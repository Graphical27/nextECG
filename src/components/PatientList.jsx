import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const PatientList = ({ limit, onPatientSelect }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);

  // Mock patient data
  useEffect(() => {
    const mockPatients = [
      { id: 'PAT001', name: 'John Doe', age: 45, gender: 'Male', status: 'monitoring', heartRate: 72, lastVisit: '2024-01-15' },
      { id: 'PAT002', name: 'Jane Smith', age: 38, gender: 'Female', status: 'stable', heartRate: 68, lastVisit: '2024-01-14' },
      { id: 'PAT003', name: 'Michael Johnson', age: 52, gender: 'Male', status: 'monitoring', heartRate: 85, lastVisit: '2024-01-15' },
      { id: 'PAT004', name: 'Sarah Williams', age: 34, gender: 'Female', status: 'stable', heartRate: 70, lastVisit: '2024-01-13' },
      { id: 'PAT005', name: 'Robert Brown', age: 61, gender: 'Male', status: 'alert', heartRate: 95, lastVisit: '2024-01-16' },
      { id: 'PAT006', name: 'Emily Davis', age: 29, gender: 'Female', status: 'stable', heartRate: 66, lastVisit: '2024-01-12' },
      { id: 'PAT007', name: 'David Wilson', age: 48, gender: 'Male', status: 'monitoring', heartRate: 78, lastVisit: '2024-01-15' },
      { id: 'PAT008', name: 'Lisa Anderson', age: 41, gender: 'Female', status: 'stable', heartRate: 72, lastVisit: '2024-01-14' },
    ];
    setPatients(mockPatients);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, limit || patients.length);

  const getStatusColor = (status) => {
    switch (status) {
      case 'alert': return theme.danger;
      case 'monitoring': return theme.warning;
      case 'stable': return theme.success;
      default: return theme.textMuted;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'alert': return `${theme.danger}20`;
      case 'monitoring': return `${theme.warning}20`;
      case 'stable': return `${theme.success}20`;
      default: return theme.secondary;
    }
  };

  return (
    <div>
      {/* Search Bar */}
      {!limit && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              background: theme.secondary,
              border: `1px solid ${theme.glassBorder}`,
              color: theme.textPrimary,
              focusRingColor: theme.accent,
            }}
          />
        </div>
      )}

      {/* Patient List */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8" style={{ color: theme.textMuted }}>
            <p>No patients found</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => onPatientSelect && onPatientSelect(patient)}
              className="glass glass-hover rounded-lg p-4 w-full text-left transition-all relative overflow-hidden"
              style={{
                border: `1px solid ${theme.glassBorder}`,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                    style={{
                      background: theme.secondary,
                      border: `1px solid ${theme.accent}`,
                      color: theme.accent,
                    }}
                  >
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 
                        className="font-semibold"
                        style={{ color: theme.textPrimary }}
                      >
                        {patient.name}
                      </h4>
                      <span 
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          background: getStatusBg(patient.status),
                          color: getStatusColor(patient.status),
                          border: `1px solid ${getStatusColor(patient.status)}40`,
                        }}
                      >
                        {patient.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: theme.textMuted }}>
                      <span>ID: {patient.id}</span>
                      <span>Age: {patient.age}</span>
                      <span>{patient.gender}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div 
                      className="text-sm font-semibold mb-1"
                      style={{ color: theme.textPrimary }}
                    >
                      {patient.heartRate} BPM
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: theme.textMuted }}
                    >
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <svg 
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: theme.textMuted }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientList;

