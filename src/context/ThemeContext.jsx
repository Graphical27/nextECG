import React, { createContext, useContext, useState, useEffect } from 'react';

// Matt Black Professional MedTech Theme
const theme = {
  name: 'Professional Black',
  // Core Colors - Matt Black Theme
  primary: '#000000',      // Pure black background
  secondary: '#0a0a0a',    // Slightly lighter black for cards
  accent: '#00ADB5',       // Teal accent (kept for medical context)
  light: '#FFFFFF',        // Pure white text
  
  // Matt surfaces (no transparency)
  glass: '#0a0a0a',        // Solid matt black
  glassBorder: '#1a1a1a',  // Subtle border
  glassHover: '#121212',   // Hover state
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#b0b0b0',
  textMuted: '#666666',
  
  // No glow effects - clean professional
  glowAccent: 'none',
  glowAccentStrong: 'none',
  glowSubtle: 'none',
  
  // Status colors (muted for professional look)
  success: '#00ff88',
  warning: '#ffb800',
  danger: '#ff4757',
  info: '#00ADB5',
  
  // ECG specific
  ecgLine: '#00ADB5',
  ecgGrid: 'rgba(255, 255, 255, 0.05)',
  
  // Clean shadows
  shadowSm: '0 2px 8px rgba(0, 0, 0, 0.8)',
  shadowMd: '0 4px 16px rgba(0, 0, 0, 0.9)',
  shadowLg: '0 8px 32px rgba(0, 0, 0, 1)',
};

// Legacy theme structure (kept minimal for compatibility)
const themes = {
  clinical: {
    name: 'Forest Green',
    bg: 'bg-green-50',
    bgSecondary: 'bg-green-100',
    text: 'text-green-900',
    name: 'Clinical Glass',
    ...theme,
  },
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Always use clinical theme
  const currentTheme = 'clinical';

  // Set body background on mount
  useEffect(() => {
    document.body.style.background = theme.primary;
    document.body.style.color = theme.textPrimary;
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
