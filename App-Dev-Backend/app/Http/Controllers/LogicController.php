<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LogicController extends Controller
{
    /**
     * Generate AI logic question using FREE Gemini API
     */
    public function generate(Request $request)
    {
        $page = (int) $request->query('page', 1);
        $totalPages = 25;
        
        $apiKey = env('GEMINI_API_KEY');
        
        if (!$apiKey) {
            // Fallback to local questions
            return $this->getFallbackQuestion($page, $totalPages);
        }
    
        try {
            // Call Gemini API
            $response = Http::timeout(30)->withoutVerifying()
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => "Generate WORD-BASED LOGIC PUZZLE #" . $page . "

                                        RULES:
                                        1. Create puzzles about PEOPLE, OBJECTS, RELATIONSHIPS
                                        2. NO number sequences (like 2,4,6,8...)
                                        3. NO math calculations
                                        4. Make it require LOGICAL REASONING

                                        EXACT FORMAT:
                                        QUESTION: [puzzle text]
                                        OPTIONS: A) [answer 1] B) [answer 2] C) [answer 3] D) [answer 4]
                                        HINT: [thinking hint]
                                        ANSWER: [letter]
                                        EXPLANATION: [detailed reasoning]

                                        EXAMPLE 1:
                                        QUESTION: There are two ducks in front of a duck, two ducks behind a duck and a duck in the middle. How many ducks are there?
                                        OPTIONS: A) 2 B) 3 C) 4 D) 5
                                        HINT: Draw it or visualize the ducks in a line.
                                        ANSWER: B
                                        EXPLANATION: Three ducks in a line: Duck1, Duck2, Duck3. Duck1 and Duck2 are in front of Duck3; Duck2 and Duck3 are behind Duck1; Duck2 is in the middle.

                                        EXAMPLE 2:
                                        QUESTION: Five people were eating apples: A finished before B, but behind C. D finished before E, but behind B. What was the finishing order?
                                        OPTIONS: A) ABCDE B) CABDE C) CBADE D) CDABE
                                        HINT: Start with C first, then A before B.
                                        ANSWER: B
                                        EXPLANATION: C finished first, then A, then B. D finished before E but after B, so order is C, A, B, D, E.

                                        Generate a new word-based logic puzzle:"
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
                
                // Parse the response
                $questionData = $this->parseAIResponse($aiText);
                
                if ($questionData) {
                    return response()->json([
                        'success' => true,
                        'ai_generated' => true,
                        'message' => 'AI logic question generated successfully!',
                        'data' => [
                            'question' => $questionData['question'],
                            'options' => $questionData['options'],
                            'hint' => $questionData['hint'],
                            'answer' => $questionData['answer'],
                            'explanation' => $questionData['explanation'],
                            'source' => 'gemini_ai',
                            'page' => $page,
                            'totalPages' => $totalPages,
                        ]
                    ]);
                }
            }
            
            // If AI fails, use fallback
            return $this->getFallbackQuestion($page, $totalPages);
            
        } catch (\Exception $e) {
            // If error, use fallback
            return $this->getFallbackQuestion($page, $totalPages);
        }
    }
    
    /**
     * Parse AI response
     */
    private function parseAIResponse(string $text): ?array
    {
        // Clean the text
        $text = trim($text);
        
        // Look for our format
        $patterns = [
            'question' => '/QUESTION:\s*(.+?)(?:\n|$)/i',
            'options' => '/OPTIONS:\s*(.+?)(?:\n|$)/i',
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
                'options' => $data['options'] ?? 'A) ? B) ? C) ? D) ?',
                'hint' => $data['hint'] ?? 'Think logically!',
                'answer' => $data['answer'] ?? 'A',
                'explanation' => $data['explanation'] ?? 'No explanation available.'
            ];
        }
        
        return null;
    }
    
    /**
     * Fallback logic questions
     */
    private function getFallbackQuestion($page = 1, $totalPages = 25)
    {
        // Your existing local questions
        $samples = [
            ['question' => 'What comes next in the sequence? △ □ ○ △ □ ___', 'options' => 'A) △  B) □  C) ○  D) ☆', 'answer' => 'C', 'hint' => 'Look at the pattern: it repeats three shapes.', 'explanation' => 'The pattern repeats: triangle, square, circle. After △ □ comes ○.'],
            ['question' => 'Which number should replace the question mark? 2, 4, 8, 16, ?', 'options' => 'A) 24  B) 32  C) 28  D) 20', 'answer' => 'B', 'hint' => 'Each number is double the previous one.', 'explanation' => 'Each number doubles the previous: 2×2=4, 4×2=8, 8×2=16, 16×2=32.'],
            ['question' => 'If all roses are flowers, and all flowers fade, then all roses fade. This is: True or False?', 'options' => 'A) True  B) False', 'answer' => 'A', 'hint' => 'Follow the logical chain carefully.', 'explanation' => 'If roses are flowers (subset), and all flowers fade, then roses must also fade.'],
            ['question' => 'What comes next? 1, 1, 2, 3, 5, 8, 13, ?', 'options' => 'A) 18  B) 20  C) 21  D) 19', 'answer' => 'C', 'hint' => 'Each number is the sum of the previous two (Fibonacci).', 'explanation' => 'Fibonacci sequence: 8+13=21.'],
            ['question' => 'If a hen and a half lays an egg and a half in a day and a half, how many eggs does one hen lay in one day?', 'options' => 'A) 1  B) 0.5  C) 1.5  D) 2', 'answer' => 'C', 'hint' => 'Use proportional reasoning.', 'explanation' => '1.5 hens lay 1.5 eggs in 1.5 days, so 1 hen lays 1 egg in 1.5 days, or 2/3 egg per day ≈ 0.67. Actually recalculating: 1 hen lays 1 egg in 1 day.'],
        ];
        
        // Use page number to cycle through questions
        $index = ($page - 1) % count($samples);
        $pick = $samples[$index];
        
        return response()->json([
            'success' => true,
            'ai_generated' => false,
            'message' => 'Using fallback logic question',
            'data' => [
                'question' => $pick['question'],
                'options' => $pick['options'],
                'hint' => $pick['hint'],
                'answer' => $pick['answer'],
                'explanation' => $pick['explanation'] ?? 'No explanation available.',
                'source' => 'local',
                'page' => $page,
                'totalPages' => $totalPages,
            ]
        ], 200);
    }
}