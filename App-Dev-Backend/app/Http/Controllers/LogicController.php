<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log; 
use App\Models\LogicQuestion; // ADD THIS

class LogicController extends Controller
{
    /**
     * Generate AI logic question using OpenRouter API
     */
    public function generate(Request $request)
{
    $apiKey = env('OPENROUTER_API_KEY');
    
    if (!$apiKey) {
        Log::error('OpenRouter API key not configured for logic questions');
        return $this->getFallbackQuestion();
    }
    
    Log::info('Starting logic question generation', ['api_key_exists' => !empty($apiKey)]);
    
    try {
        // Get recent logic questions to avoid duplicates
        $recentQuestions = LogicQuestion::orderBy('id', 'desc')
            ->limit(15)
            ->pluck('question')
            ->toArray();
        
        Log::info('Recent questions count:', ['count' => count($recentQuestions)]);
        
        $avoidPrompt = "";
        if (!empty($recentQuestions)) {
            $avoidPrompt = "Avoid these recent logic puzzles:\n";
            foreach ($recentQuestions as $recent) {
                $avoidPrompt .= "- " . substr($recent, 0, 100) . "\n";
            }
            $avoidPrompt .= "\nDO NOT REPEAT ANY OF THESE. Generate something completely different.\n\n";
        }
        
        Log::info('Avoid prompt length:', ['length' => strlen($avoidPrompt)]);
        
        // Call OpenRouter API
        $response = Http::timeout(30)
    ->withoutVerifying()
    ->withHeaders([
        'Authorization' => 'Bearer ' . $apiKey,
        'HTTP-Referer' => env('APP_URL', 'http://localhost'),
        'X-Title' => env('APP_NAME', 'Laravel Puzzle'),
        'Content-Type' => 'application/json',
    ])
    ->post('https://openrouter.ai/api/v1/chat/completions', [
        'model' => 'openai/gpt-oss-20b:free',
        'messages' => [
            [
                'role' => 'system',
                'content' => 'You generate logic puzzles. Format exactly as shown.'
            ],
            [
                'role' => 'user',
                'content' => $avoidPrompt . "Create a simple logic puzzle.

Format exactly:
QUESTION: [the puzzle]
OPTIONS: A) [option1] B) [option2] C) [option3] D) [option4]
ANSWER: [single letter A-D]
HINT: [one sentence hint]
EXPLANATION: [brief explanation]

Example:
QUESTION: Two ducks in front of a duck, two ducks behind a duck, one duck in middle. How many ducks?
OPTIONS: A) 2 B) 3 C) 4 D) 5
ANSWER: B
HINT: Visualize them in a line.
EXPLANATION: Three ducks in line: positions satisfy all conditions.

