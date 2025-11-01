# NextECG Local Database System

## Overview

NextECG now uses **IndexedDB** for robust local data storage. This provides better performance, structure, and reliability compared to localStorage.

## Database Structure

### Object Stores (Tables)

1. **users** - User accounts (patients and doctors)
   - Primary Key: `id`
   - Indexes: `email` (unique), `type`
   - Fields: id, email, password, type, name, createdAt, lastLogin

2. **patients** - Detailed patient profiles
   - Primary Key: `id`
   - Indexes: `email` (unique), `userId`
   - Fields: id, userId, email, name, age, gender, bloodType, allergies, conditions, emergencyContact, etc.

3. **vitals_history** - Historical vitals readings
   - Primary Key: `id` (auto-increment)
   - Indexes: `patientId`, `timestamp`, `date`
   - Fields: patientId, timestamp, date, heartRate, spo2, respirationRate, bloodPressure, temperature, ecgQuality

4. **settings** - User preferences and settings
   - Primary Key: `userId`
   - Fields: userId, appearance, notifications, privacy, medical, updatedAt

5. **sessions** - Active user sessions
   - Primary Key: `userId`
   - Index: `lastActivity`
   - Fields: userId, user, loginTime, lastActivity, isActive

6. **medical_records** - Medical history and records
   - Primary Key: `id` (auto-increment)
   - Indexes: `patientId`, `date`
   - Fields: patientId, date, type, title, description, doctorName, attachments

## Usage

### Basic Database Operations

```javascript
import db from './utils/database';

// Initialize database (done automatically in main.jsx)
await db.init();

// Migrate from localStorage (done automatically on first load)
await db.migrateFromLocalStorage();
```

### User Operations

```javascript
// Create new user
await db.createUser({
  email: 'patient@example.com',
  password: 'password123',
  type: 'patient',
  name: 'John Doe'
});

// Authenticate user
const user = await db.authenticateUser('patient@example.com', 'password123');

// Get user by email
const user = await db.getUserByEmail('patient@example.com');

// Update user
await db.updateUser(userId, { name: 'Jane Doe' });
```

### Patient Operations

```javascript
// Create patient profile
await db.createPatient({
  userId: 'USER-123',
  email: 'patient@example.com',
  name: 'John Doe',
  age: 30,
  gender: 'Male',
  bloodType: 'O+',
  allergies: 'None',
  conditions: 'Healthy'
});

// Get patient
const patient = await db.getPatient(patientId);

// Update patient
await db.updatePatient(patientId, {
  age: 31,
  bloodType: 'O+'
});

// Get all patients
const patients = await db.getAllPatients();
```

### Vitals History Operations

```javascript
// Add vitals reading
await db.addVitalsReading({
  patientId: 'PAT-123',
  heartRate: 75,
  spo2: 98,
  respirationRate: 16,
  bloodPressure: { systolic: 120, diastolic: 80 },
  temperature: 36.6,
  ecgQuality: 95
});

// Get vitals history (last 100 readings)
const history = await db.getVitalsHistory(patientId, 100);

// Get vitals by date range
const history = await db.getVitalsHistoryByDateRange(
  patientId,
  '2025-10-01',
  '2025-11-01'
);
```

### Settings Operations

```javascript
// Save settings
await db.saveSettings(userId, {
  appearance: {
    theme: 'dark',
    fontSize: 'medium',
    colorScheme: 'cyan',
    language: 'en'
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false
  },
  privacy: {
    twoFactorAuth: false,
    sessionTimeout: '30'
  }
});

// Get settings
const settings = await db.getSettings(userId);
```

### Session Operations

```javascript
// Create session on login
await db.createSession(userId, userData);

// Get active session
const session = await db.getSession(userId);

// Update activity (keep session alive)
await db.updateSessionActivity(userId);

// End session on logout
await db.endSession(userId);
```

### Medical Records Operations

```javascript
// Add medical record
await db.addMedicalRecord({
  patientId: 'PAT-123',
  type: 'diagnosis',
  title: 'Annual Checkup',
  description: 'Patient is in good health',
  doctorName: 'Dr. Smith',
  date: '2025-11-01'
});

// Get medical records
const records = await db.getMedicalRecords(patientId);
```

## React Hooks

### useDatabase Hook

