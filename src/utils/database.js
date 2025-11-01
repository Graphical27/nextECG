/**
 * NextECG Local Database
 * Using IndexedDB for structured local storage
 */

const DB_NAME = 'NextECG_DB';
const DB_VERSION = 1;

// Store names
const STORES = {
  USERS: 'users',
  PATIENTS: 'patients',
  VITALS_HISTORY: 'vitals_history',
  SETTINGS: 'settings',
  SESSIONS: 'sessions',
  MEDICAL_RECORDS: 'medical_records',
};

class NextECGDatabase {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize the database
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Database failed to open:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Users store (doctors and patients login info)
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          const userStore = db.createObjectStore(STORES.USERS, { 
            keyPath: 'id', 
            autoIncrement: false 
          });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('type', 'type', { unique: false });
          console.log('Created users store');
        }

        // Patients store (detailed patient information)
        if (!db.objectStoreNames.contains(STORES.PATIENTS)) {
          const patientStore = db.createObjectStore(STORES.PATIENTS, { 
            keyPath: 'id', 
            autoIncrement: false 
          });
          patientStore.createIndex('email', 'email', { unique: true });
          patientStore.createIndex('userId', 'userId', { unique: false });
          console.log('Created patients store');
        }

        // Vitals history store
        if (!db.objectStoreNames.contains(STORES.VITALS_HISTORY)) {
          const vitalsStore = db.createObjectStore(STORES.VITALS_HISTORY, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          vitalsStore.createIndex('patientId', 'patientId', { unique: false });
          vitalsStore.createIndex('timestamp', 'timestamp', { unique: false });
          vitalsStore.createIndex('date', 'date', { unique: false });
          console.log('Created vitals_history store');
        }

        // Settings store
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          const settingsStore = db.createObjectStore(STORES.SETTINGS, { 
            keyPath: 'userId' 
          });
          console.log('Created settings store');
        }

        // Sessions store (active login sessions)
        if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
          const sessionStore = db.createObjectStore(STORES.SESSIONS, { 
            keyPath: 'userId' 
          });
          sessionStore.createIndex('lastActivity', 'lastActivity', { unique: false });
          console.log('Created sessions store');
        }

        // Medical records store
        if (!db.objectStoreNames.contains(STORES.MEDICAL_RECORDS)) {
          const medicalStore = db.createObjectStore(STORES.MEDICAL_RECORDS, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          medicalStore.createIndex('patientId', 'patientId', { unique: false });
          medicalStore.createIndex('date', 'date', { unique: false });
          console.log('Created medical_records store');
        }
      };
    });
  }

  /**
   * Generic add/update operation
   */
  async put(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic get operation
   */
  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic get all operation
   */
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic delete operation
   */
  async delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get by index
   */
  async getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.get(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all by index
   */
  async getAllByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data from a store
   */
  async clear(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== USER OPERATIONS ====================

  /**
   * Create a new user (patient or doctor)
   */
  async createUser(userData) {
    const user = {
      id: userData.id || this.generateId('user'),
      email: userData.email,
      password: userData.password, // In production, this should be hashed
      type: userData.type, // 'patient' or 'doctor'
      name: userData.name,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      ...userData,
    };
    return await this.put(STORES.USERS, user);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    return await this.getByIndex(STORES.USERS, 'email', email);
  }

  /**
   * Get user by ID
   */
  async getUser(userId) {
    return await this.get(STORES.USERS, userId);
  }

  /**
   * Update user
   */
  async updateUser(userId, updates) {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
    return await this.put(STORES.USERS, updatedUser);
  }

  /**
   * Authenticate user
   */
  async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    if (user.password === password) {
      // Update last login
      await this.updateUser(user.id, { lastLogin: new Date().toISOString() });
      return user;
    }
    return null;
  }

  // ==================== PATIENT OPERATIONS ====================

  /**
   * Create patient profile
   */
  async createPatient(patientData) {
    const patient = {
      id: patientData.id || this.generateId('patient'),
      userId: patientData.userId,
      email: patientData.email,
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      bloodType: patientData.bloodType || 'Unknown',
      allergies: patientData.allergies || '',
      conditions: patientData.conditions || '',
      emergencyContact: patientData.emergencyContact || '',
      emergencyPhone: patientData.emergencyPhone || '',
      doctorName: patientData.doctorName || '',
      doctorPhone: patientData.doctorPhone || '',
      createdAt: new Date().toISOString(),
      lastCheckup: patientData.lastCheckup || new Date().toISOString(),
      ...patientData,
    };
    return await this.put(STORES.PATIENTS, patient);
  }

  /**
   * Get patient by ID
   */
  async getPatient(patientId) {
    return await this.get(STORES.PATIENTS, patientId);
  }

  /**
   * Get patient by user ID
   */
  async getPatientByUserId(userId) {
    return await this.getByIndex(STORES.PATIENTS, 'userId', userId);
  }

  /**
   * Update patient
   */
  async updatePatient(patientId, updates) {
    const patient = await this.getPatient(patientId);
    if (!patient) throw new Error('Patient not found');
    
    const updatedPatient = { ...patient, ...updates, updatedAt: new Date().toISOString() };
    return await this.put(STORES.PATIENTS, updatedPatient);
  }

  /**
   * Get all patients
   */
  async getAllPatients() {
    return await this.getAll(STORES.PATIENTS);
  }

  // ==================== VITALS HISTORY OPERATIONS ====================

  /**
   * Add vitals reading
   */
  async addVitalsReading(vitalsData) {
    const reading = {
      patientId: vitalsData.patientId,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      heartRate: vitalsData.heartRate,
      spo2: vitalsData.spo2,
      respirationRate: vitalsData.respirationRate,
      bloodPressure: vitalsData.bloodPressure,
      temperature: vitalsData.temperature,
      ecgQuality: vitalsData.ecgQuality,
      ...vitalsData,
    };
    return await this.put(STORES.VITALS_HISTORY, reading);
  }

  /**
   * Get vitals history for patient
   */
  async getVitalsHistory(patientId, limit = 100) {
    const allReadings = await this.getAllByIndex(STORES.VITALS_HISTORY, 'patientId', patientId);
    // Sort by timestamp descending and limit
    return allReadings
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Get vitals history by date range
   */
  async getVitalsHistoryByDateRange(patientId, startDate, endDate) {
    const allReadings = await this.getAllByIndex(STORES.VITALS_HISTORY, 'patientId', patientId);
    return allReadings.filter(reading => {
      const readingDate = new Date(reading.timestamp);
      return readingDate >= new Date(startDate) && readingDate <= new Date(endDate);
    });
  }

  // ==================== SETTINGS OPERATIONS ====================

  /**
   * Save user settings
   */
  async saveSettings(userId, settings) {
    const settingsData = {
      userId,
      appearance: settings.appearance || {},
      notifications: settings.notifications || {},
      privacy: settings.privacy || {},
      medical: settings.medical || {},
      updatedAt: new Date().toISOString(),
    };
    return await this.put(STORES.SETTINGS, settingsData);
  }

  /**
   * Get user settings
   */
  async getSettings(userId) {
    return await this.get(STORES.SETTINGS, userId);
  }

  // ==================== SESSION OPERATIONS ====================

  /**
   * Create session
   */
  async createSession(userId, userData) {
    const session = {
      userId,
      user: userData,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true,
    };
    return await this.put(STORES.SESSIONS, session);
  }

  /**
   * Get active session
   */
  async getSession(userId) {
    return await this.get(STORES.SESSIONS, userId);
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(userId) {
    const session = await this.getSession(userId);
    if (session) {
      session.lastActivity = new Date().toISOString();
      return await this.put(STORES.SESSIONS, session);
    }
  }

  /**
   * End session
   */
  async endSession(userId) {
    return await this.delete(STORES.SESSIONS, userId);
  }

  // ==================== MEDICAL RECORDS OPERATIONS ====================

  /**
   * Add medical record
   */
  async addMedicalRecord(recordData) {
    const record = {
      patientId: recordData.patientId,
      date: recordData.date || new Date().toISOString(),
      type: recordData.type, // 'diagnosis', 'prescription', 'lab_result', etc.
      title: recordData.title,
      description: recordData.description,
      doctorName: recordData.doctorName,
      attachments: recordData.attachments || [],
      ...recordData,
    };
    return await this.put(STORES.MEDICAL_RECORDS, record);
  }

  /**
   * Get medical records for patient
   */
  async getMedicalRecords(patientId) {
    return await this.getAllByIndex(STORES.MEDICAL_RECORDS, 'patientId', patientId);
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Generate unique ID
   */
  generateId(prefix = 'id') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix.toUpperCase()}-${timestamp}-${random}`;
  }

  /**
   * Migrate data from localStorage to IndexedDB
   */
  async migrateFromLocalStorage() {
    try {
      console.log('Starting migration from localStorage...');

      // Migrate users
      const savedUser = localStorage.getItem('nextECG_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const existingUser = await this.getUserByEmail(user.email);
        if (!existingUser) {
          await this.createUser({
            id: user.id || this.generateId('user'),
            email: user.email || user.username + '@nextecg.com',
            password: 'migrated123', // Default password for migrated users
            type: user.type || 'patient',
            name: user.name,
            ...user,
          });
          console.log('Migrated user from localStorage');
        }
      }

      // Migrate patients
      const savedPatients = localStorage.getItem('nextECG_patients');
      if (savedPatients) {
        const patients = JSON.parse(savedPatients);
        for (const patient of patients) {
          const existing = await this.getPatient(patient.id);
          if (!existing) {
            // Create user for patient if not exists
            const userExists = await this.getUserByEmail(patient.email);
            if (!userExists) {
              await this.createUser({
                id: patient.id,
                email: patient.email,
                password: patient.password || 'password123',
                type: 'patient',
                name: patient.name,
              });
            }
            await this.createPatient(patient);
          }
        }
        console.log('Migrated patients from localStorage');
      }

      // Migrate current patient
      const currentPatient = localStorage.getItem('nextECG_currentPatient');
      if (currentPatient) {
        const patient = JSON.parse(currentPatient);
        const existing = await this.getPatient(patient.id);
        if (!existing) {
          await this.createPatient(patient);
          console.log('Migrated current patient from localStorage');
        }
      }

      // Migrate settings
      const appearanceSettings = localStorage.getItem('nextECG_appearance');
      const notificationSettings = localStorage.getItem('nextECG_notifications');
      const privacySettings = localStorage.getItem('nextECG_privacy');
      const medicalSettings = localStorage.getItem('nextECG_medical');

      if (savedUser && (appearanceSettings || notificationSettings || privacySettings || medicalSettings)) {
        const user = JSON.parse(savedUser);
        await this.saveSettings(user.id, {
          appearance: appearanceSettings ? JSON.parse(appearanceSettings) : {},
          notifications: notificationSettings ? JSON.parse(notificationSettings) : {},
          privacy: privacySettings ? JSON.parse(privacySettings) : {},
          medical: medicalSettings ? JSON.parse(medicalSettings) : {},
        });
        console.log('Migrated settings from localStorage');
      }

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration error:', error);
    }
  }

  /**
   * Export all data (for backup)
   */
  async exportAllData() {
    return {
      users: await this.getAll(STORES.USERS),
      patients: await this.getAll(STORES.PATIENTS),
      vitalsHistory: await this.getAll(STORES.VITALS_HISTORY),
      settings: await this.getAll(STORES.SETTINGS),
      medicalRecords: await this.getAll(STORES.MEDICAL_RECORDS),
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Clear all data (for reset)
   */
  async clearAllData() {
    await this.clear(STORES.USERS);
    await this.clear(STORES.PATIENTS);
    await this.clear(STORES.VITALS_HISTORY);
    await this.clear(STORES.SETTINGS);
    await this.clear(STORES.SESSIONS);
    await this.clear(STORES.MEDICAL_RECORDS);
    console.log('All data cleared');
  }
}

// Create singleton instance
const db = new NextECGDatabase();

export default db;
export { STORES };
