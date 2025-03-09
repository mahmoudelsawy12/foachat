import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { api } from '../lib/api';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email entry, 2: Reset code and new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.requestPasswordReset({ email });
      setSuccess('Reset code sent to your email. Please check your inbox.');
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-5xl font-bold mb-6">No Worries !!</h1>
          <p className="text-xl text-gray-300 mb-8">
            We'll help you reset your password. Just follow the simple steps.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="border border-white px-6 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Take me back!
          </button>
        </div>

        {/* Right side - Forgot Password form */}
        <div className="bg-[#1A1B2E]/50 backdrop-blur-lg p-8 rounded-2xl text-white">
          <h2 className="text-2xl font-semibold mb-2">
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h2>
          <p className="text-gray-400 mb-6">
            {step === 1 
              ? 'Please enter your email to receive a reset code' 
              : 'Enter the reset code sent to your email and your new password'}
          </p>

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

          {step === 1 ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg pl-10 px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
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
          )}

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

export default ForgotPassword;