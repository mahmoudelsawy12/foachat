import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  message?: string;
  error?: string;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/chat');
    }
    
    // Check for success message from signup or error from OAuth
    const state = location.state as LocationState;
    if (state?.message) {
      setSuccess(state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
    if (state?.error) {
      setError(state.error);
      // Clear the error from location state
      window.history.replaceState({}, document.title);
    }
  }, [location, navigate, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // Navigate to chat page on successful login
      navigate('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <div className="text-white p-8">
          <h1 className="text-5xl font-bold mb-6">Welcome Back !</h1>
          <button
            onClick={() => navigate('/')}
            className="border border-white px-6 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Skip the login ?
          </button>
        </div>

        {/* Right side - Login form */}
        <div className="bg-[#1A1B2E]/50 backdrop-blur-lg p-8 rounded-2xl text-white">
          <h2 className="text-2xl font-semibold mb-2">Login</h2>
          <p className="text-gray-400 mb-6">Glad you're back !</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-2 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded border-gray-700 bg-[#0A0B1E] text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-purple-400 hover:text-purple-300 transition"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-white hover:text-purple-400 transition"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;