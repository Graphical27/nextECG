import React, { createContext, useContext, useState, useEffect } from 'react';

// Color schemes - Professional Medical
const colorSchemes = {
  cyan: '#00ADB5',
  blue: '#0EA5E9',
  green: '#10B981'
};

// Font size presets
const fontSizes = {
  small: { base: '14px', scale: 0.875 },
  medium: { base: '16px', scale: 1 },
  large: { base: '18px', scale: 1.125 }
};

// Generate theme based on settings
const generateTheme = (settings = {}) => {
  const { theme: themeName = 'dark', colorScheme = 'cyan', fontSize = 'medium' } = settings;
  const accentColor = colorSchemes[colorScheme] || colorSchemes.cyan;
  const isDark = themeName === 'dark';
  const isSilver = themeName === 'silver';
  
  return {
    name: isDark ? 'Professional Dark' : isSilver ? 'Signature Silver' : 'Professional Dark',
    // Core Colors - Eye-Pleasing Gradient Theme
    primary: '#F0F4F8', // Soft blue-gray background
    secondary: '#E6EEF5', // Light blue-gray
    accent: '#667EEA', // Beautiful indigo
    light: '#FFFFFF', // Pure white
    
    // Glass surfaces - Clean with subtle tint
    glass: 'rgba(255, 255, 255, 0.9)', // White glass
    glassBorder: 'rgba(102, 126, 234, 0.12)', // Soft indigo border
    glassHover: 'rgba(255, 255, 255, 1)',
    
    // Text colors - Easy on eyes
    textPrimary: '#2D3748', // Soft dark gray
    textSecondary: '#667EEA', // Beautiful indigo
    textMuted: '#718096', // Medium gray
    
    // Subtle glow effects
    glowAccent: '0 0 20px rgba(102, 126, 234, 0.15)',
    glowAccentStrong: '0 0 30px rgba(102, 126, 234, 0.25)',
    glowSubtle: '0 2px 15px rgba(102, 126, 234, 0.08)',
    
    // Status colors - Beautiful palette
    success: '#48BB78', // Fresh green
    warning: '#ED8936', // Warm orange
    danger: '#F56565', // Soft red
    info: '#667EEA', // Beautiful indigo
    
    // ECG specific
    ecgLine: '#667EEA', // Beautiful indigo
    ecgGrid: 'rgba(102, 126, 234, 0.06)',
    
    // Shadows - Soft and natural
    shadowSm: '0 2px 8px rgba(0, 0, 0, 0.06)',
    shadowMd: '0 4px 16px rgba(0, 0, 0, 0.08)',
    shadowLg: '0 8px 32px rgba(0, 0, 0, 0.1)',
    
    // Font settings
    fontSize: fontSizes[fontSize],
  };
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
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    fontSize: 'medium',
    colorScheme: 'cyan',
    language: 'en'
  });

  // Load appearance settings from localStorage
  useEffect(() => {
    try {
      const savedAppearance = localStorage.getItem('nextECG_appearance');
      if (savedAppearance) {
        const parsed = JSON.parse(savedAppearance);
        // Ensure all required properties exist
        setAppearanceSettings({
          theme: parsed.theme || 'dark',
          fontSize: parsed.fontSize || 'medium',
          colorScheme: parsed.colorScheme || 'cyan',
          language: parsed.language || 'en'
        });
      }
    } catch (error) {
      console.error('Error loading appearance settings:', error);
      // Use defaults if error
      setAppearanceSettings({
        theme: 'dark',
        fontSize: 'medium',
        colorScheme: 'cyan',
        language: 'en'
      });
    }
  }, []);

  const theme = generateTheme(appearanceSettings);

  // Apply to body and root HTML element
  useEffect(() => {
    try {
      document.body.style.background = theme.primary;
      document.body.style.color = theme.textPrimary;
      document.documentElement.style.fontSize = theme.fontSize.base;
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        appearanceSettings,
        setAppearanceSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
