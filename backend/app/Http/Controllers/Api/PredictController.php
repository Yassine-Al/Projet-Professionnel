<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PredictController extends Controller
{
    /**
     * Forward a prediction request to the Python Flask microservice.
     */
    public function predict(Request $request)
    {
        $validated = $request->validate([
            'etat'              => 'required|string',
            'boite-de-vitesses' => 'required|string',
            'type-de-carburant' => 'required|string',
            'marque'            => 'required|string',
            'modele'            => 'required|string',
            'origine'           => 'required|string',
            'kilometrage'       => 'required|integer|min:0',
            'annee'             => 'required|integer|min:2000|max:2026',
            'puissance-fiscale' => 'required|integer|min:1',
        ]);

        $pythonUrl = env('PYTHON_API_URL', 'http://127.0.0.1:5000');

        $response = Http::timeout(15)->post("{$pythonUrl}/predict", $validated);

        if ($response->failed()) {
            return response()->json([
                'error' => 'Le service de prédiction est indisponible.',
            ], 503);
        }

        return response()->json($response->json());
    }
}
