import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingScreen = ({ onComplete }) => {
  const { theme } = useTheme();
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const startTime = Date.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function updateProgress() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const newCount = Math.floor(easedProgress * 100);

      setCount(newCount);

      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setCount(100);
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 500);
        }, 300);
      }
    }

    updateProgress();
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: '#0d0d0d' }}
    >
      {/* Silver dust particles background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(192, 192, 192, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 60% 70%, rgba(192, 192, 192, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 80% 10%, rgba(192, 192, 192, 0.02) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(192, 192, 192, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 10% 60%, rgba(192, 192, 192, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px, 300px 300px, 250px 250px, 180px 180px, 220px 220px',
          backgroundPosition: '0 0, 50px 50px, 100px 100px, 150px 150px, 200px 200px',
          animation: 'dustShift 20s ease-in-out infinite',
        }}
      />
      
      {/* Additional dust layer */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 50%, rgba(192, 192, 192, 0.02) 2px, transparent 2px),
            radial-gradient(circle at 70% 40%, rgba(192, 192, 192, 0.02) 2px, transparent 2px),
            radial-gradient(circle at 50% 90%, rgba(192, 192, 192, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '400px 400px, 350px 350px, 280px 280px',
          backgroundPosition: '0 0, 100px 50px, 200px 100px',
          animation: 'dustShift 25s ease-in-out infinite reverse',
        }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full"
          style={{
            background: 'rgba(192, 192, 192, 0.3)',
            boxShadow: '0 0 3px rgba(192, 192, 192, 0.5)',
            left: `${10 + i * 10}%`,
            top: `${20 + i * 7}%`,
            animation: `float 8s infinite ease-in-out`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      <div className={`relative z-10 text-center transition-opacity duration-500 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
        {/* Logo */}
        <div 
          className="text-5xl md:text-6xl font-normal mb-2 flex items-center justify-center gap-1"
          style={{ 
            color: '#c0c0c0',
            letterSpacing: '0.15em',
            textShadow: '0 0 30px rgba(192, 192, 192, 0.2)',
            fontFamily: 'Orbitron, sans-serif'
          }}
        >
          <span style={{ color: '#a8a8a8', fontFamily: 'Orbitron, sans-serif' }}>NEXT</span>
          <span 
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #c0c0c0 0%, #808080 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ecg
          </span>
        </div>

        <div 
          className="text-xs md:text-sm mb-8"
          style={{ 
            color: '#505050',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontWeight: 300,
          }}
        >
          Advanced Cardiac Monitoring
        </div>

        {/* ECG Monitor Box */}
        <div 
          className="w-full max-w-md md:max-w-lg mx-auto mb-8 relative"
          style={{
            background: 'rgba(20, 20, 20, 0.8)',
            border: '1px solid rgba(192, 192, 192, 0.15)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(192, 192, 192, 0.05)',
          }}
        >
          {/* Grid */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              backgroundImage: `
                linear-gradient(rgba(192, 192, 192, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(192, 192, 192, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Pulse dot */}
          <div 
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: '#c0c0c0',
              top: '20px',
              left: '20px',
              boxShadow: '0 0 20px rgba(192, 192, 192, 0.6)',
              animation: 'pulse 1.2s ease-in-out infinite',
            }}
          />

          {/* Heart Rate Display */}
          <div 
            className="absolute top-4 right-5 text-right"
            style={{ color: '#c0c0c0' }}
          >
            <div 
              className="text-2xl md:text-3xl font-bold"
              style={{
                textShadow: '0 0 20px rgba(192, 192, 192, 0.3)',
                fontFamily: 'Orbitron, monospace',
              }}
            >
              {count}
            </div>
            <div 
              className="text-xs"
              style={{ 
                color: '#606060',
                letterSpacing: '0.1em',
                marginTop: '-5px',
              }}
            >
              LOADING
            </div>
          </div>

          {/* ECG Line */}
          <svg 
            viewBox="0 0 460 140" 
            preserveAspectRatio="none"
            className="w-full h-32 mt-8"
          >
            <path
              d="M0,70 L100,70 L110,70 L115,40 L120,100 L125,70 L130,65 L135,75 L140,70 L460,70"
              stroke="#c0c0c0"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="460"
              strokeDashoffset="460"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(192, 192, 192, 0.4))',
                animation: 'ecgFlow 3s linear infinite',
              }}
            />
          </svg>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes dustShift {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 1;
          }
          50% { 
            transform: translate(30px, -30px);
            opacity: 0.8;
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% { 
            transform: translateY(-100px) translateX(50px);
            opacity: 1;
          }
        }
        
        @keyframes ecgFlow {
          0% {
            stroke-dashoffset: 460;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;

