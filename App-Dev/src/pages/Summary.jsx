import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import RiddleHeader from "../components/RiddleHeader";

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { score = 0 } = location.state || {};
  const totalQuestions = 25;
  const percentage = ((score / totalQuestions) * 100).toFixed(1);

  return (
    <div className="min-h-screen w-full bg-black font-poppins font-semibold text-white">
      <RiddleHeader />

      <Link to="/Dashboard">
        <button className="text-red-600 ml-7 -mt-10 block hover:text-red-400 cursor-pointer">
          ←
        </button>
      </Link>

      <div className="flex justify-center items-center mt-10">
        <div className="flex flex-col items-center bg-gray-600 rounded-2xl w-120 h-auto p-8">
          <div className="text-yellow-400 text-4xl font-bold text-center">
            Quiz Completed!
          </div>

          <div className="mt-8 text-white text-center">
            <div className="text-6xl font-bold text-green-400">{score}</div>
            <div className="text-2xl mt-2">out of {totalQuestions}</div>
            <div className="text-xl mt-2 text-gray-300">{percentage}%</div>
          </div>

          <div className="mt-8 w-full bg-gray-700 rounded-lg h-4 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="mt-8 text-center">
            {percentage >= 80 && (
              <div className="text-yellow-400 text-lg">🎉 Excellent work!</div>
            )}
            {percentage >= 60 && percentage < 80 && (
              <div className="text-blue-400 text-lg">✨ Great job!</div>
            )}
            {percentage >= 40 && percentage < 60 && (
              <div className="text-purple-400 text-lg">💪 Good effort!</div>
            )}
            {percentage < 40 && (
              <div className="text-orange-400 text-lg">📚 Keep practicing!</div>
            )}
          </div>

          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate("/Dashboard")}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded text-white"
            >
              Return to Dashboard
            </button>

            <button
              onClick={() => navigate("/Riddles", { state: { page: 1, score: 0, hintCount: 0 } })}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
