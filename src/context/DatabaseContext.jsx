import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '../utils/database';

const DatabaseContext = createContext();

export const useDB = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDB must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      try {
        console.log('Initializing NextECG Database...');
        await db.init();
        
        // Migrate from localStorage if needed
        console.log('Checking for localStorage data to migrate...');
        await db.migrateFromLocalStorage();
        
        setIsReady(true);
        setError(null);
        console.log('Database ready!');
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err);
        setIsReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const value = {
    db,
    isReady,
    error,
    isLoading,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#00ADB5' }}></div>
          <p className="mt-4" style={{ color: '#FFFFFF' }}>Initializing Database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#000000' }}>
        <div className="max-w-md w-full text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #EF4444',
            }}
          >
            <svg 
              className="w-8 h-8" 
              style={{ color: '#EF4444' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h2 className="font-orbitron font-bold text-xl mb-2" style={{ color: '#FFFFFF' }}>
            Database Error
          </h2>
          <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>
            Failed to initialize local database. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg font-semibold"
            style={{
              background: '#00ADB5',
              color: '#000000',
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