```javascript
import { useDatabase } from './hooks/useDatabase';

function MyComponent() {
  const { db, isReady, error } = useDatabase();
  
  if (!isReady) return <div>Loading database...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  // Use db operations here
}
```

### usePatientDB Hook

```javascript
import { usePatientDB } from './hooks/useDatabase';

function PatientProfile({ patientId }) {
  const { patient, loading, error, updatePatient, reload } = usePatientDB(patientId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading patient</div>;
  
  const handleUpdate = async () => {
    await updatePatient({ age: 31 });
  };
  
  return <div>{patient.name}</div>;
}
```

### useVitalsHistoryDB Hook

```javascript
import { useVitalsHistoryDB } from './hooks/useDatabase';

function VitalsHistory({ patientId }) {
  const { history, loading, addReading, reload } = useVitalsHistoryDB(patientId, 50);
  
  const handleAddReading = async (vitals) => {
    await addReading(vitals);
  };
  
  return <div>{history.length} readings</div>;
}
```

### useSettingsDB Hook

```javascript
import { useSettingsDB } from './hooks/useDatabase';

function UserSettings({ userId }) {
  const { settings, loading, saveSettings } = useSettingsDB(userId);
  
  const handleSave = async () => {
    await saveSettings({
      appearance: { theme: 'dark' }
    });
  };
  
  return <div>Theme: {settings?.appearance?.theme}</div>;
}
```

## Database Context

The DatabaseProvider wraps the entire app and provides global access:

```javascript
import { useDB } from './context/DatabaseContext';

function MyComponent() {
  const { db, isReady, error, isLoading } = useDB();
  
  // db is the database instance
  // isReady indicates if DB is initialized
  // isLoading indicates initialization in progress
}
```

## Utility Functions

```javascript
// Export all data (for backup)
const backup = await db.exportAllData();
console.log(backup);

// Clear all data (for reset)
await db.clearAllData();

// Generate unique ID
const id = db.generateId('patient'); // Returns "PATIENT-1730419200000-5432"
```

## Migration from localStorage

The database automatically migrates existing localStorage data on first initialization:

- `nextECG_user` → users table
- `nextECG_patients` → patients table
- `nextECG_currentPatient` → patients table
- `nextECG_appearance` → settings.appearance
- `nextECG_notifications` → settings.notifications
- `nextECG_privacy` → settings.privacy
- `nextECG_medical` → settings.medical

## Data Flow

```
Login/Signup
    ↓
Create User → users table
    ↓
Create Patient → patients table
    ↓
Create Session → sessions table
    ↓
Load Settings → settings table
    ↓
Record Vitals → vitals_history table
    ↓
Add Medical Records → medical_records table
```

## Browser Compatibility

IndexedDB is supported in all modern browsers:
- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+
- Opera 15+

## Storage Limits

- Chrome: ~60% of free disk space
- Firefox: ~50% of free disk space
- Safari: 1GB max
- Edge: ~60% of free disk space

## Best Practices

1. **Always check `isReady`** before using database operations
2. **Use transactions** for multiple related operations
3. **Handle errors** with try-catch blocks
4. **Clean old data** periodically to manage storage
5. **Export backups** regularly for important data
6. **Index frequently queried fields** for better performance

## Troubleshooting

### Database won't initialize
```javascript
// Check browser support
if (!window.indexedDB) {
  console.error('IndexedDB not supported');
}

// Clear and reinitialize
await db.clearAllData();
window.location.reload();
```

### Migration issues
```javascript
// Force re-migration
localStorage.clear();
await db.migrateFromLocalStorage();
```

### Storage quota exceeded
```javascript
// Clear old vitals data
const oldData = await db.getVitalsHistoryByDateRange(
  patientId,
  '2020-01-01',
  '2024-01-01'
);
// Delete old records...
```

## Security Notes

⚠️ **Important**: This is a client-side database. Data is stored locally in the browser.

- Passwords are stored in plain text (should be hashed in production)
- Data is not encrypted (use Web Crypto API for sensitive data)
- No server-side validation
- Suitable for demo/development, not production medical data

## Future Enhancements

- [ ] Add encryption for sensitive data
- [ ] Implement server sync
- [ ] Add automatic backups
- [ ] Implement data versioning
- [ ] Add full-text search
- [ ] Optimize with compound indexes
- [ ] Add data compression
- [ ] Implement conflict resolution for sync

---

**Version**: 1.0.0  
**Last Updated**: November 1, 2025
