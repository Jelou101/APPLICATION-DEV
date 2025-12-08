import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EnduranceHeader from "../components/EnduranceHeader";
import { usePoints } from "../hooks/usePoints"; // CHANGE THIS - use hook instead of pointsManager

const Endurance = () => {
  const TIME_OPTIONS = [60, 90, 120];
  
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
 const [hintUsedThisRiddle, setHintUsedThisRiddle] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedTime, setSelectedTime] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [fastAnswers, setFastAnswers] = useState(0);
  

  const [gameOverProcessed, setGameOverProcessed] = useState(false);
  const { addGamePoints, deductPoints } = usePoints(); // ADD THIS LINE
  
  
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const questionNumber = questionsAnswered + 1;
  const bonusAwardedRef = useRef(false);

  // Initialize from location state
  useEffect(() => {
    const state = location.state || {};
    if (state.score) setScore(state.score);
    if (state.hintCount) setHintCount(state.hintCount);
    if (state.questionsAnswered) setQuestionsAnswered(state.questionsAnswered);
    if (state.timeRemaining) setTimeRemaining(state.timeRemaining);
    if (state.selectedTime) setSelectedTime(state.selectedTime);
    if (state.gameStarted) setGameStarted(true);
    if (state.fastAnswers) setFastAnswers(state.fastAnswers);
  }, [location]);

  // Timer effect
  // Timer effect
  // Timer effect
  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver || timeRemaining <= 0) return;
  
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!gameOverProcessed) {
            setGameOver(true);
            setGameOverProcessed(true);
            
            // When time naturally runs out, navigate
            const completionBonus = Math.floor(questionsAnswered * 2);
            const totalScore = score + bonusPoints;
            
            // Small delay for natural time up
            setTimeout(() => {
              navigate("/EnduranceSummary", {
                state: {
                  score: totalScore,
                  questionsAnswered,
                  totalTime: selectedTime,
                  timeUsed: selectedTime - 0, // All time used
                  hintCount,
                  fastAnswers,
                  bonusPoints,
                  timeMode: selectedTime,
                  completionBonus: completionBonus
                },
              });
            }, 1500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, timeRemaining, gameOverProcessed, questionsAnswered, score, bonusPoints, selectedTime, hintCount, fastAnswers, navigate]);
  // Reset gameOverProcessed when starting new game
    useEffect(() => {
      if (gameStarted) {
        setGameOverProcessed(false);
      }
    }, [gameStarted]);

  // Fetch question when game starts or after answer
  useEffect(() => {
    if (gameStarted && !gameOver && !question) {
      fetchQuestion();
    }
  }, [gameStarted, gameOver, question]);

  // Navigate to summary when time runs out - AWARD ENDURANCE BONUS
  // Navigate to summary when time runs out - AWARD ENDURANCE BONUS
  /*useEffect(() => {
    let isMounted = true;
    
    if (gameOver && isMounted && !bonusAwardedRef.current) {
      console.log('🎮 Game Over triggered');
      
      // Mark as processed
      bonusAwardedRef.current = true;
      
      const totalScore = score + bonusPoints;
      
      // Award endurance completion bonus
      const completionBonus = Math.floor(questionsAnswered * 2); // 2 points per question
      
      // Use hook methods instead of pointsManager
      const awardCompletionBonus = async () => {
        try {
          console.log('🏆 Awarding completion bonus:', completionBonus);
          await addGamePoints('endurance', completionBonus);
        } catch (error) {
          console.error('Error awarding completion bonus:', error);
        }
      };
      
      awardCompletionBonus();
      
      // Clear timer to prevent duplicate navigation
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          console.log('🚀 Navigating to summary');
          navigate("/EnduranceSummary", {
            state: {
              score: totalScore,
              questionsAnswered,
              totalTime: selectedTime,
              timeUsed: selectedTime - timeRemaining,
              hintCount,
              fastAnswers,
              bonusPoints,
              timeMode: selectedTime,
              completionBonus: completionBonus
            },
          });
        }
      }, 2000);
      
      // Cleanup function
      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }
  }, [gameOver, navigate, score, questionsAnswered, selectedTime, timeRemaining, hintCount, fastAnswers, bonusPoints, addGamePoints]);*/

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    setShowHint(false);
    setHintUsedThisRiddle(false);
    setUserAnswer("");

    try {
      const res = await fetch(
        `${API_BASE}/api/endurance/generate?time=${selectedTime}&q=${questionNumber}`
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      
      const payload = await res.json();
      setQuestion(payload.data || null);
    } catch (e) {
      setError("Unable to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = (time) => {
    setSelectedTime(time);
    setTimeRemaining(time);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setQuestionsAnswered(0);
    setHintCount(0);
    setBonusPoints(0);
    setFastAnswers(0);
    bonusAwardedRef.current = false;
  };

  const handleShowHint = async () => {
    if (hintUsedThisRiddle || gameOver) return;
    
    try {
      // Deduct 10 points for using hint in endurance
      const hintCost = 10; // CHANGED from 15 to 10
      await deductPoints(hintCost);
      
      setShowHint(true);
      setHintUsedThisRiddle(true);
      setHintCount((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to deduct points for hint:', error);
    }
  };

  const handleEndGameEarly = () => {
    console.log('🛑 Ending game early');
    
    // Prevent multiple clicks
    if (gameOver || gameOverProcessed) {
      console.log('⚠️ Game already ended, ignoring click');
      return;
    }
    
    // Immediately navigate to summary with current data
    const completionBonus = Math.floor(questionsAnswered * 2);
    const totalScore = score + bonusPoints;
    
    console.log('🚀 Immediate navigation to summary');
    
    // Navigate immediately without delay
    navigate("/EnduranceSummary", {
      state: {
        score: totalScore,
        questionsAnswered,
        totalTime: selectedTime,
        timeUsed: selectedTime - timeRemaining,
        hintCount,
        fastAnswers,
        bonusPoints,
        timeMode: selectedTime,
        completionBonus: completionBonus
      },
    });
    
    // Still set game over state to stop timer
    setGameOver(true);
    setGameOverProcessed(true);
    setTimeRemaining(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const calculateBonus = () => {
    const timeBonus = Math.floor(timeRemaining / 5);
    const speedBonus = timeRemaining > selectedTime * 0.7 ? 2 : 0;
    return timeBonus + speedBonus;
  };

  // Submit answer - AWARD POINTS BASED ON PERFORMANCE
  const submitAnswer = async () => {
    if (!question?.answer || !userAnswer.trim() || gameOver) return;
  
    const isCorrect = userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    let pointsEarned = isCorrect ? 1 : 0;
    let newBonus = 0;
    let newFastAnswers = fastAnswers;
  
    if (isCorrect) {
      // Calculate bonus points for speed
      newBonus = calculateBonus();
      pointsEarned += newBonus;
      setBonusPoints((prev) => prev + newBonus);
      
      // Track fast answers (answered in first 20% of time)
      if (timeRemaining > selectedTime * 0.8) {
        newFastAnswers++;
        setFastAnswers(newFastAnswers);
      }
      
      // Award total points for correct answer in endurance - 30 points
      const basePoints = 30; // CHANGED from 5 to 30
      const totalPointsAwarded = basePoints + newBonus;
      
      try {
        await addGamePoints('endurance', totalPointsAwarded);
      } catch (error) {
        console.error('Error adding points:', error);
      }
      
    } else {
      // Deduct 5 points for incorrect answer in endurance
      const pointsDeducted = 5;
      try {
        await deductPoints(pointsDeducted);
      } catch (error) {
        console.error('Error deducting points:', error);
      }
    }

    const newScore = score + pointsEarned;
    const newQuestionsAnswered = questionsAnswered + 1;
    
    setScore(newScore);
    setQuestionsAnswered(newQuestionsAnswered);

    const resultState = {
      answer: question.answer,
      explanation: question.explanation || "Question answered.",
      score: newScore,
      questionsAnswered: newQuestionsAnswered,
      hintCount,
      timeRemaining,
      selectedTime,
      timeMode: selectedTime,
      type: question.type,
      question: question.question,
      pointsEarned: isCorrect ? (30 + newBonus) : -5, // Show points earned/lost
      bonusPoints: newBonus,
      fastAnswers: newFastAnswers,
      userAnswer: userAnswer
    };

    navigate(isCorrect ? "/EnduranceCorrect" : "/EnduranceIncorrect", {
      state: resultState,
    });
  };

  // Render time selection screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link to="/Dashboard" className="inline-block mb-8">
            <button className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </Link>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Endurance Challenge
              </span>
            </h1>
            <p className="text-gray-300 text-xl">Answer as many questions as you can before time runs out!</p>
          </div>

          {/* Time Selection */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Timer Duration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TIME_OPTIONS.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleStartGame(time)}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-cyan-500/50 hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{time}</div>
                      <div className="text-gray-300">seconds</div>
                      <div className="mt-4 text-sm text-gray-400 group-hover:text-cyan-300">
                        {time === 60 && "Fast & Furious"}
                        {time === 90 && "Balanced Challenge"}
                        {time === 120 && "Marathon Mode"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Game Rules */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">📋 How It Works</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                  <span><span className="font-semibold">Timer-based:</span> Answer questions before time runs out</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                  <span><span className="font-semibold">No page limit:</span> Answer as many as you can</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                  <span><span className="font-semibold">Points:</span> +30 base + time bonus for correct answers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                  <span><span className="font-semibold">Penalties:</span> -5 for wrong answers, -10 for hints</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                  <span><span className="font-semibold">Completion Bonus:</span> +2 points per question answered</span>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render game screen
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins text-white">
      <EnduranceHeader />
      {/* Stats Bar */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          {/* Time Mode */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/30 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700/30">
            <div className="text-sm text-gray-400">Time Mode</div>
            <div className="text-xl font-bold text-cyan-400">{selectedTime}s</div>
          </div>

          {/* Timer */}
          <div className={`bg-gradient-to-r ${timeRemaining <= 10 ? 'from-red-900/30 to-red-800/20' : 'from-blue-900/30 to-blue-800/20'} backdrop-blur-sm px-6 py-4 rounded-xl border ${timeRemaining <= 10 ? 'border-red-500/30' : 'border-blue-700/30'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${timeRemaining <= 10 ? 'bg-red-500' : 'bg-blue-500'}`}></div>
              <div className="text-3xl font-bold">{formatTime(timeRemaining)}</div>
            </div>
            <div className="text-sm text-gray-400 mt-1">Time Remaining</div>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-green-700/30">
            <div className="text-sm text-gray-400">Score</div>
            <div className="text-2xl font-bold text-green-400">{score}</div>
            <div className="text-xs text-gray-500">+{bonusPoints} bonus</div>
          </div>

          {/* Questions Answered */}
          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-purple-700/30">
            <div className="text-sm text-gray-400">Answered</div>
            <div className="text-2xl font-bold text-purple-400">{questionsAnswered}</div>
            <div className="text-xs text-gray-500">#{questionNumber}</div>
          </div>

          
        </div>

        {/* Game Over Warning */}
        {gameOver && (
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 mb-6 text-center animate-pulse">
            <div className="text-red-400 text-xl font-bold">⏱️ TIME'S UP!</div>
            <div className="text-gray-300">Calculating your bonus points...</div>
          </div>
        )}
      </div>

      {/* Main Question Card */}
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-8">
          {/* Question Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${question?.type === 'riddle' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30' : 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/30'}`}>
                {question?.type === 'riddle' ? '🎭 RIDDLE' : '🧠 LOGIC'}
              </div>
              <div className="text-gray-400 text-sm">Question #{questionNumber}</div>
            </div>
            
            <button
              onClick={handleShowHint}
              disabled={hintUsedThisRiddle || loading}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                hintUsedThisRiddle || loading
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/30'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
              }`}
            >
              💡 Hint (-10 points) {/* CHANGE to -10 points */}
            </button>
          </div>

          {/* Question */}
          <div className="mb-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <div className="text-gray-400">Loading next question...</div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
                <button
                  onClick={fetchQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            ) : question ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border-2 border-gray-700/50 rounded-xl p-6">
                  <div className="text-2xl text-center leading-relaxed font-medium text-gray-100">
                    {question.question}
                  </div>
                  {question.options && (
                    <div className="mt-4 text-gray-300 text-center">{question.options}</div>
                  )}
                </div>

                {/* Hint Display */}
                {showHint && question.hint && (
                  <div className="animate-fade-in">
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

                {/* Answer Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={gameOver ? "Time's up! Game over..." : "Type your answer here..."}
                    value={userAnswer}
                    onChange={(e) => !gameOver && setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !gameOver && !loading && submitAnswer()}
                    disabled={gameOver || loading}
                    className="w-full px-6 py-4 text-lg bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 rounded-xl focus:outline-none transition-all duration-300 placeholder-gray-500 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    Press Enter to submit
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
          <button
            onClick={handleEndGameEarly}
            disabled={gameOver || gameOverProcessed}
            className={`flex-1 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700 ${
              gameOver || gameOverProcessed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {gameOver ? 'Ending Game...' : 'End Game Early'}
          </button>
            
            <button
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || gameOver || loading}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !userAnswer.trim() || gameOver || loading
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/30'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover-lift shadow-lg'
              }`}
            >
              Submit Answer
            </button>
          </div>

          {/* Bonus Info */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>💨 Answer quickly for bonus points! Bonus: +{calculateBonus()} available</p>
            <p className="mt-1">+30 base points, -5 for wrong answers, -10 for hints</p> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Endurance;