import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConnectionDialog from './ConnectionDialog';

const Header = ({ onSettingsClick }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connectedPort, setConnectedPort] = useState('');
  const [ws, setWs] = useState(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [blueFilter, setBlueFilter] = useState('low');
  const themeMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
    };

    if (showThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeMenu]);

  // Initialize blue light filter
  useEffect(() => {
    handleBlueFilterChange('low'); // Default to low intensity
  }, []);

  // WebSocket connection for monitoring status
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');
    setWs(websocket);

    websocket.onopen = () => {
      console.log('Header: Connected to WebSocket');
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'connection-status') {
          setConnectionStatus(message.connected ? 'connected' : 'disconnected');
          setConnectedPort(message.port || '');
        }
      } catch (error) {
        console.error('Header: Error parsing message:', error);
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

  const getStatusColor = () => {
    if (connectionStatus === 'connected') return theme.success;
    if (connectionStatus === 'connecting') return theme.warning;
    if (connectionStatus === 'error') return theme.danger;
    return theme.textMuted;
  };

  const getStatusText = () => {
    if (connectionStatus === 'connected') return `${t('connected')}: ${connectedPort}`;
    if (connectionStatus === 'connecting') return t('connecting') + '...';
    if (connectionStatus === 'error') return `${t('error')}`;
    return t('disconnected');
  };

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    // Apply comprehensive theme changes
    if (newTheme === 'dark') {
      // Dark mode
      document.body.style.background = 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)';
      document.body.style.color = '#F7FAFC';
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      // Light mode
      document.body.style.background = 'linear-gradient(135deg, #F0F4F8 0%, #E6EEF5 100%)';
      document.body.style.color = '#2D3748';
      document.documentElement.setAttribute('data-theme', 'light');
    }
    setShowThemeMenu(false);
  };

  const handleBlueFilterChange = (intensity) => {
    setBlueFilter(intensity);
    // Apply blue light filter
    const filterValues = {
      none: 0,
      low: 0.15,
      medium: 0.3,
      high: 0.5
    };
    document.body.style.filter = `sepia(${filterValues[intensity]}) saturate(0.9)`;
  };

  return (
    <>
      {/* Beautiful Gradient Top Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 z-[100]"
        style={{
          background: 'linear-gradient(90deg, #667EEA, #764BA2, #F093FB, #667EEA)',
          backgroundSize: '300% 100%',
          animation: 'gradient-slide 6s linear infinite',
        }}
      />
      
      <header 
        className="sticky top-0 z-50"
        style={{
          background: currentTheme === 'dark' 
            ? 'rgba(26, 32, 44, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: currentTheme === 'dark'
            ? `1px solid rgba(102, 126, 234, 0.3)`
            : `1px solid rgba(102, 126, 234, 0.15)`,
          marginTop: '4px',
          boxShadow: currentTheme === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.5)'
            : '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
            >
              <svg 
                className="w-6 h-6" 
                style={{ color: '#FFFFFF' }}
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div>
              <h1 
                className="font-semibold text-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                NextECG
              </h1>
              <p 
                className="text-xs"
                style={{ 
                  color: currentTheme === 'dark' ? '#A0AEC0' : '#718096'
                }}
              >
                Cardiac Monitoring
              </p>
            </div>
          </div>

          {/* Features List - Simplified */}
          <div className="hidden lg:flex items-center gap-4 text-sm" style={{ 
            color: currentTheme === 'dark' ? '#A0AEC0' : '#718096'
          }}>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#667EEA' }} />
              Real-time ECG
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#764BA2' }} />
              6-Lead Monitor
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F093FB' }} />
              Clinical Grade
            </span>
          </div>

          {/* Connection Status & Settings */}
          <div className="flex items-center gap-3">
            {connectionStatus === 'connected' ? (
              <button
                onClick={handleDisconnect}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #F56565 0%, #FC8181 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                }}
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => setShowConnectionDialog(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                }}
              >
                Connect with NextECG
              </button>
            )}
            
            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2.5 rounded-xl transition-all hover:shadow-lg"
                style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667EEA',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
                title="Theme Options"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </button>

              {/* Theme Dropdown Menu */}
              {showThemeMenu && (
                <div 
                  className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
                  style={{
                    background: currentTheme === 'dark'
                      ? 'rgba(26, 32, 44, 0.98)'
                      : 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: currentTheme === 'dark'
                      ? '1px solid rgba(102, 126, 234, 0.3)'
                      : '1px solid rgba(102, 126, 234, 0.15)',
                    animation: 'slideUpFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Header with Icon */}
                  <div 
                    className="px-5 py-4 border-b"
                    style={{
                      borderColor: currentTheme === 'dark' 
                        ? 'rgba(102, 126, 234, 0.2)' 
                        : 'rgba(102, 126, 234, 0.1)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                        }}
                      >
                        <svg className="w-5 h-5" style={{ color: '#FFFFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div>
                        <h3 
                          className="font-semibold text-sm"
                          style={{ 
                            color: currentTheme === 'dark' ? '#F7FAFC' : '#2D3748'
                          }}
                        >
                          Appearance Settings
                        </h3>
                        <p 
                          className="text-xs"
                          style={{ 
                            color: currentTheme === 'dark' ? '#A0AEC0' : '#718096'
                          }}
                        >
                          Customize your theme
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Theme Mode */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: '#667EEA' }}
                        />
                        <p 
                          className="text-xs font-semibold tracking-wide uppercase"
                          style={{ 
                            color: currentTheme === 'dark' ? '#A0AEC0' : '#718096'
                          }}
                        >
                          Theme Mode
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleThemeChange('light')}
                          className="group px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                          style={{
                            background: currentTheme === 'light' 
                              ? 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' 
                              : currentTheme === 'dark'
                                ? 'rgba(45, 55, 72, 0.5)'
                                : 'rgba(247, 250, 252, 0.8)',
                            color: currentTheme === 'light' ? '#FFFFFF' : currentTheme === 'dark' ? '#CBD5E0' : '#4A5568',
                            border: currentTheme === 'light' 
                              ? '2px solid rgba(102, 126, 234, 0.5)' 
                              : `1px solid ${currentTheme === 'dark' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(203, 213, 224, 0.4)'}`,
                            boxShadow: currentTheme === 'light' 
                              ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
                              : 'none',
                          }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg">☀️</span>
                            <span>Light</span>
                          </div>
                          {currentTheme === 'light' && (
                            <div className="flex justify-center mt-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => handleThemeChange('dark')}
                          className="group px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                          style={{
                            background: currentTheme === 'dark' 
                              ? 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' 
                              : currentTheme === 'dark'
                                ? 'rgba(45, 55, 72, 0.5)'
                                : 'rgba(247, 250, 252, 0.8)',
                            color: currentTheme === 'dark' ? '#FFFFFF' : currentTheme === 'dark' ? '#CBD5E0' : '#4A5568',
                            border: currentTheme === 'dark' 
                              ? '2px solid rgba(102, 126, 234, 0.5)' 
                              : `1px solid ${currentTheme === 'dark' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(203, 213, 224, 0.4)'}`,
                            boxShadow: currentTheme === 'dark' 
                              ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
                              : 'none',
                          }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg">🌙</span>
                            <span>Dark</span>
                          </div>
                          {currentTheme === 'dark' && (
                            <div className="flex justify-center mt-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div 
                      className="h-px"
                      style={{
                        background: currentTheme === 'dark' 
                          ? 'rgba(102, 126, 234, 0.2)' 
                          : 'rgba(102, 126, 234, 0.1)',
                      }}
                    />

                    {/* Blue Light Filter */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: '#764BA2' }}
                        />
                        <p 
                          className="text-xs font-semibold tracking-wide uppercase"
                          style={{ 
                            color: currentTheme === 'dark' ? '#A0AEC0' : '#718096'
                          }}
                        >
                          Blue Light Filter
                        </p>
                      </div>
                      <div className="space-y-2">
                        {[
                          { value: 'none', icon: '🔆', label: 'None', desc: 'No filter applied' },
                          { value: 'low', icon: '🌤️', label: 'Low', desc: 'Minimal warmth' },
                          { value: 'medium', icon: '🌅', label: 'Medium', desc: 'Moderate warmth' },
                          { value: 'high', icon: '🌇', label: 'High', desc: 'Maximum warmth' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleBlueFilterChange(option.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all hover:scale-[1.01] flex items-center gap-3"
                            style={{
                              background: blueFilter === option.value 
                                ? currentTheme === 'dark'
                                  ? 'rgba(102, 126, 234, 0.15)'
                                  : 'rgba(102, 126, 234, 0.08)'
                                : currentTheme === 'dark'
                                  ? 'rgba(45, 55, 72, 0.3)'
                                  : 'rgba(247, 250, 252, 0.5)',
                              color: blueFilter === option.value 
                                ? '#667EEA' 
                                : currentTheme === 'dark' ? '#CBD5E0' : '#4A5568',
                              border: blueFilter === option.value 
                                ? '2px solid rgba(102, 126, 234, 0.4)' 
                                : `1px solid ${currentTheme === 'dark' ? 'rgba(102, 126, 234, 0.15)' : 'rgba(203, 213, 224, 0.3)'}`,
                              boxShadow: blueFilter === option.value 
                                ? '0 2px 8px rgba(102, 126, 234, 0.2)' 
                                : 'none',
                            }}
                          >
                            <span className="text-xl">{option.icon}</span>
                            <div className="flex-1">
                              <div className="font-semibold">{option.label}</div>
                              <div 
                                className="text-xs mt-0.5"
                                style={{ 
                                  color: currentTheme === 'dark' ? '#A0AEC0' : '#718096'
                                }}
                              >
                                {option.desc}
                              </div>
                            </div>
                            {blueFilter === option.value && (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Settings Button */}
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="p-2.5 rounded-xl transition-all hover:shadow-lg"
                style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667EEA',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Connection Dialog */}
      <ConnectionDialog
        isOpen={showConnectionDialog}
        onClose={() => setShowConnectionDialog(false)}
        onConnect={handleConnect}
      />
    </header>
    </>
  );
};

export default Header;

