import React from 'react';
import { useTheme } from '../context/ThemeContext';

const DataCard = ({ title, value, unit, trend, icon, status = 'normal' }) => {
  const { theme } = useTheme();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
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
      className="glass glass-hover rounded-3xl p-6 relative overflow-hidden"
      style={{ 
        minHeight: '200px',
        transition: 'all 0.3s ease',
        border: `1px solid rgba(102, 126, 234, 0.15)`,
      }}
    >
      {/* Top accent line - beautiful gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ 
          background: 'linear-gradient(90deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
        }}
      />

      {/* Animated background shimmer */}
      <div 
        className="absolute inset-0 shimmer pointer-events-none"
        style={{ opacity: 0.05 }}
      />

      {/* Icon */}
      {icon && (
        <div 
          className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center pulse-glow"
          style={{
            background: `${statusColor}15`,
            border: `2px solid ${statusColor}40`,
          }}
        >
          <div style={{ transform: 'scale(1.2)' }}>
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      <h3 
        className="text-2xl font-bold uppercase tracking-wide mb-4 leading-tight"
        style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}
      >
        {title}
      </h3>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span 
          className="font-medium text-sm"
          style={{ 
            color: isDark ? '#A0AEC0' : theme.textMuted,
          }}
        >
          {value}
        </span>
        {unit && (
          <span 
            className="text-xs font-medium"
            style={{ color: theme.textMuted }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div 
          className="flex items-center gap-3 mt-4 px-4 py-2 rounded-lg"
          style={{
            background: trend > 0 
              ? `${theme.success}15` 
              : trend < 0 
              ? `${theme.danger}15` 
              : `${theme.textMuted}15`,
            border: `1px solid ${trend > 0 ? theme.success : trend < 0 ? theme.danger : theme.textMuted}40`,
          }}
        >
          {trend > 0 ? (
            <svg 
              className="w-5 h-5" 
              style={{ color: theme.success }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : trend < 0 ? (
            <svg 
              className="w-5 h-5" 
              style={{ color: theme.danger }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          ) : null}
          <span 
            className="text-sm font-semibold"
            style={{ color: trend > 0 ? theme.success : trend < 0 ? theme.danger : theme.textMuted }}
          >
            {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
          </span>
        </div>
      )}

      {/* Status indicator dot */}
      <div 
        className="absolute top-6 right-6 flex items-center gap-2"
      >
        <div 
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ 
            background: statusColor,
            boxShadow: `0 0 10px ${statusColor}`,
          }}
        />
        <span 
          className="text-xs font-semibold uppercase"
          style={{ color: statusColor }}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default DataCard;

