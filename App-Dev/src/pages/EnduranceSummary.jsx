import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const EnduranceSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    score,
    questionsAnswered,
    totalTime,
    timeUsed,
    hintCount,
    fastAnswers,
    bonusPoints,
    timeMode
  } = location.state || {};

  const [performanceMessage, setPerformanceMessage] = useState("");
  const [performanceColor, setPerformanceColor] = useState("text-gray-400");

  useEffect(() => {
    const accuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;
    const timePerQuestion = questionsAnswered > 0 ? Math.round(timeUsed / questionsAnswered) : 0;
    
    let message = "";
    let color = "text-gray-400";
    
    if (accuracy >= 80) {
      message = "Outstanding! You're a puzzle master! 🌟";
      color = "text-yellow-400";
    } else if (accuracy >= 60) {
      message = "Great job! You're getting really good! 👍";
      color = "text-green-400";
    } else if (accuracy >= 40) {
      message = "Good effort! Keep practicing! 💪";
      color = "text-blue-400";
    } else {
      message = "Keep trying! You'll improve with practice! 🎯";
      color = "text-cyan-400";
    }
    
    setPerformanceMessage(message);
    setPerformanceColor(color);
  }, [score, questionsAnswered, timeUsed]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const calculateAccuracy = () => {
    if (questionsAnswered === 0) return 0;
    // Assuming each correct answer gives 1 point to score
    const correctAnswers = score; // In endurance, score tracks correct answers
    return Math.round((correctAnswers / questionsAnswered) * 100);
  };

  const calculateSpeed = () => {
    if (questionsAnswered === 0) return 0;
    return Math.round(timeUsed / questionsAnswered);
  };

  const handleRetry = () => {
    navigate("/Endurance");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back to Dashboard */}
          <Link to="/Dashboard" className="inline-block mb-8">
            <button className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </Link>

          {/* Summary Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Endurance Challenge Complete!
              </span>
            </h1>
            <p className="text-xl text-gray-300">Your AI-powered puzzle marathon results</p>
          </div>

          {/* Performance Message */}
          <div className={`text-center text-2xl font-bold mb-8 ${performanceColor} animate-fade-in`}>
            {performanceMessage}
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 backdrop-blur-xl rounded-2xl border border-green-700/30 p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">TOTAL SCORE</div>
              <div className="text-5xl font-bold text-green-400 mb-2">{score}</div>
              <div className="text-gray-300">out of {questionsAnswered} possible</div>
              <div className="mt-4 text-green-300">
              +{(questionsAnswered * 30) + (bonusPoints || 0)} total points earned
            </div>
            </div>

            {/* Accuracy Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-blue-700/30 p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">ACCURACY</div>
              <div className="text-5xl font-bold text-blue-400 mb-2">{calculateAccuracy()}%</div>
              <div className="text-gray-300">{score} correct of {questionsAnswered}</div>
  
            </div>

            {/* Time Card */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-xl rounded-2xl border border-purple-700/30 p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">TIME STATS</div>
              <div className="text-3xl font-bold text-purple-400 mb-2">{formatTime(timeUsed)}</div>
              <div className="text-gray-300">used of {formatTime(totalTime)}</div>
              <div className="mt-4 text-pink-300">
                ~{calculateSpeed()}s per question
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Detailed Breakdown</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-gray-400 text-sm">Time Mode</div>
                <div className="text-xl font-bold text-cyan-400">{timeMode}s</div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-gray-400 text-sm">Questions Answered</div>
                <div className="text-xl font-bold text-cyan-400">{questionsAnswered}</div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-gray-400 text-sm">Hints Used</div>
                <div className="text-xl font-bold text-yellow-400">{hintCount}</div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-gray-400 text-sm">Fast Answers</div>
                <div className="text-xl font-bold text-green-400">{fastAnswers}</div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="mt-8 space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Accuracy</span>
                  <span className="text-cyan-400 font-semibold">{calculateAccuracy()}%</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${calculateAccuracy()}%` }}
                  ></div>
                </div>
              </div>
              
              
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/Dashboard" className="block">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700 hover-lift">
                Back to Dashboard
              </button>
            </Link>
            
            <button
              onClick={handleRetry}
              className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover-lift shadow-lg"
            >
              Play Again
            </button>
            
            <Link to="/ChoosePuzzle" className="block">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 hover-lift">
                Try Other Modes
              </button>
            </Link>
          </div>

          {/* Tips */}
          <div className="mt-12 text-center text-gray-400">
            <p className="mb-2">💡 Tip: Try different time modes for varied challenges!</p>
            <p className="text-sm">All questions are AI-generated for endless variety</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnduranceSummary;