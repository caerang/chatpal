
import React from 'react';
import { GoogleIcon } from './Icons';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-2xl max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to ChatPal</h2>
        <p className="text-gray-400 mb-8">
          Start your journey to fluent English conversations today.
        </p>
        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <GoogleIcon className="w-6 h-6 mr-3" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
