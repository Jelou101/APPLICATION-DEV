<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Riddle;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log; // Add this import

class EnduranceController extends Controller
{
    /**
     * Generate an endurance question (mix of riddles and logic) using AI
     */
    public function generate(Request $request)
    {
        $timeMode = (int) $request->query('time', 60);
        $questionNumber = (int) $request->query('q', 1);
        
        // Mix of question types - 50% riddle, 50% logic
        $type = rand(1, 2) === 1 ? 'riddle' : 'logic';
        
        if ($type === 'riddle') {
            $question = $this->generateAIRiddle();
        } else {
            $question = $this->generateAILogicQuestion();
        }
        
        // If AI fails, fallback to predefined questions
        if (!$question) {
            $question = $this->getFallbackQuestion($type);
        }
        
        // Add metadata
        $question['time_mode'] = $timeMode;
        $question['question_number'] = $questionNumber;
        $question['type'] = $type;
        
        return response()->json([
            'success' => true,
            'message' => 'Endurance question generated',
            'data' => $question
        ], 200);
    }
    
    /**
     * Generate AI riddle using Gemini
     */
    private function generateAIRiddle()
    {
        $apiKey = env('GEMINI_API_KEY');
        
        if (!$apiKey) {
            Log::warning('Gemini API key not configured');
            return null;
        }
        
        try {
            $response = Http::timeout(30)->withoutVerifying()
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => "Generate a SIMPLE riddle for an endurance game. The answer must be ONE WORD only.
                                    
                                    Format EXACTLY:
                                    RIDDLE: [the riddle question]
                                    HINT: [a helpful hint]
                                    ANSWER: [one word only]
                                    EXPLANATION: [Explain clearly why this is the answer in 1 sentence]

                                    Example:
                                    RIDDLE: What has keys but can't open locks?
                                    HINT: Think about musical instruments
                                    ANSWER: piano
                                    EXPLANATION: A piano has keys (piano keys) but they are musical keys, not keys that open locks.

                                    Generate a new unique riddle:"
                                ]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 1.0,
                        'maxOutputTokens' => 150,
                    ]
                ]);
        
            if ($response->successful()) {
                $data = $response->json();
                $aiText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
                
                Log::info('AI Riddle Generated:', ['response' => $aiText]);
                return $this->parseAIResponse($aiText, 'riddle');
            } else {
                Log::error('AI Riddle API failed:', ['response' => $response->body()]);
            }
        } catch (\Exception $e) {
            Log::error('AI Riddle Generation Error: ' . $e->getMessage());
        }
        
        return null;
    }
    
    /**
     * Generate AI logic question using Gemini
     */
    private function generateAILogicQuestion()
    {
        $apiKey = env('GEMINI_API_KEY');
        
        if (!$apiKey) {
            Log::warning('Gemini API key not configured');
            return null;
        }
        
        try {
            $response = Http::timeout(30)->withoutVerifying()
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => "Generate a SIMPLE logic puzzle for an endurance game. Make it pattern-based or simple math PLEASE DONT REPEAT QUESTIONS YOU ALREADY GENERATE. MAKE IT UNI.
                                    
                                    Format EXACTLY:
                                    QUESTION: [the logic question]
                                    OPTIONS: [4 multiple choice options labeled A, B, C, D]
                                    ANSWER: [single letter A, B, C, or D]
                                    HINT: [a helpful hint]
                                    EXPLANATION: [Explain the solution in 1-2 sentences]

                                    Example:
                                    QUESTION: What comes next? 2, 4, 8, 16, ?
                                    OPTIONS: A) 24 B) 32 C) 28 D) 20
                                    ANSWER: B
                                    HINT: Each number doubles the previous.
                                    EXPLANATION: The pattern is multiplying by 2 each time: 2×2=4, 4×2=8, 8×2=16, 16×2=32.

                                    Generate a new unique logic puzzle:"
                                ]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.8,
                        'maxOutputTokens' => 200,
                    ]
                ]);
        
            if ($response->successful()) {
                $data = $response->json();
                $aiText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
                
                Log::info('AI Logic Question Generated:', ['response' => $aiText]);
                return $this->parseAIResponse($aiText, 'logic');
            } else {
                Log::error('AI Logic API failed:', ['response' => $response->body()]);
            }
        } catch (\Exception $e) {
            Log::error('AI Logic Generation Error: ' . $e->getMessage());
        }
        
        return null;
    }
    
    /**
     * Parse AI response based on type
     */
    private function parseAIResponse(string $text, string $type): ?array
    {
        $text = trim($text);
        
        if ($type === 'riddle') {
            $patterns = [
                'question' => '/RIDDLE:\s*(.+?)(?:\n|$)/i',
                'hint' => '/HINT:\s*(.+?)(?:\n|$)/i',
                'answer' => '/ANSWER:\s*(.+?)(?:\n|$)/i',
                'explanation' => '/EXPLANATION:\s*(.+?)(?:\n|$)/i',
            ];
        } else {
            $patterns = [
                'question' => '/QUESTION:\s*(.+?)(?:\n|$)/i',
                'options' => '/OPTIONS:\s*(.+?)(?:\n|$)/i',
                'answer' => '/ANSWER:\s*(.+?)(?:\n|$)/i',
                'hint' => '/HINT:\s*(.+?)(?:\n|$)/i',
                'explanation' => '/EXPLANATION:\s*(.+?)(?:\n|$)/i',
            ];
        }
        
        $data = [];
        foreach ($patterns as $key => $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $data[$key] = trim($matches[1]);
            }
        }
        
        if (isset($data['question']) && isset($data['answer'])) {
            $result = [
                'question' => $data['question'],
                'hint' => $data['hint'] ?? 'Think carefully!',
                'answer' => strtolower($data['answer']),
                'explanation' => $data['explanation'] ?? 'No explanation available.',
                'type' => $type
            ];
            
            if ($type === 'logic' && isset($data['options'])) {
                $result['options'] = $data['options'];
            }
            
            return $result;
        }
        
        Log::warning('Failed to parse AI response:', [
            'type' => $type,
            'text' => $text,
            'parsed_data' => $data
        ]);
        
        return null;
    }
    
    /**
     * Get fallback question if AI fails
     */
    private function getFallbackQuestion(string $type): array
    {
        if ($type === 'riddle') {
            $fallbacks = [
                [
                    'question' => "What has keys but can't open locks?",
                    'hint' => 'Think about musical instruments',
                    'answer' => 'piano',
                    'explanation' => 'A piano has keys (piano keys) but they are musical keys, not keys that open locks.',
                    'type' => 'riddle'
                ],
                [
                    'question' => "What has a head and a tail but no body?",
                    'hint' => 'Think about money',
                    'answer' => 'coin',
                    'explanation' => 'A coin has a head (the front with a face) and a tail (the back side) but no actual body.',
                    'type' => 'riddle'
                ],
            ];
        } else {
            $fallbacks = [
                [
                    'question' => 'What comes next? △ □ ○ △ □ ___',
                    'options' => 'A) △  B) □  C) ○  D) ☆',
                    'answer' => 'c',
                    'hint' => 'Pattern repeats every 3 shapes.',
                    'explanation' => 'The pattern △ □ ○ repeats continuously. After △ □ comes ○.',
                    'type' => 'logic'
                ],
                [
                    'question' => 'What next? 1, 1, 2, 3, 5, 8, 13, ?',
                    'options' => 'A) 18  B) 20  C) 21  D) 19',
                    'answer' => 'c',
                    'hint' => 'Fibonacci sequence: add previous two numbers.',
                    'explanation' => '8 + 13 = 21. This is the Fibonacci sequence.',
                    'type' => 'logic'
                ],
            ];
        }
        
        return $fallbacks[array_rand($fallbacks)];
    }
}   