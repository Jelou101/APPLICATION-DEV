import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RiddleHeader from "../components/RiddleHeader";

const Riddles = () => {
  const MAX_HINTS = 5;
  const [riddle, setRiddle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [hintUsedThisRiddle, setHintUsedThisRiddle] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "";

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Load user progress from localStorage
  const loadProgress = async () => {
    try {
      const saved = localStorage.getItem('riddleProgress');
      if (saved) {
        const progress = JSON.parse(saved);
        setScore(progress.score || 0);
        setHintCount(progress.hintCount || 0);
        
        // If there's a saved current riddle, load it
        if (progress.currentRiddle) {
          setRiddle(progress.currentRiddle);
        } else {
          fetchGeneratedRiddle();
        }
      } else {
        fetchGeneratedRiddle();
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      fetchGeneratedRiddle();
    }
  };

  // Save progress to localStorage
  const saveProgress = (currentRiddle = null) => {
    try {
      const progress = {
        score,
        hintCount,
        currentRiddle,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('riddleProgress', JSON.stringify(progress));
      setSaveStatus("Progress saved! 💾");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Fetch a new riddle
  const fetchGeneratedRiddle = async () => {
    setLoading(true);
    setError(null);
    setShowHint(false);
    setHintUsedThisRiddle(false);
    setUserAnswer("");

    try {
      const response = await fetch(`${API_BASE}/api/riddles/generate/ai`);
      if (!response.ok) throw new Error(`Status ${response.status}`);

      const payload = await response.json();
      const newRiddle = payload.data;
      
      setRiddle(newRiddle);
      saveProgress(newRiddle);
    } catch (e) {
      console.error('Fetch error:', e);
      setError("Unable to load riddle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show hint
  const handleShowHint = () => {
    if (hintUsedThisRiddle) {
      setError("You already used a hint on this puzzle!");
      return;
    }

    if (hintCount >= MAX_HINTS) {
      setError(`Hint limit reached (${MAX_HINTS}).`);
      return;
    }

    setError(null);
    setShowHint(true);
    setHintUsedThisRiddle(true);
    const newHintCount = hintCount + 1;
    setHintCount(newHintCount);
    
    saveProgress(riddle);
  };

  // Skip current riddle
  const handleSkipRiddle = () => {
    if (!riddle) return;
    
    // Save progress
    saveProgress(null);
    
    // Generate new riddle
    fetchGeneratedRiddle();
  };

  // Submit answer
  const submitAnswer = async () => {
    if (!riddle?.answer) return;

    const isCorrect = userAnswer.trim().toLowerCase() === riddle.answer.trim().toLowerCase();

    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);

    // Save progress
    saveProgress(null);

    // Navigate to result page
    const resultState = {
      answer: riddle.answer,
      explanation: riddle.explanation || "No explanation available.",
      score: newScore,
      hintCount,
      question: riddle.question,
      isCorrect,
      timestamp: Date.now()
    };

    if (isCorrect) {
      navigate("/Correct", { state: resultState });
    } else {
      navigate("/Incorrect", { state: resultState });
    }
  };

  // Exit game (automatically saves)
  const handleExit = () => {
    saveProgress(riddle);
    navigate("/Dashboard");
  };

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && userAnswer.trim() && !loading) {
        submitAnswer();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [userAnswer, loading]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins text-white">
      <RiddleHeader />

      {/* Stats and Actions */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-between items-center mb-8">
        <button
  onClick={() => window.location.href = "/ChoosePuzzle"}
  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl border border-gray-700 transition-all duration-300 hover-lift"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
  Save & Exit
</button>

          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-gray-400 text-sm">Score</div>
              <div className="text-2xl font-bold text-cyan-400">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-sm">Hints Used</div>
              <div className={`text-2xl font-bold ${hintCount >= MAX_HINTS ? 'text-red-400' : 'text-yellow-400'}`}>
                {hintCount}/{MAX_HINTS}
              </div>
            </div>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div className="text-center text-green-400 animate-fade-in mb-4">
            {saveStatus}
          </div>
        )}

        {/* Riddle Card */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          {/* Riddle Question */}
          <div className="mb-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <div className="text-gray-400">Generating your riddle...</div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
                <button
                  onClick={fetchGeneratedRiddle}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl transition-all duration-300 hover-lift"
                >
                  Try Again
                </button>
              </div>
            ) : riddle ? (
              <>

                <div className="text-2xl text-center leading-relaxed mb-8 p-6 bg-gradient-to-r from-gray-900/50 to-black/50 border-2 border-gray-700/50 rounded-xl">
                  {riddle.question}
                </div>

                {/* Hint Display */}
                {showHint && riddle.hint && (
                  <div className="mb-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 border-l-4 border-yellow-500 p-4 rounded-r-xl">
                      <div className="flex items-center gap-2 text-yellow-300 mb-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Hint #{hintCount}</span>
                      </div>
                      <div className="text-yellow-200">{riddle.hint}</div>
                    </div>
                  </div>
                )}

                {/* Answer Input */}
                <div className="mb-8">
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                    className="w-full px-6 py-4 text-lg bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl focus:outline-none transition-all duration-300 placeholder-gray-500 text-center"
                    autoFocus
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleShowHint}
                    disabled={hintUsedThisRiddle || hintCount >= MAX_HINTS || loading}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      hintUsedThisRiddle || hintCount >= MAX_HINTS || loading
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white hover-lift shadow-lg"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Get Hint ({MAX_HINTS - hintCount} left)
                  </button>

                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim() || loading}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      !userAnswer.trim() || loading
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover-lift shadow-lg"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Submit Answer
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-400 text-sm mt-8">
          <p>💡 Press Enter to submit your answer</p>
          <p className="mt-1">Progress is automatically saved. You can exit and continue later!</p>
        </div>
      </div>
    </div>
  );
};

export default Riddles;