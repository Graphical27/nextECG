import React from 'react';
import { useTheme } from '../context/ThemeContext';
import DataCard from './DataCard';
import LiveECGPlotter from './LiveECGPlotter';
import AIPrediction from './AIPrediction';
import VitalsHistory from './VitalsHistory';

const PatientDetail = ({ patient, onBack }) => {
  const { theme } = useTheme();

  const HeartIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  const ActivityIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  const ShieldIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const TrendIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  return (
    <div>
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-3 rounded-lg transition-all hover:opacity-80"
          style={{
            background: theme.secondary,
            border: `1px solid ${theme.glassBorder}`,
            color: theme.textPrimary,
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 
            className="font-orbitron font-bold text-2xl"
            style={{ color: theme.textPrimary }}
          >
            {patient.name}
          </h2>
          <p 
            className="text-sm"
            style={{ color: theme.textMuted }}
          >
            Patient ID: {patient.id} • {patient.age} years, {patient.gender}
          </p>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="glass glass-hover depth-shadow rounded-xl p-6 mb-6 relative overflow-hidden slide-in">
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: theme.accent }}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div 
              className="text-xs font-medium mb-1"
              style={{ color: theme.textMuted }}
            >
              Status
            </div>
            <div 
              className="font-semibold text-lg"
              style={{ color: theme.textPrimary }}
            >
              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
            </div>
          </div>
          <div>
            <div 
              className="text-xs font-medium mb-1"
              style={{ color: theme.textMuted }}
            >
              Last Visit
            </div>
            <div 
              className="font-semibold"
              style={{ color: theme.textPrimary }}
            >
              {new Date(patient.lastVisit).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div 
              className="text-xs font-medium mb-1"
              style={{ color: theme.textMuted }}
            >
              Heart Rate
            </div>
            <div 
              className="font-semibold text-lg"
              style={{ color: theme.accent }}
            >
              {patient.heartRate} BPM
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DataCard 
          title="Heart Rate" 
          value={patient.heartRate.toString()} 
          unit="BPM" 
          icon={HeartIcon}
          status={patient.heartRate >= 60 && patient.heartRate <= 100 ? 'normal' : 'warning'}
        />
        <DataCard 
          title="Blood Pressure" 
          value="120/80" 
          icon={ActivityIcon}
          status="normal"
        />
        <DataCard 
          title="SpO2 Level" 
          value="98" 
          unit="%" 
          icon={ShieldIcon}
          status="normal"
        />
        <DataCard 
          title="Temperature" 
          value="98.6" 
          unit="°F" 
          icon={TrendIcon}
          status="normal"
        />
      </div>

      {/* ECG Monitor */}
      <div className="mb-6">
        <LiveECGPlotter />
      </div>

      {/* AI Analysis & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIPrediction />
        <VitalsHistory />
      </div>
    </div>
  );
};

export default PatientDetail;

