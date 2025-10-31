import React from 'react';
import { useTheme } from '../context/ThemeContext';

const DataCard = ({ title, value, unit, trend, icon, status = 'normal' }) => {
  const { theme } = useTheme();
  
  // Status colors
  const statusColors = {
    normal: theme.success,
    warning: theme.warning,
    danger: theme.danger,
    info: theme.info,
  };

  const statusColor = statusColors[status] || theme.accent;

  return (
    <div 
      className="glass glass-hover depth-shadow rounded-xl p-6 relative overflow-hidden slide-in scale-hover"
    >
      {/* Top accent line - solid color, no gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ 
          background: statusColor,
        }}
      />

      {/* Icon */}
      {icon && (
        <div 
          className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center"
          style={{
            background: theme.secondary,
            border: `1px solid ${theme.glassBorder}`,
          }}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 
        className="text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: theme.textMuted }}
      >
        {title}
      </h3>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-2">
        <span 
          className="font-orbitron font-bold text-4xl"
          style={{ color: theme.textPrimary }}
        >
          {value}
        </span>
        {unit && (
          <span 
            className="text-xl font-medium"
            style={{ color: theme.textSecondary }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="flex items-center gap-2 mt-3">
          {trend > 0 ? (
            <svg 
              className="w-4 h-4" 
              style={{ color: theme.success }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : trend < 0 ? (
            <svg 
              className="w-4 h-4" 
              style={{ color: theme.danger }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          ) : null}
          <span 
            className="text-sm font-medium"
            style={{ color: trend > 0 ? theme.success : trend < 0 ? theme.danger : theme.textMuted }}
          >
            {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
          </span>
        </div>
      )}
    </div>
  );
};

export default DataCard;

