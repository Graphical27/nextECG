import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ConnectionDialog = ({ isOpen, onClose, onConnect }) => {
  const { theme } = useTheme();
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wsConnection, setWsConnection] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Request port list when dialog opens
      requestPortList();
    }
  }, [isOpen]);

  const requestPortList = () => {
    setLoading(true);
    setError('');
    
    // Connect to WebSocket if not already connected
    const ws = new WebSocket('ws://localhost:8080');
    setWsConnection(ws);
    
    ws.onopen = () => {
      // Request list of ports
      ws.send(JSON.stringify({ type: 'list-ports' }));
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'ports-list') {
          setPorts(message.ports);
          setLoading(false);
          
          // Auto-select Arduino port if found
          const arduinoPort = message.ports.find(p => 
            p.manufacturer && (
              p.manufacturer.toLowerCase().includes('arduino') ||
              p.manufacturer.toLowerCase().includes('ftdi') ||
              p.manufacturer.toLowerCase().includes('ch340') ||
              p.manufacturer.toLowerCase().includes('wch')
            )
          );
          
          if (arduinoPort) {
            setSelectedPort(arduinoPort.path);
          } else if (message.ports.length > 0) {
            setSelectedPort(message.ports[0].path);
          }
        } else if (message.type === 'error') {
          setError(message.message);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
        setError('Failed to parse server response');
        setLoading(false);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to server. Make sure the backend is running.');
      setLoading(false);
    };
    
    ws.onclose = () => {
      setLoading(false);
    };
  };

  const handleConnect = () => {
    if (!selectedPort) {
      setError('Please select a port');
      return;
    }
    
    onConnect(selectedPort);
    onClose();
  };

  const handleRefresh = () => {
    if (wsConnection) {
      wsConnection.close();
    }
    setPorts([]);
    setSelectedPort('');
    requestPortList();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: `${theme.primary}80` }}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className="relative glass depth-shadow-lg rounded-2xl p-8 max-w-2xl w-full mx-4 slide-in scale-hover"
        style={{
          border: `1px solid ${theme.glassBorder}`,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        {/* Top accent line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: theme.accent }}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: theme.secondary,
                border: `1px solid ${theme.glassBorder}`,
              }}
            >
              <svg 
                className="w-6 h-6" 
                style={{ color: theme.accent }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <div>
              <h2 
                className="font-orbitron font-bold text-2xl"
                style={{ color: theme.textPrimary }}
              >
                Connect to Arduino
              </h2>
              <p 
                className="text-sm font-medium"
                style={{ color: theme.textMuted }}
              >
                Select your Arduino Nano serial port
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: theme.glass,
              border: `1px solid ${theme.glassBorder}`,
            }}
          >
            <svg 
              className="w-5 h-5" 
              style={{ color: theme.textMuted }}
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
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div 
            className="mb-4 p-4 rounded-lg flex items-start gap-3"
            style={{
              background: `${theme.danger}20`,
              border: `1px solid ${theme.danger}40`,
            }}
          >
            <svg 
              className="w-5 h-5 flex-shrink-0 mt-0.5" 
              style={{ color: theme.danger }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div>
              <div 
                className="font-semibold mb-1"
                style={{ color: theme.danger }}
              >
                Error
              </div>
              <div 
                className="text-sm"
                style={{ color: theme.textMuted }}
              >
                {error}
              </div>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div 
            className="mb-6 p-6 rounded-lg flex flex-col items-center justify-center gap-4"
            style={{
              background: theme.glass,
              border: `1px solid ${theme.glassBorder}`,
            }}
          >
            <div 
              className="w-12 h-12 rounded-full border-4 animate-spin"
              style={{
                borderColor: `${theme.accent}20`,
                borderTopColor: theme.accent,
              }}
            />
            <div 
              className="text-sm font-medium"
              style={{ color: theme.textMuted }}
            >
              Scanning for available ports...
            </div>
          </div>
        )}
        
        {/* Ports List */}
        {!loading && ports.length > 0 && (
          <div className="mb-6">
            <div 
              className="text-sm font-semibold mb-3"
              style={{ color: theme.textPrimary }}
            >
              Available Ports ({ports.length})
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ports.map((port, index) => (
                <label
                  key={index}
                  className="block cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <div 
                    className={`p-4 rounded-lg transition-all ${
                      selectedPort === port.path ? 'scale-[1.02]' : ''
                    }`}
                    style={{
                      background: selectedPort === port.path ? `${theme.accent}20` : theme.glass,
                      border: `2px solid ${selectedPort === port.path ? theme.accent : theme.glassBorder}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="port"
                        value={port.path}
                        checked={selectedPort === port.path}
                        onChange={(e) => setSelectedPort(e.target.value)}
                        className="w-5 h-5 cursor-pointer"
                        style={{ accentColor: theme.accent }}
                      />
                      <div className="flex-1">
                        <div 
                          className="font-orbitron font-bold mb-1"
                          style={{ color: theme.textPrimary }}
                        >
                          {port.path}
                        </div>
                        {port.manufacturer && (
                          <div 
                            className="text-sm font-medium flex items-center gap-2"
                            style={{ color: theme.textMuted }}
                          >
                            <svg 
                              className="w-4 h-4" 
                              style={{ color: theme.accent }}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                              />
                            </svg>
                            {port.manufacturer}
                            {port.manufacturer.toLowerCase().includes('arduino') && (
                              <span 
                                className="px-2 py-0.5 rounded text-xs font-bold"
                                style={{
                                  background: theme.success,
                                  color: theme.primary,
                                }}
                              >
                                ARDUINO
                              </span>
                            )}
                          </div>
                        )}
                        {port.serialNumber && (
                          <div 
                            className="text-xs mt-1"
                            style={{ color: theme.textMuted }}
                          >
                            Serial: {port.serialNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* No Ports Found */}
        {!loading && ports.length === 0 && !error && (
          <div 
            className="mb-6 p-6 rounded-lg text-center"
            style={{
              background: theme.glass,
              border: `1px solid ${theme.glassBorder}`,
            }}
          >
            <svg 
              className="w-16 h-16 mx-auto mb-4" 
              style={{ color: theme.textMuted }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div 
              className="font-semibold mb-2"
              style={{ color: theme.textPrimary }}
            >
              No Serial Ports Found
            </div>
            <div 
              className="text-sm mb-4"
              style={{ color: theme.textMuted }}
            >
              Make sure your Arduino Nano is connected via USB
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: theme.glass,
              border: `1px solid ${theme.glassBorder}`,
              color: theme.textPrimary,
            }}
          >
            <svg 
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Refresh
          </button>
          
          <button
            onClick={handleConnect}
            disabled={!selectedPort || loading}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: theme.accent,
              color: theme.primary,
            }}
          >
            <svg 
              className="w-5 h-5"
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
            Connect
          </button>
        </div>
        
        {/* Help Text */}
        <div 
          className="mt-4 p-4 rounded-lg"
          style={{
            background: `${theme.info}10`,
            border: `1px solid ${theme.info}30`,
          }}
        >
          <div 
            className="text-xs font-medium flex items-start gap-2"
            style={{ color: theme.textMuted }}
          >
            <svg 
              className="w-4 h-4 flex-shrink-0 mt-0.5" 
              style={{ color: theme.info }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div>
              <strong>Tip:</strong> Arduino ports usually show up as "Arduino", "FTDI", "CH340", or "wch.cn" manufacturers. 
              Make sure you've uploaded the ECG code to your Arduino Nano before connecting.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDialog;
