import { Link } from "react-router-dom";

function NewHeader() {
  return (
    <div className="flex items-center justify-between px-8 py-4">
      {/* Logo and Title Section */}
      <div className="flex items-center gap-4">
        <img src="logo.png" alt="Puzzle Master Logo" className="w-16 h-16" />
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Puzzle Master
        </span>
      </div>

      {/* Points Button */}
      <Link to="/Login">
        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 hover-lift shadow-lg flex items-center gap-2">
          <span className="text-yellow-300">🏆</span>
          <span>1000 Points</span>
        </button>
      </Link>
    </div>
  );
}

export default NewHeader;