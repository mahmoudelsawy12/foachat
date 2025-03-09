import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, BookOpen, Calendar, Users, ChevronRight } from 'lucide-react';
import NavBar from '../components/NavBar';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white">
      {/* Navigation */}
      <NavBar transparent={false} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-8">FOA CHAT AI</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 text-gray-300">
              "Hi there! 👋 I'm your friendly college chatbot, here to make your student life easier. Whether you need help with assignments, finding resources, managing schedules, or just have questions about campus life! I'm here to assist. Let's get started! What can I help you with today?"
            </p>
            <button 
              onClick={() => navigate('/chat')}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-lg font-semibold transition flex items-center gap-2 mx-auto group"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-[#1A1B2E] p-6 rounded-xl transform hover:scale-105 transition">
            <Bot className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">24/7 AI Support</h3>
            <p className="text-gray-400">Get instant answers to your questions anytime, anywhere.</p>
          </div>
          <div className="bg-[#1A1B2E] p-6 rounded-xl transform hover:scale-105 transition">
            <BookOpen className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Study Resources</h3>
            <p className="text-gray-400">Access a vast library of study materials and guides.</p>
          </div>
          <div className="bg-[#1A1B2E] p-6 rounded-xl transform hover:scale-105 transition">
            <Calendar className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Schedule Management</h3>
            <p className="text-gray-400">Keep track of your classes and assignments effortlessly.</p>
          </div>
          <div className="bg-[#1A1B2E] p-6 rounded-xl transform hover:scale-105 transition">
            <Users className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-gray-400">Connect with peers and get help from the community.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;