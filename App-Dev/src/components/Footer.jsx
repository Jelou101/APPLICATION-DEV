import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-black border-t-2 border-cyan-600/20 mt-20">
      <div className="container mx-auto px-4">
        <div className="py-12">
          {/* Main Content - Centered */}
          <div className="flex flex-col items-center justify-center text-center gap-8 max-w-3xl mx-auto">
            {/* Logo and Description */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <img 
                  src="logo.png" 
                  alt="Puzzle Master Logo" 
                  className="w-16 h-16 md:w-20 md:h-20"
                />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Puzzle Master
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    AI-Generated Brain Teasers and Logic Challenge Game
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                An AI-powered puzzle experience that challenges your mind with 
                real-time riddles, logic problems, and brain teasers.
              </p>
            </div>

            {/* Facebook Contacts - Only two accounts */}
            <div className="mt-8">
              <h3 className="text-white font-bold text-lg mb-6">Connect with Us</h3>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                {/* Claudin Facebook */}
                <a
                  href="https://www.facebook.com/claudin15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-500/10 hover:from-blue-600/30 hover:to-blue-500/20 border border-blue-500/30 text-gray-300 hover:text-white transition-all duration-300 hover-lift group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Claudin</p>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">Facebook</p>
                  </div>
                </a>

                {/* Roberto Facebook */}
                <a
                  href="https://www.facebook.com/roberto.vender.180"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-500/10 hover:from-blue-600/30 hover:to-blue-500/20 border border-blue-500/30 text-gray-300 hover:text-white transition-all duration-300 hover-lift group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Roberto</p>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">Facebook</p>
                  </div>
                </a>
              </div>
            </div>

            
          </div>

          {/* Copyright - Simple */}
          <div className="text-center pt-8 mt-8 border-t border-gray-800">
            <p className="text-gray-400">
              © {currentYear} Puzzle Master. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;