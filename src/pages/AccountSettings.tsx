import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, ArrowLeft, Check, X } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';

function AccountSettings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('password'); // Only password tab now
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    // Check if user is logged in
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { error: 'Please login to access account settings' } });
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setPasswordError('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    
    try {
      setPasswordLoading(true);
      
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordSuccess('Password changed successfully!');
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white">
      {/* Navigation */}
      <NavBar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/chat')} 
            className="mr-4 p-2 rounded-full hover:bg-gray-800/50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>

        <div className="bg-[#1A1B2E]/50 backdrop-blur-lg rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <div className="px-6 py-4 font-medium flex items-center text-purple-400 border-b-2 border-purple-400">
              <Lock className="w-5 h-5 mr-2" />
              Password
            </div>
          </div>

          {/* Password Tab */}
          <div className="p-6">
            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center">
                <X className="w-5 h-5 mr-2" />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg mb-6 flex items-center">
                <Check className="w-5 h-5 mr-2" />
                {passwordSuccess}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
              {/* User Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">Username</label>
                  <div className="flex items-center bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3">
                    <User className="w-5 h-5 text-gray-500 mr-2" />
                    <span>{user?.username}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <div className="flex items-center bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3">
                    <Mail className="w-5 h-5 text-gray-500 mr-2" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full bg-[#0A0B1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold transition ${
                  passwordLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {passwordLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;