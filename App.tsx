
import React, { useState, useCallback, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import { User } from './types';
import { LogoIcon } from './components/Icons';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
        // Clear any corrupted auth data
        await authService.signOut();
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingAuth();
  }, []);

  const handleLogin = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if there's an error
      setUser(null);
    }
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen antialiased text-gray-200 bg-gray-900">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading ChatPal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen antialiased text-gray-200 bg-gray-900">
        <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center space-x-3">
                <LogoIcon className="h-8 w-8 text-blue-400" />
                <h1 className="text-xl font-bold text-white">ChatPal</h1>
            </div>
            {user && (
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        {user.photoURL && (
                            <img 
                                src={user.photoURL} 
                                alt={user.displayName || 'User'} 
                                className="h-8 w-8 rounded-full border-2 border-gray-600"
                            />
                        )}
                        <span className="text-sm text-gray-300 hidden sm:inline">
                            {user.displayName || user.email}
                        </span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
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
