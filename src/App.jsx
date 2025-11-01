import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import LoginPage from './components/LoginPage';
import PatientSignUp from './components/PatientSignUp';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import SixLeadECG from './components/SixLeadECG';
import PostSurgeryRecovery from './components/PostSurgeryRecovery';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Login Page */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/patient" replace />
          ) : (
            <LoginPage />
          )
        } 
      />

      {/* Patient Sign Up */}
      <Route 
        path="/patient/signup" 
        element={
          isAuthenticated && user?.type === 'patient' ? (
            <Navigate to="/patient" replace />
          ) : (
            <PatientSignUp />
          )
        } 
      />

      {/* Patient Dashboard - Protected */}
      <Route 
        path="/patient" 
        element={
          <ProtectedRoute requiredType="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } 
      />

      {/* 6-Lead ECG Page - Protected */}
      <Route 
        path="/patient/six-lead-ecg" 
        element={
          <ProtectedRoute requiredType="patient">
            <SixLeadECG />
          </ProtectedRoute>
        } 
      />

      {/* Post Surgery Recovery Page - Protected */}
      <Route 
        path="/patient/post-surgery" 
        element={
          <ProtectedRoute requiredType="patient">
            <PostSurgeryRecovery />
          </ProtectedRoute>
        } 
      />

      {/* Doctor Dashboard - Protected */}
      <Route 
        path="/doctor" 
        element={
          <ProtectedRoute requiredType="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Root redirect */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/patient" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  const { loading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);

  // Show loading screen first time only
  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  // Show auth loading spinner if checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#00ADB5' }}></div>
          <p className="mt-4" style={{ color: '#FFFFFF' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
