import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BackgroundAnimation from './BackgroundAnimation';
import DataCard from './DataCard';
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';

const DoctorDashboard = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [view, setView] = useState('overview'); // 'overview', 'patients', 'reports'

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setView('patient-detail');
  };

  const HeartIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  const UsersIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const ChartIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const FileIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const AlertIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  return (
    <div className="min-h-screen" style={{ background: theme.primary }}>
      <BackgroundAnimation />
      
      {/* Header */}
      <header className="sticky top-0 z-50 mb-6">
        <div className="container mx-auto px-6 py-4">
          <div className="glass glass-hover depth-shadow rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: theme.accent }}
            />
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: theme.secondary,
                  border: `1px solid ${theme.glassBorder}`,
                  color: theme.accent,
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 
                  className="font-orbitron font-bold text-xl"
                  style={{ color: theme.textPrimary }}
                >
                  Doctor Dashboard
                </h1>
                <p 
                  className="text-xs font-medium"
                  style={{ color: theme.textMuted }}
                >
                  {user?.name || 'Doctor'} • {user?.id || 'DOC001'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                background: theme.accent,
                color: '#000000',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 pb-12">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => { setView('overview'); setSelectedPatient(null); }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              view === 'overview' ? '' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              background: view === 'overview' ? theme.accent : theme.secondary,
              color: view === 'overview' ? '#000000' : theme.textPrimary,
              border: `1px solid ${view === 'overview' ? theme.accent : theme.glassBorder}`,
            }}
          >
            Overview
          </button>
          <button
            onClick={() => { setView('patients'); setSelectedPatient(null); }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              view === 'patients' ? '' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              background: view === 'patients' ? theme.accent : theme.secondary,
              color: view === 'patients' ? '#000000' : theme.textPrimary,
              border: `1px solid ${view === 'patients' ? theme.accent : theme.glassBorder}`,
            }}
          >
            Patients
          </button>
          <button
            onClick={() => { setView('reports'); setSelectedPatient(null); }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              view === 'reports' ? '' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              background: view === 'reports' ? theme.accent : theme.secondary,
              color: view === 'reports' ? '#000000' : theme.textPrimary,
              border: `1px solid ${view === 'reports' ? theme.accent : theme.glassBorder}`,
            }}
          >
            Reports
          </button>
        </div>

        {/* Overview View */}
        {view === 'overview' && (
          <>
            {/* Welcome Section */}
            <div className="glass glass-hover depth-shadow rounded-xl p-8 mb-6 relative overflow-hidden slide-in">
              <div 
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: theme.accent }}
              />
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: theme.secondary,
                    border: `2px solid ${theme.accent}`,
                    color: theme.accent,
                  }}
                >
                  {HeartIcon}
                </div>
                <div>
                  <h2 
                    className="font-orbitron font-bold text-2xl mb-2"
                    style={{ color: theme.textPrimary }}
                  >
                    Welcome, {user?.name || 'Doctor'}!
                  </h2>
                  <p 
                    className="text-sm"
                    style={{ color: theme.textMuted }}
                  >
                    Access patient records, monitor vitals, and manage clinical data
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <DataCard 
                title="Total Patients" 
                value="24" 
                icon={UsersIcon}
                status="normal"
              />
              <DataCard 
                title="Active Monitors" 
                value="8" 
                icon={HeartIcon}
                status="normal"
              />
              <DataCard 
                title="Reports Today" 
                value="12" 
                icon={FileIcon}
                status="normal"
              />
              <DataCard 
                title="Alerts" 
                value="3" 
                icon={AlertIcon}
                status="warning"
              />
            </div>

            {/* Recent Patients */}
            <div className="glass glass-hover depth-shadow rounded-xl p-6 mb-6 relative overflow-hidden slide-in">
              <div 
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: theme.accent }}
              />
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="font-orbitron font-bold text-lg"
                  style={{ color: theme.textPrimary }}
                >
                  Recent Patients
                </h3>
                <button
                  onClick={() => setView('patients')}
                  className="text-sm font-medium transition-all hover:opacity-80"
                  style={{ color: theme.accent }}
                >
                  View All →
                </button>
              </div>
              <PatientList limit={5} onPatientSelect={handlePatientSelect} />
            </div>
          </>
        )}

        {/* Patients View */}
        {view === 'patients' && (
          <div className="glass glass-hover depth-shadow rounded-xl p-6 relative overflow-hidden slide-in">
            <div 
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: theme.accent }}
            />
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="font-orbitron font-bold text-lg"
                style={{ color: theme.textPrimary }}
              >
                All Patients
              </h3>
            </div>
            <PatientList onPatientSelect={handlePatientSelect} />
          </div>
        )}

        {/* Patient Detail View */}
        {view === 'patient-detail' && selectedPatient && (
          <PatientDetail 
            patient={selectedPatient} 
            onBack={() => { setView('patients'); setSelectedPatient(null); }}
          />
        )}

        {/* Reports View */}
        {view === 'reports' && (
          <div className="glass glass-hover depth-shadow rounded-xl p-8 relative overflow-hidden slide-in">
            <div 
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: theme.accent }}
            />
            <div className="text-center py-12">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  background: theme.secondary,
                  border: `2px solid ${theme.accent}`,
                  color: theme.accent,
                }}
              >
                <ChartIcon />
              </div>
              <h3 
                className="font-orbitron font-bold text-xl mb-3"
                style={{ color: theme.textPrimary }}
              >
                Reports & Analytics
              </h3>
              <p 
                className="text-sm mb-6"
                style={{ color: theme.textMuted }}
              >
                Generate patient reports, view analytics, and export data.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <button
                  className="glass glass-hover rounded-xl p-4 text-center"
                  style={{
                    border: `1px solid ${theme.glassBorder}`,
                  }}
                >
                  <FileIcon className="w-8 h-8 mx-auto mb-2" style={{ color: theme.accent }} />
                  <p style={{ color: theme.textPrimary }} className="font-medium">Patient Reports</p>
                </button>
                <button
                  className="glass glass-hover rounded-xl p-4 text-center"
                  style={{
                    border: `1px solid ${theme.glassBorder}`,
                  }}
                >
                  <ChartIcon className="w-8 h-8 mx-auto mb-2" style={{ color: theme.accent }} />
                  <p style={{ color: theme.textPrimary }} className="font-medium">Analytics</p>
                </button>
                <button
                  className="glass glass-hover rounded-xl p-4 text-center"
                  style={{
                    border: `1px solid ${theme.glassBorder}`,
                  }}
                >
                  <FileIcon className="w-8 h-8 mx-auto mb-2" style={{ color: theme.accent }} />
                  <p style={{ color: theme.textPrimary }} className="font-medium">Export Data</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
