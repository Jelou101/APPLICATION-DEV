import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "";

  // Function to clear previous user's progress
  const clearPreviousUserProgress = () => {
    // Clear all localStorage items except auth-related ones
    const authKeys = ['token', 'user', 'userId'];
    Object.keys(localStorage).forEach(key => {
      if (!authKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  };

  // Function to migrate old progress to user-scoped storage
  const migrateOldProgress = (userId) => {
    // List of old progress keys to migrate
    const oldProgressKeys = [
      'riddleProgress',
      'logicProgress',
      'enduranceProgress'
    ];
    
    oldProgressKeys.forEach(oldKey => {
      const oldData = localStorage.getItem(oldKey);
      if (oldData && userId) {
        // Move to user-scoped storage
        localStorage.setItem(`${oldKey}_${userId}`, oldData);
        // Remove old key
        localStorage.removeItem(oldKey);
      }
    });
  };

  const loginPost = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    const postData = {
      email: email,
      password: password
    };

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Store user data
      if (data.user) {
        // Clear any old generic progress before storing new user data
        clearPreviousUserProgress();
        
        // Store auth data
        localStorage.setItem('token', data.token || '');
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.user_id || data.user.id);
        
        // Migrate any old progress to user-scoped storage
        migrateOldProgress(data.user.user_id || data.user.id);
      }

      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate('/Dashboard');
      }, 1500);

    } catch (error) {
      setMessage(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && email && password && !loading) {
      loginPost();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back to Home */}
        <Link to="/" className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <button className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </Link>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden animate-fade-in">
          {/* Card Header */}
          <div className="p-8 border-b border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-gray-800/30">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-gray-300 mt-2">Sign in to continue your puzzle journey</p>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">
                Email Address
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-8">
              <label className="block text-gray-300 mb-2">
                Password
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl ${message.includes('successful') ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
                <div className="flex items-center gap-3">
                  {message.includes('successful') ? (
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={message.includes('successful') ? 'text-green-300' : 'text-red-300'}>
                    {message}
                  </span>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={loginPost}
              disabled={loading || !email || !password}
              className={`w-full py-4 rounded-xl font-bold transition-all duration-300 hover-lift ${
                loading || !email || !password
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          
            {/* Register Link */}
            <div className="text-center pt-6 border-t border-gray-700/50">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/Register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;