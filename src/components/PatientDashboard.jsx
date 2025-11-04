import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useVitals } from '../context/VitalsContext';
import HeartbeatBackground from './HeartbeatBackground';
import Header from './Header';
import DataCard from './DataCard';
import Settings from './Settings';

function PatientDashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { vitals } = useVitals();
  const [showSettings, setShowSettings] = useState(false);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen">
      {/* Heartbeat ECG Background */}
      <HeartbeatBackground />
      
      {/* Header */}
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-12" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Feature Cards - Portal Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* How's My Heart Card */}
          <div 
            className="cursor-pointer"
            onClick={() => window.location.assign('/heart-rate/index.html')}
          >
              <DataCard
                title="How's My Heart"
                value={vitals.heartRate > 0 ? `${vitals.heartRate} BPM` : "Connect Device"}
                unit=""
                status={vitals.heartRate >= 60 && vitals.heartRate <= 100 ? "normal" : vitals.heartRate > 100 ? "warning" : vitals.heartRate > 0 ? "warning" : "info"}
                icon={
                  <svg 
                    className="w-6 h-6" 
                    style={{ color: '#FF6B9D' }}
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
                    {/* Add heartbeat line */}
                    <path 
                      d="M8 12h2l1-3 2 6 1-3h2" 
                      stroke="#FF6B9D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.7"
                    />
                  </svg>
                }
              />
            </div>

            {/* 6 Lead Data Card */}
            <div 
              className="cursor-pointer"
              onClick={() => navigate('/patient/six-lead-ecg')}
            >
            <DataCard
              title="6 Lead Data"
              value="View Details"
              unit=""
              status="info"
              icon={
                <svg 
                  className="w-6 h-6" 
                  style={{ color: '#4ECDC4' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {/* ECG wave pattern */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12h2l2-5 3 10 2-8 2 6 2-3h5" 
                  />
                  {/* Lead indicator dots */}
                  <circle cx="6" cy="6" r="1.5" fill="#4ECDC4" />
                  <circle cx="12" cy="6" r="1.5" fill="#4ECDC4" />
                  <circle cx="18" cy="6" r="1.5" fill="#4ECDC4" />
                  <circle cx="6" cy="18" r="1.5" fill="#4ECDC4" />
                  <circle cx="12" cy="18" r="1.5" fill="#4ECDC4" />
                  <circle cx="18" cy="18" r="1.5" fill="#4ECDC4" />
                </svg>
              }
            />
          </div>

          {/* AI Analysis Card */}
          <div className="cursor-pointer">
            <DataCard
              title="AI Analysis"
              value="Coming Soon"
              unit=""
              status="warning"
              icon={
                <svg 
                  className="w-6 h-6" 
                  style={{ color: '#9B59B6' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                  />
                  {/* AI brain circuit */}
                  <circle cx="12" cy="10" r="1.5" fill="#9B59B6" opacity="0.6" />
                </svg>
              }
            />
          </div>

          {/* Post Surgery Recovery Card */}
          <div
            className="cursor-pointer"
            onClick={() => navigate('/patient/post-surgery')}
          >
            <DataCard
              title="Post Surgery Recovery"
              value="Monitor"
              unit=""
              status="info"
              icon={
                <svg 
                  className="w-6 h-6" 
                  style={{ color: '#F39C12' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {/* Medical clipboard with checkmarks */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                  />
                  {/* Checkmarks */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 16h6" 
                  />
                </svg>
              }
            />
          </div>
        </div>
      </main>

      {/* Content Sections - Portal Style */}
      <section className="relative py-20" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-6 space-y-20 max-w-7xl">
          
          {/* Key Features */}
          <div className="glass rounded-3xl p-12" style={{ border: `1px solid ${theme.glassBorder}` }}>
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ 
              color: isDark ? '#F7FAFC' : theme.textPrimary 
            }}>
              Why Choose NextECG?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="text-center p-6 rounded-xl" style={{ background: `${theme.accent}10` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                     style={{ background: `${theme.accent}20`, border: `2px solid ${theme.accent}40` }}>
                  <svg className="w-8 h-8" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ 
                  color: isDark ? '#F7FAFC' : theme.textPrimary 
                }}>Real-time Monitoring</h3>
                <p className="text-sm" style={{ 
                  color: isDark ? '#CBD5E0' : theme.textSecondary 
                }}>
                  Continuous ECG monitoring with instant alerts for abnormalities
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-6 rounded-xl" style={{ background: `${theme.accent}10` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                     style={{ background: `${theme.accent}20`, border: `2px solid ${theme.accent}40` }}>
                  <svg className="w-8 h-8" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>AI-Powered Analysis</h3>
                <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                  Advanced machine learning algorithms for accurate cardiac assessment
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-6 rounded-xl" style={{ background: `${theme.accent}10` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                     style={{ background: `${theme.accent}20`, border: `2px solid ${theme.accent}40` }}>
                  <svg className="w-8 h-8" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Medical Grade Certified</h3>
                <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                  FDA approved and ISO certified for clinical use
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="glass rounded-2xl p-8" style={{ border: `1px solid ${theme.glassBorder}` }}>
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl font-bold mb-2" style={{ color: theme.accent }}>6</div>
                <p className="text-sm font-semibold mb-1" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>ECG Leads</p>
                <p className="text-xs" style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}>I, II, III, aVR, aVL, aVF</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold mb-2" style={{ color: theme.accent }}>125Hz</div>
                <p className="text-sm font-semibold mb-1" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Sampling Rate</p>
                <p className="text-xs" style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}>High precision capture</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold mb-2" style={{ color: theme.accent }}>24/7</div>
                <p className="text-sm font-semibold mb-1" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Monitoring</p>
                <p className="text-xs" style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}>Continuous operation</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="glass rounded-2xl p-8" style={{ border: `1px solid ${theme.glassBorder}` }}>
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" 
                       style={{ background: `${theme.accent}20`, border: `3px solid ${theme.accent}` }}>
                    <span className="text-3xl font-bold" style={{ color: theme.accent }}>1</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Connect Device</h3>
                  <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                    Attach ECG leads to patient using our AI-guided placement system
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" 
                       style={{ background: `${theme.accent}20`, border: `3px solid ${theme.accent}` }}>
                    <span className="text-3xl font-bold" style={{ color: theme.accent }}>2</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Capture Data</h3>
                  <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                    Record high-quality ECG signals with real-time waveform display
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" 
                       style={{ background: `${theme.accent}20`, border: `3px solid ${theme.accent}` }}>
                    <span className="text-3xl font-bold" style={{ color: theme.accent }}>3</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>AI Analysis</h3>
                  <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                    Get instant AI-powered insights and comprehensive cardiac reports
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Compliance Section */}
          <div className="glass rounded-2xl p-8" style={{ border: `1px solid ${theme.glassBorder}` }}>
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>
              Trusted by Healthcare Professionals
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="text-4xl font-bold mb-2" style={{ color: theme.accent }}>500+</div>
                <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>Hospitals</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold mb-2" style={{ color: theme.accent }}>10K+</div>
                <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>Patients Monitored</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold mb-2" style={{ color: theme.accent }}>50+</div>
                <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>Countries</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-bold mb-2" style={{ color: theme.accent }}>99.9%</div>
                <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>Uptime</p>
              </div>
            </div>
            
            {/* Certifications */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.accent}30` }}>
                <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-semibold" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>FDA Approved</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.accent}30` }}>
                <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-semibold" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>ISO 13485</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.accent}30` }}>
                <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-semibold" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.accent}30` }}>
                <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>CE Marked</span>
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="glass rounded-2xl p-8" style={{ border: `1px solid ${theme.glassBorder}` }}>
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>
              Advanced Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                       style={{ background: `${theme.accent}20`, border: `2px solid ${theme.accent}40` }}>
                    <svg className="w-6 h-6" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Real-Time Alerts</h3>
                  <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                    Instant notifications for arrhythmias, ST changes, and critical events with customizable thresholds
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                       style={{ background: `${theme.accent}20`, border: `2px solid ${theme.accent}40` }}>
                    <svg className="w-6 h-6" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Trend Analysis</h3>
                  <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                    Historical data visualization with AI-powered pattern recognition for early detection
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                       style={{ background: `${theme.accent}20`, border: `2px solid ${theme.accent}40` }}>
                    <svg className="w-6 h-6" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Mobile Access</h3>
                  <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                    Monitor patients from anywhere with secure cloud sync and responsive design
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                       style={{ background: `${theme.accent}20`, border: `2px solid ${theme.accent}40` }}>
                    <svg className="w-6 h-6" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>EMR Integration</h3>
                  <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                    Seamless integration with major EMR systems for streamlined workflow
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                       style={{ background: `${theme.accent}20`, border: `2px solid ${theme.accent}40` }}>
                    <svg className="w-6 h-6" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Multi-User Support</h3>
                  <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                    Role-based access control for doctors, nurses, and technicians
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                       style={{ background: `${theme.accent}20`, border: `2px solid ${theme.accent}40` }}>
                    <svg className="w-6 h-6" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Report Generation</h3>
                  <p className="text-sm" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                    Automated comprehensive reports with customizable templates and export options
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support & Resources */}
          <div className="glass rounded-2xl p-8" style={{ border: `1px solid ${theme.glassBorder}` }}>
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>
              Support & Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl" style={{ background: `${theme.accent}10` }}>
                <svg className="w-12 h-12 mx-auto mb-4" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>24/7 Support</h3>
                <p className="text-sm mb-4" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                  Round-the-clock technical support and clinical consultation
                </p>
              </div>

              <div className="text-center p-6 rounded-xl" style={{ background: `${theme.accent}10` }}>
                <svg className="w-12 h-12 mx-auto mb-4" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Documentation</h3>
                <p className="text-sm mb-4" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                  Comprehensive guides, tutorials, and clinical protocols
                </p>
              </div>

              <div className="text-center p-6 rounded-xl" style={{ background: `${theme.accent}10` }}>
                <svg className="w-12 h-12 mx-auto mb-4" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>Training Programs</h3>
                <p className="text-sm mb-4" style={{ color: isDark ? '#CBD5E0' : theme.textSecondary }}>
                  Certification courses and continuing education for staff
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-medium mb-2" style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}>
            NextECG Clinical Platform • Real-time Cardiac Monitoring
          </p>
          <p className="text-xs" style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}>
            Medical-grade analysis powered by AI • For clinical use only
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PatientDashboard;

