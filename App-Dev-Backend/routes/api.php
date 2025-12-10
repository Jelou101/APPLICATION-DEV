<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RiddleController;
use App\Http\Controllers\LogicController;
use App\Http\Controllers\EnduranceController;
use App\Http\Controllers\UserProgressController;
use App\Http\Controllers\UserStatusController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
Route::get('/riddles/check-duplicates', [RiddleController::class, 'checkDuplicates']);
Route::get('/riddles/statistics', [RiddleController::class, 'statistics']);
Route::post('/riddles/clear-cache', [RiddleController::class, 'clearCache']);

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

Route::get('/list-gemini-models', function() {
    $apiKey = env('GEMINI_API_KEY');
    
    if (!$apiKey) {
        return response()->json(['error' => 'No Gemini API key found'], 500);
    }
    
    try {
        $response = Http::timeout(30)
            ->withoutVerifying()
            ->get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");
            
        if ($response->successful()) {
            $models = $response->json();
            $availableModels = [];
            
            foreach ($models['models'] as $model) {
                if (in_array('generateContent', $model['supportedGenerationMethods'] ?? [])) {
                    $availableModels[] = [
                        'name' => $model['name'],
                        'display_name' => $model['displayName'],
                        'description' => $model['description'] ?? '',
                    ];
                }
            }
            
            return response()->json([
                'success' => true,
                'total_models' => count($models['models']),
                'generative_models' => $availableModels,
                'sample_models' => array_slice($availableModels, 0, 5) // First 5
            ]);
        } else {
            return response()->json([
                'success' => false,
                'status' => $response->status(),
                'body' => $response->body()
            ], 500);
        }
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// Add to api.php
Route::get('/test-new-key', function() {
    $apiKey = env('GEMINI_API_KEY');
    
    // Show first/last few characters (don't expose full key)
    $keyPreview = substr($apiKey, 0, 10) . '...' . substr($apiKey, -4);
    
    // Simple test
    try {
        $response = Http::withoutVerifying()
            ->timeout(10)
            ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'contents' => [[
                    'parts' => [['text' => 'Say "Hello World"']]
                ]],
                'generationConfig' => ['maxOutputTokens' => 10]
            ]);
            
        return response()->json([
            'status' => $response->successful() ? '✅ Working' : '❌ Failed',
            'key_preview' => $keyPreview,
            'response_code' => $response->status(),
            'message' => $response->successful() ? 'New key is working!' : 'Check API key',
            'body_preview' => substr($response->body(), 0, 200)
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => '❌ Error',
            'key_preview' => $keyPreview,
            'error' => $e->getMessage()
        ]);
    }
});

Route::get('/debug-riddle', function() {
    $apiKey = env('GEMINI_API_KEY');
    
    $response = Http::withoutVerifying()
        ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
            'contents' => [[
                'parts' => [['text' => 'Create a riddle. Format: RIDDLE: [q] ANSWER: [a]']]
            ]],
            'generationConfig' => ['maxOutputTokens' => 100]
        ]);
    
    return response()->json([
        'status' => $response->status(),
        'body' => $response->json()
    ]);
});

Route::get('/riddles/test', [RiddleController::class, 'testGenerate']);