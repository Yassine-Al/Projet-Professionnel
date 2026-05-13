<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            'annonce_id' => 'required|exists:annonces,id',
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('annonces', 'public');

        $image = Image::create([
            'annonce_id' => $request->annonce_id,
            'url' => $path,
        ]);

        return response()->json([
            'message' => 'Image uploaded',
            'data' => $image
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        $image = Image::findOrFail($image);

        $annonce = Annonce::findOrFail($image->annonce_id);

        if ($annonce->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $image->delete();

        return response()->json([
            'message' => 'Image deleted'
        ]);
    }
}
