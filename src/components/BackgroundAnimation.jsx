import React from 'react';
import { useTheme } from '../context/ThemeContext';

const BackgroundAnimation = () => {
  const { theme } = useTheme();

  // ECG waveform path with realistic cardiac pattern
  const ecgPath = `
    M 0 400 
    L 150 400 
    L 160 405 
    L 170 395 
    L 180 420 
    L 190 350 
    L 200 400 
    L 210 410 
    L 230 390 
    L 250 400 
    L 450 400 
    L 460 405 
    L 470 395 
    L 480 420 
    L 490 350 
    L 500 400 
    L 510 410 
    L 530 390 
    L 550 400 
    L 750 400 
    L 760 405 
    L 770 395 
    L 780 420 
    L 790 350 
    L 800 400 
    L 810 410 
    L 830 390 
    L 850 400 
    L 1050 400
    L 1060 405 
    L 1070 395 
    L 1080 420 
    L 1090 350 
    L 1100 400 
    L 1110 410 
    L 1130 390 
    L 1150 400
    L 1400 400
  `;

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: theme.primary }}
    >
      {/* Subtle grid overlay only - no gradients */}
      <div 
        className="absolute inset-0 opacity-10 grid-pattern"
      />
      
      {/* Single clean heartbeat line */}
      <svg
        className="absolute w-full h-full opacity-15"
        viewBox="0 0 1400 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Primary heartbeat line - clean, no glow */}
        <path
          className="heartbeat-line"
          d={ecgPath}
          stroke={theme.accent}
          strokeWidth="1.5"
          fill="none"
          opacity="1"
        />
      </svg>
    </div>
  );
};

export default BackgroundAnimation;

