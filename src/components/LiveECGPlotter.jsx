import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LiveECGPlotter = () => {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'ECG Signal',
        data: [],
        borderColor: theme.ecgLine,
        backgroundColor: `${theme.accent}10`,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
        fill: true,
      },
    ],
  });

  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [heartRate, setHeartRate] = useState(0);
  const [avgValue, setAvgValue] = useState(0);
  const [sampleRate, setSampleRate] = useState(250);
  const wsRef = useRef(null);
  const maxDataPoints = 50;

  // Update chart color when theme changes
  useEffect(() => {
    setChartData(prevData => ({
      ...prevData,
      datasets: [{
        ...prevData.datasets[0],
        borderColor: theme.ecgLine,
        backgroundColor: `${theme.accent}10`,
      }],
    }));
  }, [theme.ecgLine, theme.accent]);

  useEffect(() => {
    // Connect to the WebSocket server
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to Arduino Nano via WebSocket');
      setConnectionStatus('Connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle different message types from server
        if (message.type === 'ecg') {
          // ECG data message
          const ecgValue = message.ecgValue;

          setChartData((prevData) => {
            const newLabels = [...prevData.labels, message.timestamp || Date.now()];
            const newData = [...prevData.datasets[0].data, ecgValue];

            // Keep only the last maxDataPoints
            if (newLabels.length > maxDataPoints) {
              newLabels.shift();
              newData.shift();
            }

            // Calculate average signal value
            const avg = newData.reduce((a, b) => a + b, 0) / newData.length;
            setAvgValue(Math.round(avg));

            return {
              labels: newLabels,
              datasets: [
                {
                  ...prevData.datasets[0],
                  data: newData,
                  borderColor: theme.ecgLine,
                  backgroundColor: `${theme.accent}10`,
                },
              ],
            };
          });
        } else if (message.type === 'vitals') {
          // Vitals data message (heart rate, SpO2, etc.)
          const vitals = message.data;
          if (vitals.heartRate) {
            setHeartRate(vitals.heartRate);
          }
        } else if (message.ecgValue !== undefined) {
          // Legacy format support
          const ecgValue = message.ecgValue;
          setChartData((prevData) => {
            const newLabels = [...prevData.labels, Date.now()];
            const newData = [...prevData.datasets[0].data, ecgValue];

            if (newLabels.length > maxDataPoints) {
              newLabels.shift();
              newData.shift();
            }

            const avg = newData.reduce((a, b) => a + b, 0) / newData.length;
            setAvgValue(Math.round(avg));

            return {
              labels: newLabels,
              datasets: [
                {
                  ...prevData.datasets[0],
                  data: newData,
                  borderColor: theme.ecgLine,
                  backgroundColor: `${theme.accent}10`,
                },
              ],
            };
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };

    ws.onclose = () => {
      console.log('Disconnected from Arduino Nano');
      setConnectionStatus('Disconnected');
    };

    // Cleanup on component unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [theme.ecgLine, theme.accent]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: theme.ecgGrid,
          lineWidth: 1,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          color: theme.ecgGrid,
          lineWidth: 1,
        },
        ticks: {
          color: theme.textMuted,
          font: {
            size: 10,
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  const getStatusColor = () => {
    if (connectionStatus === 'Connected') return theme.success;
    if (connectionStatus === 'Error') return theme.danger;
    return theme.warning;
  };

  return (
    <div className="glass glass-hover depth-shadow-lg rounded-xl p-6 relative overflow-hidden slide-in">
      {/* Top accent - solid, no gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ 
          background: theme.accent,
        }}
      />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
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
          </div>
          <div>
            <h2 
              className="font-orbitron font-bold text-2xl"
              style={{ color: theme.textPrimary }}
            >
              Live ECG Monitor
            </h2>
            <p 
              className="text-sm font-medium mt-1"
              style={{ color: theme.textMuted }}
            >
              Real-time cardiac waveform analysis
            </p>
          </div>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center gap-4">
          <div 
            className="px-4 py-2 rounded-full flex items-center gap-2"
            style={{
              background: `${getStatusColor()}20`,
              border: `1px solid ${getStatusColor()}40`,
            }}
          >
            <span 
              className="text-sm font-semibold tracking-wide"
              style={{ color: getStatusColor() }}
            >
              {connectionStatus}
            </span>
          </div>
          
          {connectionStatus === 'Connected' && (
            <div 
              className="px-3 py-1.5 rounded-full flex items-center gap-2"
              style={{ background: theme.secondary }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: theme.accent }}
              />
              <span 
                className="font-orbitron font-bold text-xs tracking-wider"
                style={{ color: theme.accent }}
              >
                LIVE
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* ECG Chart Container */}
      <div 
        className="h-80 rounded-xl p-4 relative overflow-hidden mb-4"
        style={{
          background: `${theme.primary}80`,
          border: `1px solid ${theme.glassBorder}`,
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        
        <Line data={chartData} options={options} />
        
        {/* Scanning line effect - solid, no glow */}
        {connectionStatus === 'Connected' && (
          <div 
            className="absolute top-0 bottom-0 w-[1px] scan-line"
            style={{
              background: theme.accent,
              left: '10%',
            }}
          />
        )}
      </div>
      
      {/* Bottom Feature Cards */}
      <div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4"
        style={{ borderTop: `1px solid ${theme.glassBorder}` }}
      >
        {/* Live Monitoring Card */}
        <div 
          className="px-4 py-3 rounded-lg glass glass-hover cursor-pointer transition-all hover:scale-105"
          style={{ 
            background: theme.secondary,
            border: `1px solid ${theme.glassBorder}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `${theme.accent}20`,
                color: theme.accent,
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: theme.textMuted }}
            >
              Live Monitoring
            </div>
          </div>
          <div 
            className="font-semibold text-sm"
            style={{ color: theme.textPrimary }}
          >
            Real-time ECG tracking
          </div>
        </div>
        
        {/* 6Lead Data Card */}
        <div 
          className="px-4 py-3 rounded-lg glass glass-hover cursor-pointer transition-all hover:scale-105"
          style={{ 
            background: theme.secondary,
            border: `1px solid ${theme.glassBorder}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `${theme.accent}20`,
                color: theme.accent,
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: theme.textMuted }}
            >
              6Lead Data
            </div>
          </div>
          <div 
            className="font-semibold text-sm"
            style={{ color: theme.textPrimary }}
          >
            Multi-channel analysis
          </div>
        </div>
        
        {/* Post Surgery Recovery Card */}
        <div 
          className="px-4 py-3 rounded-lg glass glass-hover cursor-pointer transition-all hover:scale-105"
          style={{ 
            background: theme.secondary,
            border: `1px solid ${theme.glassBorder}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `${theme.accent}20`,
                color: theme.accent,
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: theme.textMuted }}
            >
              Post Surgery Recovery
            </div>
          </div>
          <div 
            className="font-semibold text-sm"
            style={{ color: theme.textPrimary }}
          >
            Recovery monitoring
          </div>
        </div>
        
        {/* History Card */}
        <div 
          className="px-4 py-3 rounded-lg glass glass-hover cursor-pointer transition-all hover:scale-105"
          style={{ 
            background: theme.secondary,
            border: `1px solid ${theme.glassBorder}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `${theme.accent}20`,
                color: theme.accent,
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: theme.textMuted }}
            >
              History
            </div>
          </div>
          <div 
            className="font-semibold text-sm"
            style={{ color: theme.textPrimary }}
          >
            View past records
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveECGPlotter;

