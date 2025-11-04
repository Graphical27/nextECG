import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import BackgroundAnimation from './BackgroundAnimation';

const SixLeadECG = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const borderColor = theme?.glassBorder || 'rgba(255, 255, 255, 0.15)';
  const backgroundColor = theme?.secondary || 'rgba(8, 14, 20, 0.85)';
  const accentColor = theme?.accent || '#00ADB5';
  const textColor = theme?.textPrimary || '#FFFFFF';

  return (
    <div className="relative min-h-screen">
      <BackgroundAnimation />

      <iframe
        title="NextECG 6-Lead Monitor"
        src="/6leads/index.html"
        allow="serial; clipboard-read; clipboard-write"
        className="absolute inset-0 w-full h-full"
        style={{ border: 'none', zIndex: 10, background: backgroundColor }}
      />

      <div className="absolute top-6 left-6 z-20 flex flex-col gap-4">
        <button
          onClick={() => navigate('/patient')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-80"
          style={{
            color: accentColor,
            border: `1px solid ${accentColor}40`,
            background: `${backgroundColor}CC`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 px-4 py-2 rounded-full text-sm"
        style={{
          color: textColor,
          background: `${backgroundColor}CC`,
          border: `1px solid ${borderColor}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        The 6-lead monitor now fills the whole viewport. Use Chrome or Edge to enable Web Serial features.
      </div>
    </div>
  );
};

export default SixLeadECG;
