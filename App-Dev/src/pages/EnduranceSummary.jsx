import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const EnduranceSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    score = 0,
    questionsAnswered = 0,
    totalTime = 60,
    timeUsed = 0,
    hintCount = 0,
    fastAnswers = 0,
    bonusPoints = 0,
    timeMode = 60
  } = location.state || {};

  const timeLeft = totalTime - timeUsed;
  const accuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;
  const totalScore = score + bonusPoints;

  // Calculate performance rating
  const getPerformanceRating = () => {
    const ratio = totalScore / questionsAnswered;
    if (ratio >= 1.5) return "Legendary! 🏆";
    if (ratio >= 1.2) return "Excellent! ⭐";
    if (ratio >= 1.0) return "Good! 👍";
    if (ratio >= 0.7) return "Fair! 💪";
    return "Keep Practicing! 🔄";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePlayAgain = () => {
    navigate("/Endurance");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins">
      <div className="container mx-auto px-4 py-12">
        {/* Back to Dashboard */}
        <Link to="/Dashboard" className="inline-block mb-8">
          <button className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </Link>

        <div className="max-w-3xl mx-auto">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-gray-800/30">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Endurance Challenge Complete!
                </h1>
                <p className="text-gray-300 mt-2">Time's up! Here's how you did:</p>
              </div>
            </div>

            {/* Performance Rating */}
            <div className="p-8 border-b border-gray-700/50">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {getPerformanceRating()}
                </h2>
                <p className="text-gray-300">
                  {timeMode} second challenge completed
                </p>
              </div>
            </div>

            {/* Main Stats */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Total Score */}
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">{totalScore}</div>
                    <div className="text-gray-300">Total Points</div>
                    <div className="text-sm text-gray-400 mt-2">
                      Base: {score} + Bonus: {bonusPoints}
                    </div>
                  </div>
                </div>

                {/* Questions Answered */}
                <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-700/30 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">{questionsAnswered}</div>
                    <div className="text-gray-300">Questions Answered</div>
                    <div className="text-sm text-gray-400 mt-2">
                      Accuracy: {accuracy}%
                    </div>
                  </div>
                </div>

                {/* Time Stats */}
                <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-700/30 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">{formatTime(timeUsed)}</div>
                    <div className="text-gray-300">Time Used</div>
                    <div className="text-sm text-gray-400 mt-2">
                      Out of {formatTime(totalTime)}
                    </div>
                  </div>
                </div>

                {/* Fast Answers */}
                <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-700/30 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">{fastAnswers}</div>
                    <div className="text-gray-300">Fast Answers</div>
                    <div className="text-sm text-gray-400 mt-2">
                      Answered in under {Math.round(timeMode * 0.2)}s
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="bg-black/40 border border-gray-600 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">📊 Detailed Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Time Mode Selected</span>
                    <span className="font-bold text-cyan-400">{timeMode} seconds</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Time Used</span>
                    <span className="font-bold text-cyan-400">{formatTime(timeUsed)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Time Left</span>
                    <span className="font-bold text-cyan-400">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Hints Used</span>
                    <span className="font-bold text-yellow-400">{hintCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Bonus Points</span>
                    <span className="font-bold text-green-400">+{bonusPoints}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Accuracy</span>
                    <span className="font-bold text-blue-400">{accuracy}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handlePlayAgain}
                  className="py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold transition-all duration-300 hover-lift shadow-lg"
                >
                  Play Again
                </button>
                <Link to="/Dashboard">
                  <button className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-bold transition-all duration-300 border border-gray-700">
                    Back to Dashboard
                  </button>
                </Link>
              </div>

              {/* Tips */}
              <div className="mt-8 text-center text-gray-400">
                <p>💡 <span className="text-cyan-300">Tip:</span> Try a different time mode for a new challenge!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnduranceSummary;