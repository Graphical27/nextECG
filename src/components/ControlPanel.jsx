import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const ControlPanel = () => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    autoRefresh: true,
    soundAlerts: false,
    dataExport: 'JSON',
    refreshRate: '250ms',
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="glass glass-hover depth-shadow rounded-full w-14 h-14 flex items-center justify-center scale-hover"
        style={{
          border: `1px solid ${theme.glassBorder}`,
        }}
      >
        <svg 
          className="w-6 h-6 transition-transform duration-300"
          style={{ 
            color: theme.accent,
            transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
      </button>

      {/* Control Panel */}
      {isExpanded && (
        <div 
          className="glass depth-shadow-lg rounded-xl p-6 mb-4 w-80 slide-in"
          style={{
            border: `1px solid ${theme.glassBorder}`,
          }}
        >
          {/* Top accent - solid */}
          <div 
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ 
              background: theme.accent,
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 
              className="font-orbitron font-bold text-lg"
              style={{ color: theme.textPrimary }}
            >
              Control Panel
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-opacity-20"
              style={{ color: theme.textMuted }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            {/* Auto Refresh */}
            <div className="flex items-center justify-between">
              <div>
                <div 
                  className="text-sm font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  Auto Refresh
                </div>
                <div 
                  className="text-xs"
                  style={{ color: theme.textMuted }}
                >
                  Automatic data updates
                </div>
              </div>
              <button
                onClick={() => toggleSetting('autoRefresh')}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{
                  background: settings.autoRefresh ? theme.accent : theme.glass,
                }}
              >
                <div 
                  className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{
                    transform: settings.autoRefresh ? 'translateX(26px)' : 'translateX(4px)',
                  }}
                />
              </button>
            </div>

            {/* Sound Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <div 
                  className="text-sm font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  Sound Alerts
                </div>
                <div 
                  className="text-xs"
                  style={{ color: theme.textMuted }}
                >
                  Audio notifications
                </div>
              </div>
              <button
                onClick={() => toggleSetting('soundAlerts')}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{
                  background: settings.soundAlerts ? theme.accent : theme.glass,
                }}
              >
                <div 
                  className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{
                    transform: settings.soundAlerts ? 'translateX(26px)' : 'translateX(4px)',
                  }}
                />
              </button>
            </div>

            {/* Divider */}
            <div 
              className="border-t my-4"
              style={{ borderColor: theme.glassBorder }}
            />

            {/* Refresh Rate */}
            <div>
              <div 
                className="text-sm font-semibold mb-2"
                style={{ color: theme.textPrimary }}
              >
                Refresh Rate
              </div>
              <select
                value={settings.refreshRate}
                onChange={(e) => setSettings({...settings, refreshRate: e.target.value})}
                className="w-full px-3 py-2 rounded-lg font-medium text-sm"
                style={{
                  background: theme.glass,
                  border: `1px solid ${theme.glassBorder}`,
                  color: theme.textPrimary,
                }}
              >
                <option value="100ms">100ms (Fast)</option>
                <option value="250ms">250ms (Normal)</option>
                <option value="500ms">500ms (Slow)</option>
                <option value="1000ms">1000ms (Very Slow)</option>
              </select>
            </div>

            {/* Data Export Format */}
            <div>
              <div 
                className="text-sm font-semibold mb-2"
                style={{ color: theme.textPrimary }}
              >
                Export Format
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['JSON', 'CSV', 'PDF'].map(format => (
                  <button
                    key={format}
                    onClick={() => setSettings({...settings, dataExport: format})}
                    className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: settings.dataExport === format ? theme.accent : theme.glass,
                      border: `1px solid ${settings.dataExport === format ? theme.accent : theme.glassBorder}`,
                      color: settings.dataExport === format ? theme.primary : theme.textPrimary,
                    }}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div 
              className="border-t my-4"
              style={{ borderColor: theme.glassBorder }}
            />

            {/* Quick Actions */}
            <div className="space-y-2">
              <button
                className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all scale-hover"
                style={{
                  background: theme.secondary,
                  border: `1px solid ${theme.glassBorder}`,
                  color: theme.accent,
                }}
              >
                📥 Export Data
              </button>
              <button
                className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all scale-hover"
                style={{
                  background: theme.secondary,
                  border: `1px solid ${theme.glassBorder}`,
                  color: theme.info,
                }}
              >
                📊 View Report
              </button>
              <button
                className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all scale-hover"
                style={{
                  background: theme.secondary,
                  border: `1px solid ${theme.glassBorder}`,
                  color: theme.warning,
                }}
              >
                🔔 Set Alerts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
