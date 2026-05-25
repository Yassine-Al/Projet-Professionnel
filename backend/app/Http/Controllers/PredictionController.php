<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PredictionController extends Controller
{
    public function predict(Request $request)
    {
        $request->validate([
            'brand'          => 'required|string',
            'model'          => 'required|string',
            'model_year'     => 'required|integer|min:1900|max:' . date('Y'),
            'mileage'        => 'required|integer|min:0',
            'fuel_type'      => 'required|string',
            'transmission'   => 'required|string',
            'car_condition'  => 'required|string',
            'fiscal_power'   => 'nullable|integer|min:1',
            'origine'        => 'nullable|string',
        ]);

        $response = Http::post(env('PREDICTION_SERVICE_URL', 'http://127.0.0.1:8001') . '/predict', [
            'etat'              => $request->car_condition,
            'boite-de-vitesses' => $request->transmission,
            'type-de-carburant' => $request->fuel_type,
            'marque'            => $request->brand,
            'modele'            => $request->model,
            'origine'           => $request->input('origine', 'WW au Maroc'),
            'kilometrage'       => $request->mileage,
            'annee'             => $request->model_year,
            'puissance-fiscale' => $request->input('fiscal_power', 6),
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