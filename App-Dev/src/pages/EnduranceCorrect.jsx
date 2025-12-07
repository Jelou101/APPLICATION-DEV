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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              CORRECT! 🎉
            </h1>
            <p className="text-gray-300 mt-2">Great job! You earned {pointsEarned} point{pointsEarned !== 1 ? 's' : ''}</p>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-gray-400 text-sm">Total Score</div>
                <div className="text-2xl font-bold text-green-400">{score}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">Questions</div>
                <div className="text-2xl font-bold text-cyan-400">{questionsAnswered}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">Time Left</div>
                <div className="text-2xl font-bold text-blue-400">{formatTime(timeRemaining)}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">Hints Used</div>
                <div className="text-2xl font-bold text-yellow-400">{hintCount}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
              <div className="bg-green-900/30 px-3 py-1 rounded-full border border-green-700/30">
                +{pointsEarned - 1} bonus points
              </div>
              <div className="bg-blue-900/30 px-3 py-1 rounded-full border border-blue-700/30">
                Time bonus: +{Math.floor(timeRemaining / 5)}
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${type === 'riddle' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30' : 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/30'}`}>
                {type === 'riddle' ? '🎭 RIDDLE' : '🧠 LOGIC'}
              </div>
              <div className="text-gray-400">Question #{questionsAnswered}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-400 text-sm mb-2">Question:</div>
              <div className="text-xl text-gray-100 bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
                {question}
              </div>
              {type === 'logic' && options && (
                <div className="mt-4">
                  <div className="text-gray-400 text-sm mb-2">Options:</div>
                  <div className="text-gray-300 bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
                    {options}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="text-gray-400 text-sm mb-2">Your Answer:</div>
              <div className="text-xl font-semibold text-green-400 bg-green-900/20 border border-green-700/30 rounded-xl p-4">
                {userAnswer}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-400 text-sm mb-2">Correct Answer:</div>
              <div className="text-xl font-semibold text-emerald-400 bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4">
                {type === 'logic' ? `${answer.toUpperCase()}` : answer}
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-sm mb-2">Explanation:</div>
              <div className="text-gray-300 bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
                {explanation}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleExit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700 hover-lift"
            >
              Save & Exit
            </button>
            
            <button
              onClick={handleContinue}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover-lift shadow-lg"
            >
              Next Question →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnduranceCorrect;