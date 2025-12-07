import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import RiddleHeader from "../components/RiddleHeader";

const Correct = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    answer = "N/A", 
    score = 0, 
    hintCount = 0, 
    question = "",
    explanation = "No explanation available." 
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

      <div className="container mx-auto px-4 pt-8">
        {/* Back Button */}
        <Link to="/Dashboard">
          <button className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </Link>

        {/* Success Card */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          {/* Success Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {randomMessage}
            </h1>
            <p className="text-gray-300 mt-2">You solved it correctly!</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 p-6 rounded-xl border border-gray-700/30">
              <div className="text-gray-400 text-sm mb-2">Current Score</div>
              <div className="text-4xl font-bold text-green-400">{score}</div>
            </div>
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 p-6 rounded-xl border border-gray-700/30">
              <div className="text-gray-400 text-sm mb-2">Hints Used</div>
              <div className="text-4xl font-bold text-blue-400">{hintCount}</div>
            </div>
          </div>

          {/* Answer Card */}
          <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-700/30 rounded-xl p-6 mb-8">
            <div className="text-gray-400 text-sm mb-4">You solved:</div>
            <div className="text-xl mb-6 text-gray-200 italic leading-relaxed">"{question}"</div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="text-green-400 font-semibold">Correct Answer:</div>
              <div className="text-2xl font-bold text-white">{answer}</div>
            </div>
            
            <div className="mt-6">
              <div className="text-gray-400 text-sm mb-2">Explanation:</div>
              <div className="text-gray-300 bg-gray-800/30 p-4 rounded-lg leading-relaxed">
                {explanation}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleNextPuzzle}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition-all duration-300 hover-lift shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Next Puzzle
            </button>
            
            <button
              onClick={handleDashboard}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white transition-all duration-300 border border-gray-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Dashboard
            </button>
          </div>

          {/* Tip */}
          <div className="text-center text-gray-400 text-sm mt-8">
            <p>Your progress is automatically saved. You can exit and continue later!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Correct;