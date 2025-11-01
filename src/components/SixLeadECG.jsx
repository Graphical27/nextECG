import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import BackgroundAnimation from './BackgroundAnimation';

const SixLeadECG = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // ECG data for each lead
  const [leadData, setLeadData] = useState({
    leadI: [],
    leadII: [],
    leadIII: [],
    aVR: [],
    aVL: [],
    aVF: [],
  });

  // Generate simulated ECG data
  useEffect(() => {
    const generateECGData = (leadType) => {
      const data = [];
      const points = 500;
      
      // Different amplitude and patterns for each lead
      const amplitudes = {
        leadI: 1.0,
        leadII: 1.2,
        leadIII: 0.8,
        aVR: -0.9,
        aVL: 0.7,
        aVF: 1.1,
      };
      
      const amplitude = amplitudes[leadType] || 1.0;
      
      for (let i = 0; i < points; i++) {
        const x = i;
        let y = 0;
        
        // Generate realistic ECG pattern
        const beatCycle = i % 100;
        
        if (beatCycle < 5) {
          // P wave
          y = amplitude * 0.2 * Math.sin((beatCycle / 5) * Math.PI);
        } else if (beatCycle >= 15 && beatCycle < 20) {
          // Q wave (small dip)
          y = amplitude * -0.15;
        } else if (beatCycle >= 20 && beatCycle < 25) {
          // R wave (sharp peak)
          y = amplitude * 1.5 * Math.sin(((beatCycle - 20) / 5) * Math.PI);
        } else if (beatCycle >= 25 && beatCycle < 30) {
          // S wave (dip)
          y = amplitude * -0.3;
        } else if (beatCycle >= 40 && beatCycle < 55) {
          // T wave
          y = amplitude * 0.3 * Math.sin(((beatCycle - 40) / 15) * Math.PI);
        }
        
        // Add slight noise for realism
        y += (Math.random() - 0.5) * 0.05;
        
        data.push({ x, y });
      }
      
      return data;
    };

    // Generate data for all leads
    setLeadData({
      leadI: generateECGData('leadI'),
      leadII: generateECGData('leadII'),
      leadIII: generateECGData('leadIII'),
      aVR: generateECGData('aVR'),
      aVL: generateECGData('aVL'),
      aVF: generateECGData('aVF'),
    });

    // Update data periodically
    const interval = setInterval(() => {
      setLeadData({
        leadI: generateECGData('leadI'),
        leadII: generateECGData('leadII'),
        leadIII: generateECGData('leadIII'),
        aVR: generateECGData('aVR'),
        aVL: generateECGData('aVL'),
        aVF: generateECGData('aVF'),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ECG Lead Component
  const ECGLead = ({ title, data, color }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !data.length) return;

      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = theme.secondary;
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = theme.glassBorder;
      ctx.lineWidth = 0.5;
      
      // Vertical lines
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw ECG waveform
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const scaleX = width / data.length;
      const scaleY = height / 4;
      const centerY = height / 2;

      data.forEach((point, index) => {
        const x = point.x * scaleX;
        const y = centerY - point.y * scaleY;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.stroke();

    }, [data, theme, color]);

    return (
      <div className="glass rounded-xl p-4 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: color }}
        />
        
        <div className="flex items-center justify-between mb-3">
          <h3 
            className="font-orbitron font-bold text-lg"
            style={{ color: theme.textPrimary }}
          >
            {title}
          </h3>
          <div 
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${color}20`,
              color: color,
              border: `1px solid ${color}40`,
            }}
          >
            Live
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={150}
          className="w-full rounded-lg"
          style={{
            background: theme.secondary,
            border: `1px solid ${theme.glassBorder}`,
          }}
        />

        <div className="mt-2 text-xs" style={{ color: theme.textMuted }}>
          <span>Scale: 10mm/mV • Speed: 25mm/s</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <BackgroundAnimation />
      
      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/patient')}
                className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-all hover:opacity-80"
                style={{
                  color: theme.accent,
                  border: `1px solid ${theme.accent}40`,
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              
              <h1 
                className="font-orbitron font-bold text-3xl md:text-4xl"
                style={{ color: theme.textPrimary }}
              >
                6-Lead ECG Monitor
              </h1>
              <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
                Real-time 6-lead electrocardiogram monitoring
              </p>
            </div>

            <div 
              className="glass px-4 py-3 rounded-xl"
              style={{ border: `1px solid ${theme.glassBorder}` }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ background: theme.success }}
                />
                <span className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                  Recording
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Lead Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Limb Leads */}
            <div className="space-y-6">
              <div 
                className="glass p-4 rounded-xl"
                style={{ border: `2px solid ${theme.accent}40` }}
              >
                <h2 
                  className="font-orbitron font-bold text-xl mb-4 flex items-center gap-2"
                  style={{ color: theme.accent }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Standard Limb Leads
                </h2>
                <div className="space-y-4">
                  <ECGLead title="Lead I" data={leadData.leadI} color="#00ADB5" />
                  <ECGLead title="Lead II" data={leadData.leadII} color="#FF6B6B" />
                  <ECGLead title="Lead III" data={leadData.leadIII} color="#4ECDC4" />
                </div>
              </div>
            </div>

            {/* Right Column - Augmented Leads */}
            <div className="space-y-6">
              <div 
                className="glass p-4 rounded-xl"
                style={{ border: `2px solid ${theme.accent}40` }}
              >
                <h2 
                  className="font-orbitron font-bold text-xl mb-4 flex items-center gap-2"
                  style={{ color: theme.accent }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                  Augmented Limb Leads
                </h2>
                <div className="space-y-4">
                  <ECGLead title="aVR" data={leadData.aVR} color="#9333EA" />
                  <ECGLead title="aVL" data={leadData.aVL} color="#10B981" />
                  <ECGLead title="aVF" data={leadData.aVF} color="#F59E0B" />
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="mt-6 glass rounded-xl p-6">
            <h3 
              className="font-orbitron font-bold text-lg mb-4"
              style={{ color: theme.textPrimary }}
            >
              Lead Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: theme.accent }}>
                  Standard Limb Leads
                </h4>
                <ul className="space-y-1 text-sm" style={{ color: theme.textMuted }}>
                  <li>• <strong style={{ color: '#00ADB5' }}>Lead I</strong>: Right arm to left arm</li>
                  <li>• <strong style={{ color: '#FF6B6B' }}>Lead II</strong>: Right arm to left leg</li>
                  <li>• <strong style={{ color: '#4ECDC4' }}>Lead III</strong>: Left arm to left leg</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: theme.accent }}>
                  Augmented Limb Leads
                </h4>
                <ul className="space-y-1 text-sm" style={{ color: theme.textMuted }}>
                  <li>• <strong style={{ color: '#9333EA' }}>aVR</strong>: Augmented vector right</li>
                  <li>• <strong style={{ color: '#10B981' }}>aVL</strong>: Augmented vector left</li>
                  <li>• <strong style={{ color: '#F59E0B' }}>aVF</strong>: Augmented vector foot</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SixLeadECG;
