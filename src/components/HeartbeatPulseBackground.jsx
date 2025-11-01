import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * HeartbeatPulseBackground Component
 * 
 * A professional, medical-grade ECG heartbeat pulse line animation
 * rendered on HTML5 Canvas with optimized performance.
 * 
 * Features:
 * - Smooth ECG-style pulse waveform
 * - RGB(0, 255, 240) neon glow with gradient fading
 * - Continuous looping animation
 * - Fully responsive and performant
 * - Medical-grade visual aesthetics
 * 
 * @component
 */
const HeartbeatPulseBackground = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas dimensions with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();

    // ═══════════════════════════════════════════════════════════
    // ECG WAVEFORM GENERATION - Medical-Grade Pulse Pattern
    // ═══════════════════════════════════════════════════════════
    
    /**
     * Generates realistic ECG waveform coordinates
     * P-wave, QRS complex, T-wave morphology
     */
    const generateECGWaveform = (startX, amplitude, width) => {
      const points = [];
      const segments = 200; // Smooth curve resolution
      
      for (let i = 0; i <= segments; i++) {
        const x = startX + (i / segments) * width;
        const progress = i / segments;
        
        let y = height / 2; // Baseline
        
        // P-wave (0.0 - 0.15)
        if (progress < 0.15) {
          const pProgress = progress / 0.15;
          y -= amplitude * 0.15 * Math.sin(pProgress * Math.PI);
        }
        // PR segment (0.15 - 0.25)
        else if (progress < 0.25) {
          y -= 0;
        }
        // QRS complex (0.25 - 0.45) - Sharp peak
        else if (progress < 0.45) {
          const qrsProgress = (progress - 0.25) / 0.2;
          
          if (qrsProgress < 0.3) {
            // Q-wave (small downward)
            y += amplitude * 0.2 * (qrsProgress / 0.3);
          } else if (qrsProgress < 0.6) {
            // R-wave (sharp upward peak)
            const rProgress = (qrsProgress - 0.3) / 0.3;
            y -= amplitude * Math.sin(rProgress * Math.PI);
          } else {
            // S-wave (small downward)
            const sProgress = (qrsProgress - 0.6) / 0.4;
            y += amplitude * 0.3 * Math.sin(sProgress * Math.PI);
          }
        }
        // ST segment (0.45 - 0.55)
        else if (progress < 0.55) {
          y -= 0;
        }
        // T-wave (0.55 - 0.8)
        else if (progress < 0.8) {
          const tProgress = (progress - 0.55) / 0.25;
          y -= amplitude * 0.25 * Math.sin(tProgress * Math.PI);
        }
        // Return to baseline (0.8 - 1.0)
        else {
          y = height / 2;
        }
        
        points.push({ x, y });
      }
      
      return points;
    };

    // ═══════════════════════════════════════════════════════════
    // ANIMATION PARAMETERS - Fine-tuned for Professional Look
    // ═══════════════════════════════════════════════════════════
    
    const pulseWidth = width * 0.4; // Width of one ECG cycle
    const pulseAmplitude = 60; // Peak height in pixels
    const pulseSpeed = 2; // Pixels per frame
    const numberOfPulses = Math.ceil(width / pulseWidth) + 2;
    
    // RGB(0, 255, 240) - Professional Medical Cyan
    const accentColor = 'rgb(0, 255, 240)';
    
    // ═══════════════════════════════════════════════════════════
    // RENDERING ENGINE - Optimized Canvas Draw Loop
    // ═══════════════════════════════════════════════════════════
    
    const render = () => {
      // Clear canvas with fade effect for motion blur
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      // Update horizontal offset for scrolling effect
      offsetRef.current -= pulseSpeed;
      if (offsetRef.current < -pulseWidth) {
        offsetRef.current = 0;
      }
      
      // Draw multiple ECG pulses across the screen
      for (let i = 0; i < numberOfPulses; i++) {
        const pulseX = offsetRef.current + i * pulseWidth;
        const waveform = generateECGWaveform(pulseX, pulseAmplitude, pulseWidth);
        
        // ═══════════════════════════════════════════════════════════
        // GRADIENT OPACITY CALCULATION
        // Decreasing from left, increasing from right
        // ═══════════════════════════════════════════════════════════
        
        const pulseCenter = pulseX + pulseWidth / 2;
        const distanceFromCenter = Math.abs(pulseCenter - width / 2);
        const maxDistance = width / 2;
        
        // Fade based on distance from screen center
        const baseOpacity = 1 - (distanceFromCenter / maxDistance) * 0.7;
        const opacity = Math.max(0.2, Math.min(1, baseOpacity));
        
        // ═══════════════════════════════════════════════════════════
        // NEON GLOW RENDERING - Multi-layer Shadow for Depth
        // ═══════════════════════════════════════════════════════════
        
        ctx.save();
        
        // Outer glow (subtle)
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(0, 255, 240, ${opacity * 0.6})`;
        ctx.strokeStyle = `rgba(0, 255, 240, ${opacity * 0.3})`;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        waveform.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        
        // Core line (bright)
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(0, 255, 240, ${opacity})`;
        ctx.strokeStyle = `rgba(0, 255, 240, ${opacity})`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        waveform.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        
        // Inner glow (sharp highlight)
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.strokeStyle = `rgba(0, 255, 240, ${opacity})`;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        waveform.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        
        ctx.restore();
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(render);
    };

    // Start animation
    render();

    // ═══════════════════════════════════════════════════════════
    // RESPONSIVE RESIZE HANDLER
    // ═══════════════════════════════════════════════════════════
    
    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="heartbeat-pulse-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.15, // Subtle background presence
      }}
    />
  );
};

export default HeartbeatPulseBackground;
