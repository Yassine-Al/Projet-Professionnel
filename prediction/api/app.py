from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
from datetime import datetime
from sklearn.base import BaseEstimator, TransformerMixin


class DataTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, columns_to_drop):
        self.columns_to_drop = columns_to_drop

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X.drop(self.columns_to_drop, axis=1, errors='ignore', inplace=True)
        return X

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:8000'])

# ── Load the trained pipeline once at startup ──────────────────────────────────
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
PIPELINE_PATH = os.path.join(BASE_DIR, '..', 'production', 'final_pipeline.pkl')

pipeline = None
if os.path.isfile(PIPELINE_PATH):
    pipeline = joblib.load(PIPELINE_PATH)
    print(f"[OK] Pipeline loaded from {PIPELINE_PATH}")
else:
    print(
        f"[WARN] Pipeline not found at {PIPELINE_PATH}\n"
        "   Run  python prediction/api/generate_pipeline.py  (after placing data.csv)\n"
        "   to train and export the model. The /predict endpoint will return 503 until then."
    )


# ── Health check ───────────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': pipeline is not None,
    })


# ── Prediction endpoint ────────────────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    if pipeline is None:
        return jsonify({
            'error': (
                "Le modèle de prédiction n'est pas encore disponible. "
                "Exécutez generate_pipeline.py pour générer final_pipeline.pkl."
            )
        }), 503

    data = request.get_json(force=True)

    required_fields = ['marque', 'modele', 'annee', 'kilometrage', 'etat',
                       'boite-de-vitesses', 'type-de-carburant']
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return jsonify({'error': f'Champs obligatoires manquants : {", ".join(missing)}'}), 400

    try:
        annee = int(data.get('annee'))
    except (ValueError, TypeError):
        return jsonify({'error': 'Valeur invalide pour annee'}), 400

    age = datetime.now().year - annee

    # Build the DataFrame with the exact column names the pipeline expects
    try:
        df = pd.DataFrame([{
            'etat':              str(data.get('etat', 'Bon')),
            'boite-de-vitesses': str(data.get('boite-de-vitesses', 'Manuelle')),
            'type-de-carburant': str(data.get('type-de-carburant', 'Essence')),
            'marque':            str(data.get('marque', '')),
            'modele':            str(data.get('modele', '')),
            'origine':           str(data.get('origine', 'WW au Maroc')),
            'kilometrage':       int(data.get('kilometrage', 0)),
            'age':               age,
            'puissance-fiscale': int(data.get('puissance-fiscale', 5)),
            # Columns the pipeline drops internally — must still be present
            'annee-modele':      str(annee),
            'titre':             '',
            'localisation':      '',
        }])
    except (ValueError, TypeError) as e:
        return jsonify({'error': f'Données invalides : {e}'}), 400

    try:
        raw_price = float(pipeline.predict(df)[0])
    except Exception as e:
        return jsonify({'error': f'Erreur de prédiction : {e}'}), 500

    if raw_price <= 0:
        return jsonify({'error': 'Prédiction invalide : prix négatif ou nul'}), 500

    # Round to nearest 500 MAD for cleaner display
    mid  = round(raw_price / 500) * 500
    low  = round(raw_price * 0.90 / 500) * 500
    high = round(raw_price * 1.10 / 500) * 500

    return jsonify({
        'success': True,
        'price':   mid,
        'min':     low,
        'max':     high,
    })


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8001, debug=True)
