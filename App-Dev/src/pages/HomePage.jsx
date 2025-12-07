import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Endless AI Puzzles",
      description: "Fresh, unique puzzles generated in real-time. Never solve the same riddle twice!",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Adaptive Difficulty",
      description: "AI learns your skill level and adjusts puzzle difficulty for the perfect challenge.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Smart Hints & Explanations",
      description: "Get intelligent hints that guide you without spoiling the solution.",
      color: "from-green-500 to-emerald-400"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Your Challenge",
      description: "Pick from Single Player Journey, Logic Puzzles, or Endurance Mode",
      icon: "🎮"
    },
    {
      number: "02",
      title: "Solve AI Puzzles",
      description: "Test your wits with unique, AI-generated riddles and logic puzzles",
      icon: "🧩"
    },
    {
      number: "03",
      title: "Earn & Improve",
      description: "Score points, unlock achievements, and track your progress",
      icon: "🏆"
    }
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 font-poppins">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-24 pb-16 text-center">
          <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text animate-gradient">Train Your Brain</span>
              <br />
              <span className="text-white">With AI-Powered Puzzles</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Experience <span className="text-cyan-400 font-semibold">endless unique puzzles</span>, riddles, and logic challenges 
              powered by advanced AI. Never solve the same puzzle twice!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/Login" className="group">
                <button className="relative px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl text-lg transition-all duration-300 hover-lift shadow-2xl overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Start Playing Free
                  </span>
                  <div className="absolute inset-0 animate-shimmer"></div>
                </button>
              </Link>
              
             
            </div>

            <div className="mt-12 text-gray-400 flex flex-wrap justify-center items-center gap-4">
              
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Save & Resume Anytime</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Mobile Friendly</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-white md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">Puzzle Master?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The ultimate brain training experience with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`glass rounded-2xl p-8 transition-all duration-500 hover-lift ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 mx-auto animate-float`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Play Section */}
        <section id="how-to-play" className="bg-gradient-to-b from-gray-900/50 to-transparent py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl text-white md:text-5xl font-bold mb-4">
                How to <span className="gradient-text">Get Started</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Start your puzzle journey in just three simple steps
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="text-center animate-fade-in"
                    style={{ animationDelay: `${index * 300}ms` }}
                  >
                    <div className="relative inline-block mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 flex items-center justify-center text-3xl">
                        {step.icon}
                      </div>
                      <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
              
              <h2 className="text-4xl text-white md:text-5xl font-bold mb-6">
                Ready to <span className="gradient-text">Challenge</span> Your Mind?
              </h2>

              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/Login">
                  <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl text-lg transition-all duration-300 hover-lift shadow-xl">
                    Start Now →
                  </button>
                </Link>
                
              </div>
              
              <div className="mt-8 text-gray-400 text-sm">
                <p>Play instantly • Progress saved automatically</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;