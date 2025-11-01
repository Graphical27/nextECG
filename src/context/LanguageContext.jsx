import React, { createContext, useContext, useState, useEffect } from 'react';

// Translation dictionary
const translations = {
  en: {
    // Header
    appName: 'NextECG',
    appTagline: 'Clinical Monitoring System',
    connectArduino: 'Connect Arduino',
    disconnect: 'Disconnect',
    
    // Dashboard
    welcome: 'Welcome',
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    oxygenSaturation: 'Oxygen Saturation',
    temperature: 'Temperature',
    liveECG: 'Live ECG Monitor',
    aiPrediction: 'AI Prediction',
    vitalsHistory: 'Vitals History',
    settings: 'Settings',
    
    // Status
    connected: 'Connected',
    disconnected: 'Disconnected',
    connecting: 'Connecting',
    error: 'Error',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    refresh: 'Refresh',
    download: 'Download',
    export: 'Export',
    
    // Settings
    settingsTitle: 'Settings',
    profile: 'Profile',
    password: 'Password',
    notifications: 'Notifications',
    privacy: 'Privacy',
    appearance: 'Appearance',
    medical: 'Medical',
    data: 'Data',
    help: 'Help',
    about: 'About',
    editProfile: 'Edit Profile',
    fullName: 'Full Name',
    age: 'Age',
    gender: 'Gender',
    emailAddress: 'Email Address',
    updateProfile: 'Update Profile',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    notificationsAlerts: 'Notifications & Alerts',
    communicationPreferences: 'Communication Preferences',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    dailySummary: 'Daily Health Summary',
    abnormalVitalsAlert: 'Abnormal Vitals Alert',
    saveNotificationSettings: 'Save Notification Settings',
    privacySecurity: 'Privacy & Security',
    securityFeatures: 'Security Features',
    twoFactorAuth: 'Two-Factor Authentication',
    autoLogout: 'Auto Logout',
    sessionManagement: 'Session Management',
    sessionTimeout: 'Session Timeout (minutes)',
    accountManagement: 'Account Management',
    exportMyData: 'Export My Data',
    deleteMyAccount: 'Delete My Account',
    sessionControl: 'Session Control',
    logout: 'Logout',
    savePrivacySettings: 'Save Privacy Settings',
    appearanceSettings: 'Appearance Settings',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    signatureSilver: 'Signature Silver',
    fontSize: 'Font Size',
    colorScheme: 'Color Scheme',
    language: 'Language',
    saveAppearanceSettings: 'Save Appearance Settings',
    medicalInformation: 'Medical Information',
    bloodType: 'Blood Type',
    allergies: 'Allergies',
    medicalConditions: 'Medical Conditions',
    emergencyContact: 'Emergency Contact',
    contactName: 'Contact Name',
    contactPhone: 'Contact Phone',
    primaryCarePhysician: 'Primary Care Physician',
    doctorName: 'Doctor Name',
    phoneNumber: 'Phone Number',
    saveMedicalInformation: 'Save Medical Information',
    downloadHealthData: 'Download Health Data',
    selectDateRange: 'Select Date Range',
    allTime: 'All Time',
    custom: 'Custom',
    byMonth: 'By Month',
    byYear: 'By Year',
    startDate: 'Start Date',
    endDate: 'End Date',
    selectMonth: 'Select Month',
    selectYear: 'Select Year',
    downloadHealthDataPDF: 'Download Health Data (PDF)',
    helpSupport: 'Help & Support',
    faq: 'Frequently Asked Questions',
    contactSupport: 'Contact Support',
    sendMessage: 'Send Message',
    sendFeedback: 'Send Feedback',
    aboutNextECG: 'About NextECG',
    version: 'Version',
    latestVersion: 'Latest Version',
    uptime: 'Uptime',
    monitoring247: '24/7 Monitoring',
    hipaaCompliant: 'HIPAA Compliant',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    openSourceLicenses: 'Open Source Licenses',
    
    // Units
    bpm: 'bpm',
    mmHg: 'mmHg',
    percent: '%',
    fahrenheit: '°F',
    celsius: '°C',
  },
  es: {
    // Header
    appName: 'NextECG',
    appTagline: 'Sistema de Monitoreo Clínico',
    connectArduino: 'Conectar Arduino',
    disconnect: 'Desconectar',
    
    // Dashboard
    welcome: 'Bienvenido',
    heartRate: 'Frecuencia Cardíaca',
    bloodPressure: 'Presión Arterial',
    oxygenSaturation: 'Saturación de Oxígeno',
    temperature: 'Temperatura',
    liveECG: 'Monitor ECG en Vivo',
    aiPrediction: 'Predicción IA',
    vitalsHistory: 'Historial de Signos Vitales',
    settings: 'Configuración',
    
    // Status
    connected: 'Conectado',
    disconnected: 'Desconectado',
    connecting: 'Conectando',
    error: 'Error',
    
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    refresh: 'Actualizar',
    download: 'Descargar',
    export: 'Exportar',
    
    // Settings
    settingsTitle: 'Configuración',
    profile: 'Perfil',
    password: 'Contraseña',
    notifications: 'Notificaciones',
    privacy: 'Privacidad',
    appearance: 'Apariencia',
    medical: 'Médico',
    data: 'Datos',
    help: 'Ayuda',
    about: 'Acerca de',
    editProfile: 'Editar Perfil',
    fullName: 'Nombre Completo',
    age: 'Edad',
    gender: 'Género',
    emailAddress: 'Correo Electrónico',
    updateProfile: 'Actualizar Perfil',
    changePassword: 'Cambiar Contraseña',
    currentPassword: 'Contraseña Actual',
    newPassword: 'Nueva Contraseña',
    confirmPassword: 'Confirmar Nueva Contraseña',
    updatePassword: 'Actualizar Contraseña',
    notificationsAlerts: 'Notificaciones y Alertas',
    communicationPreferences: 'Preferencias de Comunicación',
    emailNotifications: 'Notificaciones por Correo',
    pushNotifications: 'Notificaciones Push',
    dailySummary: 'Resumen Diario de Salud',
    abnormalVitalsAlert: 'Alerta de Signos Vitales Anormales',
    saveNotificationSettings: 'Guardar Configuración de Notificaciones',
    privacySecurity: 'Privacidad y Seguridad',
    securityFeatures: 'Características de Seguridad',
    twoFactorAuth: 'Autenticación de Dos Factores',
    autoLogout: 'Cierre de Sesión Automático',
    sessionManagement: 'Gestión de Sesiones',
    sessionTimeout: 'Tiempo de Espera de Sesión (minutos)',
    accountManagement: 'Gestión de Cuenta',
    exportMyData: 'Exportar Mis Datos',
    deleteMyAccount: 'Eliminar Mi Cuenta',
    sessionControl: 'Control de Sesión',
    logout: 'Cerrar Sesión',
    savePrivacySettings: 'Guardar Configuración de Privacidad',
    appearanceSettings: 'Configuración de Apariencia',
    theme: 'Tema',
    darkMode: 'Modo Oscuro',
    signatureSilver: 'Plata Distintivo',
    fontSize: 'Tamaño de Fuente',
    colorScheme: 'Esquema de Color',
    language: 'Idioma',
    saveAppearanceSettings: 'Guardar Configuración de Apariencia',
    medicalInformation: 'Información Médica',
    bloodType: 'Tipo de Sangre',
    allergies: 'Alergias',
    medicalConditions: 'Condiciones Médicas',
    emergencyContact: 'Contacto de Emergencia',
    contactName: 'Nombre de Contacto',
    contactPhone: 'Teléfono de Contacto',
    primaryCarePhysician: 'Médico de Atención Primaria',
    doctorName: 'Nombre del Doctor',
    phoneNumber: 'Número de Teléfono',
    saveMedicalInformation: 'Guardar Información Médica',
    downloadHealthData: 'Descargar Datos de Salud',
    selectDateRange: 'Seleccionar Rango de Fechas',
    allTime: 'Todo el Tiempo',
    custom: 'Personalizado',
    byMonth: 'Por Mes',
    byYear: 'Por Año',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    selectMonth: 'Seleccionar Mes',
    selectYear: 'Seleccionar Año',
    downloadHealthDataPDF: 'Descargar Datos de Salud (PDF)',
    helpSupport: 'Ayuda y Soporte',
    faq: 'Preguntas Frecuentes',
    contactSupport: 'Contactar Soporte',
    sendMessage: 'Enviar Mensaje',
    sendFeedback: 'Enviar Comentarios',
    aboutNextECG: 'Acerca de NextECG',
    version: 'Versión',
    latestVersion: 'Última Versión',
    uptime: 'Tiempo Activo',
    monitoring247: 'Monitoreo 24/7',
    hipaaCompliant: 'Cumple con HIPAA',
    termsOfService: 'Términos de Servicio',
    privacyPolicy: 'Política de Privacidad',
    openSourceLicenses: 'Licencias de Código Abierto',
    
    // Units
    bpm: 'lpm',
    mmHg: 'mmHg',
    percent: '%',
    fahrenheit: '°F',
    celsius: '°C',
  },
  fr: {
    // Header
    appName: 'NextECG',
    appTagline: 'Système de Surveillance Clinique',
    connectArduino: 'Connecter Arduino',
    disconnect: 'Déconnecter',
    
    // Dashboard
    welcome: 'Bienvenue',
    heartRate: 'Fréquence Cardiaque',
    bloodPressure: 'Pression Artérielle',
    oxygenSaturation: 'Saturation en Oxygène',
    temperature: 'Température',
    liveECG: 'Moniteur ECG en Direct',
    aiPrediction: 'Prédiction IA',
    vitalsHistory: 'Historique des Signes Vitaux',
    settings: 'Paramètres',
    
    // Status
    connected: 'Connecté',
    disconnected: 'Déconnecté',
    connecting: 'Connexion',
    error: 'Erreur',
    
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    refresh: 'Actualiser',
    download: 'Télécharger',
    export: 'Exporter',
    
    // Units
    bpm: 'bpm',
    mmHg: 'mmHg',
    percent: '%',
    fahrenheit: '°F',
    celsius: '°C',
  },
  de: {
    // Header
    appName: 'NextECG',
    appTagline: 'Klinisches Überwachungssystem',
    connectArduino: 'Arduino Verbinden',
    disconnect: 'Trennen',
    
    // Dashboard
    welcome: 'Willkommen',
    heartRate: 'Herzfrequenz',
    bloodPressure: 'Blutdruck',
    oxygenSaturation: 'Sauerstoffsättigung',
    temperature: 'Temperatur',
    liveECG: 'Live-EKG-Monitor',
    aiPrediction: 'KI-Vorhersage',
    vitalsHistory: 'Vitalwerte-Verlauf',
    settings: 'Einstellungen',
    
    // Status
    connected: 'Verbunden',
    disconnected: 'Getrennt',
    connecting: 'Verbinden',
    error: 'Fehler',
    
    // Common
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    close: 'Schließen',
    refresh: 'Aktualisieren',
    download: 'Herunterladen',
    export: 'Exportieren',
    
    // Units
    bpm: 'S/min',
    mmHg: 'mmHg',
    percent: '%',
    fahrenheit: '°F',
    celsius: '°C',
  },
  hi: {
    // Header
    appName: 'NextECG',
    appTagline: 'क्लिनिकल निगरानी प्रणाली',
    connectArduino: 'Arduino कनेक्ट करें',
    disconnect: 'डिस्कनेक्ट करें',
    
    // Dashboard
    welcome: 'स्वागत है',
    heartRate: 'हृदय गति',
    bloodPressure: 'रक्तचाप',
    oxygenSaturation: 'ऑक्सीजन संतृप्ति',
    temperature: 'तापमान',
    liveECG: 'लाइव ECG मॉनिटर',
    aiPrediction: 'AI भविष्यवाणी',
    vitalsHistory: 'महत्वपूर्ण संकेतों का इतिहास',
    settings: 'सेटिंग्स',
    
    // Status
    connected: 'कनेक्टेड',
    disconnected: 'डिस्कनेक्टेड',
    connecting: 'कनेक्ट हो रहा है',
    error: 'त्रुटि',
    
    // Common
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
    refresh: 'रीफ्रेश करें',
    download: 'डाउनलोड करें',
    export: 'निर्यात करें',
    
    // Settings
    settingsTitle: 'सेटिंग्स',
    profile: 'प्रोफ़ाइल',
    password: 'पासवर्ड',
    notifications: 'सूचनाएं',
    privacy: 'गोपनीयता',
    appearance: 'रूप',
    medical: 'चिकित्सा',
    data: 'डेटा',
    help: 'सहायता',
    about: 'के बारे में',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    fullName: 'पूरा नाम',
    age: 'उम्र',
    gender: 'लिंग',
    emailAddress: 'ईमेल पता',
    updateProfile: 'प्रोफ़ाइल अपडेट करें',
    changePassword: 'पासवर्ड बदलें',
    currentPassword: 'वर्तमान पासवर्ड',
    newPassword: 'नया पासवर्ड',
    confirmPassword: 'नए पासवर्ड की पुष्टि करें',
    updatePassword: 'पासवर्ड अपडेट करें',
    notificationsAlerts: 'सूचनाएं और अलर्ट',
    communicationPreferences: 'संचार प्राथमिकताएं',
    emailNotifications: 'ईमेल सूचनाएं',
    pushNotifications: 'पुश सूचनाएं',
    dailySummary: 'दैनिक स्वास्थ्य सारांश',
    abnormalVitalsAlert: 'असामान्य संकेतों की चेतावनी',
    saveNotificationSettings: 'सूचना सेटिंग्स सहेजें',
    privacySecurity: 'गोपनीयता और सुरक्षा',
    securityFeatures: 'सुरक्षा सुविधाएँ',
    twoFactorAuth: 'दो-कारक प्रमाणीकरण',
    autoLogout: 'स्वतः लॉगआउट',
    sessionManagement: 'सत्र प्रबंधन',
    sessionTimeout: 'सत्र समय समाप्ति (मिनट)',
    accountManagement: 'खाता प्रबंधन',
    exportMyData: 'मेरा डेटा निर्यात करें',
    deleteMyAccount: 'मेरा खाता हटाएं',
    sessionControl: 'सत्र नियंत्रण',
    logout: 'लॉगआउट',
    savePrivacySettings: 'गोपनीयता सेटिंग्स सहेजें',
    appearanceSettings: 'रूप सेटिंग्स',
    theme: 'थीम',
    darkMode: 'डार्क मोड',
    signatureSilver: 'सिग्नेचर सिल्वर',
    fontSize: 'फ़ॉन्ट आकार',
    colorScheme: 'रंग योजना',
    language: 'भाषा',
    saveAppearanceSettings: 'रूप सेटिंग्स सहेजें',
    medicalInformation: 'चिकित्सा जानकारी',
    bloodType: 'रक्त समूह',
    allergies: 'एलर्जी',
    medicalConditions: 'चिकित्सा स्थितियां',
    emergencyContact: 'आपातकालीन संपर्क',
    contactName: 'संपर्क नाम',
    contactPhone: 'संपर्क फ़ोन',
    primaryCarePhysician: 'प्राथमिक देखभाल चिकित्सक',
    doctorName: 'डॉक्टर का नाम',
    phoneNumber: 'फ़ोन नंबर',
    saveMedicalInformation: 'चिकित्सा जानकारी सहेजें',
    downloadHealthData: 'स्वास्थ्य डेटा डाउनलोड करें',
    selectDateRange: 'तिथि सीमा चुनें',
    allTime: 'सभी समय',
    custom: 'कस्टम',
    byMonth: 'महीने के अनुसार',
    byYear: 'वर्ष के अनुसार',
    startDate: 'शुरूआती तिथि',
    endDate: 'अंतिम तिथि',
    selectMonth: 'महीना चुनें',
    selectYear: 'वर्ष चुनें',
    downloadHealthDataPDF: 'स्वास्थ्य डेटा डाउनलोड करें (PDF)',
    helpSupport: 'सहायता और समर्थन',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    contactSupport: 'समर्थन से संपर्क करें',
    sendMessage: 'संदेश भेजें',
    sendFeedback: 'प्रतिक्रिया भेजें',
    aboutNextECG: 'NextECG के बारे में',
    version: 'संस्करण',
    latestVersion: 'नवीनतम संस्करण',
    uptime: 'अपटाइम',
    monitoring247: '24/7 निगरानी',
    hipaaCompliant: 'HIPAA अनुपालन',
    termsOfService: 'सेवा की शर्तें',
    privacyPolicy: 'गोपनीयता नीति',
    openSourceLicenses: 'ओपन सोर्स लाइसेंस',
    
    // Units
    bpm: 'bpm',
    mmHg: 'mmHg',
    percent: '%',
    fahrenheit: '°F',
    celsius: '°C',
  },
  zh: {
    // Header
    appName: 'NextECG',
    appTagline: '临床监测系统',
    connectArduino: '连接 Arduino',
    disconnect: '断开连接',
    
    // Dashboard
    welcome: '欢迎',
    heartRate: '心率',
    bloodPressure: '血压',
    oxygenSaturation: '血氧饱和度',
    temperature: '体温',
    liveECG: '实时心电图监测',
    aiPrediction: 'AI 预测',
    vitalsHistory: '生命体征历史',
    settings: '设置',
    
    // Status
    connected: '已连接',
    disconnected: '已断开',
    connecting: '连接中',
    error: '错误',
    
    // Common
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    close: '关闭',
    refresh: '刷新',
    download: '下载',
    export: '导出',
    
    // Units
    bpm: '次/分',
    mmHg: 'mmHg',
    percent: '%',
    fahrenheit: '°F',
    celsius: '°C',
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Load language from localStorage
  useEffect(() => {
    try {
      const savedAppearance = localStorage.getItem('nextECG_appearance');
      if (savedAppearance) {
        const appearance = JSON.parse(savedAppearance);
        if (appearance.language && translations[appearance.language]) {
          setLanguage(appearance.language);
        }
      }
    } catch (error) {
      console.error('Error loading language:', error);
      setLanguage('en'); // Fallback to English
    }
  }, []);

  // Translation function with fallback
  const t = (key) => {
    try {
      return translations[language]?.[key] || translations['en']?.[key] || key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      // Save to localStorage immediately
      try {
        const savedAppearance = localStorage.getItem('nextECG_appearance');
        const appearance = savedAppearance ? JSON.parse(savedAppearance) : {};
        appearance.language = newLanguage;
        localStorage.setItem('nextECG_appearance', JSON.stringify(appearance));
      } catch (error) {
        console.error('Error saving language:', error);
      }
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
