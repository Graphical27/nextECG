import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useVitals } from '../context/VitalsContext';

const PatientInfo = () => {
  const { theme } = useTheme();
  const { patientInfo, setPatientInfo } = useVitals();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (field, value) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="glass glass-hover depth-shadow rounded-xl p-6 relative overflow-hidden slide-in scale-hover">
      {/* Top accent line - solid */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ 
          background: theme.accent,
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: theme.secondary,
            border: `1px solid ${theme.glassBorder}`,
          }}
        >
          <svg 
            className="w-6 h-6" 
            style={{ color: theme.accent }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        </div>
        <div>
          <h3 
            className="font-orbitron font-bold text-lg"
            style={{ color: theme.textPrimary }}
          >
            Patient Information
          </h3>
          <p 
            className="text-xs font-medium"
            style={{ color: theme.textMuted }}
          >
            Current patient profile
          </p>
        </div>
      </div>

      {/* Patient Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div 
              className="text-xs font-medium mb-1"
              style={{ color: theme.textMuted }}
            >
              Name
            </div>
            <div 
              className="font-semibold"
              style={{ color: theme.textPrimary }}
            >
              {patientInfo.name}
            </div>
          </div>
          <div>
            <div 
              className="text-xs font-medium mb-1"
              style={{ color: theme.textMuted }}
            >
              Patient ID
            </div>
            <div 
              className="font-orbitron font-semibold text-sm"
              style={{ color: theme.accent }}
            >
              {patientInfo.id}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div 
              className="text-xs font-medium mb-1"
              style={{ color: theme.textMuted }}
            >
              Age
            </div>
            <div 
              className="font-semibold"
              style={{ color: theme.textPrimary }}
            >
              {patientInfo.age > 0 ? `${patientInfo.age} years` : 'Not set'}
            </div>
          </div>
          <div>
            <div 
              className="text-xs font-medium mb-1"
              style={{ color: theme.textMuted }}
            >
              Gender
            </div>
            <div 
              className="font-semibold"
              style={{ color: theme.textPrimary }}
            >
              {patientInfo.gender}
            </div>
          </div>
          <div>
            <div 
              className="text-xs font-medium mb-1"
              style={{ color: theme.textMuted }}
            >
              Blood Type
            </div>
            <div 
              className="font-semibold"
              style={{ color: theme.textPrimary }}
            >
              {patientInfo.bloodType}
            </div>
          </div>
        </div>

        <div 
          className="pt-4 mt-4"
          style={{ borderTop: `1px solid ${theme.glassBorder}` }}
        >
          <div 
            className="text-xs font-medium mb-1"
            style={{ color: theme.textMuted }}
          >
            Last Checkup
          </div>
          <div 
            className="font-semibold"
            style={{ color: theme.textPrimary }}
          >
            {new Date(patientInfo.lastCheckup).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
