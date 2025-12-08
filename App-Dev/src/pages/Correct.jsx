import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import RiddleHeader from "../components/RiddleHeader";

const Correct = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    answer = "N/A", 
    hintCount = 0, 
    question = "",
    explanation = "No explanation available.",
    pointsChange = "+10 points"
  } = location.state || {};

  const congratMessages = [
    "Brilliant! 🎯",
    "You're on fire! 🔥",
    "Genius! 🧠",
    "Perfect! ⭐",
    "Excellent! 👏"
  ];
  
  const randomMessage = congratMessages[Math.floor(Math.random() * congratMessages.length)];

  const handleNextPuzzle = () => {
    navigate("/Riddles");
  };

  const handleDashboard = () => {
    navigate("/Dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins text-white">
      <RiddleHeader />

      <div className="container mx-auto px-4 pt-6">
        {/* Back Button */}
        <Link to="/Dashboard">
          <button className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </Link>

        {/* Success Card */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
          {/* Success Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {randomMessage}
            </h1>
            <p className="text-gray-300 mt-1 text-sm">You solved it correctly!</p>

            {/* Points Section - MAIN FOCUS */}
            <div className="mt-4">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-900/40 to-yellow-800/30 rounded-xl border-2 border-yellow-500/40 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-300 text-2xl">🏆</span>
                  <div className="text-left">
                    <div className="text-yellow-300 font-bold text-xl">{pointsChange || '+10 Points'}</div>
                    <div className="text-yellow-200 text-sm">Added to your total points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Answer Card */}
          <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-700/30 rounded-lg p-4 mb-6">
            <div className="text-gray-400 text-xs mb-2">You solved:</div>
            <div className="text-base mb-4 text-gray-200 italic line-clamp-3 leading-relaxed">
              "{question.length > 150 ? `${question.substring(0, 150)}...` : question}"
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="text-green-400 font-semibold text-sm">Correct Answer:</div>
              <div className="text-xl font-bold text-white truncate">{answer}</div>
            </div>
            
            <div className="mt-4">
              <div className="text-gray-400 text-xs mb-1">Explanation:</div>
              <div className="text-gray-300 bg-gray-800/30 p-3 rounded-lg text-sm leading-relaxed max-h-24 overflow-y-auto">
                {explanation.length > 200 ? `${explanation.substring(0, 200)}...` : explanation}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleNextPuzzle}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition-all duration-300 text-sm hover-lift"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Next Puzzle
            </button>
            
            <button
              onClick={handleDashboard}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white transition-all duration-300 border border-gray-700 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Dashboard
            </button>
          </div>

          {/* Tip */}
          <div className="text-center text-gray-400 text-xs mt-4">
            <p>Points are automatically saved to your account!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Correct;