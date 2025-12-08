import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EnduranceCorrect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    answer,
    explanation,
    question,
    type,
    options,
    score,
    questionsAnswered,
    hintCount,
    timeRemaining,
    selectedTime,
    pointsEarned,
    bonusPoints,
    userAnswer
  } = location.state || {};

  const handleContinue = () => {
    navigate("/Endurance", {
      state: {
        score,
        questionsAnswered,
        hintCount,
        timeRemaining,
        selectedTime,
        gameStarted: true
      }
    });
  };

  const handleExit = () => {
    navigate("/Dashboard");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins text-white overflow-hidden flex items-center justify-center">

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header - More Compact */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              CORRECT! 🎉
            </h1>
            <p className="text-gray-300 mt-1 text-sm">+30 base + {bonusPoints || 0} bonus points</p>
          </div>

          {/* Compact Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Question</div>
              <div className="text-xl font-bold text-cyan-400">#{questionsAnswered}</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Time Left</div>
              <div className="text-xl font-bold text-blue-400">{formatTime(timeRemaining)}</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Hints Used</div>
              <div className="text-xl font-bold text-yellow-400">{hintCount}</div>
            </div>
          </div>

          {/* Question Card - Compact */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-6">
            {/* Question Type */}
            <div className="flex items-center justify-between mb-4">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${type === 'riddle' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30' : 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/30'}`}>
                {type === 'riddle' ? '🎭 RIDDLE' : '🧠 LOGIC'}
              </div>
            </div>

            {/* Question - Compact */}
            <div className="mb-4">
              <div className="text-gray-400 text-xs mb-1">Question:</div>
              <div className="text-lg text-gray-100 bg-gray-900/30 border border-gray-700/30 rounded-lg p-3">
                {question && question.length > 100 ? `${question.substring(0, 100)}...` : question}
              </div>
            </div>

            {/* Options if logic - Compact */}
            {type === 'logic' && options && (
              <div className="mb-4">
                <div className="text-gray-400 text-xs mb-1">Options:</div>
                <div className="text-sm text-gray-300 bg-gray-900/30 border border-gray-700/30 rounded-lg p-3">
                  {options.length > 80 ? `${options.substring(0, 80)}...` : options}
                </div>
              </div>
            )}

            {/* Answers Side by Side */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Your Answer:</div>
                <div className="text-sm font-semibold text-green-400 bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                  {userAnswer}
                </div>
              </div>
              
              <div>
                <div className="text-gray-400 text-xs mb-1">Correct Answer:</div>
                <div className="text-sm font-semibold text-emerald-400 bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-3">
                  {type === 'logic' ? `${answer?.toUpperCase()}` : answer}
                </div>
              </div>
            </div>

            {/* Explanation - Compact */}
            <div>
              <div className="text-gray-400 text-xs mb-1">Explanation:</div>
              <div className="text-sm text-gray-300 bg-gray-900/30 border border-gray-700/30 rounded-lg p-3 max-h-20 overflow-y-auto">
                {explanation}
              </div>
            </div>
          </div>


          {/* Action Buttons - Compact */}
          <div className="flex gap-3">
            <button
              onClick={handleExit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700 hover:border-gray-600 text-sm"
            >
              Save & Exit
            </button>
            
            <button
              onClick={handleContinue}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover-lift shadow-lg text-sm"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnduranceCorrect;