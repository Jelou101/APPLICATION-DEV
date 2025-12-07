import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to handle anchor link clicks
  const handleAnchorClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    
    // If we're already on homepage, just scroll to section
    if (window.location.pathname === "/Homepage" || window.location.pathname === "/") {
      const element = document.getElementById(sectionId.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're not on homepage, navigate to homepage with hash
      window.location.href = `/Homepage#${sectionId}`;
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img 
                src="logo.png" 
                alt="Puzzle Master Logo" 
                className="w-16 h-16 sm:w-15 sm:h-15"
              />
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Puzzle Master
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink
              to="/Homepage"
              className={({ isActive }) =>
                `text-lg font-medium transition-all duration-300 hover:text-cyan-400 ${
                  isActive ? "text-cyan-400 font-bold border-b-2 border-cyan-400 pb-1" : "text-gray-300"
                }`
              }
            >
              Home
            </NavLink>

            {/* Use button instead of anchor for better control */}
            <button
              onClick={() => handleAnchorClick("features")}
              className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300 cursor-pointer bg-transparent border-none"
            >
              Features
            </button>

            <button
              onClick={() => handleAnchorClick("how-to-play")}
              className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-all duration-300 cursor-pointer bg-transparent border-none"
            >
              How to Play
            </button>

            <NavLink
              to="/LeaderBoard"
              className={({ isActive }) =>
                `text-lg font-medium transition-all duration-300 hover:text-cyan-400 ${
                  isActive ? "text-cyan-400 font-bold border-b-2 border-cyan-400 pb-1" : "text-gray-300"
                }`
              }
            >
              LeaderBoard
            </NavLink>

            {/* Desktop Auth Buttons */}
            <div className="flex items-center gap-4 ml-4">
              <Link to="/Register">
                <button className="px-6 py-2 border-2 border-cyan-500/50 text-gray-300 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-white transition-all duration-300 font-semibold">
                  Sign Up
                </button>
              </Link>
              <Link to="/Login">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover-lift">
                  Sign In
                </button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-300 p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800 mt-2 p-6 animate-fade-in">
            <div className="flex flex-col gap-3">
              <NavLink
                to="/Homepage"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium py-3 px-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                      : "text-gray-300 hover:bg-gray-800/50"
                  }`
                }
              >
                Home
              </NavLink>

              <button
                onClick={() => handleAnchorClick("features")}
                className="text-lg font-medium text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-800/50 transition-all duration-300 text-left bg-transparent border-none"
              >
                Features
              </button>

              <button
                onClick={() => handleAnchorClick("how-to-play")}
                className="text-lg font-medium text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-800/50 transition-all duration-300 text-left bg-transparent border-none"
              >
                How to Play
              </button>

              <NavLink
                to="/LeaderBoard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium py-3 px-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                      : "text-gray-300 hover:bg-gray-800/50"
                  }`
                }
              >
                LeaderBoard
              </NavLink>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 pt-6 border-t border-gray-800">
                <Link to="/Register" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full py-3 border-2 border-cyan-500/50 text-gray-300 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-white transition-all duration-300 font-semibold">
                    Sign Up
                  </button>
                </Link>
                <Link to="/Login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-semibold">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;