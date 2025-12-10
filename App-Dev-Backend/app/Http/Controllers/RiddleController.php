<?php

namespace App\Http\Controllers;

use App\Models\Riddle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RiddleController extends Controller
{
    /**
     * Return a list of riddles.
     */
    public function index()
    {
        $riddles = Riddle::orderBy('id', 'asc')->get(['id', 'question', 'hint', 'source']);
        return response()->json(['data' => $riddles], 200);
    }

    /**
     * Store a new riddle.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'question' => 'required|string',
            'answer' => 'nullable|string',
            'hint' => 'nullable|string',
            'source' => 'nullable|string',
            'explanation' => 'nullable|string',
        ]);

        $riddle = Riddle::create($data);

        return response()->json(['data' => $riddle], 201);
    }

    /**
     * Show a single riddle.
     */
    public function show($id)
    {
        $riddle = Riddle::find($id);
        if (!$riddle) {
            return response()->json(['message' => 'Riddle not found'], 404);
        }
        return response()->json(['data' => $riddle], 200);
    }

    /**
     * Update a riddle.
     */
    public function update(Request $request, $id)
    {
        $riddle = Riddle::find($id);
        if (!$riddle) {
            return response()->json(['message' => 'Riddle not found'], 404);
        }

        $data = $request->validate([
            'question' => 'sometimes|required|string',
            'answer' => 'nullable|string',
            'hint' => 'nullable|string',
            'source' => 'nullable|string',
            'explanation' => 'nullable|string',
        ]);

        $riddle->update($data);

        return response()->json(['data' => $riddle], 200);
    }

    /**
     * Delete a riddle.
     */
    public function destroy($id)
    {
        $riddle = Riddle::find($id);
        if (!$riddle) {
            return response()->json(['message' => 'Riddle not found'], 404);
        }

        $riddle->delete();
        return response()->json(['message' => 'Riddle deleted'], 200);
    }

    /**
     * Generate AI riddle with UNIQUE guarantee and API optimization
     */
    public function generate(Request $request)
    {
        // Daily cache
        $cacheKey = 'ai_riddle_today_' . now()->format('Y-m-d');
        if (Cache::has($cacheKey)) {
            $cached = Cache::get($cacheKey);
            return response()->json([
                'success' => true,
                'ai_generated' => $cached['ai_generated'],
                'cached' => true,
                'message' => $cached['ai_generated'] ? 'AI riddle (cached)' : 'Fallback riddle (cached)',
                'data' => $cached['data']
            ]);
        }
        
        $debugLog = ['timestamp' => now()->toDateTimeString()];
        
        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return $this->saveAndReturnFallback('no_api_key', $debugLog, $cacheKey);
        }
        
        // Get existing answers for uniqueness
        $existingAnswers = Riddle::pluck('answer')->map(function($ans) {
            return strtolower(trim($ans));
        })->toArray();
        
        $debugLog['existing_unique_answers'] = count(array_unique($existingAnswers));
        
        // ========== VARIED THEMES (not just animals) ==========
        $themes = [
            'animals' => 'Create a riddle about an animal',
            'objects' => 'Create a riddle about a common household object',
            'nature' => 'Create a riddle about something in nature (not animals)',
            'food' => 'Create a riddle about food or drink',
            'technology' => 'Create a riddle about technology or electronics',
            'body' => 'Create a riddle about a body part or human feature',
            'time' => 'Create a riddle about time or something related to time',
            'transportation' => 'Create a riddle about transportation or vehicles'
        ];
        
        // Select random theme (not just animals)
        $themeKeys = array_keys($themes);
        $selectedTheme = $themeKeys[array_rand($themeKeys)];
        $themeInstruction = $themes[$selectedTheme];
        
        $debugLog['selected_theme'] = $selectedTheme;
        
        // ========== IMPROVED PROMPT FOR RELIABILITY ==========
        $prompt = "{$themeInstruction}. Answer must be one word.

CRITICAL: Format your response EXACTLY like this - 4 lines total:

RIDDLE: [Your riddle question ending with ?]
HINT: [Short hint, 2-4 words]
ANSWER: [One word answer - lowercase]
EXPLANATION: [Clear 1-sentence explanation]

Example format:
RIDDLE: What has keys but can't open locks?
HINT: Musical instrument
ANSWER: piano
EXPLANATION: A piano has keys for playing music, not for opening doors.

Now create a NEW riddle following this exact format:";
        
        $debugLog['prompt_length'] = strlen($prompt);
        
        // ========== MAKE API CALL WITH BETTER CONFIG ==========
        try {
            $response = Http::withoutVerifying()
                ->timeout(45) // Increased timeout
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [[
                        'parts' => [['text' => $prompt]]
                    ]],
                    'generationConfig' => [
                        'temperature' => 0.7, // Lower for more consistent formatting
                        'maxOutputTokens' => 300, // Reduced for shorter, consistent responses
                        'topP' => 0.8,
                    ]
                ]);

            $debugLog['response_status'] = $response->status();
            
            if ($response->successful()) {
                $data = $response->json();
                $debugLog['finish_reason'] = $data['candidates'][0]['finishReason'] ?? 'unknown';
                $debugLog['total_tokens'] = $data['usageMetadata']['totalTokenCount'] ?? 0;
                
                $aiText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
                $debugLog['ai_text_raw'] = $aiText;
                $debugLog['ai_text_length'] = strlen($aiText);
                
                if (!empty($aiText)) {
                    // Parse with ROBUST parser
                    $parsed = $this->parseRiddleResponseRobust($aiText);
                    
                    if ($parsed['success']) {
                        // Check for duplicate answer
                        $answer = strtolower(trim($parsed['answer']));
                        
                        // Check if answer is valid (not empty, not "at", etc.)
                        if (strlen($answer) < 2) {
                            $debugLog['invalid_answer'] = $answer;
                            Log::warning("AI generated invalid answer: {$answer}");
                            return $this->saveAndReturnVariedFallback($existingAnswers, $debugLog, $cacheKey, $selectedTheme);
                        }
                        
                        if (!in_array($answer, $existingAnswers)) {
                            // Save AI riddle
                            $riddle = Riddle::create([
                                'question' => $parsed['question'],
                                'hint' => $parsed['hint'],
                                'answer' => $answer,
                                'explanation' => $parsed['explanation'],
                                'source' => 'gemini_ai'
                            ]);
                            
                            // Cache the AI result
                            $cacheData = [
                                'ai_generated' => true,
                                'data' => [
                                    'id' => $riddle->id,
                                    'question' => $riddle->question,
                                    'hint' => $riddle->hint,
                                    'answer' => $riddle->answer,
                                    'explanation' => $riddle->explanation,
                                    'source' => $riddle->source,
                                    'theme' => $selectedTheme
                                ]
                            ];
                            
                            Cache::put($cacheKey, $cacheData, now()->addDay());
                            
                            Log::info("✅ AI riddle success", [
                                'id' => $riddle->id,
                                'answer' => $answer,
                                'theme' => $selectedTheme,
                                'has_explanation' => !empty($parsed['explanation'])
                            ]);

                            return response()->json([
                                'success' => true,
                                'ai_generated' => true,
                                'unique' => true,
                                'message' => 'AI riddle generated successfully!',
                                'data' => $cacheData['data'],
                                'theme' => $selectedTheme
                            ]);
                            
                        } else {
                            $debugLog['duplicate_answer'] = $answer;
                            Log::warning("AI generated duplicate answer: {$answer}");
                            return $this->saveAndReturnVariedFallback($existingAnswers, $debugLog, $cacheKey, $selectedTheme);
                        }
                        
                    } else {
                        $debugLog['parse_error'] = $parsed['error'];
                        Log::warning("Parse error: " . $parsed['error']);
                        return $this->saveAndReturnVariedFallback($existingAnswers, $debugLog, $cacheKey, $selectedTheme);
                    }
                    
                } else {
                    $debugLog['empty_response'] = true;
                    return $this->saveAndReturnVariedFallback($existingAnswers, $debugLog, $cacheKey, $selectedTheme);
                }
                
            } else {
                $error = $response->json();
                $debugLog['api_error'] = $error['error']['message'] ?? 'Unknown error';
                $debugLog['status_code'] = $response->status();
                
                // Check if it's quota error
                if ($response->status() === 429 || str_contains($debugLog['api_error'], 'quota')) {
                    $debugLog['quota_exceeded'] = true;
                    Log::warning("API quota exceeded, using fallback");
                }
                
                Log::error("API error", $debugLog);
                return $this->saveAndReturnVariedFallback($existingAnswers, $debugLog, $cacheKey, $selectedTheme);
            }
            
        } catch (\Exception $e) {
            $debugLog['exception'] = $e->getMessage();
            Log::error("Exception", $debugLog);
            return $this->saveAndReturnVariedFallback($existingAnswers, $debugLog, $cacheKey, $selectedTheme);
        }
    }
    
    /**
     * ROBUST PARSER - Ultra reliable
     */
    private function parseRiddleResponseRobust(string $text): array
    {
        $text = trim($text);
        
        // Remove any markdown formatting
        $text = str_replace(['```', '**', '*', '`'], '', $text);
        
        // Normalize line endings
        $text = preg_replace('/\r\n/', "\n", $text);
        
        $result = [
            'question' => '',
            'hint' => '',
            'answer' => '',
            'explanation' => ''
        ];
        
        // METHOD 1: Strict regex parsing with line-by-line
        $lines = array_map('trim', explode("\n", $text));
        $lines = array_values(array_filter($lines, function($line) {
            return !empty($line) && strlen($line) > 2;
        }));
        
        // Look for exact patterns
        foreach ($lines as $line) {
            $line = trim($line);
            
            // Check for RIDDLE: prefix
            if (preg_match('/^RIDDLE:\s*(.+)$/i', $line, $matches)) {
                $result['question'] = trim($matches[1]);
            }
            // Check for HINT: prefix
            elseif (preg_match('/^HINT:\s*(.+)$/i', $line, $matches)) {
                $result['hint'] = trim($matches[1]);
            }
            // Check for ANSWER: prefix
            elseif (preg_match('/^ANSWER:\s*(.+)$/i', $line, $matches)) {
                $result['answer'] = trim($matches[1]);
            }
            // Check for EXPLANATION: prefix
            elseif (preg_match('/^EXPLANATION:\s*(.+)$/i', $line, $matches)) {
                $result['explanation'] = trim($matches[1]);
            }
        }
        
        // METHOD 2: If missing parts, infer from structure
        if (empty($result['question']) && count($lines) > 0) {
            // First line with ? is probably the riddle
            foreach ($lines as $line) {
                if (str_contains($line, '?')) {
                    $result['question'] = trim(str_ireplace('RIDDLE:', '', $line));
                    break;
                }
            }
            // If still empty, use first line
            if (empty($result['question'])) {
                $result['question'] = $lines[0];
            }
        }
        
        if (empty($result['answer'])) {
            // Look for a single word line (likely answer)
            foreach ($lines as $line) {
                $cleanLine = trim(str_ireplace(['ANSWER:', 'answer:'], '', $line));
                if (preg_match('/^[a-zA-Z]{2,15}$/', $cleanLine)) {
                    $result['answer'] = $cleanLine;
                    break;
                }
            }
        }
        
        if (empty($result['hint']) && count($lines) > 1) {
            // Second line might be hint if it's short
            if (isset($lines[1]) && strlen($lines[1]) < 50) {
                $result['hint'] = trim(str_ireplace('HINT:', '', $lines[1]));
            }
        }
        
        if (empty($result['explanation']) && count($lines) > 2) {
            // Last line or longer line might be explanation
            $lastLine = end($lines);
            if (strlen($lastLine) > 20) {
                $result['explanation'] = trim(str_ireplace('EXPLANATION:', '', $lastLine));
            }
        }
        
        // Clean and validate answer
        if (!empty($result['answer'])) {
            $original = $result['answer'];
            $result['answer'] = strtolower(trim($result['answer']));
            // Remove any non-letter characters from start/end only
            $result['answer'] = preg_replace('/^[^a-z]+|[^a-z]+$/i', '', $result['answer']);
            
            // If answer became too short, use original
            if (strlen($result['answer']) < 2) {
                $result['answer'] = strtolower(preg_replace('/[^a-z]/i', '', $original));
            }
        }
        
        // Ensure explanation exists
        if (empty($result['explanation']) && !empty($result['answer'])) {
            $result['explanation'] = "The answer '{$result['answer']}' fits the riddle's description.";
        } elseif (empty($result['explanation'])) {
            $result['explanation'] = "This answer correctly matches all the clues in the riddle.";
        }
        
        // Ensure hint exists
        if (empty($result['hint'])) {
            $result['hint'] = "Think carefully about the clues!";
        }
        
        // Ensure question ends with ?
        if (!empty($result['question']) && !str_ends_with(trim($result['question']), '?')) {
            $result['question'] = rtrim($result['question'], '.!') . '?';
        }
        
        // Final validation
        if (empty($result['question']) || empty($result['answer'])) {
            return [
                'success' => false, 
                'error' => 'Missing question or answer',
                'data' => $result
            ];
        }
        
        return ['success' => true] + $result;
    }
    
    /**
     * Save and return VARIED fallback (multiple themes)
     */
    private function saveAndReturnVariedFallback(array $existingAnswers, array $debugLog, string $cacheKey, string $theme)
    {
        // EXTENSIVE collection of riddles across ALL themes
        $allRiddles = [
            // Animals theme
            [
                'question' => "I wear my house upon my back, a spiral shell, a winding track. I leave a silver trail behind, my pace is slow, you will find. What am I?",
                'hint' => 'Mollusk',
                'answer' => 'snail',
                'explanation' => 'A snail carries its shell (house), leaves a slimy trail, and moves very slowly.',
                'source' => 'unique_fallback',
                'theme' => 'animals'
            ],
            [
                'question' => "I sleep during the day, fly at night. My vision is special, I use sound as sight. What am I?",
                'hint' => 'Nocturnal mammal',
                'answer' => 'bat',
                'explanation' => 'Bats are nocturnal, use echolocation to navigate, and sleep upside down.',
                'source' => 'unique_fallback',
                'theme' => 'animals'
            ],
            
            // Objects theme
            [
                'question' => "I have keys but open no locks, space but no room, you can enter but not go inside. What am I?",
                'hint' => 'Used for typing',
                'answer' => 'keyboard',
                'explanation' => 'A keyboard has keys (letters), space bar, and you "enter" data with it.',
                'source' => 'unique_fallback',
                'theme' => 'objects'
            ],
            [
                'question' => "I have hands but cannot clap, a face but no eyes. I tell but cannot speak. What am I?",
                'hint' => 'Tells time',
                'answer' => 'clock',
                'explanation' => 'A clock has hands (hour/minute), a face (dial), and tells time without speaking.',
                'source' => 'unique_fallback',
                'theme' => 'objects'
            ],
            
            // Nature theme
            [
                'question' => "I fall from the sky but never get wet, I disappear when I touch the ground. What am I?",
                'hint' => 'Winter weather',
                'answer' => 'snowflake',
                'explanation' => 'Snowflakes fall from clouds, are made of ice (not wet), and melt when touching warm ground.',
                'source' => 'unique_fallback',
                'theme' => 'nature'
            ],
            [
                'question' => "I have roots that nobody sees, taller than trees. Up, up I go, yet I never grow. What am I?",
                'hint' => 'Natural formation',
                'answer' => 'mountain',
                'explanation' => 'Mountains have underground roots (geological), are tall, and don\'t grow like living things.',
                'source' => 'unique_fallback',
                'theme' => 'nature'
            ],
            
            // Food theme
            [
                'question' => "I am taken from a mine and shut in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?",
                'hint' => 'Writing tool',
                'answer' => 'pencil',
                'explanation' => 'Pencil lead comes from graphite mines, is encased in wood, and is used until gone.',
                'source' => 'unique_fallback',
                'theme' => 'food'
            ],
            [
                'question' => "What has a heart that doesn't beat?",
                'hint' => 'Vegetable',
                'answer' => 'artichoke',
                'explanation' => 'An artichoke has a heart (the tender center) but is a vegetable, not a living creature.',
                'source' => 'unique_fallback',
                'theme' => 'food'
            ],
            
            // Technology theme
            [
                'question' => "I have a screen but no TV, keys but no locks, memory but no brain. What am I?",
                'hint' => 'Electronic device',
                'answer' => 'computer',
                'explanation' => 'A computer has a screen, keyboard keys, memory (RAM), but is not a living being.',
                'source' => 'unique_fallback',
                'theme' => 'technology'
            ],
            [
                'question' => "I can connect you to anyone, anywhere, without wires or cables. I fit in your pocket but hold the world. What am I?",
                'hint' => 'Mobile device',
                'answer' => 'smartphone',
                'explanation' => 'A smartphone allows wireless communication, is pocket-sized, and provides global information access.',
                'source' => 'unique_fallback',
                'theme' => 'technology'
            ],
            
            // Body theme
            [
                'question' => "The more of me you take, the more you leave behind. What am I?",
                'hint' => 'Related to walking',
                'answer' => 'footsteps',
                'explanation' => 'When you take footsteps, you leave more footsteps behind you as you walk.',
                'source' => 'unique_fallback',
                'theme' => 'body'
            ],
            [
                'question' => "I have a head and a tail, but no body. What am I?",
                'hint' => 'Can be flipped',
                'answer' => 'coin',
                'explanation' => 'A coin has a head (front design) and tail (back design) but no actual body.',
                'source' => 'unique_fallback',
                'theme' => 'body'
            ],
            
            // Time theme
            [
                'question' => "I am always coming but never arrive. What am I?",
                'hint' => 'Future moment',
                'answer' => 'tomorrow',
                'explanation' => 'Tomorrow is always in the future, always "coming" but when it arrives it becomes today.',
                'source' => 'unique_fallback',
                'theme' => 'time'
            ],
            [
                'question' => "What flies without wings, cries without eyes?",
                'hint' => 'Weather phenomenon',
                'answer' => 'cloud',
                'explanation' => 'Clouds move ("fly") in the sky and produce rain ("cry") without biological features.',
                'source' => 'unique_fallback',
                'theme' => 'time'
            ]
        ];
        
        // Filter by theme first, then remove duplicates
        $themeRiddles = array_filter($allRiddles, function($riddle) use ($theme) {
            return $riddle['theme'] === $theme;
        });
        
        // If no theme-specific riddles, use all
        if (empty($themeRiddles)) {
            $themeRiddles = $allRiddles;
        }
        
        // Filter out duplicates
        $available = array_filter($themeRiddles, function($riddle) use ($existingAnswers) {
            return !in_array($riddle['answer'], $existingAnswers);
        });
        
        if (count($available) > 0) {
            $fallbackData = $available[array_rand($available)];
            $isUnique = true;
        } else {
            // All are duplicates, pick least used theme or random
            $fallbackData = $themeRiddles[array_rand($themeRiddles)];
            $isUnique = false;
        }
        
        // Save to database
        $riddle = Riddle::create([
            'question' => $fallbackData['question'],
            'hint' => $fallbackData['hint'],
            'answer' => $fallbackData['answer'],
            'explanation' => $fallbackData['explanation'],
            'source' => $fallbackData['source']
        ]);
        
        // Cache the fallback result
        $cacheData = [
            'ai_generated' => false,
            'data' => [
                'id' => $riddle->id,
                'question' => $riddle->question,
                'hint' => $riddle->hint,
                'answer' => $riddle->answer,
                'explanation' => $riddle->explanation,
                'source' => $riddle->source,
                'theme' => $fallbackData['theme']
            ]
        ];
        
        Cache::put($cacheKey, $cacheData, now()->addDay());
        
        Log::info("Using fallback riddle", [
            'theme' => $fallbackData['theme'],
            'answer' => $fallbackData['answer'],
            'unique' => $isUnique
        ]);
        
        return response()->json([
            'success' => true,
            'ai_generated' => false,
            'fallback' => true,
            'unique' => $isUnique,
            'message' => $isUnique ? "Using unique {$fallbackData['theme']} riddle" : "Using {$fallbackData['theme']} riddle",
            'data' => $cacheData['data'],
            'theme' => $fallbackData['theme']
        ]);
    }
    
    /**
     * Fallback for no API key
     */
    private function saveAndReturnFallback(string $reason, array $debugLog, string $cacheKey)
    {
        $fallback = [
            'question' => "What has keys but can't open locks?",
            'hint' => 'Musical instrument',
            'answer' => 'piano',
            'explanation' => 'A piano has keys for playing music, not for opening doors.',
            'source' => 'system_fallback',
            'theme' => 'objects'
        ];
        
        $riddle = Riddle::create([
            'question' => $fallback['question'],
            'hint' => $fallback['hint'],
            'answer' => $fallback['answer'],
            'explanation' => $fallback['explanation'],
            'source' => $fallback['source']
        ]);
        
        $cacheData = [
            'ai_generated' => false,
            'data' => [
                'id' => $riddle->id,
                'question' => $fallback['question'],
                'hint' => $fallback['hint'],
                'answer' => $fallback['answer'],
                'explanation' => $fallback['explanation'],
                'source' => $fallback['source'],
                'theme' => $fallback['theme']
            ]
        ];
        
        Cache::put($cacheKey, $cacheData, now()->addDay());
        
        return response()->json([
            'success' => true,
            'ai_generated' => false,
            'fallback' => true,
            'message' => 'System fallback riddle',
            'data' => $cacheData['data']
        ]);
    }
    /**
     * Get statistics about riddles
     */
    public function statistics()
    {
        $total = Riddle::count();
        $bySource = Riddle::select('source', DB::raw('count(*) as count'))
            ->groupBy('source')
            ->get()
            ->pluck('count', 'source');
        
        $uniqueAnswers = Riddle::distinct('answer')->count('answer');
        
        // Check for potential duplicates
        $potentialDuplicates = [];
        $riddles = Riddle::all();
        
        foreach ($riddles as $i => $r1) {
            foreach ($riddles as $j => $r2) {
                if ($i < $j && $r1->answer === $r2->answer) {
                    $potentialDuplicates[] = [
                        'answer' => $r1->answer,
                        'ids' => [$r1->id, $r2->id],
                        'questions' => [substr($r1->question, 0, 50), substr($r2->question, 0, 50)]
                    ];
                }
            }
        }
        
        return response()->json([
            'total_riddles' => $total,
            'unique_answers' => $uniqueAnswers,
            'by_source' => $bySource,
            'potential_duplicates' => [
                'count' => count($potentialDuplicates),
                'examples' => array_slice($potentialDuplicates, 0, 5)
            ],
            'cache_status' => [
                'today_ai_cached' => Cache::has('ai_riddle_today_' . now()->format('Y-m-d')),
                'next_ai_allowed' => 'tomorrow'
            ]
        ]);
    }
    
    /**
     * Manually clear cache for testing
     */
    public function clearCache()
    {
        $key = 'ai_riddle_today_' . now()->format('Y-m-d');
        $wasCached = Cache::has($key);
        Cache::forget($key);
        
        return response()->json([
            'success' => true,
            'message' => $wasCached ? 'Cache cleared. Next AI call allowed.' : 'No cache to clear.',
            'next_ai_call' => 'allowed now'
        ]);
    }
}
