import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { useVitals } from '../context/VitalsContext';

const VitalsHistory = () => {
  const { theme } = useTheme();
  const { history, vitals } = useVitals();

  // Format timestamps for display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Generate labels from history
  const labels = history.timestamps.length > 0
    ? history.timestamps.slice(-7).map(formatTime)
    : ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'];

  // Use real data or fallback
  const heartRateData = history.heartRateHistory.length > 0
    ? history.heartRateHistory.slice(-7)
    : [68, 72, 70, 75, 71, 73, 72];

  // Historical data
  const historyData = {
    labels,
    datasets: [
      {
        label: 'Heart Rate',
        data: heartRateData,
        borderColor: theme.accent,
        backgroundColor: `${theme.accent}20`,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: theme.accent,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.secondary,
        titleColor: theme.textPrimary,
        bodyColor: theme.textPrimary,
        borderColor: theme.accent,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
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
      y: {
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

  // Generate recent readings from history
  const recentReadings = [];
  const numReadings = Math.min(3, history.timestamps.length);
  
  for (let i = 0; i < numReadings; i++) {
    const idx = history.timestamps.length - 1 - i;
    if (idx >= 0) {
      const timestamp = new Date(history.timestamps[idx]);
      recentReadings.push({
        time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        hr: history.heartRateHistory[idx] || 0,
        bp: `${history.bpSystolicHistory[idx] || 0}/${history.bpDiastolicHistory[idx] || 0}`,
        temp: vitals.temperature > 0 ? `${vitals.temperature}°F` : '--',
        spo2: `${history.spo2History[idx] || 0}%`,
      });
    }
  }

  // Fallback if no history
  if (recentReadings.length === 0) {
    const now = new Date();
    recentReadings.push(
      { 
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), 
        hr: vitals.heartRate || 0, 
        bp: `${vitals.bloodPressure.systolic || 0}/${vitals.bloodPressure.diastolic || 0}`, 
        temp: vitals.temperature > 0 ? `${vitals.temperature}°F` : '--', 
        spo2: `${vitals.spo2 || 0}%` 
      }
    );
  }

  return (
    <div className="glass glass-hover depth-shadow rounded-xl p-6 relative overflow-hidden slide-in scale-hover">
      {/* Top accent line - solid */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ 
          background: theme.accent,
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
        </div>
        <div>
          <h3 
            className="font-orbitron font-bold text-lg"
            style={{ color: theme.textPrimary }}
          >
            Vitals History
          </h3>
          <p 
            className="text-xs font-medium"
            style={{ color: theme.textMuted }}
          >
            Last 6 hours trending
          </p>
        </div>
      </div>

      {/* Mini Chart */}
      <div 
        className="h-40 rounded-xl p-3 mb-6"
        style={{
          background: `${theme.primary}60`,
          border: `1px solid ${theme.glassBorder}`,
        }}
      >
        <Line data={historyData} options={options} />
      </div>

      {/* Recent Readings Table */}
      <div className="space-y-3">
        <div 
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: theme.textMuted }}
        >
          Recent Readings
        </div>
        
        {recentReadings.map((reading, index) => (
          <div 
            key={index}
            className="glass-hover px-4 py-3 rounded-lg"
            style={{
              background: `${theme.glass}`,
              border: `1px solid ${theme.glassBorder}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-xs font-medium"
                style={{ color: theme.textMuted }}
              >
                {reading.time}
              </span>
              <span 
                className="font-orbitron text-sm font-bold"
                style={{ color: theme.accent }}
              >
                {reading.hr} BPM
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span style={{ color: theme.textMuted }}>BP: </span>
                <span 
                  className="font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {reading.bp}
                </span>
              </div>
              <div>
                <span style={{ color: theme.textMuted }}>Temp: </span>
                <span 
                  className="font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {reading.temp}
                </span>
              </div>
              <div>
                <span style={{ color: theme.textMuted }}>SpO2: </span>
                <span 
                  className="font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {reading.spo2}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VitalsHistory;
