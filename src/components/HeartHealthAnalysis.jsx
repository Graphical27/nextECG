import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useVitals } from '../context/VitalsContext';
import Header from './Header';
import HeartbeatBackground from './HeartbeatBackground';
import ConnectionDialog from './ConnectionDialog';

const HeartHealthAnalysis = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { vitals } = useVitals();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const [healthScore, setHealthScore] = useState(0);
  const [analysis, setAnalysis] = useState({
    status: 'normal',
    message: '',
    recommendations: [],
    riskLevel: 'low'
  });
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [ws, setWs] = useState(null);

  // WebSocket connection for monitoring status
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');
    setWs(websocket);

    websocket.onopen = () => {
      console.log('HeartHealthAnalysis: Connected to WebSocket');
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'connection-status') {
          setConnectionStatus(message.connected ? 'connected' : 'disconnected');
        }
      } catch (error) {
        console.error('HeartHealthAnalysis: Error parsing message:', error);
      }
    };

    websocket.onerror = () => {
      setConnectionStatus('error');
    };

    websocket.onclose = () => {
      setConnectionStatus('disconnected');
    };

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  const handleConnect = (port) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'connect', port }));
      setConnectionStatus('connecting');
    }
  };

  const handleDisconnect = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'disconnect' }));
    }
  };

  // Calculate health score based on heart rate
  useEffect(() => {
    const calculateHealthScore = () => {
      const hr = vitals.heartRate;
      let score = 0;
      let status = 'normal';
      let message = '';
      let recommendations = [];
      let riskLevel = 'low';

      if (hr === 0) {
        score = 0;
        status = 'unknown';
        message = 'No heart rate data available. Please connect your ECG device.';
        recommendations = ['Connect your NextECG device', 'Ensure proper lead placement'];
      } else if (hr >= 60 && hr <= 100) {
        // Normal range
        score = 95;
        status = 'excellent';
        message = 'Your heart rate is within the normal healthy range!';
        recommendations = [
          'Maintain your current lifestyle',
          'Continue regular exercise',
          'Stay hydrated'
        ];
        riskLevel = 'low';
      } else if (hr >= 50 && hr < 60) {
        // Slightly low (athletic or resting)
        score = 85;
        status = 'good';
        message = 'Your heart rate is slightly low, which can be normal for athletes or during rest.';
        recommendations = [
          'Monitor if you feel any symptoms',
          'Maintain physical activity',
          'Consult doctor if you feel dizzy'
        ];
        riskLevel = 'low';
      } else if (hr > 100 && hr <= 120) {
        // Elevated
        score = 70;
        status = 'caution';
        message = 'Your heart rate is slightly elevated. This may be due to activity, stress, or caffeine.';
        recommendations = [
          'Try relaxation techniques',
          'Reduce caffeine intake',
          'Practice deep breathing',
          'Monitor your heart rate regularly'
        ];
        riskLevel = 'medium';
      } else if (hr > 120 && hr <= 150) {
        // High
        score = 50;
        status = 'warning';
        message = 'Your heart rate is elevated. Please monitor closely.';
        recommendations = [
          'Avoid strenuous activity',
          'Practice deep breathing',
          'Consult your healthcare provider',
          'Monitor for symptoms like chest pain or shortness of breath'
        ];
        riskLevel = 'high';
      } else if (hr > 150) {
        // Very high
        score = 30;
        status = 'danger';
        message = 'Your heart rate is very high. Seek medical attention if accompanied by symptoms.';
        recommendations = [
          'Sit down and rest immediately',
          'Call emergency services if you feel chest pain, dizziness, or shortness of breath',
          'Monitor your condition closely',
          'Contact your doctor'
        ];
        riskLevel = 'critical';
      } else if (hr < 50) {
        // Very low
        score = 40;
        status = 'warning';
        message = 'Your heart rate is very low. This needs medical evaluation unless you are a trained athlete.';
        recommendations = [
          'Consult your healthcare provider',
          'Monitor for symptoms like dizziness or fatigue',
          'Avoid sudden physical exertion',
          'Keep a log of your heart rate'
        ];
        riskLevel = 'high';
      }

      setHealthScore(score);
      setAnalysis({ status, message, recommendations, riskLevel });
    };

    calculateHealthScore();
  }, [vitals.heartRate]);

  const getStatusColor = (status) => {
    const colors = {
      excellent: '#10B981',
      good: '#3B82F6',
      normal: '#10B981',
      caution: '#F59E0B',
      warning: '#EF4444',
      danger: '#DC2626',
      unknown: '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  const getRiskColor = (risk) => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626'
    };
    return colors[risk] || '#6B7280';
  };

  return (
    <div className="min-h-screen">
      <HeartbeatBackground />
      <Header />

      <main className="container mx-auto px-6 pt-32 pb-12 max-w-6xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Back Button and Connection Status */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/patient')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all glass glass-hover"
            style={{ 
              color: isDark ? '#F7FAFC' : '#2D3748',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {/* Connection Button */}
          {connectionStatus === 'connected' ? (
            <button
              onClick={handleDisconnect}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #F56565 0%, #FC8181 100%)',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Disconnect Device
            </button>
          ) : (
            <button
              onClick={() => setShowConnectionDialog(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect ECG Device
            </button>
          )}
        </div>

        {/* Main Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-3"
            style={{ 
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            How's My Heart
          </h1>
          <p style={{ color: isDark ? '#A0AEC0' : '#718096' }}>
            Real-time heart health analysis based on your current vitals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heart Rate Display - Main Card */}
          <div className="lg:col-span-2 glass glass-hover rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: isDark ? '#F7FAFC' : '#2D3748' }}>
                Current Heart Rate
              </h2>
              <div 
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: `${getStatusColor(analysis.status)}20`,
                  color: getStatusColor(analysis.status),
                  border: `2px solid ${getStatusColor(analysis.status)}40`
                }}
              >
                {analysis.status.toUpperCase()}
              </div>
            </div>

            {/* Heart Rate Value */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                {/* Animated Heart Icon */}
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                  <svg 
                    className="w-16 h-16" 
                    style={{ 
                      color: '#FF6B9D',
                      animation: vitals.heartRate > 0 ? 'heartbeat 1s ease-in-out infinite' : 'none'
                    }}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                
                <div className="text-center mt-8">
                  <div 
                    className="text-8xl font-bold mb-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${getStatusColor(analysis.status)} 0%, ${getStatusColor(analysis.status)}80 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {vitals.heartRate}
                  </div>
                  <div className="text-xl font-medium" style={{ color: isDark ? '#A0AEC0' : '#718096' }}>
                    beats per minute
                  </div>
                </div>
              </div>
            </div>

            {/* Health Score Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color: isDark ? '#F7FAFC' : '#2D3748' }}>
                  Health Score
                </span>
                <span className="text-sm font-bold" style={{ color: getStatusColor(analysis.status) }}>
                  {healthScore}/100
                </span>
              </div>
              <div className="w-full h-4 rounded-full" style={{ background: isDark ? '#2D3748' : '#E2E8F0' }}>
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${healthScore}%`,
                    background: `linear-gradient(90deg, ${getStatusColor(analysis.status)} 0%, ${getStatusColor(analysis.status)}80 100%)`,
                    boxShadow: `0 0 20px ${getStatusColor(analysis.status)}40`
                  }}
                />
              </div>
            </div>

            {/* Analysis Message */}
            <div 
              className="p-4 rounded-xl mb-6"
              style={{
                background: `${getStatusColor(analysis.status)}10`,
                border: `1px solid ${getStatusColor(analysis.status)}30`
              }}
            >
              <p className="text-center font-medium" style={{ color: isDark ? '#F7FAFC' : '#2D3748' }}>
                {analysis.message}
              </p>
            </div>

            {/* Normal Range Indicator */}
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-xs mb-1" style={{ color: isDark ? '#A0AEC0' : '#718096' }}>
                  Normal Range
                </div>
                <div className="font-bold" style={{ color: '#10B981' }}>
                  60-100 BPM
                </div>
              </div>
              <div className="h-8 w-px" style={{ background: isDark ? '#4A5568' : '#CBD5E0' }} />
              <div className="text-center">
                <div className="text-xs mb-1" style={{ color: isDark ? '#A0AEC0' : '#718096' }}>
                  Risk Level
                </div>
                <div className="font-bold" style={{ color: getRiskColor(analysis.riskLevel) }}>
                  {analysis.riskLevel.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="glass glass-hover rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#F7FAFC' : '#2D3748' }}>
              Recommendations
            </h3>
            
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                    border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                      color: '#FFFFFF'
                    }}
                  >
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm flex-1" style={{ color: isDark ? '#E2E8F0' : '#4A5568' }}>
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>

            {/* Emergency Contact */}
            {analysis.riskLevel === 'critical' && (
              <div 
                className="mt-6 p-4 rounded-xl"
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '2px solid #DC2626'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5" style={{ color: '#DC2626' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span className="font-bold" style={{ color: '#DC2626' }}>Emergency</span>
                </div>
                <p className="text-sm" style={{ color: '#DC2626' }}>
                  If you experience chest pain, severe dizziness, or difficulty breathing, call emergency services immediately.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Vitals Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {/* SpO2 */}
          <div className="glass glass-hover rounded-xl p-4 text-center">
            <div className="text-sm mb-1" style={{ color: isDark ? '#A0AEC0' : '#718096' }}>
              Blood Oxygen
            </div>
            <div className="text-2xl font-bold" style={{ color: vitals.spo2 >= 95 ? '#10B981' : '#EF4444' }}>
              {vitals.spo2}%
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="glass glass-hover rounded-xl p-4 text-center">
            <div className="text-sm mb-1" style={{ color: isDark ? '#A0AEC0' : '#718096' }}>
              Blood Pressure
            </div>
            <div className="text-2xl font-bold" style={{ color: isDark ? '#F7FAFC' : '#2D3748' }}>
              {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
            </div>
          </div>

          {/* Respiration Rate */}
          <div className="glass glass-hover rounded-xl p-4 text-center">
            <div className="text-sm mb-1" style={{ color: isDark ? '#A0AEC0' : '#718096' }}>
              Respiration
            </div>
            <div className="text-2xl font-bold" style={{ color: isDark ? '#F7FAFC' : '#2D3748' }}>
              {vitals.respirationRate} /min
            </div>
          </div>

          {/* Temperature */}
          <div className="glass glass-hover rounded-xl p-4 text-center">
            <div className="text-sm mb-1" style={{ color: isDark ? '#A0AEC0' : '#718096' }}>
              Temperature
            </div>
            <div className="text-2xl font-bold" style={{ color: isDark ? '#F7FAFC' : '#2D3748' }}>
              {vitals.temperature}°C
            </div>
          </div>
        </div>
      </main>

      {/* Connection Dialog */}
      <ConnectionDialog
        isOpen={showConnectionDialog}
        onClose={() => setShowConnectionDialog(false)}
        onConnect={handleConnect}
      />

      <style>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default HeartHealthAnalysis;
