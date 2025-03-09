import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await api.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Redirect to login page on success
      navigate('/login', { 
        state: { 
          message: 'Sign up successful! Please log in with your credentials.' 
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <div className="text-white p-8">
          <h1 className="text-5xl font-bold mb-6">We're Happy To<br />Have You Here !</h1>
          <button
            onClick={() => navigate('/')}
            className="border border-white px-6 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Skip the Signup ?
          </button>
        </div>

        {/* Right side - Sign up form */}
        <div className="bg-[#1A1B2E]/50 backdrop-blur-lg p-8 rounded-2xl text-white">
          <h2 className="text-2xl font-semibold mb-2">Signup</h2>
          <p className="text-gray-400 mb-6">Just some details to get you in!</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                required
                minLength={6}
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 rounded-lg font-semibold transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {loading ? 'Signing up...' : 'Signup'}
            </button>

            <p className="text-center text-gray-400 text-sm mt-6">
              Already Registered?{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-white hover:text-purple-400 transition"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;