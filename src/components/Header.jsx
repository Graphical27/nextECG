import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ConnectionDialog from './ConnectionDialog';

const Header = () => {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connectedPort, setConnectedPort] = useState('');
  const [ws, setWs] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
    if (connectionStatus === 'connected') return `Connected: ${connectedPort}`;
    if (connectionStatus === 'connecting') return 'Connecting...';
    if (connectionStatus === 'error') return 'Connection Error';
    return 'Not Connected';
  };

  return (
    <header 
      className="glass depth-shadow sticky top-0 z-50 slide-in"
      style={{
        borderBottom: `1px solid ${theme.glassBorder}`,
      }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: theme.secondary,
                border: `1px solid ${theme.glassBorder}`,
              }}
            >
              <svg 
                className="w-7 h-7" 
                style={{ color: theme.accent }}
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div>
              <h1 
                className="font-orbitron font-bold text-2xl tracking-wide"
                style={{ color: theme.textPrimary }}
              >
                Next<span style={{ color: theme.accent }}>ECG</span>
              </h1>
              <p 
                className="text-xs font-medium"
                style={{ color: theme.textMuted }}
              >
                Clinical Monitoring System
              </p>
            </div>
          </div>

          {/* Right Section - Status & Time */}
          <div className="flex items-center gap-4">
            {/* Connection Button */}
            {connectionStatus === 'connected' ? (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2"
                style={{
                  background: `${theme.danger}20`,
                  border: `1px solid ${theme.danger}40`,
                  color: theme.danger,
                }}
              >
                <svg 
                  className="w-4 h-4"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => setShowConnectionDialog(true)}
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2"
                style={{
                  background: theme.accent,
                  color: theme.primary,
                }}
              >
                <svg 
                  className="w-4 h-4"
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
                Connect Arduino
              </button>
            )}
            
            {/* Current Time */}
            <div className="hidden md:flex flex-col items-end">
              <div 
                className="font-orbitron text-lg font-bold"
                style={{ color: theme.textPrimary }}
              >
                {currentTime.toLocaleTimeString()}
              </div>
              <div 
                className="text-xs font-medium"
                style={{ color: theme.textMuted }}
              >
                {currentTime.toLocaleDateString(undefined, { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Connection Status */}
            <div 
              className="px-4 py-2 rounded-full flex items-center gap-2"
              style={{
                background: `${getStatusColor()}20`,
                border: `1px solid ${getStatusColor()}40`,
              }}
            >
              <div 
                className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`}
                style={{ background: getStatusColor() }}
              />
              <span 
                className="text-sm font-medium"
                style={{ color: getStatusColor() }}
              >
                {getStatusText()}
              </span>
            </div>
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
  );
};

export default Header;

