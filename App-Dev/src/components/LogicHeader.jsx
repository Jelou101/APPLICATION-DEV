import { useEffect, useState } from 'react';
import { usePoints } from "../hooks/usePoints";

function LogicHeader() {
  const { points, getTotalPoints } = usePoints(); 
  const [displayPoints, setDisplayPoints] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);

  // Handle points display
  useEffect(() => {
    const updatePoints = async () => {
      setIsLoading(true);
      try {
        // Handle different point formats
        if (typeof points === 'number') {
          setDisplayPoints(points);
        } else if (points && points.total_points !== undefined) {
          setDisplayPoints(points.total_points);
        } else if (getTotalPoints) {
          const total = await getTotalPoints();
          setDisplayPoints(total || 1000);
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem('userPoints');
          setDisplayPoints(saved ? parseInt(saved) : 1000);
        }
      } catch (error) {
        console.error('Error loading points:', error);
        const saved = localStorage.getItem('userPoints');
        setDisplayPoints(saved ? parseInt(saved) : 1000);
      } finally {
        setIsLoading(false);
      }
    };

    updatePoints();
  }, [points, getTotalPoints]);

  // Add focus listener to refresh points
  useEffect(() => {
    const handleFocus = async () => {
      if (getTotalPoints) {
        try {
          const total = await getTotalPoints();
          setDisplayPoints(total || 1000);
        } catch (error) {
          console.error('Error refreshing points on focus:', error);
        }
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [getTotalPoints]);

  // Listen for point updates from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userPoints') {
        setDisplayPoints(e.newValue ? parseInt(e.newValue) : 1000);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex items-center justify-between w-full px-4 sm:px-6 md:px-8 py-3 md:py-4 relative flex-wrap gap-3 md:gap-4">
      
      {/* Logo and Title Section - Left */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 order-1 flex-shrink-0">
        <img 
          src="logo.png" 
          alt="Puzzle Master Logo" 
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
        />
        <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent whitespace-nowrap hidden sm:block">
          Puzzle Master
        </span>
      </div>

      {/* LOGIC Title - Centered - Responsive */}
      <div className="
        w-full sm:w-auto
        absolute top-full sm:static 
        mt-2 sm:mt-0
        order-3 sm:order-2
        flex justify-center
      ">
        <div className="
          px-3 sm:px-4 md:px-6 
          py-1 sm:py-2
          bg-gradient-to-r from-cyan-900/30 to-blue-900/30 
          border border-cyan-700/30
          rounded-lg md:rounded-xl
          backdrop-blur-sm
          shadow-lg
        ">
          <span className="
            text-lg sm:text-xl md:text-2xl 
            font-bold text-cyan-400 
            whitespace-nowrap
            drop-shadow-lg
          ">
            LOGIC
          </span>
        </div>
      </div>

      {/* Dynamic Points Button - Right - Responsive */}
      <div className="
        flex-1 sm:flex-none
        order-2 sm:order-3
        flex justify-end sm:justify-center
      ">
        <div className="
          w-full sm:w-auto
          px-3 sm:px-4 md:px-6 
          py-2 md:py-2.5
          bg-gradient-to-r from-blue-600 to-cyan-500 
          text-white rounded-lg md:rounded-xl 
          font-semibold 
          hover:from-blue-700 hover:to-cyan-600 
          transition-all duration-300 
          hover-lift shadow-lg
          flex items-center justify-center gap-1.5 sm:gap-2
          min-w-[140px] sm:min-w-[160px]
          cursor-pointer
          relative group
        ">
          <span className="text-yellow-300 text-base sm:text-lg md:text-xl">🏆</span>
          <span className="whitespace-nowrap text-xs sm:text-sm md:text-base">
            {isLoading ? (
              <div className="animate-pulse bg-cyan-400/30 h-4 w-16 rounded"></div>
            ) : (
              `${displayPoints.toLocaleString()} Points`
            )}
          </span>
          
          {/* Points Breakdown Tooltip */}
          <div className="
            absolute 
            right-0 top-full 
            mt-2 
            hidden group-hover:block
            bg-gray-900/95 
            border border-gray-700
            rounded-lg 
            p-3 
            shadow-2xl 
            z-50 
            min-w-48
            backdrop-blur-sm
          ">
            <div className="text-sm font-semibold text-cyan-400 mb-2">
              Logic Challenge Points
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Current Points:</span>
                <span className="text-white font-bold">{displayPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Correct Answer:</span>
                <span className="text-green-400 font-bold">+15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Hint Cost:</span>
                <span className="text-yellow-400 font-bold">-3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Wrong Answer:</span>
                <span className="text-red-400 font-bold">-5</span>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="text-gray-400 text-xs">
                  Hover over any game to see specific point rules
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogicHeader;