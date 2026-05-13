<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PredictionController extends Controller
{
    public function predict(Request $request)
    {
        // 1. validation
        $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'model_year' => 'required|integer',
            'mileage' => 'required|integer',
            'fuel_type' => 'required|string',
            'transmission' => 'required|string',
            'car_condition' => 'required|string',
        ]);

        // 2. calcul age (IMPORTANT pour ton modèle)
        $currentYear = date("Y");
        $age = $currentYear - $request->model_year;

        // 3. mapping vers FastAPI format
        $response = Http::post('http://127.0.0.1:8001/predict', [
            'etat' => $request->car_condition,
            'boite_de_vitesses' => $request->transmission,
            'type_de_carburant' => $request->fuel_type,
            'marque' => $request->brand,
            'modele' => $request->model,
            'origine' => 'maroc', // valeur par défaut (tu peux changer)
            'kilometrage' => $request->mileage,
            'age' => $age,
            'puissance_fiscale' => 6, // ⚠️ à récupérer si tu l’ajoutes côté frontend
            'annee_modele' => $request->model_year,
        ]);

        // 4. check erreur API
        if ($response->failed()) {
            return response()->json([
                'message' => 'Prediction service unavailable'
            ], 500);
        }

        // 5. return résultat propre
        return response()->json([
            'message' => 'Prediction success',
            'price_estimation' => $response->json()['price'] ?? null
        ]);
    }
}