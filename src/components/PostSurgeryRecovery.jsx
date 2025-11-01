import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useVitals } from '../context/VitalsContext';
import BackgroundAnimation from './BackgroundAnimation';

const PostSurgeryRecovery = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { patientInfo } = useVitals();
  
  const [ecgType, setEcgType] = useState('surgery');
  const [isConnected, setIsConnected] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Surgery details (mock data - would come from database)
  const surgeryDetails = {
    doctorName: 'Dr. Rajesh Kumar',
    surgeryTime: '2025-11-01 14:30',
    patientId: 'PAT-2025-001',
    hospital: 'Apollo Hospitals',
    patientName: patientInfo?.name || user?.name || 'Patient',
    surgeryType: 'Cardiac Bypass Surgery'
  };

  const handleConnectPlotter = () => {
    setIsConnected(true);
    // Simulate connection
    setTimeout(() => {
      alert('ECG Plotter Connected Successfully!');
    }, 1000);
  };

  const handleCaptureImage = () => {
    // Simulate 10-second capture
    alert('Capturing ECG data for 10 seconds...');
    setTimeout(() => {
      setCapturedImage('captured'); // Would be actual image data
      alert('ECG data captured successfully!');
    }, 2000);
  };

  const handleAnalyzeReport = () => {
    setAnalyzing(true);
    setShowAnalysis(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: theme.primary }}>
      <BackgroundAnimation />
      
      <div className="relative z-10 container mx-auto p-6 pb-12 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/patient')} 
            className="p-3 rounded-lg transition-all hover:opacity-80" 
            style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="font-orbitron font-bold text-2xl md:text-3xl" style={{ color: theme.textPrimary }}>
            Post Surgery Recovery
          </h1>
        </div>

        {/* Surgery Details Card */}
        <div className="glass depth-shadow rounded-xl p-6 mb-6">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
          <h2 className="font-orbitron font-bold text-xl mb-4" style={{ color: theme.textPrimary }}>
            Surgery Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
              <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Doctor Name</p>
              <p className="font-semibold" style={{ color: theme.textPrimary }}>{surgeryDetails.doctorName}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
              <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Surgery Time</p>
              <p className="font-semibold" style={{ color: theme.textPrimary }}>{surgeryDetails.surgeryTime}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
              <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Patient ID</p>
              <p className="font-semibold" style={{ color: theme.textPrimary }}>{surgeryDetails.patientId}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
              <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Hospital</p>
              <p className="font-semibold" style={{ color: theme.textPrimary }}>{surgeryDetails.hospital}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
              <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Patient Name</p>
              <p className="font-semibold" style={{ color: theme.textPrimary }}>{surgeryDetails.patientName}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
              <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Surgery Type</p>
              <p className="font-semibold" style={{ color: theme.textPrimary }}>{surgeryDetails.surgeryType}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* ECG Type Selection */}
            <div className="glass depth-shadow rounded-xl p-6">
              <h2 className="font-orbitron font-bold text-xl mb-4" style={{ color: theme.textPrimary }}>
                Your ECG Type
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {['surgery', 'pacemaker', 'stent'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setEcgType(type)}
                    className={`py-4 px-3 rounded-xl font-semibold transition-all capitalize text-sm ${
                      ecgType === type ? 'shadow-xl' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: ecgType === type 
                        ? `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` 
                        : `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`,
                      color: ecgType === type ? '#000000' : theme.textPrimary,
                      border: `2px solid ${ecgType === type ? theme.accent : theme.glassBorder}`,
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Lead Placement */}
            <div className="glass depth-shadow rounded-xl p-6">
              <h2 className="font-orbitron font-bold text-xl mb-4" style={{ color: theme.textPrimary }}>
                AI Lead Placement Guide
              </h2>
              <div className="relative" style={{ background: theme.secondary, borderRadius: '12px', padding: '20px' }}>
                {/* Human Manikin SVG */}
                <svg viewBox="0 0 200 400" className="w-full max-w-xs mx-auto">
                  {/* Body outline */}
                  <ellipse cx="100" cy="80" rx="40" ry="50" fill="none" stroke={theme.accent} strokeWidth="2" />
                  <rect x="70" y="130" width="60" height="120" rx="15" fill="none" stroke={theme.accent} strokeWidth="2" />
                  <line x1="70" y1="150" x2="30" y2="200" stroke={theme.accent} strokeWidth="2" />
                  <line x1="130" y1="150" x2="170" y2="200" stroke={theme.accent} strokeWidth="2" />
                  <line x1="70" y1="250" x2="50" y2="350" stroke={theme.accent} strokeWidth="2" />
                  <line x1="130" y1="250" x2="150" y2="350" stroke={theme.accent} strokeWidth="2" />
                  
                  {/* ECG Lead Positions */}
                  <circle cx="85" cy="140" r="6" fill="#FF6B6B" />
                  <text x="60" y="145" fill={theme.textPrimary} fontSize="10">RA</text>
                  
                  <circle cx="115" cy="140" r="6" fill="#4ECDC4" />
                  <text x="125" y="145" fill={theme.textPrimary} fontSize="10">LA</text>
                  
                  <circle cx="70" cy="260" r="6" fill="#FFE66D" />
                  <text x="45" y="265" fill={theme.textPrimary} fontSize="10">RL</text>
                  
                  <circle cx="130" cy="260" r="6" fill="#95E1D3" />
                  <text x="140" y="265" fill={theme.textPrimary} fontSize="10">LL</text>
                  
                  <circle cx="90" cy="170" r="6" fill="#F38181" />
                  <text x="65" y="175" fill={theme.textPrimary} fontSize="10">V1</text>
                  
                  <circle cx="110" cy="170" r="6" fill="#AA96DA" />
                  <text x="120" y="175" fill={theme.textPrimary} fontSize="10">V2</text>
                </svg>
                
                <div className="mt-4 text-xs space-y-1" style={{ color: theme.textMuted }}>
                  <p><span style={{ color: '#FF6B6B' }}>● RA</span> - Right Arm</p>
                  <p><span style={{ color: '#4ECDC4' }}>● LA</span> - Left Arm</p>
                  <p><span style={{ color: '#FFE66D' }}>● RL</span> - Right Leg (Ground)</p>
                  <p><span style={{ color: '#95E1D3' }}>● LL</span> - Left Leg</p>
                  <p><span style={{ color: '#F38181' }}>● V1-V6</span> - Chest Leads</p>
                </div>
              </div>
            </div>

            {/* Connect Plotter */}
            <div className="glass depth-shadow rounded-xl p-6">
              <h2 className="font-orbitron font-bold text-xl mb-4" style={{ color: theme.textPrimary }}>
                Connect Your Plotter
              </h2>
              <button
                onClick={handleConnectPlotter}
                disabled={isConnected}
                className="w-full py-4 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-3"
                style={{
                  background: isConnected 
                    ? `linear-gradient(135deg, ${theme.success}, ${theme.success}dd)` 
                    : `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
                  color: '#000000',
                  opacity: isConnected ? 0.7 : 1
                }}
              >
                {isConnected ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Connect ECG Plotter
                  </>
                )}
              </button>
              
              {isConnected && (
                <button
                  onClick={handleCaptureImage}
                  className="w-full mt-3 py-4 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-3"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
                    color: '#000000'
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Capture 10-Second ECG
                </button>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Captured ECG Data */}
            {capturedImage && (
              <div className="glass depth-shadow rounded-xl p-6">
                <h2 className="font-orbitron font-bold text-xl mb-4" style={{ color: theme.textPrimary }}>
                  6 Lead ECG Data
                </h2>
                <div 
                  className="rounded-lg p-8 flex items-center justify-center min-h-[300px]"
                  style={{ background: theme.secondary, border: `2px solid ${theme.glassBorder}` }}
                >
                  <div className="text-center">
                    <svg className="w-20 h-20 mx-auto mb-4" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="font-semibold text-lg mb-2" style={{ color: theme.textPrimary }}>
                      ECG Data Captured
                    </p>
                    <p className="text-sm" style={{ color: theme.textMuted }}>
                      10-second 6-lead ECG recording ready for analysis
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded" style={{ background: theme.primary }}>
                        <p style={{ color: theme.textMuted }}>Lead I</p>
                        <p style={{ color: theme.accent }}>✓ Captured</p>
                      </div>
                      <div className="p-2 rounded" style={{ background: theme.primary }}>
                        <p style={{ color: theme.textMuted }}>Lead II</p>
                        <p style={{ color: theme.accent }}>✓ Captured</p>
                      </div>
                      <div className="p-2 rounded" style={{ background: theme.primary }}>
                        <p style={{ color: theme.textMuted }}>Lead III</p>
                        <p style={{ color: theme.accent }}>✓ Captured</p>
                      </div>
                      <div className="p-2 rounded" style={{ background: theme.primary }}>
                        <p style={{ color: theme.textMuted }}>aVR</p>
                        <p style={{ color: theme.accent }}>✓ Captured</p>
                      </div>
                      <div className="p-2 rounded" style={{ background: theme.primary }}>
                        <p style={{ color: theme.textMuted }}>aVL</p>
                        <p style={{ color: theme.accent }}>✓ Captured</p>
                      </div>
                      <div className="p-2 rounded" style={{ background: theme.primary }}>
                        <p style={{ color: theme.textMuted }}>aVF</p>
                        <p style={{ color: theme.accent }}>✓ Captured</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyzeReport}
                  className="w-full mt-4 py-4 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-3"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
                    color: '#000000'
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Analyze My Report
                </button>
              </div>
            )}

            {/* AI Analysis Result */}
            {showAnalysis && (
              <div className="glass depth-shadow rounded-xl p-6">
                <h2 className="font-orbitron font-bold text-xl mb-4" style={{ color: theme.textPrimary }}>
                  AI Analysis
                </h2>
                {analyzing ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mb-4" 
                      style={{ borderColor: theme.accent, borderTopColor: 'transparent' }}
                    />
                    <p className="font-semibold" style={{ color: theme.textPrimary }}>
                      Analyzing ECG data...
                    </p>
                    <p className="text-sm mt-2" style={{ color: theme.textMuted }}>
                      AI is processing your 6-lead ECG patterns
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg" style={{ background: `${theme.success}20`, border: `2px solid ${theme.success}` }}>
                      <p className="font-semibold text-lg mb-2" style={{ color: theme.success }}>
                        ✓ Analysis Complete
                      </p>
                      <p className="text-sm" style={{ color: theme.textPrimary }}>
                        Your post-surgery ECG shows normal sinus rhythm with appropriate recovery patterns.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                        <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Heart Rate</p>
                        <p className="font-bold text-xl" style={{ color: theme.accent }}>72 bpm</p>
                        <p className="text-xs mt-1" style={{ color: theme.success }}>Normal</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                        <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Rhythm</p>
                        <p className="font-bold text-lg" style={{ color: theme.accent }}>Sinus</p>
                        <p className="text-xs mt-1" style={{ color: theme.success }}>Regular</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                        <p className="text-xs mb-1" style={{ color: theme.textMuted }}>QRS Duration</p>
                        <p className="font-bold text-xl" style={{ color: theme.accent }}>98 ms</p>
                        <p className="text-xs mt-1" style={{ color: theme.success }}>Normal</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                        <p className="text-xs mb-1" style={{ color: theme.textMuted }}>QT Interval</p>
                        <p className="font-bold text-xl" style={{ color: theme.accent }}>420 ms</p>
                        <p className="text-xs mt-1" style={{ color: theme.success }}>Normal</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* How's My Heart */}
            <div className="glass depth-shadow rounded-xl p-6">
              <h2 className="font-orbitron font-bold text-xl mb-4" style={{ color: theme.textPrimary }}>
                How's My Heart?
              </h2>
              <div 
                className="rounded-lg p-12 flex items-center justify-center min-h-[200px]"
                style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, border: `2px dashed ${theme.glassBorder}` }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
                    style={{ background: `${theme.accent}20` }}
                  >
                    <svg className="w-12 h-12" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-bold text-2xl mb-2" style={{ color: theme.textPrimary }}>
                    Coming Soon
                  </p>
                  <p className="text-sm" style={{ color: theme.textMuted }}>
                    Advanced AI-powered heart health insights and predictions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSurgeryRecovery;
