import React from "react";
import { Link } from "react-router-dom";
import NewHeader from "../components/NewHeader";

const ChoosePuzzle = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins">
      <NewHeader />

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link to="/Dashboard">
          <button className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors mb-12">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Title */}
      <div className="text-center text-4xl md:text-5xl font-bold mb-12">
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Choose Your Puzzle Type
        </span>
      </div>

      {/* Boxes Section */}
      <div className="flex justify-center gap-10 mt-8 flex-wrap px-4">
        {/* RIDDLES */}
        <Link to="/Riddles" className="no-underline">
          <div className="flex flex-col items-center bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl w-80 p-8 hover:scale-105 duration-300 hover-lift cursor-pointer group">
            <div className="text-2xl font-bold text-yellow-400 mb-3">RIDDLES</div>
            <span className="text-gray-300 text-center">
              Word puzzles & brain teasers
            </span>
            <div className="mt-6 w-16 h-1 bg-gradient-to-r from-yellow-600 to-orange-500 rounded-full group-hover:w-24 transition-all duration-300"></div>
          </div>
        </Link>

        {/* LOGIC */}
        <Link to="/Logic" className="no-underline">
          <div className="flex flex-col items-center bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl w-80 p-8 hover:scale-105 duration-300 hover-lift cursor-pointer group">
            <div className="text-2xl font-bold text-cyan-400 mb-3">LOGIC</div>
            <span className="text-gray-300 text-center">
              Patterns & sequences
            </span>
            <div className="mt-6 w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full group-hover:w-24 transition-all duration-300"></div>
          </div>
        </Link>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-gray-400 mt-16 mb-12 px-4">
        <p className="text-lg">Select a puzzle type to start your brain training journey</p>
      </div>
    </div>
  );
};

export default ChoosePuzzle;