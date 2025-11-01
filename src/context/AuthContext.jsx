import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved login on mount
  useEffect(() => {
    // OPTION: Set this to false to disable auto-login completely
    const ENABLE_AUTO_LOGIN = true;
    
    if (!ENABLE_AUTO_LOGIN) {
      setLoading(false);
      return;
    }
    
    try {
      const savedUser = localStorage.getItem('nextECG_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        
        // Check if session is still valid (logged in within last 24 hours)
        const loginTime = userData.loginTime ? new Date(userData.loginTime) : null;
        const now = new Date();
        const hoursSinceLogin = loginTime ? (now - loginTime) / (1000 * 60 * 60) : 999;
        
        // Only auto-login if session is less than 24 hours old
        if (hoursSinceLogin < 24) {
          setUser(userData);
          console.log('Auto-login successful');
        } else {
          // Session expired, clear it
          console.log('Session expired, clearing data');
          localStorage.removeItem('nextECG_user');
          localStorage.removeItem('nextECG_currentPatient');
        }
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('nextECG_user');
    }
    setLoading(false);
  }, []);

  const login = (userType, credentials) => {
    try {
      if (userType === 'patient') {
        // Check against stored patient data
        const storedPatients = JSON.parse(localStorage.getItem('nextECG_patients') || '[]');
        const patient = storedPatients.find(p => 
          (p.email === credentials.username || p.email === credentials.email) && 
          p.password === credentials.password
        );

        if (patient) {
          const userData = {
            type: 'patient',
            email: patient.email,
            name: patient.name,
            id: patient.id,
            age: patient.age,
            gender: patient.gender,
            loginTime: new Date().toISOString(),
          };
          setUser(userData);
          localStorage.setItem('nextECG_user', JSON.stringify(userData));
          localStorage.setItem('nextECG_currentPatient', JSON.stringify(patient));
          return { success: true, user: userData };
        } else {
          // Allow test login for development
          const testPatient = {
            type: 'patient',
            email: credentials.email || credentials.username || 'test@patient.com',
            name: credentials.name || 'Test Patient',
            id: 'PAT-TEST-001',
            age: 30,
            gender: 'Unknown',
            bloodType: 'Unknown',
            loginTime: new Date().toISOString(),
          };
          setUser(testPatient);
          localStorage.setItem('nextECG_user', JSON.stringify(testPatient));
          localStorage.setItem('nextECG_currentPatient', JSON.stringify(testPatient));
          return { success: true, user: testPatient };
        }
      } else {
        // Doctor login - simple test login for now
        const userData = {
          type: 'doctor',
          username: credentials.username || 'doctor',
          name: credentials.name || 'Dr. Smith',
          id: credentials.id || 'DOC001',
          loginTime: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem('nextECG_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('nextECG_user');
      // Don't remove patient data, just remove current session
      // localStorage.removeItem('nextECG_currentPatient');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout anyway
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isDoctor: user?.type === 'doctor',
    isPatient: user?.type === 'patient',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

