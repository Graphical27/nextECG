import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const AIPrediction = () => {
  const { theme } = useTheme();
  const [prediction, setPrediction] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Simulate AI analysis
  useEffect(() => {
    const runAnalysis = () => {
      setAnalyzing(true);
      setTimeout(() => {
        const predictions = [
          {
            condition: 'Normal Sinus Rhythm',
            confidence: 98,
            status: 'normal',
            recommendation: 'Continue regular monitoring',
          },
          {
            condition: 'Mild Tachycardia',
            confidence: 85,
            status: 'warning',
            recommendation: 'Monitor closely, consider consultation',
          },
          {
            condition: 'Atrial Fibrillation Risk',
            confidence: 72,
            status: 'info',
            recommendation: 'Schedule follow-up ECG in 24 hours',
          },
        ];
        setPrediction(predictions[Math.floor(Math.random() * predictions.length)]);
        setAnalyzing(false);
      }, 2000);
    };

    runAnalysis();
    const interval = setInterval(runAnalysis, 15000); // Re-analyze every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (!prediction) return theme.accent;
    if (prediction.status === 'normal') return theme.success;
    if (prediction.status === 'warning') return theme.warning;
    if (prediction.status === 'danger') return theme.danger;
    return theme.info;
  };

  return (
    <div className="glass glass-hover depth-shadow rounded-xl p-6 relative overflow-hidden slide-in scale-hover">
      {/* Top accent line - solid */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ 
          background: getStatusColor(),
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
              />
            </svg>
          </div>
          <div>
            <h3 
              className="font-orbitron font-bold text-lg"
              style={{ color: theme.textPrimary }}
            >
              AI Analysis
            </h3>
            <p 
              className="text-xs font-medium"
              style={{ color: theme.textMuted }}
            >
              Real-time cardiac assessment
            </p>
          </div>
        </div>

        {analyzing && (
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: theme.accent }}
            />
            <span 
              className="text-xs font-medium"
              style={{ color: theme.accent }}
            >
              Analyzing...
            </span>
          </div>
        )}
      </div>

      {/* Prediction Results */}
      {prediction ? (
        <div className="space-y-4">
          {/* Condition */}
          <div>
            <div 
              className="text-xs font-medium mb-2"
              style={{ color: theme.textMuted }}
            >
              Detected Condition
            </div>
            <div 
              className="font-orbitron font-bold text-xl"
              style={{ color: theme.textPrimary }}
            >
              {prediction.condition}
            </div>
          </div>

          {/* Confidence Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-xs font-medium"
                style={{ color: theme.textMuted }}
              >
                Confidence Level
              </span>
              <span 
                className="font-orbitron font-bold text-sm"
                style={{ color: getStatusColor() }}
              >
                {prediction.confidence}%
              </span>
            </div>
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ background: `${theme.glass}` }}
            >
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: `${prediction.confidence}%`,
                  background: getStatusColor(),
                }}
              />
            </div>
          </div>

          {/* Status Badge */}
          <div 
              className="px-4 py-3 rounded-lg"
            style={{
              background: theme.secondary,
              border: `1px solid ${theme.glassBorder}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg 
                className="w-4 h-4" 
                style={{ color: getStatusColor() }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span 
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: getStatusColor() }}
              >
                Recommendation
              </span>
            </div>
            <p 
              className="text-sm font-medium"
              style={{ color: theme.textPrimary }}
            >
              {prediction.recommendation}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent"
            style={{ borderColor: theme.accent }}
          />
        </div>
      )}
    </div>
  );
};

export default AIPrediction;
