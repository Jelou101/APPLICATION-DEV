import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePoints } from "../hooks/usePoints";

function NewHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { points } = usePoints();


  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);


  // In your header components, add this useEffect:
useEffect(() => {
  // Refresh points when window gets focus
  const handleFocus = () => {
    // This will trigger the usePoints hook to update
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'user',
      newValue: localStorage.getItem('user')
    }));
  };
  
  window.addEventListener('focus', handleFocus);
  
  return () => {
    window.removeEventListener('focus', handleFocus);
  };
}, []);

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  navigate('/Homepage');
};

return (
  <div className="flex items-center justify-between px-4 sm:px-8 py-4 flex-wrap gap-4">

    {/* Logo and Title Section */}
    <div className="flex items-center gap-3 sm:gap-4">
      <img src="logo.png" alt="Puzzle Master Logo" className="w-12 h-12 sm:w-16 sm:h-16" />
      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Puzzle Master
      </span>
    </div>

    {/* Right Section */}
    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">

      {/* User Greeting (hidden on mobile) */}
      {user && (
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right leading-tight">
            <div className="text-xs text-gray-300">Hello,</div>
            <div className="text-cyan-300 font-semibold">
              {user.display_name || 'Player'}
            </div>
          </div>
          
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user.display_name?.charAt(0)?.toUpperCase() || 'P'}
            </span>
          </div>
        </div>
      )}

      {/* Responsive Trophy Points Button */}
      <div className="
        w-full sm:w-auto
        px-4 sm:px-6 py-2
        bg-gradient-to-r from-blue-600 to-cyan-500 
        text-white rounded-xl font-semibold 
        hover:from-blue-700 hover:to-cyan-600 
        transition-all duration-300 hover-lift shadow-lg
        flex items-center justify-center gap-2
        text-sm sm:text-base
      ">
        <span className="text-yellow-300 text-lg sm:text-xl">🏆</span>

        <span className="whitespace-nowrap">
          {points.total_points?.toLocaleString() || '1000'} Points
        </span>
      </div>

      {/* Logout Button */}
      {user && (
        <button
          onClick={handleLogout}
          className="
            px-3 sm:px-4 py-2 
            bg-gradient-to-r from-gray-700 to-gray-800 
            hover:from-red-700 hover:to-red-800 
            text-white rounded-xl font-semibold 
            transition-all duration-300 hover-lift 
            border border-gray-600 hover:border-red-500 
            flex items-center gap-2
          "
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>

          {/* Hide text on mobile, show on md+ screens */}
          <span className="hidden md:inline">Logout</span>
        </button>
      )}
    </div>
  </div>
);

}

export default NewHeader;