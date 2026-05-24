<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\UserController;

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
    | AUTH USER & PROFILE
    |--------------------------------------------------------------------------
    */
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::delete('/user', [UserController::class, 'destroy']);

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | ANNONCES (CORE)
    |--------------------------------------------------------------------------
    */
    Route::apiResource('annonces', AnnonceController::class);
    Route::get('my-annonces', [AnnonceController::class, 'myAnnonces']);
    Route::post('annonces/{annonce}/mark-sold', [AnnonceController::class, 'markSold']);

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
    | CONVERSATIONS & MESSAGES (CHAT SYSTEM)
    |--------------------------------------------------------------------------
    */

    // Inbox + initiation conversation (idempotent firstOrCreate)
    Route::get('conversations', [ConversationController::class, 'index']);
    Route::post('conversations', [ConversationController::class, 'store']);

    // Historique + auto-mark-read à l'ouverture
    Route::get('conversations/{conversation}', [ConversationController::class, 'show']);

    // Badge non-lus global (navbar)
    Route::get('unread-count', [ConversationController::class, 'unreadCount']);

    // Messages dans une conversation
    Route::post('conversations/{conversation}/messages', [MessageController::class, 'store']);
    Route::post('conversations/{conversation}/messages/read', [MessageController::class, 'markAllRead']);

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