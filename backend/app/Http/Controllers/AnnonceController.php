<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use Illuminate\Http\Request;

class AnnonceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Annonce::with(['images', 'user'])->latest();

        $query->where('status', $request->input('status', 'approved'));

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('brand')) {
            $query->where('brand', 'like', "%{$request->brand}%");
        }

        if ($request->filled('fuel_type')) {
            $query->where('fuel_type', $request->fuel_type);
        }

        if ($request->filled('transmission')) {
            $query->where('transmission', $request->transmission);
        }

        if ($request->filled('car_condition')) {
            $query->where('car_condition', $request->car_condition);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('min_year')) {
            $query->where('model_year', '>=', $request->min_year);
        }

        if ($request->filled('max_year')) {
            $query->where('model_year', '<=', $request->max_year);
        }

        return response()->json($query->paginate(10));
    }

    public function myAnnonces(Request $request)
    {
        $query = Annonce::with(['images'])
            ->where('user_id', auth()->id())
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(10));
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
        $annonce->load(['images', 'user', 'reviews']);

        return response()->json($annonce);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Annonce $annonce)
    {
        if ($annonce->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title'        => 'sometimes|string',
            'description'  => 'sometimes|string',
            'price'        => 'sometimes|numeric',
            'brand'        => 'sometimes|string',
            'model'        => 'sometimes|string',
            'model_year'   => 'sometimes|integer',
            'mileage'      => 'sometimes|integer',
            'fuel_type'    => 'sometimes|string',
            'transmission' => 'sometimes|string',
            'fiscal_power' => 'sometimes|string',
            'car_condition'=> 'sometimes|string',
        ]);

        $annonce->update($validated);

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
        if ($annonce->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $annonce->delete();

        return response()->json([
            'message' => 'Annonce deleted'
        ]);
    }

    public function markSold(Annonce $annonce)
    {
        if ($annonce->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($annonce->status !== 'approved') {
            return response()->json(['error' => 'Only approved annonces can be marked as sold'], 422);
        }

        $annonce->update(['status' => 'sold']);

        return response()->json(['message' => 'Annonce marked as sold', 'data' => $annonce]);
    }
}
