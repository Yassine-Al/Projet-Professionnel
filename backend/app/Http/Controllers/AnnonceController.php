<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use Illuminate\Http\Request;

class AnnonceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $annonces = Annonce::with(['images', 'user'])
            ->latest()
            ->paginate(10);

        return response()->json($annonces);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'brand' => 'required',
            'model' => 'required',
            'model_year' => 'required|integer',
            'mileage' => 'required|integer',
            'fuel_type' => 'required',
            'transmission' => 'required',
            'car_condition' => 'required',
        ]);

        $annonce = Annonce::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'brand' => $request->brand,
            'model' => $request->model,
            'model_year' => $request->model_year,
            'mileage' => $request->mileage,
            'fuel_type' => $request->fuel_type,
            'transmission' => $request->transmission,
            'fiscal_power' => $request->fiscal_power,
            'car_condition' => $request->car_condition,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Annonce created successfully',
            'data' => $annonce
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Annonce $annonce)
    {
        $annonce = Annonce::with(['images', 'user', 'reviews'])
            ->findOrFail($annonce);

        return response()->json($annonce);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Annonce $annonce)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Annonce $annonce)
    {
        $annonce = Annonce::findOrFail($annonce);

        if ($annonce->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $annonce->update($request->all());

        return response()->json([
            'message' => 'Annonce updated',
            'data' => $annonce
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Annonce $annonce)
    {
        $annonce = Annonce::findOrFail($annonce);

        if ($annonce->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $annonce->delete();

        return response()->json([
            'message' => 'Annonce deleted'
        ]);
    }
}
