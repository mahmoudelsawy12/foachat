import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Get email and reset code from URL params if available
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    const codeParam = searchParams.get('code');
    
    if (emailParam) setEmail(emailParam);
    if (codeParam) setResetCode(codeParam);
  }, [location]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword({
        email,
        resetCode,
        newPassword
      });
      
      setSuccess('Password reset successful!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password has been reset successfully. Please login with your new password.' }
        });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <div className="text-white p-8">
          <h1 className="text-5xl font-bold mb-6">Reset Your Password</h1>
          <button
            onClick={() => navigate('/login')}
            className="border border-white px-6 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>

        {/* Right side - Reset Password form */}
        <div className="bg-[#1A1B2E]/50 backdrop-blur-lg p-8 rounded-2xl text-white">
          <h2 className="text-2xl font-semibold mb-2">Create New Password</h2>
          <p className="text-gray-400 mb-6">Enter your new secure password</p>

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

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Reset Code"
                className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                required
                minLength={6}
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

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
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;