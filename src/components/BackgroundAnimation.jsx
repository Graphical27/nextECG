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
      {/* Animated Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 173, 181, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 173, 181, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridMove 20s linear infinite',
        }}
      />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: `rgba(0, 173, 181, ${0.2 + (i % 5) * 0.1})`,
            left: `${(i * 6.67) % 100}%`,
            top: `${(i * 7) % 100}%`,
            animation: `particleFloat ${8 + (i % 5)}s infinite ease-in-out`,
            animationDelay: `${i * 0.5}s`,
            boxShadow: `0 0 ${5 + i}px rgba(0, 173, 181, ${0.3 + (i % 3) * 0.2})`,
          }}
        />
      ))}

      {/* ECG Heartbeat Lines - Multiple Layers */}
      <svg
        className="absolute w-full h-full opacity-15"
        viewBox="0 0 1400 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Primary heartbeat line */}
        <path
          className="heartbeat-line"
          d={ecgPath}
          stroke={theme.accent}
          strokeWidth="1.5"
          fill="none"
          opacity="1"
          style={{
            filter: 'drop-shadow(0 0 3px rgba(0, 173, 181, 0.3))',
          }}
        />
        
        {/* Secondary heartbeat line - offset */}
        <path
          className="heartbeat-line"
          d={ecgPath}
          stroke={theme.accent}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
          style={{
            filter: 'drop-shadow(0 0 2px rgba(0, 173, 181, 0.2))',
            transform: 'translateY(100px)',
          }}
        />
      </svg>

      {/* Pulsing circles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`pulse-${i}`}
          className="absolute rounded-full border"
          style={{
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            borderColor: `rgba(0, 173, 181, ${0.1 - i * 0.02})`,
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
            animation: `pulseCircle ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      {/* CSS Animations */}
      <style>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }
        
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-50px) translateX(30px) scale(1.2);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-100px) translateX(-20px) scale(0.8);
            opacity: 0.8;
          }
          75% { 
            transform: translateY(-50px) translateX(15px) scale(1.1);
            opacity: 0.5;
          }
        }
        
        @keyframes pulseCircle {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.1;
          }
          50% { 
            transform: scale(1.3);
            opacity: 0.05;
          }
        }
      `}</style>
    </div>
  );
};

export default BackgroundAnimation;

