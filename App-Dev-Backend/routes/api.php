<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RiddleController;
use App\Http\Controllers\LogicController;
use App\Http\Controllers\EnduranceController;
use App\Http\Controllers\UserProgressController;

Route::post('/login', [UserController::class,'login']);
Route::post('/register', [UserController::class,'register']);

// User Progress API - Add these 3 lines
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/progress/{gameMode}', [UserProgressController::class, 'show']);
    Route::post('/progress/{gameMode}', [UserProgressController::class, 'update']);
    Route::post('/progress/{gameMode}/reset', [UserProgressController::class, 'reset']);
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