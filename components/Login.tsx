
import React, { useEffect, useRef, useState } from 'react';
import { GoogleIcon } from './Icons';
import { authService } from '../services/authService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize the auth service
        await authService.initialize();
        
        // Render the Google button
        if (googleButtonRef.current) {
          authService.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'signin_with',
            width: '320',
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize Google Auth:', err);
        setError('Failed to load Google Sign-In. Please refresh the page.');
        setIsLoading(false);
      }
    };

    const handleLoginSuccess = (event: CustomEvent) => {
      const user = event.detail as User;
      onLogin(user);
    };

    const handleLoginError = (event: CustomEvent) => {
      console.error('Login error:', event.detail);
      setError('Login failed. Please try again.');
    };

    // Add event listeners
    window.addEventListener('googleLoginSuccess', handleLoginSuccess as EventListener);
    window.addEventListener('googleLoginError', handleLoginError as EventListener);

    // Initialize Google Auth
    initializeGoogleAuth();

    // Cleanup event listeners
    return () => {
      window.removeEventListener('googleLoginSuccess', handleLoginSuccess as EventListener);
      window.removeEventListener('googleLoginError', handleLoginError as EventListener);
    };
  }, [onLogin]);

  const handleFallbackLogin = () => {
    if (isLoading) return;
    
    try {
      authService.showOneTap();
    } catch (err) {
      console.error('Error showing One Tap:', err);
      setError('Google Sign-In is not available. Please check your internet connection.');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-2xl max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to ChatPal</h2>
        <p className="text-gray-400 mb-8">
          Start your journey to fluent English conversations today.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="w-full flex items-center justify-center px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Loading Google Sign-In...
          </div>
        ) : (
          <>
            {/* Google Identity Services Button Container */}
            <div ref={googleButtonRef} className="mb-4"></div>
            
            {/* Fallback button */}
            <button
              onClick={handleFallbackLogin}
              className="w-full flex items-center justify-center px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mt-2"
            >
              <GoogleIcon className="w-6 h-6 mr-3" />
              Alternative Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
