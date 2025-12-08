<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RiddleController;
use App\Http\Controllers\LogicController;
use App\Http\Controllers\EnduranceController;
use App\Http\Controllers\UserProgressController;
use App\Http\Controllers\UserStatusController;
use Illuminate\Http\Request;

Route::post('/login', [UserController::class,'login']);
Route::post('/register', [UserController::class,'register']);

// User Progress API - Add these 3 lines
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/progress/{gameMode}', [UserProgressController::class, 'show']);
    Route::post('/progress/{gameMode}', [UserProgressController::class, 'update']);
    Route::post('/progress/{gameMode}/reset', [UserProgressController::class, 'reset']);
    


    Route::prefix('user-status')->group(function () {
        Route::get('/points', [UserStatusController::class, 'getPoints']);
        Route::post('/points/add', [UserStatusController::class, 'addPoints']);
        Route::post('/points/deduct', [UserStatusController::class, 'deductPoints']);
        Route::post('/points/game', [UserStatusController::class, 'addGamePoints']);
        Route::post('/points/reset', [UserStatusController::class, 'resetPoints']);
    });
});

// Riddles API
Route::get('/riddles', [RiddleController::class, 'index']);
Route::get('/riddles/{id}', [RiddleController::class, 'show']);
Route::post('/riddles', [RiddleController::class, 'store']);
Route::get('/riddles/generate/ai', [RiddleController::class, 'generate']);
Route::put('/riddles/{id}', [RiddleController::class, 'update']);
Route::delete('/riddles/{id}', [RiddleController::class, 'destroy']);

// Logic Questions API
Route::get('/logic/generate', [LogicController::class, 'generate']);

// Endurance API (50 mixed riddle/logic questions)
Route::match(['get', 'post'], '/endurance/generate', [EnduranceController::class, 'generate']);

// Test route to check if Sanctum is working
// Test route to check if Sanctum is working
// Test route to check if Sanctum is working
// Test route to check if Sanctum is working
Route::middleware('auth:sanctum')->get('/test-auth', function (Request $request) {
    return response()->json([
        'message' => 'Authentication is working!',
        'user' => $request->user()  // Changed from auth()->user() to $request->user()
    ]);
});