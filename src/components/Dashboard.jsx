import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useVitals } from '../context/VitalsContext';
import HeartbeatPulseBackground from './HeartbeatPulseBackground';
import BackgroundAnimation from './BackgroundAnimation';
import Header from './Header';
import LiveECGPlotter from './LiveECGPlotter';
import DataCard from './DataCard';
import PatientInfo from './PatientInfo';
import AIPrediction from './AIPrediction';
import VitalsHistory from './VitalsHistory';
import ControlPanel from './ControlPanel';

function Dashboard() {
  const { theme } = useTheme();
  const { vitals } = useVitals();

  // Icons for data cards
  const HeartIcon = (
    <svg 
      className="w-5 h-5" 
      style={{ color: theme.accent }}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
      />
    </svg>
  );

  const ActivityIcon = (
    <svg 
      className="w-5 h-5" 
      style={{ color: theme.accent }}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 10V3L4 14h7v7l9-11h-7z" 
      />
    </svg>
  );

  const ShieldIcon = (
    <svg 
      className="w-5 h-5" 
      style={{ color: theme.accent }}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
      />
    </svg>
  );

  const TrendIcon = (
    <svg 
      className="w-5 h-5" 
      style={{ color: theme.accent }}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
      />
    </svg>
  );

  return (
    <div className="min-h-screen">
      {/* Professional Heartbeat Pulse Animation Background */}
      <HeartbeatPulseBackground />
      
      {/* Background Animation */}
      <BackgroundAnimation />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto p-6 pb-12">
        {/* Top Section - Patient Info & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PatientInfo />
          </div>
          <div>
            <DataCard
              title="Heart Rate"
              value={vitals.heartRate}
              unit="BPM"
              icon={HeartIcon}
              trend="+2.3%"
            />
          </div>
        </div>

        {/* Middle Section - ECG Graph & Vital Signs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <LiveECGPlotter />
          </div>
          <div className="space-y-6">
            <DataCard
              title="SpO2"
              value={vitals.spo2}
              unit="%"
              icon={ActivityIcon}
              trend="Normal"
            />
            <DataCard
              title="ECG Quality"
              value={vitals.ecgQuality}
              unit="%"
              icon={ShieldIcon}
              trend="Excellent"
            />
          </div>
        </div>

        {/* Bottom Section - AI Prediction, History, and Control */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <AIPrediction />
          </div>
          <div>
            <VitalsHistory />
          </div>
          <div>
            <ControlPanel />
          </div>
        </div>

        {/* Additional Vital Signs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <DataCard
            title="Blood Pressure"
            value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
            unit="mmHg"
            icon={TrendIcon}
            trend="Normal"
          />
          <DataCard
            title="Temperature"
            value={vitals.temperature}
            unit="°C"
            icon={TrendIcon}
            trend="Normal"
          />
          <DataCard
            title="Respiration"
            value={vitals.respirationRate}
            unit="rpm"
            icon={ActivityIcon}
            trend="Normal"
          />
          <DataCard
            title="Status"
            value={vitals.leadsOff ? "Leads Off" : "Connected"}
            unit=""
            icon={ShieldIcon}
            trend={vitals.leadsOff ? "Warning" : "Good"}
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
