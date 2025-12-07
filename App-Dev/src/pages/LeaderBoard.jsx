import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LeaderBoard = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col bg-black font-pobbins font-semibold text-white">
      <Header />

      {/* Podium Section */}
      <div className="flex justify-center items-end mt-5 gap-8">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-20 bg-gray-400"></div>
          <span className="mt-2 text-xl">2</span>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-yellow-400"></div>
          <span className="mt-2 text-xl">1</span>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-16 bg-green-400"></div>
          <span className="mt-2 text-xl">3</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="flex justify-center mt-16">
        <table className="w-[600px] text-left border-collapse border border-gray-700">
          <thead className="bg-red-800">
            <tr>
              <th className="px-4 py-2 border border-gray-600">RANK</th>
              <th className="px-4 py-2 border border-gray-600">PLAYER</th>
              <th className="px-4 py-2 border border-gray-600">POINTS</th>
              <th className="px-4 py-2 border border-gray-600">STREAK</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900">
            <tr>
              <td className="px-4 py-2 border border-gray-600">4</td>
              <td className="px-4 py-2 border border-gray-600">You</td>
              <td className="px-4 py-2 border border-gray-600">1500</td>
              <td className="px-4 py-2 border border-gray-600">7</td>
            </tr>
          </tbody>
        </table>
      </div>

    
    </div>
  );
};

export default LeaderBoard;
