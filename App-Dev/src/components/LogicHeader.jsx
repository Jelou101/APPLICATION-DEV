import { useEffect } from 'react'; // ADD THIS
import { usePoints } from "../hooks/usePoints";

function LogicHeader() {
  const { points } = usePoints(); 

  // Add focus listener
  useEffect(() => {
    const handleFocus = () => {
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
    <div className="flex items-center justify-between w-full px-8 py-4">
      {/* Logo and Title Section */}
      <div className="flex items-center gap-4">
        <img src="logo.png" alt="Puzzle Master Logo" className="w-16 h-16" />
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Puzzle Master
        </span>
      </div>

      {/* LOGIC Title - Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          LOGIC
        </span>
      </div>

      {/* Dynamic Points Button - ONLY ONE */}
      <div className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 hover-lift shadow-lg flex items-center gap-2">
        <span className="text-yellow-300">🏆</span>
        <span>{points.total_points?.toLocaleString() || '1000'} Points</span>
      </div>
    </div>
  );
}

export default LogicHeader;