import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import LogicHeader from "../components/LogicHeader";

const LogicIncorrect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Update this line (around line 15):
  const {
    answer = "N/A",
    explanation = "No explanation available.",
    score = 0,
    question = "",
    hintCount = 0,
    pointsChange = "-5 points" // ADD THIS LINE
  } = location.state || {};

  const handleTryAgain = () => {
    navigate("/Logic");
  };

  const handleDashboard = () => {
    navigate("/Dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins text-white">
      <LogicHeader />

      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="pt-6">
          <button
            onClick={handleDashboard}
            className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <div className="max-w-2xl w-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                Incorrect! ❌
              </h1>
              <p className="text-gray-300 mt-2">Better luck next time!</p>
            
              {/* ADD THIS NEW SECTION FOR POINTS */}
              <div className="mt-4">
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-red-900/30 to-red-800/20 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-3">
                    <span className="text-red-300 text-2xl">⚠️</span>
                    <div className="text-left">
                    <div className="text-red-300 font-bold text-xl">{pointsChange || '-5 Points'}</div>
                      <div className="text-red-200 text-sm">Deducted from your total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-black/40 p-4 rounded-xl border border-gray-600">
                <div className="text-gray-400 text-sm">Current Score</div>
                <div className="text-3xl font-bold text-green-400">{score}</div>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-gray-600">
                <div className="text-gray-400 text-sm">Hints Used</div>
                <div className="text-3xl font-bold text-blue-400">{hintCount}</div>
              </div>
            </div>

            {/* Question and Answer */}
            <div className="bg-black/40 border border-gray-600 rounded-xl p-6 mb-6">
              <div className="text-gray-400 text-sm mb-2">Question:</div>
              <div className="text-xl mb-4 text-gray-200">{question}</div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="text-green-400 font-semibold">Correct Answer:</div>
                <div className="text-2xl font-bold text-white">{answer}</div>
              </div>
              
              <div className="mt-4">
                <div className="text-cyan-400 text-sm mb-2">Explanation:</div>
                <div className="text-gray-300 bg-gray-800/50 p-4 rounded-lg">
                  {explanation}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleTryAgain}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition-all duration-300 hover-lift"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Try Another
              </button>
              
              <button
                onClick={handleDashboard}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white transition-all duration-300 border border-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Dashboard
              </button>
            </div>

            {/* Tip */}
            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>Don't give up! Every puzzle makes you smarter.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogicIncorrect;