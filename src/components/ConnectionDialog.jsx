import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ConnectionDialog = ({ isOpen, onClose, onConnect }) => {
  const { theme } = useTheme();
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  // Detect devices when dialog opens
  useEffect(() => {
    if (isOpen) {
      detectDevices();
    }
    
    return () => {
      // Cleanup
      setDevices([]);
      setSelectedDevice(null);
      setError('');
    };
  }, [isOpen]);

  const detectDevices = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check if Serial API is available (Chrome, Edge)
      if ('serial' in navigator) {
        try {
          const ports = await navigator.serial.getPorts();
          const deviceList = ports.map((port, index) => ({
            id: `serial-${index}`,
            name: `Serial Device ${index + 1}`,
            type: 'Serial Port',
            port: port,
            icon: '🔌'
          }));
          
          if (deviceList.length > 0) {
            setDevices(deviceList);
            setSelectedDevice(deviceList[0]);
          } else {
            // No devices found, show option to request
            setDevices([{
              id: 'request-serial',
              name: 'Click to detect new device',
              type: 'Request Permission',
              port: null,
              icon: '🔍'
            }]);
          }
        } catch (err) {
          console.error('Error getting serial ports:', err);
        }
      }
      
      // Simulate detecting USB devices (mock data for now)
      // In production, this would use Web USB API or backend detection
      const mockDevices = [
        {
          id: 'arduino-nano',
          name: 'Arduino Nano',
          type: 'USB Serial',
          manufacturer: 'Arduino',
          port: 'COM3',
          icon: '🤖'
        },
        {
          id: 'esp32',
          name: 'ESP32 DevKit',
          type: 'USB Serial',
          manufacturer: 'Espressif',
          port: 'COM4',
          icon: '📡'
        },
        {
          id: 'ch340',
          name: 'CH340 USB Serial',
          type: 'USB Serial',
          manufacturer: 'WCH',
          port: 'COM5',
          icon: '🔌'
        }
      ];
      
      // Add mock devices for demo
      if (devices.length === 0) {
        setDevices(mockDevices);
        setSelectedDevice(mockDevices[0]);
      }
      
    } catch (err) {
      console.error('Error detecting devices:', err);
      setError('Failed to detect devices. Please check browser permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceRequest = async () => {
    try {
      if ('serial' in navigator) {
        const port = await navigator.serial.requestPort();
        const newDevice = {
          id: `serial-${Date.now()}`,
          name: 'Serial Device',
          type: 'Serial Port',
          port: port,
          icon: '🔌'
        };
        setDevices([newDevice]);
        setSelectedDevice(newDevice);
      }
    } catch (err) {
      console.error('User cancelled device selection:', err);
    }
  };

  const handleConnect = async () => {
    if (!selectedDevice) {
      setError('Please select a device');
      return;
    }
    
    setConnecting(true);
    setError('');
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the parent connect handler
      if (onConnect) {
        onConnect(selectedDevice);
      }
      
      // Close dialog
      onClose();
    } catch (err) {
      setError('Failed to connect to device');
      setConnecting(false);
    }
  };

  if (!isOpen) return null;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4" 
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      {/* Backdrop - Click to close */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-opacity duration-200"
        style={{ 
          background: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)',
        }}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className="relative glass rounded-2xl p-8 w-full mx-auto"
        style={{
          border: `1px solid ${theme.glassBorder}`,
          maxWidth: '650px',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUpFadeIn 0.3s ease-out',
          boxShadow: isDark 
            ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(102, 126, 234, 0.2)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(102, 126, 234, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent gradient */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ 
            background: 'linear-gradient(90deg, #667EEA, #764BA2, #F093FB)',
          }}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
            >
              <svg 
                className="w-7 h-7" 
                style={{ color: '#FFFFFF' }}
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
                className="font-bold text-2xl mb-1"
                style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}
              >
                Connect Device
              </h2>
              <p 
                className="text-sm font-medium"
                style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}
              >
                Select a device to connect with NextECG
              </p>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: isDark ? 'rgba(45, 55, 72, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              border: `1px solid ${theme.glassBorder}`,
            }}
          >
            <svg 
              className="w-5 h-5" 
              style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}
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
            className="mb-4 p-4 rounded-xl flex items-start gap-3"
            style={{
              background: `${theme.danger}15`,
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
                className="font-semibold mb-1 text-sm"
                style={{ color: theme.danger }}
              >
                Connection Error
              </div>
              <div 
                className="text-xs"
                style={{ color: isDark ? '#CBD5E0' : theme.textMuted }}
              >
                {error}
              </div>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading ? (
          <div 
            className="mb-6 p-12 rounded-xl flex flex-col items-center justify-center gap-4"
            style={{
              background: isDark ? 'rgba(45, 55, 72, 0.4)' : 'rgba(255, 255, 255, 0.6)',
              border: `1px solid ${theme.glassBorder}`,
            }}
          >
            <div 
              className="w-16 h-16 rounded-full border-4 animate-spin"
              style={{
                borderColor: `${theme.accent}20`,
                borderTopColor: theme.accent,
              }}
            />
            <p 
              className="text-sm font-medium"
              style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}
            >
              Detecting devices...
            </p>
          </div>
        ) : (
          <>
            {/* Device List */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: isDark ? '#CBD5E0' : theme.textMuted }}
                >
                  Available Devices ({devices.length})
                </h3>
                <button
                  onClick={detectDevices}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                  style={{
                    background: `${theme.accent}15`,
                    color: theme.accent,
                    border: `1px solid ${theme.accent}30`,
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {devices.length === 0 ? (
                  <div 
                    className="p-8 rounded-xl text-center"
                    style={{
                      background: isDark ? 'rgba(45, 55, 72, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                      border: `1px dashed ${theme.glassBorder}`,
                    }}
                  >
                    <svg 
                      className="w-12 h-12 mx-auto mb-3 opacity-50" 
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
                    <p 
                      className="text-sm font-medium mb-1"
                      style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}
                    >
                      No devices found
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}
                    >
                      Connect your device and click Refresh
                    </p>
                  </div>
                ) : (
                  devices.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => device.id === 'request-serial' ? handleDeviceRequest() : setSelectedDevice(device)}
                      className="w-full p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                      style={{
                        background: selectedDevice?.id === device.id 
                          ? `linear-gradient(135deg, ${theme.accent}20, ${theme.accent}10)` 
                          : isDark ? 'rgba(45, 55, 72, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                        border: selectedDevice?.id === device.id 
                          ? `2px solid ${theme.accent}` 
                          : `1px solid ${theme.glassBorder}`,
                        boxShadow: selectedDevice?.id === device.id 
                          ? `0 4px 12px ${theme.accent}30` 
                          : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{
                            background: selectedDevice?.id === device.id 
                              ? `${theme.accent}20` 
                              : isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.08)',
                          }}
                        >
                          {device.icon}
                        </div>
                        <div className="flex-1">
                          <div 
                            className="font-bold text-sm mb-1"
                            style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}
                          >
                            {device.name}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span 
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                background: `${theme.accent}15`,
                                color: theme.accent,
                              }}
                            >
                              {device.type}
                            </span>
                            {device.port && (
                              <span 
                                className="text-xs"
                                style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}
                              >
                                {device.port}
                              </span>
                            )}
                            {device.manufacturer && (
                              <span 
                                className="text-xs"
                                style={{ color: isDark ? '#A0AEC0' : theme.textMuted }}
                              >
                                • {device.manufacturer}
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedDevice?.id === device.id && (
                          <svg 
                            className="w-6 h-6" 
                            style={{ color: theme.accent }}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: theme.glassBorder }}>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.02]"
                style={{
                  background: isDark ? 'rgba(45, 55, 72, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                  color: isDark ? '#F7FAFC' : theme.textPrimary,
                  border: `1px solid ${theme.glassBorder}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={!selectedDevice || connecting}
                className="flex-1 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: selectedDevice && !connecting 
                    ? 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' 
                    : isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)',
                  color: '#FFFFFF',
                  boxShadow: selectedDevice && !connecting 
                    ? '0 4px 12px rgba(102, 126, 234, 0.4)' 
                    : 'none',
                }}
              >
                {connecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
                    />
                    Connecting...
                  </span>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionDialog;
