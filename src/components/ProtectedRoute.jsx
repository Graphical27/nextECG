import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredType }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#00ADB5' }}></div>
          <p className="mt-4" style={{ color: '#FFFFFF' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredType && user?.type !== requiredType) {
    // Redirect to correct dashboard based on user type
    if (user?.type === 'doctor') {
      return <Navigate to="/doctor" replace />;
    }
    return <Navigate to="/patient" replace />;
  }

  return children;
};

export default ProtectedRoute;

