import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';

function OAuthCallback() {
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the authorization code from URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('No authorization code received');
        }

        if (!provider) {
          throw new Error('No provider specified');
        }

        // Exchange code for token
        const result = await api.oauthLogin(provider, code);
        
        // Navigate to chat page on successful login
        navigate('/chat');
      } catch (err) {
        console.error('OAuth error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        
        // Navigate back to login after showing error
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              error: err instanceof Error ? err.message : 'Authentication failed' 
            }
          });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [provider, location.search, navigate]);

  return (
    <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center">
      <div className="bg-[#1A1B2E]/50 backdrop-blur-lg p-8 rounded-2xl text-white max-w-md w-full">
        {loading ? (
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
            <p className="text-gray-400">Please wait while we complete your {provider} login</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
            <p className="text-gray-400">Redirecting you back to login...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg mb-4">
              Authentication successful!
            </div>
            <p className="text-gray-400">Redirecting you to the chat...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OAuthCallback;