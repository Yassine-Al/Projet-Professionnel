# ocazz.ma — Plateforme marocaine de vente de véhicules d'occasion

Marketplace fullstack pour l'achat et la vente de voitures d'occasion au Maroc, avec estimation de prix par IA.

## Stack technique

| Couche | Technologie |
|---|---|
| Backend API | Laravel 10 · PHP 8.2 · Sanctum |
| Frontend | React 18 · Vite · React Router v6 |
| Base de données | MySQL 8 |
| Prédiction IA | Python 3 · Flask · scikit-learn · Random Forest |
| Chatbot | Gemini 2.0 Flash Lite (streaming SSE) |

## Structure du projet

```
Projet-Professionnel/
├── backend/        # API Laravel (port 8000)
├── frontend/       # App React/Vite (port 3000)
└── prediction/     # Service Flask de prédiction de prix (port 5000)
    ├── api/        # Flask app (app.py)
    ├── data/       # Données d'entraînement (non versionné)
    ├── preparing/  # Notebooks de nettoyage et préparation
    ├── models/     # Notebooks de modélisation
    └── production/ # Modèle entraîné final_pipeline.pkl (non versionné)
```

## Prérequis

- PHP 8.2+ & Composer
- Node.js 18+ & npm
- MySQL 8
- Python 3.10+

## Installation

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Éditez `backend/.env` :

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

DB_DATABASE=ocazz
DB_USERNAME=root
DB_PASSWORD=your_password

MAIL_MAILER=log          # utilise le log en dev, mettre smtp en prod

GEMINI_API_KEY=          # https://aistudio.google.com/
PREDICTION_SERVICE_URL=http://127.0.0.1:5000
```

```bash
php artisan migrate --seed
php artisan storage:link
```

### 2. Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env   # ou créer .env avec VITE_BACKEND_URL=http://localhost:8000
```

### 3. Service de prédiction (Flask)

```bash
cd prediction/api
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

**Pour utiliser le modèle ML réel** (optionnel) :
1. Placez votre fichier de données dans `prediction/data/data.csv`
2. Exécutez `python prediction/api/generate_pipeline.py` depuis la racine du projet
3. Le modèle entraîné sera sauvegardé dans `prediction/production/final_pipeline.pkl`

> Sans `final_pipeline.pkl`, le service utilise automatiquement un moteur heuristique basé sur les prix du marché marocain.

## Démarrage

Ouvrez **3 terminaux** :

```bash
# Terminal 1 — API Laravel
cd backend && php artisan serve

# Terminal 2 — Frontend React
cd frontend && npm run dev

# Terminal 3 — Service de prédiction
cd prediction/api && .venv/bin/python app.py
```

L'application est accessible sur **http://localhost:3000**

## Comptes par défaut (après seeding)

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@ocazz.ma | password |
| Vendeur | seller@test.com | password |
| Acheteur | buyer@test.com | password |

> Vérifiez les seeders dans `backend/database/seeders/` pour les valeurs exactes.

## Fonctionnalités

- **Marketplace** — parcourir, filtrer et rechercher des annonces
- **Dépôt d'annonce** — formulaire multi-étapes avec upload de photos
- **Estimation IA** — prédiction de prix basée sur les données du marché marocain
- **Messagerie** — système de messages intégré entre acheteurs et vendeurs
- **Chatbot** — assistant IA propulsé par Gemini (streaming)
- **Administration** — tableau de bord admin pour modérer annonces et utilisateurs
- **Galerie photos** — visionneuse lightbox sur les fiches véhicule

## Variables d'environnement importantes

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Clé API Google Gemini (chatbot) |
| `PREDICTION_SERVICE_URL` | URL du service Flask de prédiction |
| `MAIL_MAILER` | `log` en dev, `smtp` en prod |
| `VITE_BACKEND_URL` | URL de l'API Laravel (frontend) |
