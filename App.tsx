
import React, { useState, useCallback } from 'react';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import { User } from './types';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = useCallback(() => {
    // In a real app, this would involve a call to Firebase Auth.
    // For this MVP, we'll simulate a successful login.
    setUser({
      uid: 'mock-user-123',
      displayName: 'Alex',
      email: 'alex.doe@example.com',
    });
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <div className="flex flex-col h-screen antialiased text-gray-200 bg-gray-900">
        <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center space-x-3">
                <LogoIcon className="h-8 w-8 text-blue-400" />
                <h1 className="text-xl font-bold text-white">ChatPal</h1>
            </div>
            {user && (
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
                >
                    Sign Out
                </button>
            )}
        </header>
        <main className="flex-grow flex flex-col">
            {user ? (
                <ChatInterface user={user} />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </main>
    </div>
  );
};

export default App;
