import React from "react";
import { Link } from "react-router-dom";
import NewHeader from "../components/NewHeader";

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins">
      <NewHeader />

      {/* Title */}
      <div className="text-center text-5xl font-bold mt-12 mb-4">
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Welcome to Puzzle Master!
        </span>
      </div>

      {/* Subtitle */}
      <div className="text-center text-gray-300 text-xl mb-12">
        Ready to challenge your brain?
      </div>

      {/* Boxes Section */}
      <div className="flex justify-center gap-12 mt-8 flex-wrap px-4">
        {/* SINGLE PLAYER */}
        <div className="flex flex-col items-center bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl w-96 p-8 hover:scale-105 duration-300 hover-lift">
          <div className="text-2xl font-bold text-cyan-400 mb-3">
            Single Player Journey
          </div>

          <span className="text-gray-300 text-center leading-relaxed mb-8">
            Solve at your own pace
          </span>

          <div className="my-6 p-4 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M66.0916 34.9584V51.625M74.425 43.2917H57.7583M33.2041 16.1959H66.7916C72.5594 16.197 78.0905 18.489 82.1685 22.5678C86.2465 26.6466 88.5375 32.1781 88.5375 37.9459V72.3834C88.5375 81.0292 77.9833 85.2375 72.0291 78.9709L59.6291 65.9125H40.3625L28.3833 80.3292C22.6583 87.2209 11.4541 83.1709 11.4541 74.2167V37.9417C11.4552 32.1747 13.7467 26.6442 17.8246 22.5663C21.9025 18.4884 27.4371 16.197 33.2041 16.1959Z" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M38.9083 43.2917C36.6071 43.2917 34.7416 41.4262 34.7416 39.125C34.7416 36.8239 36.6071 34.9584 38.9083 34.9584C41.2095 34.9584 43.075 36.8239 43.075 39.125C43.075 41.4262 41.2095 43.2917 38.9083 43.2917Z" fill="#22d3ee"/>
              <path d="M29.7417 52.4583C27.4405 52.4583 25.575 50.5929 25.575 48.2917C25.575 45.9905 27.4405 44.125 29.7417 44.125C32.0428 44.125 33.9083 45.9905 33.9083 48.2917C33.9083 50.5929 32.0428 52.4583 29.7417 52.4583Z" fill="#22d3ee"/>
            </svg>
          </div>

          <Link to="/ChoosePuzzle" className="mt-8 w-full">
            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl px-8 py-4 duration-300 transition-all hover-lift shadow-lg">
              Play now
            </button>
          </Link>
        </div>

        {/* ENDURANCE */}
        <div className="flex flex-col items-center bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl w-96 p-8 hover:scale-105 duration-300 hover-lift">
          <div className="text-2xl font-bold text-yellow-400 mb-3">
            Endurance Challenge
          </div>

          <span className="text-gray-300 text-center leading-relaxed mb-8">
            Continuous puzzles with increasing difficulty and timer
          </span>

          <div className="my-6 p-4 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M66.0918 34.9584V51.625M74.4251 43.2917H57.7584M33.2043 16.1959H66.7918C72.5595 16.197 78.0906 18.489 82.1686 22.5678C86.2467 26.6466 88.5376 32.1781 88.5376 37.9459V72.3834C88.5376 81.0292 77.9834 85.2375 72.0293 78.9709L59.6293 65.9125H40.3626L28.3834 80.3292C22.6584 87.2209 11.4543 83.1709 11.4543 74.2167V37.9417C11.4554 32.1747 13.7468 26.6442 17.8247 22.5663C21.9026 18.4884 27.4372 16.197 33.2043 16.1959Z" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M38.9085 43.2917C36.6073 43.2917 34.7419 41.4262 34.7419 39.125C34.7419 36.8239 36.6073 34.9584 38.9085 34.9584C41.2097 34.9584 43.0752 36.8239 43.0752 39.125C43.0752 41.4262 41.2097 43.2917 38.9085 43.2917Z" fill="#fbbf24"/>
              <path d="M29.7418 52.4583C27.4406 52.4583 25.5751 50.5929 25.5751 48.2917C25.5751 45.9905 27.4406 44.125 29.7418 44.125C32.043 44.125 33.9084 45.9905 33.9084 48.2917C33.9084 50.5929 32.043 52.4583 29.7418 52.4583Z" fill="#fbbf24"/>
            </svg>
          </div>

          <Link to="/Endurance" className="mt-8 w-full">
            <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-700 hover:to-orange-600 text-white font-semibold rounded-xl px-8 py-4 duration-300 transition-all hover-lift shadow-lg">
              Play now
            </button>
          </Link>   
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-gray-400 mt-16 mb-12 px-4">
        <p className="text-lg">Choose a game mode and start your puzzle adventure!</p>
      </div>
    </div>
  );
};

export default Dashboard;