Now generate a new logic puzzle:"
            ]
        ],
        'temperature' => 0.8,
        'max_tokens' => 250,
    ]);
        
        Log::info('OpenRouter API response status:', ['status' => $response->status()]);
        
        if ($response->successful()) {
            $data = $response->json();
            Log::info('OpenRouter API successful response');
            
            $aiText = $data['choices'][0]['message']['content'] ?? '';
            Log::info('AI response text sample:', ['first_100_chars' => substr($aiText, 0, 100)]);
            
            // Parse the response
            $questionData = $this->parseAIResponse($aiText);
            
            if ($questionData) {
                Log::info('Successfully parsed AI response');
                
                // Save to database
                $logicQuestion = LogicQuestion::create([
                    'question' => $questionData['question'],
                    'options' => $questionData['options'],
                    'answer' => $questionData['answer'],
                    'hint' => $questionData['hint'],
                    'explanation' => $questionData['explanation'],
                    'source' => 'openrouter_ai',
                ]);

                Log::info('Saved logic question to database', ['id' => $logicQuestion->id]);
                
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
                        'source' => 'openrouter_ai',
                    ]
                ]);
            } else {
                Log::warning('Failed to parse AI response', ['ai_text' => $aiText]);
            }
        } else {
            Log::error('OpenRouter API failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
        }
        
        // If AI fails, use fallback
        Log::warning('Falling back to local logic question');
        return $this->getFallbackQuestion();
        
    } catch (\Exception $e) {
        Log::error('Exception in logic question generation: ' . $e->getMessage());
        return $this->getFallbackQuestion();
    }
}
    /**
     * Parse AI response
     */
    private function parseAIResponse(string $text): ?array
{
    $text = trim($text);
    
    // Try multiple pattern formats
    $patterns = [
        'question' => '/QUESTION:\s*(.+?)(?:\n|$)/i',
        'options' => '/OPTIONS:\s*(.+?)(?:\n|$)/i',
        'answer' => '/ANSWER:\s*(.+?)(?:\n|$)/i',
        'hint' => '/HINT:\s*(.+?)(?:\n|$)/i',
        'explanation' => '/EXPLANATION:\s*(.+?)(?:\n|$)/i',
    ];
    
    // Also try without labels (just the format)
    if (!preg_match('/QUESTION:/i', $text)) {
        // Try to parse lines directly
        $lines = array_filter(explode("\n", $text));
        if (count($lines) >= 5) {
            return [
                'question' => trim($lines[0]),
                'options' => trim($lines[1]),
                'answer' => trim($lines[2]),
                'hint' => trim($lines[3]),
                'explanation' => trim($lines[4]),
            ];
        }
    }
    
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
            'answer' => strtoupper(trim($data['answer'], ' .')),
            'explanation' => $data['explanation'] ?? 'No explanation available.'
        ];
    }
    
    Log::warning('Could not parse AI response', ['text' => $text]);
    return null;
}
    
    /**
     * Fallback logic questions
     */
    private function getFallbackQuestion()
    {
        // Your existing local questions
        $samples = [
            ['question' => 'What comes next in the sequence? △ □ ○ △ □ ___', 'options' => 'A) △  B) □  C) ○  D) ☆', 'answer' => 'C', 'hint' => 'Look at the pattern: it repeats three shapes.', 'explanation' => 'The pattern repeats: triangle, square, circle. After △ □ comes ○.'],
            ['question' => 'Which number should replace the question mark? 2, 4, 8, 16, ?', 'options' => 'A) 24  B) 32  C) 28  D) 20', 'answer' => 'B', 'hint' => 'Each number is double the previous one.', 'explanation' => 'Each number doubles the previous: 2×2=4, 4×2=8, 8×2=16, 16×2=32.'],
            ['question' => 'If all roses are flowers, and all flowers fade, then all roses fade. This is: True or False?', 'options' => 'A) True  B) False', 'answer' => 'A', 'hint' => 'Follow the logical chain carefully.', 'explanation' => 'If roses are flowers (subset), and all flowers fade, then roses must also fade.'],
            ['question' => 'What comes next? 1, 1, 2, 3, 5, 8, 13, ?', 'options' => 'A) 18  B) 20  C) 21  D) 19', 'answer' => 'C', 'hint' => 'Each number is the sum of the previous two (Fibonacci).', 'explanation' => 'Fibonacci sequence: 8+13=21.'],
            ['question' => 'If a hen and a half lays an egg and a half in a day and a half, how many eggs does one hen lay in one day?', 'options' => 'A) 1  B) 0.5  C) 1.5  D) 2', 'answer' => 'C', 'hint' => 'Use proportional reasoning.', 'explanation' => '1.5 hens lay 1.5 eggs in 1.5 days, so 1 hen lays 1 egg in 1.5 days, or 2/3 egg per day ≈ 0.67. Actually recalculating: 1 hen lays 1 egg in 1 day.'],
        ];
        
        // Random selection instead of page-based
        $index = array_rand($samples);
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
                // NO PAGE INFO!
            ]
        ], 200);
    }
}