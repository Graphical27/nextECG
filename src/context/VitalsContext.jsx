import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const VitalsContext = createContext();

export const useVitals = () => {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error('useVitals must be used within a VitalsProvider');
  }
  return context;
};

export const VitalsProvider = ({ children }) => {
  const [vitals, setVitals] = useState({
    heartRate: 0,
    spo2: 0,
    respirationRate: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    temperature: 0,
    ecgQuality: 0,
    leadsOff: false,
  });

  const [patientInfo, setPatientInfo] = useState({
    name: 'Patient',
    id: 'PT-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000),
    age: 0,
    gender: 'Unknown',
    bloodType: 'Unknown',
    lastCheckup: new Date().toISOString().split('T')[0],
  });

  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [history, setHistory] = useState({
    timestamps: [],
    heartRateHistory: [],
    spo2History: [],
    bpSystolicHistory: [],
    bpDiastolicHistory: [],
  });

  const wsRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('VitalsContext: Connected to Arduino Nano');
      setConnectionStatus('Connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'vitals') {
          const newVitals = message.data;
          setVitals(newVitals);

          // Update history (keep last 24 hours, sample every minute)
          setHistory(prev => {
            const now = new Date();
            const timestamps = [...prev.timestamps, now];
            const heartRateHistory = [...prev.heartRateHistory, newVitals.heartRate];
            const spo2History = [...prev.spo2History, newVitals.spo2];
            const bpSystolicHistory = [...prev.bpSystolicHistory, newVitals.bloodPressure.systolic];
            const bpDiastolicHistory = [...prev.bpDiastolicHistory, newVitals.bloodPressure.diastolic];

            // Keep only last 100 readings (to prevent memory issues)
            const maxHistory = 100;
            if (timestamps.length > maxHistory) {
              timestamps.shift();
              heartRateHistory.shift();
              spo2History.shift();
              bpSystolicHistory.shift();
              bpDiastolicHistory.shift();
            }

            return {
              timestamps,
              heartRateHistory,
              spo2History,
              bpSystolicHistory,
              bpDiastolicHistory,
            };
          });
        }
      } catch (error) {
        console.error('VitalsContext: Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('VitalsContext: WebSocket error:', error);
      setConnectionStatus('Error');
    };

    ws.onclose = () => {
      console.log('VitalsContext: Disconnected from server');
      setConnectionStatus('Disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const value = {
    vitals,
    patientInfo,
    setPatientInfo,
    connectionStatus,
    history,
  };

  return (
    <VitalsContext.Provider value={value}>
      {children}
    </VitalsContext.Provider>
  );
};
