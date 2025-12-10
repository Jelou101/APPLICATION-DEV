import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LogicHeader from "../components/LogicHeader";
import { usePoints } from "../hooks/usePoints"; // Import usePoints

const Logic = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [hintUsedThisQuestion, setHintUsedThisQuestion] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addGamePoints, deductPoints } = usePoints();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "";

  const getUserId = () => localStorage.getItem('userId');
  const getStorageKey = () => {
    const userId = getUserId();
    return userId ? `logicProgress_${userId}` : 'logicProgress_guest';
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const storageKey = getStorageKey();
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const progress = JSON.parse(saved);
        setScore(progress.score || 0);
        setHintCount(progress.hintCount || 0);
        if (progress.currentQuestion) {
          setQuestion(progress.currentQuestion);
        } else {
          fetchGeneratedQuestion();
        }
      } else {
        fetchGeneratedQuestion();
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      fetchGeneratedQuestion();
    }
  };

  const saveProgress = (currentQuestion = null) => {
    try {
      const progress = {
        score,
        hintCount,
        currentQuestion,
        lastSaved: new Date().toISOString(),
        userId: getUserId() || 'guest'
      };
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(progress));
      setSaveStatus("Progress saved! 💾");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const fetchGeneratedQuestion = async () => {
    setLoading(true);
    setError(null);
    setShowHint(false);
    setHintUsedThisQuestion(false);
    setUserAnswer("");

    try {
      const url = `${API_BASE}/api/logic/generate`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const payload = await res.json();
      setQuestion(payload.data || null);
      saveProgress(payload.data || null);
    } catch (e) {
      setError("Unable to load logic question.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowHint = async () => {
    if (hintUsedThisQuestion) {
      setError("You already used a hint on this question!");
      return;
    }

    try {
      const hintCost = 3;
      await deductPoints(hintCost);

      setError(null);
      setShowHint(true);
      setHintUsedThisQuestion(true);
      const newHintCount = hintCount + 1;
      setHintCount(newHintCount);
      saveProgress(question);
    } catch (error) {
      setError("Failed to deduct points for hint. Please try again.");
      console.error('Hint error:', error);
    }
  };

  const submitAnswer = useCallback(async () => {
    if (!question?.answer || isSubmitting) return;
    setIsSubmitting(true);

    // The answer from the backend is now the actual value (e.g., '21' or 'the number 5'),
    // not a single letter (e.g., 'a' or 'c').
    const isCorrect = userAnswer.trim().toUpperCase() === question.answer.trim().toUpperCase();

    if (isCorrect) {
      try { await addGamePoints('logic', 15); } 
      catch (error) { console.error('Error adding points:', error); }
    } else {
      try { await deductPoints(5); } 
      catch (error) { console.error('Error deducting points:', error); }
    }

    const explanation = question.explanation || "This logic question tests pattern recognition or mathematical reasoning.";
    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);
    saveProgress(null);

    const resultState = {
      answer: question.answer,
      explanation,
      score: newScore,
      hintCount,
      question: question.question,
      options: [], // Options should be empty for the next screen
      isCorrect,
      timestamp: Date.now(),
      pointsChange: isCorrect ? '+15 points' : '-5 points'
    };

    if (isCorrect) navigate("/LogicCorrect", { state: resultState });
    else navigate("/LogicIncorrect", { state: resultState });

    setIsSubmitting(false);
  }, [question, isSubmitting, userAnswer, score, hintCount, navigate, addGamePoints, deductPoints]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && userAnswer.trim() && !loading && !isSubmitting) {
        submitAnswer();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [userAnswer, loading, isSubmitting, submitAnswer]);

  const handleExit = () => {
    saveProgress(question);
    navigate("/Dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins text-white">
      <LogicHeader />

      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl border border-gray-700 transition-all duration-300 hover-lift"
          >
            Save & Exit
          </button>
        </div>

        {saveStatus && (
          <div className="text-center text-green-400 animate-fade-in mb-4">
            {saveStatus}
          </div>
        )}

        <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          <div className="mb-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <div className="text-gray-400">Generating logic question...</div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
                <button
                  onClick={fetchGeneratedQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl transition-all duration-300 hover-lift"
                >
                  Try Again
                </button>
              </div>
            ) : question ? (
              <>
                <div className="text-2xl text-center leading-relaxed mb-6 p-6 bg-gradient-to-r from-gray-900/50 to-black/50 border-2 border-gray-700/50 rounded-xl">
                  {question.question}
                </div>

                {/* *** FIX APPLIED HERE: The options rendering block is removed. ***
                  Since we are expecting free-response questions, we do not render options.
                  The backend has been updated to send question.options as an empty array.
                */}
                
                {showHint && question.hint && (
                  <div className="mb-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 border-l-4 border-yellow-500 p-4 rounded-r-xl">
                      <div className="flex items-center gap-2 text-yellow-300 mb-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Hint #{hintCount}</span>
                      </div>
                      <div className="text-yellow-200">{question.hint}</div>
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <input
                    type="text"
                    placeholder="Enter your answer....."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full px-6 py-4 text-lg bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl focus:outline-none transition-all duration-300 placeholder-gray-500 text-center"
                    autoFocus
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleShowHint}
                    disabled={hintUsedThisQuestion || loading}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      hintUsedThisQuestion || loading
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white hover-lift shadow-lg"
                    }`}
                  >
                    Get Hint (-3 points)
                  </button>

                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim() || loading || isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      !userAnswer.trim() || loading || isSubmitting
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover-lift shadow-lg"
                    }`}
                  >
                    Submit Answer
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          <p>💡 Press Enter to submit your answer</p>
          <p className="mt-1">Progress is automatically saved. You can exit and continue later!</p>
        </div>
      </div>
    </div>
  );
};

export default Logic;