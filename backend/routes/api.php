<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PredictionController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | AUTH USER
    |--------------------------------------------------------------------------
    */
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | ANNONCES (CORE)
    |--------------------------------------------------------------------------
    */
    Route::apiResource('annonces', AnnonceController::class);

    /*
    |--------------------------------------------------------------------------
    | IMAGES
    |--------------------------------------------------------------------------
    */
    Route::apiResource('images', ImageController::class);

    /*
    |--------------------------------------------------------------------------
    | FAVORITES
    |--------------------------------------------------------------------------
    */
    Route::post('favorites/toggle/{annonceId}', [FavoriteController::class, 'toggle']);
    Route::get('favorites', [FavoriteController::class, 'index']);
    Route::delete('favorites/{annonceId}', [FavoriteController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | REVIEWS
    |--------------------------------------------------------------------------
    */
    Route::apiResource('reviews', ReviewController::class);

    Route::get('annonces/{id}/reviews', [ReviewController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | MESSAGES (CHAT SYSTEM)
    |--------------------------------------------------------------------------
    */
    Route::post('messages', [MessageController::class, 'store']);

    Route::get('messages/{userId}/{annonceId}', [MessageController::class, 'index']);

    Route::delete('messages/{id}', [MessageController::class, 'destroy']);

    Route::get('inbox', [MessageController::class, 'inbox']);

    /*
    |--------------------------------------------------------------------------
    | PREDICTION (FASTAPI ML SERVICE)
    |--------------------------------------------------------------------------
    */
    Route::post('predict-price', [PredictionController::class, 'predict']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);

    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);

    Route::get('/admin/annonces', [AdminController::class, 'annonces']);

    Route::post('/admin/annonces/{id}/approve', [AdminController::class, 'approveAnnonce']);
    Route::post('/admin/annonces/{id}/reject', [AdminController::class, 'rejectAnnonce']);
});