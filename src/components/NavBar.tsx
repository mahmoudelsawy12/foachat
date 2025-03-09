import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfileDropdown from './UserProfileDropdown';

interface NavBarProps {
  transparent?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ transparent = false }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className={`w-full ${transparent ? 'bg-transparent' : 'bg-[#1A1B2E]/50 backdrop-blur-sm border-b border-gray-800/50'} z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side navigation */}
          <div className="flex items-center space-x-8">
            <button onClick={() => navigate('/')} className="text-white/80 hover:text-white transition">Home</button>
            {isAuthenticated && (
              <button onClick={() => navigate('/chat')} className="text-white/80 hover:text-white transition">Chat</button>
            )}
            <button onClick={() => navigate('/about-us')} className="text-white/80 hover:text-white transition">About Us</button>
            <button onClick={() => navigate('/our-team')} className="text-white/80 hover:text-white transition">Our Team</button>
          </div>
          
          {/* Center logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-bold tracking-wider text-white">FOA CHAT AI</h1>
          </div>
          
          {/* Right side - Auth buttons or user profile */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <UserProfileDropdown username={user.username} />
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')} 
                  className="px-6 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')} 
                  className="px-6 py-1.5 rounded-full text-white hover:bg-white/10 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;