<?php

namespace App\Http\Controllers;

use App\Models\Riddle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
        if (! $riddle) {
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
        if (! $riddle) {
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
        if (! $riddle) {
            return response()->json(['message' => 'Riddle not found'], 404);
        }

        $riddle->delete();
        return response()->json(['message' => 'Riddle deleted'], 200);
    }

    /**
     * Generate AI riddle - REMOVED PAGE SYSTEM
     */
    public function generate(Request $request)
    {
        $apiKey = env('GEMINI_API_KEY');
        
        if (!$apiKey) {
            return response()->json([
                'message' => 'API key not configured'
            ], 500);
        }
    
        try {
            // Get recent riddles to avoid duplicates
            $recentRiddles = Riddle::orderBy('id', 'desc')
                ->limit(10) // Increased to 10 for better duplicate avoidance
                ->pluck('question')
                ->toArray();
            
            $avoidPrompt = "";
            if (!empty($recentRiddles)) {
                $avoidPrompt = "Avoid these recent riddles:\n";
                foreach ($recentRiddles as $recent) {
                    $avoidPrompt .= "- " . substr($recent, 0, 60) . "\n";
                }
                $avoidPrompt .= "\n";
            }
            
            // Call Gemini API - REMOVED PAGE REFERENCE
            $response = Http::timeout(30)->withoutVerifying()
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => $avoidPrompt . "Generate a UNIQUE and SIMPLE riddle.
                                    Answer must be ONE WORD only (like: clock, towel, comb, piano, candle).
                                    Make it different from the examples above.
                                    
                                    IMPORTANT: Always include EXPLANATION
                                    Format EXACTLY:
                                    RIDDLE: [the riddle question]
                                    HINT: [a helpful hint]
                                    ANSWER: [one word only]
                                    EXPLANATION: [Explain clearly why this is the answer in 1-2 sentences]

                                    Example:
                                    RIDDLE: What has keys but can't open locks?
                                    HINT: Think about musical instruments
                                    ANSWER: piano
                                    EXPLANATION: A piano has keys (piano keys) but they are musical keys, not keys that open locks.

                                    Generate a unique riddle now:"
                                ]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.9, // Slightly higher for more variety
                        'maxOutputTokens' => 200,
                    ]
                ]);
        
            if ($response->successful()) {
                $data = $response->json();
                $aiText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
                
                // Parse the response
                $riddleData = $this->parseAIResponse($aiText);
                
                if ($riddleData) {
                    // Ensure answer is one word
                    $answerWords = explode(' ', trim($riddleData['answer']));
                    if (count($answerWords) > 1) {
                        $riddleData['answer'] = $answerWords[0];
                    }
                    $riddleData['answer'] = strtolower($riddleData['answer']);
                    
                    // Save to database
                    $riddle = Riddle::create([
                        'question' => $riddleData['question'],
                        'hint' => $riddleData['hint'],
                        'answer' => $riddleData['answer'],
                        'explanation' => $riddleData['explanation'],
                        'source' => 'gemini_ai'
                    ]);

                    return response()->json([
                        'success' => true,
                        'ai_generated' => true,
                        'message' => 'AI riddle generated successfully!',
                        'data' => [
                            'id' => $riddle->id,
                            'question' => $riddleData['question'],
                            'hint' => $riddleData['hint'],
                            'answer' => $riddleData['answer'],
                            'explanation' => $riddleData['explanation'],
                            'source' => 'gemini_ai'
                            // NO PAGE INFO!
                        ]
                    ]);
                }
            }
            
            // If AI fails, use fallback WITHOUT page info
            return $this->getFallbackRiddle();
            
        } catch (\Exception $e) {
            // If error, use fallback WITHOUT page info
            return $this->getFallbackRiddle();
        }
    }
    
    /**
     * Parse AI response
     */
    private function parseAIResponse(string $text): ?array
    {
        $text = trim($text);
        
        $patterns = [
            'question' => '/RIDDLE:\s*(.+?)(?:\n|$)/i',
            'hint' => '/HINT:\s*(.+?)(?:\n|$)/i',
            'answer' => '/ANSWER:\s*(.+?)(?:\n|$)/i',
            'explanation' => '/EXPLANATION:\s*(.+?)(?:\n|$)/i',
        ];
        
        $data = [];
        foreach ($patterns as $key => $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $data[$key] = trim($matches[1]);
            }
        }
        
        if (isset($data['question']) && isset($data['answer'])) {
            return [
                'question' => $data['question'],
                'hint' => $data['hint'] ?? 'Think carefully!',
                'answer' => $data['answer'],
                'explanation' => $data['explanation'] ?? 'No explanation available.'
            ];
        }
        
        return null;
    }
    
    /**
     * Fallback riddle if AI fails - REMOVED PAGE PARAMETERS
     */
    private function getFallbackRiddle()
    {
        $fallbacks = [
            [
                'question' => "What has keys but can't open locks?",
                'hint' => 'Think about musical instruments',
                'answer' => 'piano',
                'explanation' => 'A piano has keys (piano keys) but they are musical keys, not keys that open locks.',
                'source' => 'fallback'
            ],
            [
                'question' => "I'm tall when I'm young and short when I'm old. What am I?",
                'hint' => 'Think about something that burns',
                'answer' => 'candle',
                'explanation' => 'A candle is tall when new, but melts and becomes shorter as it burns.',
                'source' => 'fallback'
            ],
            [
                'question' => "What has a head and a tail but no body?",
                'hint' => 'Think about money',
                'answer' => 'coin',
                'explanation' => 'A coin has a head (the front with a face) and a tail (the back side) but no actual body.',
                'source' => 'fallback'
            ],
            [
                'question' => "What gets wet while drying?",
                'hint' => 'Think about bathroom items',
                'answer' => 'towel',
                'explanation' => 'A towel gets wet as it dries you off.',
                'source' => 'fallback'
            ],
            [
                'question' => "What has teeth but can't bite?",
                'hint' => 'Think about tools',
                'answer' => 'comb',
                'explanation' => 'A comb has teeth but it cannot bite.',
                'source' => 'fallback'
            ],
        ];
        
        // Random fallback instead of page-based
        $index = array_rand($fallbacks);
        $fallbackData = $fallbacks[$index];
        
        // Save to database
        $riddle = Riddle::create([
            'question' => $fallbackData['question'],
            'hint' => $fallbackData['hint'],
            'answer' => $fallbackData['answer'],
            'explanation' => $fallbackData['explanation'],
            'source' => 'fallback'
        ]);
        
        return response()->json([
            'success' => true,
            'ai_generated' => false,
            'message' => 'Using fallback riddle',
            'data' => [
                'id' => $riddle->id,
                'question' => $fallbackData['question'],
                'hint' => $fallbackData['hint'],
                'answer' => $fallbackData['answer'],
                'explanation' => $fallbackData['explanation'],
                'source' => $fallbackData['source']
                // NO PAGE INFO!
            ]
        ]);
    }
}