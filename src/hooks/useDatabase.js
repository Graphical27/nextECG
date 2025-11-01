import { useState, useEffect, useCallback } from 'react';
import db from '../utils/database';

/**
 * Custom hook for NextECG Database operations
 */
export const useDatabase = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize database
  useEffect(() => {
    const initDB = async () => {
      try {
        await db.init();
        // Migrate from localStorage if needed
        await db.migrateFromLocalStorage();
        setIsReady(true);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err);
      }
    };

    initDB();
  }, []);

  return {
    db,
    isReady,
    error,
  };
};

/**
 * Hook for patient operations
 */
export const usePatientDB = (patientId) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPatient = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await db.getPatient(patientId);
      setPatient(data);
      setError(null);
    } catch (err) {
      console.error('Error loading patient:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const updatePatient = useCallback(async (updates) => {
    try {
      await db.updatePatient(patientId, updates);
      await loadPatient();
      return true;
    } catch (err) {
      console.error('Error updating patient:', err);
      setError(err);
      return false;
    }
  }, [patientId, loadPatient]);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  return {
    patient,
    loading,
    error,
    updatePatient,
    reload: loadPatient,
  };
};

/**
 * Hook for vitals history
 */
export const useVitalsHistoryDB = (patientId, limit = 100) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await db.getVitalsHistory(patientId, limit);
      setHistory(data);
      setError(null);
    } catch (err) {
      console.error('Error loading vitals history:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [patientId, limit]);

  const addReading = useCallback(async (vitalsData) => {
    try {
      await db.addVitalsReading({ ...vitalsData, patientId });
      await loadHistory();
      return true;
    } catch (err) {
      console.error('Error adding vitals reading:', err);
      setError(err);
      return false;
    }
  }, [patientId, loadHistory]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    loading,
    error,
    addReading,
    reload: loadHistory,
  };
};

/**
 * Hook for user settings
 */
export const useSettingsDB = (userId) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await db.getSettings(userId);
      setSettings(data || {
        appearance: { theme: 'dark', fontSize: 'medium', colorScheme: 'cyan', language: 'en' },
        notifications: {},
        privacy: {},
        medical: {},
      });
      setError(null);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveSettings = useCallback(async (newSettings) => {
    try {
      await db.saveSettings(userId, newSettings);
      await loadSettings();
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err);
      return false;
    }
  }, [userId, loadSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    saveSettings,
    reload: loadSettings,
  };
};

export default {
  useDatabase,
  usePatientDB,
  useVitalsHistoryDB,
  useSettingsDB,
};
