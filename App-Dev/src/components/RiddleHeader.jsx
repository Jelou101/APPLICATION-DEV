import { useEffect } from 'react'; // ADD THIS LINE
import { usePoints } from "../hooks/usePoints";

function RiddleHeader() {
  const { points } = usePoints(); 

  // Add this useEffect to refresh points on focus
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

  return (
    <div className="flex items-center justify-between w-full px-4 sm:px-6 md:px-8 py-3 md:py-4 relative flex-wrap gap-3 md:gap-4">
      
      {/* Logo and Title Section */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 order-1">
        <img 
          src="logo.png" 
          alt="Puzzle Master Logo" 
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
        />
        <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent whitespace-nowrap">
          Puzzle Master
        </span>
      </div>
  
      {/* RIDDLES Title - Responsive Positioning */}
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
          bg-gradient-to-r from-yellow-900/30 to-orange-900/30 
          border border-yellow-700/30
          rounded-lg md:rounded-xl
          backdrop-blur-sm
        ">
          <span className="
            text-lg sm:text-xl md:text-2xl 
            font-bold text-yellow-400 
            whitespace-nowrap
            drop-shadow-lg
          ">
            RIDDLES
          </span>
        </div>
      </div>
  
      {/* Dynamic Points Button - Responsive */}
      <div className="
        flex-1 sm:flex-none
        order-2 sm:order-3
        flex justify-end sm:justify-center
      ">
        <div
          className="
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
          "
        >
          <span className="text-yellow-300 text-base sm:text-lg md:text-xl">🏆</span>
          <span className="whitespace-nowrap text-xs sm:text-sm md:text-base">
            {points.total_points?.toLocaleString() || "1000"} Points
          </span>
        </div>
      </div>
  
      {/* Mobile Layout Visual Guide (remove in production) */}
      <style>{`
        @media (max-width: 640px) {
          .mobile-layout::before {
            content: "Mobile";
            position: absolute;
            top: -10px;
            right: 10px;
            background: red;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            opacity: 0.3;
          }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .mobile-layout::before {
            content: "Tablet";
            position: absolute;
            top: -10px;
            right: 10px;
            background: orange;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            opacity: 0.3;
          }
        }
        @media (min-width: 769px) {
          .mobile-layout::before {
            content: "Desktop";
            position: absolute;
            top: -10px;
            right: 10px;
            background: green;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            opacity: 0.3;
          }
        }
      `}</style>
      <div className="mobile-layout absolute top-0 left-0 w-full h-full pointer-events-none"></div>
    </div>
  );
}

export default RiddleHeader;