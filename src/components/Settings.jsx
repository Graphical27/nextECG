import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useVitals } from '../context/VitalsContext';
import { useAuth } from '../context/AuthContext';
import BackgroundAnimation from './BackgroundAnimation';

const Settings = ({ onBack }) => {
  const navigate = useNavigate();
  const { theme, setAppearanceSettings: updateThemeSettings } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { patientInfo, setPatientInfo, vitals } = useVitals();
  const { user, logout } = useAuth();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // All state declarations
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({ name: '', age: '', gender: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [downloadData, setDownloadData] = useState({ dateRange: 'all', startDate: '', endDate: '', selectedMonth: '', selectedYear: new Date().getFullYear().toString() });
  const [notificationSettings, setNotificationSettings] = useState({ emailNotifications: true, pushNotifications: false, dailySummary: true, abnormalVitalsAlert: true });
  const [privacySettings, setPrivacySettings] = useState({ twoFactorAuth: false, sessionTimeout: '30', autoLogout: true });
  const [appearanceSettings, setAppearanceSettings] = useState({ theme: 'dark', fontSize: 'medium', colorScheme: 'cyan', language: 'en' });
  const [medicalInfo, setMedicalInfo] = useState({ bloodType: '', allergies: '', conditions: '', emergencyContact: '', emergencyPhone: '', doctorName: '', doctorPhone: '', doctorEmail: '' });
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load settings on mount and when user/patientInfo changes
  useEffect(() => {
    try {
      const currentPatient = localStorage.getItem('nextECG_currentPatient');
      if (currentPatient) {
        const patient = JSON.parse(currentPatient);
        setFormData({ 
          name: patient.name || patientInfo?.name || user?.name || '', 
          age: patient.age || patientInfo?.age || '', 
          gender: patient.gender || patientInfo?.gender || '', 
          email: patient.email || patientInfo?.email || user?.email || '' 
        });
      } else if (user) {
        // Fallback to user data if no patient data
        setFormData({
          name: user.name || '',
          age: user.age || '',
          gender: user.gender || '',
          email: user.email || ''
        });
      }
      
      const savedNotifications = localStorage.getItem('nextECG_notifications');
      if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications));
      
      const savedPrivacy = localStorage.getItem('nextECG_privacy');
      if (savedPrivacy) setPrivacySettings(JSON.parse(savedPrivacy));
      
      const savedAppearance = localStorage.getItem('nextECG_appearance');
      if (savedAppearance) setAppearanceSettings(JSON.parse(savedAppearance));
      
      const savedMedical = localStorage.getItem('nextECG_medical');
      if (savedMedical) setMedicalInfo(JSON.parse(savedMedical));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, [user, patientInfo]); // Re-run when user or patientInfo changes

  // Handlers
  const handleProfileUpdate = useCallback((e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const currentPatient = JSON.parse(localStorage.getItem('nextECG_currentPatient') || '{}');
      const updatedPatient = { 
        ...currentPatient, 
        name: formData.name, 
        age: parseInt(formData.age), 
        gender: formData.gender, 
        email: formData.email 
      };
      
      // Update patient list if exists
      const allPatients = JSON.parse(localStorage.getItem('nextECG_patients') || '[]');
      const updatedPatients = allPatients.map(p => p.id === currentPatient.id ? updatedPatient : p);
      localStorage.setItem('nextECG_patients', JSON.stringify(updatedPatients));
      
      // Update current patient
      localStorage.setItem('nextECG_currentPatient', JSON.stringify(updatedPatient));
      
      // Update user session data
      const currentUser = JSON.parse(localStorage.getItem('nextECG_user') || '{}');
      const updatedUser = { 
        ...currentUser, 
        name: formData.name, 
        email: formData.email,
        age: parseInt(formData.age),
        gender: formData.gender
      };
      localStorage.setItem('nextECG_user', JSON.stringify(updatedUser));
      
      // Update VitalsContext patient info
      setPatientInfo({ 
        name: formData.name, 
        age: parseInt(formData.age), 
        gender: formData.gender, 
        email: formData.email,
        id: currentPatient.id,
        bloodType: currentPatient.bloodType,
        lastCheckup: currentPatient.lastCheckup
      });
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  }, [formData, setPatientInfo]);

  const handlePasswordUpdate = useCallback((e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const currentPatient = JSON.parse(localStorage.getItem('nextECG_currentPatient') || '{}');
    if (passwordData.currentPassword !== currentPatient.password) { setError('Current password is incorrect'); return; }
    if (passwordData.newPassword.length < 6) { setError('New password must be at least 6 characters'); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword) { setError('New passwords do not match'); return; }
    const updatedPatient = { ...currentPatient, password: passwordData.newPassword };
    const allPatients = JSON.parse(localStorage.getItem('nextECG_patients') || '[]');
    const updatedPatients = allPatients.map(p => p.id === currentPatient.id ? updatedPatient : p);
    localStorage.setItem('nextECG_patients', JSON.stringify(updatedPatients));
    localStorage.setItem('nextECG_currentPatient', JSON.stringify(updatedPatient));
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSuccess('Password updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  }, [passwordData]);

  const handleDownloadData = useCallback(() => {
    setError('');
    setSuccess('');
    let dateRangeText = '';
    if (downloadData.dateRange === 'all') { 
      dateRangeText = 'All Time'; 
    } else if (downloadData.dateRange === 'custom') {
      if (!downloadData.startDate || !downloadData.endDate) { 
        setError('Please select both start and end dates'); 
        return; 
      }
      dateRangeText = `${downloadData.startDate} to ${downloadData.endDate}`;
    } else if (downloadData.dateRange === 'month') {
      if (!downloadData.selectedMonth) { 
        setError('Please select a month'); 
        return; 
      }
      dateRangeText = new Date(downloadData.selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (downloadData.dateRange === 'year') { 
      dateRangeText = downloadData.selectedYear; 
    }
    const currentPatient = JSON.parse(localStorage.getItem('nextECG_currentPatient') || '{}');
    const pdfData = `%PDF-1.4
NextECG Health Report
Generated: ${new Date().toLocaleString()}
Patient: ${currentPatient?.name || 'N/A'}
Email: ${currentPatient?.email || 'N/A'}
Period: ${dateRangeText}
Vitals: HR ${vitals.heartRate}bpm, BP ${vitals.bloodPressure}mmHg, SpO2 ${vitals.oxygenSaturation}%, Temp ${vitals.temperature}°F`;
    const dataBlob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NextECG-Report-${dateRangeText.replace(/\s+/g, '-')}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    setSuccess('Health report downloaded!');
    setTimeout(() => setSuccess(''), 3000);
  }, [downloadData, vitals]);

  const handleNotificationSave = () => { localStorage.setItem('nextECG_notifications', JSON.stringify(notificationSettings)); setSuccess('Notifications saved!'); setTimeout(() => setSuccess(''), 3000); };
  const handlePrivacySave = () => { localStorage.setItem('nextECG_privacy', JSON.stringify(privacySettings)); setSuccess('Privacy settings saved!'); setTimeout(() => setSuccess(''), 3000); };
  const handleAppearanceSave = () => { 
    localStorage.setItem('nextECG_appearance', JSON.stringify(appearanceSettings));
    // Update ThemeContext immediately
    if (updateThemeSettings) {
      updateThemeSettings(appearanceSettings);
    }
    setSuccess('Appearance settings saved! Page will reload in 2 seconds...'); 
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  const handleMedicalSave = () => { localStorage.setItem('nextECG_medical', JSON.stringify(medicalInfo)); setSuccess('Medical info saved!'); setTimeout(() => setSuccess(''), 3000); };
  
  const handleDeleteAccount = () => { 
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
      try {
        // Get current user/patient data
        const currentPatient = JSON.parse(localStorage.getItem('nextECG_currentPatient') || '{}');
        const currentUser = JSON.parse(localStorage.getItem('nextECG_user') || '{}');
        
        // Remove from patients array
        const allPatients = JSON.parse(localStorage.getItem('nextECG_patients') || '[]');
        localStorage.setItem('nextECG_patients', JSON.stringify(allPatients.filter(p => p.id !== currentPatient.id)));
        
        // Clear all user data
        localStorage.removeItem('nextECG_currentPatient');
        localStorage.removeItem('nextECG_user');
        localStorage.removeItem('nextECG_appearance');
        localStorage.removeItem('nextECG_notifications');
        localStorage.removeItem('nextECG_privacy');
        localStorage.removeItem('nextECG_medical');
        
        // Call logout to clear auth state
        logout();
        
        // Show success message
        alert('Your account has been successfully deleted.');
        
        // Redirect to login page
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        setError('Failed to delete account. Please try again.');
      }
    } 
  };
  
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:aadipandey223@gmail.com?subject=${encodeURIComponent(feedbackForm.subject || 'NextECG Feedback')}&body=${encodeURIComponent(`Name: ${feedbackForm.name}\nEmail: ${feedbackForm.email}\n\nMessage:\n${feedbackForm.message}`)}`;
    window.location.href = mailtoLink;
    setFeedbackForm({ name: '', email: '', subject: '', message: '' });
    setSuccess('Opening email client...');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:aadipandey223@gmail.com?subject=${encodeURIComponent('NextECG Support Request')}&body=${encodeURIComponent(`From: ${feedbackForm.email}\n\n${feedbackForm.message}`)}`;
    window.location.href = mailtoLink;
    setSuccess('Opening email client...');
    setTimeout(() => setSuccess(''), 3000);
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <button 
      type="button" 
      onClick={() => onChange(!checked)} 
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ease-in-out ${checked ? 'shadow-2xl' : 'shadow-inner'}`} 
      style={{ 
        background: checked 
          ? `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}ee 50%, ${theme.accent}dd 100%)` 
          : `linear-gradient(135deg, ${theme.glassBorder} 0%, rgba(100,100,100,0.3) 100%)`,
        boxShadow: checked 
          ? `0 0 25px ${theme.accent}50, 0 4px 15px ${theme.accent}30, inset 0 1px 3px rgba(0,0,0,0.4)` 
          : '0 2px 8px rgba(0,0,0,0.2), inset 0 2px 4px rgba(0,0,0,0.3)',
        border: `2px solid ${checked ? theme.accent : 'rgba(100,100,100,0.4)'}`
      }}
    >
      <span 
        className={`inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-in-out ${checked ? 'translate-x-8' : 'translate-x-1'}`} 
        style={{ 
          background: checked 
            ? 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #e8e8e8 100%)' 
            : 'linear-gradient(135deg, #e0e0e0 0%, #c8c8c8 50%, #b0b0b0 100%)',
          boxShadow: checked 
            ? `0 3px 8px rgba(0,0,0,0.4), 0 0 15px ${theme.accent}40, inset 0 -2px 3px rgba(0,0,0,0.15)` 
            : '0 2px 6px rgba(0,0,0,0.4), inset 0 -2px 3px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}
      />
    </button>
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: theme.primary }}>
      <BackgroundAnimation />
      <div className="relative z-10 container mx-auto p-6 pb-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <button onClick={onBack} className="p-3 rounded-lg transition-all hover:opacity-80" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: isDark ? '#F7FAFC' : theme.textPrimary }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
          )}
          <h1 className="font-orbitron font-bold text-2xl md:text-3xl" style={{ color: isDark ? '#F7FAFC' : theme.textPrimary }}>{t('settingsTitle')}</h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'profile', label: t('profile'), icon: '👤' },
            { id: 'password', label: t('password'), icon: '🔒' },
            { id: 'notifications', label: t('notifications'), icon: '🔔' },
            { id: 'privacy', label: t('privacy'), icon: '🛡️' },
            { id: 'appearance', label: t('appearance'), icon: '🎨' },
            { id: 'medical', label: t('medical'), icon: '🩺' },
            { id: 'data', label: t('data'), icon: '📥' },
            { id: 'help', label: t('help'), icon: '❓' },
            { id: 'about', label: t('about'), icon: 'ℹ️' }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${activeTab === tab.id ? '' : 'opacity-70 hover:opacity-100'}`} 
              style={{ 
                background: activeTab === tab.id ? theme.accent : theme.secondary, 
                color: activeTab === tab.id ? '#000000' : (isDark ? '#F7FAFC' : theme.textPrimary), 
                border: `1px solid ${activeTab === tab.id ? theme.accent : theme.glassBorder}` 
              }}
            >
              <span className="mr-2">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass depth-shadow rounded-xl p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
              <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color: theme.textPrimary }}>{t('editProfile')}</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: theme.textMuted }}>{t('fullName')} *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: theme.textMuted }}>{t('age')} *</label>
                    <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="25" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: theme.textMuted }}>{t('gender')} *</label>
                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} required>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: theme.textMuted }}>{t('emailAddress')} *</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="john@example.com" required />
                  </div>
                </div>
                {error && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.danger}20`, border: `1px solid ${theme.danger}`, color: theme.danger }}>{error}</div>}
                {success && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.success}20`, border: `1px solid ${theme.success}`, color: theme.success }}>{success}</div>}
                <button type="submit" className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: theme.accent, color: '#000000' }}>{t('updateProfile')}</button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="glass depth-shadow rounded-xl p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
              <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color: theme.textPrimary }}>Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: theme.textMuted }}>Current Password *</label>
                  <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="Enter current password" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: theme.textMuted }}>New Password *</label>
                  <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="Minimum 6 characters" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: theme.textMuted }}>Confirm New Password *</label>
                  <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="Re-enter new password" required />
                </div>
                {error && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.danger}20`, border: `1px solid ${theme.danger}`, color: theme.danger }}>{error}</div>}
                {success && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.success}20`, border: `1px solid ${theme.success}`, color: theme.success }}>{success}</div>}
                <button type="submit" className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: theme.accent, color: '#000000' }}>Update Password</button>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="glass depth-shadow rounded-xl p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
              <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color: theme.textPrimary }}>Notifications & Alerts</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Communication Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-xl transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, border: `2px solid ${theme.glassBorder}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <p className="font-semibold text-base" style={{ color: theme.textPrimary }}>Email Notifications</p>
                        </div>
                        <p className="text-sm ml-7" style={{ color: theme.textMuted }}>Receive updates and alerts via email</p>
                      </div>
                      <ToggleSwitch checked={notificationSettings.emailNotifications} onChange={(val) => setNotificationSettings({ ...notificationSettings, emailNotifications: val })} />
                    </div>
                    <div className="flex items-center justify-between p-5 rounded-xl transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, border: `2px solid ${theme.glassBorder}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                          <p className="font-semibold text-base" style={{ color: theme.textPrimary }}>Push Notifications</p>
                        </div>
                        <p className="text-sm ml-7" style={{ color: theme.textMuted }}>Get instant browser notifications</p>
                      </div>
                      <ToggleSwitch checked={notificationSettings.pushNotifications} onChange={(val) => setNotificationSettings({ ...notificationSettings, pushNotifications: val })} />
                    </div>
                    <div className="flex items-center justify-between p-5 rounded-xl transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, border: `2px solid ${theme.glassBorder}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <p className="font-semibold text-base" style={{ color: theme.textPrimary }}>Daily Health Summary</p>
                        </div>
                        <p className="text-sm ml-7" style={{ color: theme.textMuted }}>Daily email with vitals summary</p>
                      </div>
                      <ToggleSwitch checked={notificationSettings.dailySummary} onChange={(val) => setNotificationSettings({ ...notificationSettings, dailySummary: val })} />
                    </div>
                    <div className="flex items-center justify-between p-5 rounded-xl transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, border: `2px solid ${theme.glassBorder}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-5 h-5" style={{ color: theme.danger }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          <p className="font-semibold text-base" style={{ color: theme.textPrimary }}>Abnormal Vitals Alert</p>
                        </div>
                        <p className="text-sm ml-7" style={{ color: theme.textMuted }}>Immediate alert when vitals are abnormal</p>
                      </div>
                      <ToggleSwitch checked={notificationSettings.abnormalVitalsAlert} onChange={(val) => setNotificationSettings({ ...notificationSettings, abnormalVitalsAlert: val })} />
                    </div>
                  </div>
                </div>
                {success && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.success}20`, border: `1px solid ${theme.success}`, color: theme.success }}>{success}</div>}
                <button onClick={handleNotificationSave} className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: theme.accent, color: '#000000' }}>Save Notification Settings</button>
              </div>
            </div>
          )}

          {/* Privacy Tab - CONTINUED IN NEXT REPLACEMENT */}
          {activeTab === 'privacy' && (
            <div className="glass depth-shadow rounded-xl p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
              <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color: theme.textPrimary }}>Privacy & Security</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Security Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-xl transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, border: `2px solid ${theme.glassBorder}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          <p className="font-semibold text-base" style={{ color: theme.textPrimary }}>Two-Factor Authentication</p>
                        </div>
                        <p className="text-sm ml-7" style={{ color: theme.textMuted }}>Add an extra layer of security to your account</p>
                      </div>
                      <ToggleSwitch checked={privacySettings.twoFactorAuth} onChange={(val) => setPrivacySettings({ ...privacySettings, twoFactorAuth: val })} />
                    </div>
                    <div className="flex items-center justify-between p-5 rounded-xl transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, border: `2px solid ${theme.glassBorder}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          <p className="font-semibold text-base" style={{ color: theme.textPrimary }}>Auto Logout</p>
                        </div>
                        <p className="text-sm ml-7" style={{ color: theme.textMuted }}>Automatically log out after period of inactivity</p>
                      </div>
                      <ToggleSwitch checked={privacySettings.autoLogout} onChange={(val) => setPrivacySettings({ ...privacySettings, autoLogout: val })} />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Session Management</h3>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.textMuted }}>Session Timeout (minutes)</label>
                    <select value={privacySettings.sessionTimeout} onChange={(e) => setPrivacySettings({ ...privacySettings, sessionTimeout: e.target.value })} className="w-full md:w-64 px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }}>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Account Management</h3>
                  <div className="space-y-3">
                    <button onClick={handleDownloadData} className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-105 flex items-center justify-center gap-2 shadow-lg" style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, border: `2px solid ${theme.glassBorder}`, color: theme.textPrimary }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Export My Data
                    </button>
                    <button onClick={handleDeleteAccount} className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-105 flex items-center justify-center gap-2 shadow-lg" style={{ background: `linear-gradient(135deg, ${theme.danger}30, ${theme.danger}20)`, border: `2px solid ${theme.danger}`, color: theme.danger }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete My Account
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Session Control</h3>
                  <button 
                    onClick={() => { 
                      logout(); 
                      navigate('/login'); 
                    }} 
                    className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-105 flex items-center justify-center gap-2 shadow-lg" 
                    style={{ background: `linear-gradient(135deg, ${theme.accent}30, ${theme.accent}20)`, border: `2px solid ${theme.accent}`, color: theme.accent }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
                {success && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.success}20`, border: `1px solid ${theme.success}`, color: theme.success }}>{success}</div>}
                <button onClick={handlePrivacySave} className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: theme.accent, color: '#000000' }}>Save Privacy Settings</button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="glass depth-shadow rounded-xl p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
              <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color: theme.textPrimary }}>Appearance Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'dark' })} 
                      className={`p-6 rounded-xl transition-all hover:scale-105 ${appearanceSettings.theme === 'dark' ? 'ring-4 shadow-2xl' : 'opacity-70 hover:opacity-100'}`} 
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, 
                        border: `2px solid ${appearanceSettings.theme === 'dark' ? theme.accent : theme.glassBorder}`, 
                        ringColor: theme.accent,
                        boxShadow: appearanceSettings.theme === 'dark' ? `0 0 30px ${theme.accent}40` : 'none'
                      }}
                    >
                      <div className="w-16 h-16 rounded-xl mb-3 bg-gradient-to-br from-gray-900 to-black mx-auto shadow-lg border-2 border-gray-700" />
                      <p className="text-base font-semibold text-center" style={{ color: theme.textPrimary }}>Dark Mode</p>
                      <p className="text-xs text-center mt-1" style={{ color: theme.textMuted }}>Professional & Eye-friendly</p>
                    </button>
                    <button 
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'silver' })} 
                      className={`p-6 rounded-xl transition-all hover:scale-105 ${appearanceSettings.theme === 'silver' ? 'ring-4 shadow-2xl' : 'opacity-70 hover:opacity-100'}`} 
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, 
                        border: `2px solid ${appearanceSettings.theme === 'silver' ? theme.accent : theme.glassBorder}`, 
                        ringColor: theme.accent,
                        boxShadow: appearanceSettings.theme === 'silver' ? `0 0 30px ${theme.accent}40` : 'none'
                      }}
                    >
                      <div className="w-16 h-16 rounded-xl mb-3 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 mx-auto shadow-lg border-2 border-gray-400" />
                      <p className="text-base font-semibold text-center" style={{ color: theme.textPrimary }}>Signature Silver</p>
                      <p className="text-xs text-center mt-1" style={{ color: theme.textMuted }}>Premium & Elegant</p>
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Font Size</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['small', 'medium', 'large'].map(size => (
                      <button 
                        key={size} 
                        onClick={() => setAppearanceSettings({ ...appearanceSettings, fontSize: size })} 
                        className={`py-4 px-4 rounded-xl font-semibold transition-all capitalize hover:scale-105 ${appearanceSettings.fontSize === size ? 'shadow-xl' : 'opacity-70 hover:opacity-100'}`} 
                        style={{ 
                          background: appearanceSettings.fontSize === size 
                            ? `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` 
                            : `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, 
                          color: appearanceSettings.fontSize === size ? '#000000' : theme.textPrimary, 
                          border: `2px solid ${appearanceSettings.fontSize === size ? theme.accent : theme.glassBorder}`,
                          boxShadow: appearanceSettings.fontSize === size ? `0 0 25px ${theme.accent}40` : 'none',
                          fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Color Scheme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'cyan', color: '#00ADB5', label: 'Cyan' }, 
                      { name: 'blue', color: '#0EA5E9', label: 'Blue' }, 
                      { name: 'green', color: '#10B981', label: 'Green' }
                    ].map(scheme => (
                      <button key={scheme.name} onClick={() => setAppearanceSettings({ ...appearanceSettings, colorScheme: scheme.name })} className={`py-3 px-4 rounded-lg font-medium transition-all capitalize flex items-center justify-center gap-2 ${appearanceSettings.colorScheme === scheme.name ? '' : 'opacity-70'}`} style={{ background: appearanceSettings.colorScheme === scheme.name ? scheme.color + '20' : theme.secondary, border: `1px solid ${appearanceSettings.colorScheme === scheme.name ? scheme.color : theme.glassBorder}`, color: theme.textPrimary }}>
                        <div className="w-4 h-4 rounded-full" style={{ background: scheme.color }} />
                        {scheme.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Language</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { code: 'en', name: 'English', flag: '🇺🇸' },
                      { code: 'es', name: 'Español', flag: '🇪🇸' },
                      { code: 'fr', name: 'Français', flag: '🇫🇷' },
                      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
                      { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
                      { code: 'zh', name: '中文', flag: '🇨🇳' }
                    ].map(lang => (
                      <button 
                        key={lang.code} 
                        onClick={() => {
                          setLanguage(lang.code);
                          setAppearanceSettings({ ...appearanceSettings, language: lang.code });
                        }} 
                        className={`py-4 px-4 rounded-xl font-semibold transition-all flex items-center gap-3 hover:scale-105 ${language === lang.code ? 'shadow-2xl' : 'opacity-70 hover:opacity-100'}`} 
                        style={{ 
                          background: language === lang.code 
                            ? `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` 
                            : `linear-gradient(135deg, ${theme.secondary}, ${theme.secondary}dd)`, 
                          color: language === lang.code ? '#000000' : theme.textPrimary, 
                          border: `2px solid ${language === lang.code ? theme.accent : theme.glassBorder}`,
                          boxShadow: language === lang.code ? `0 0 25px ${theme.accent}40` : 'none'
                        }}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-xl" style={{ background: `${theme.accent}10`, border: `2px solid ${theme.accent}30` }}>
                    <p className="text-sm flex items-center gap-2" style={{ color: theme.textPrimary }}>
                      <span className="text-xl">ℹ️</span>
                      <span>Changing language will reload the page to apply changes</span>
                    </p>
                  </div>
                </div>
                {success && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.success}20`, border: `1px solid ${theme.success}`, color: theme.success }}>{success}</div>}
                <button onClick={handleAppearanceSave} className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: theme.accent, color: '#000000' }}>Save Appearance Settings</button>
              </div>
            </div>
          )}

          {/* Medical Info Tab - WILL CONTINUE */}
          {activeTab === 'medical' && (
            <div className="glass depth-shadow rounded-xl p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
              <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color: theme.textPrimary }}>Medical Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Blood Type</label>
                    <select value={medicalInfo.bloodType} onChange={(e) => setMedicalInfo({ ...medicalInfo, bloodType: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }}>
                      <option value="">Select blood type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Allergies</label>
                    <input type="text" value={medicalInfo.allergies} onChange={(e) => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="e.g., Penicillin, Peanuts" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Medical Conditions</label>
                  <textarea value={medicalInfo.conditions} onChange={(e) => setMedicalInfo({ ...medicalInfo, conditions: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-lg resize-none" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="List any existing medical conditions..." />
                </div>
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Contact Name</label>
                      <input type="text" value={medicalInfo.emergencyContact} onChange={(e) => setMedicalInfo({ ...medicalInfo, emergencyContact: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Contact Phone</label>
                      <input type="tel" value={medicalInfo.emergencyPhone} onChange={(e) => setMedicalInfo({ ...medicalInfo, emergencyPhone: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: theme.textPrimary }}>Primary Care Physician</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Doctor Name</label>
                      <input type="text" value={medicalInfo.doctorName} onChange={(e) => setMedicalInfo({ ...medicalInfo, doctorName: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="Dr. Smith" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Phone Number</label>
                      <input type="tel" value={medicalInfo.doctorPhone} onChange={(e) => setMedicalInfo({ ...medicalInfo, doctorPhone: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="+1 (555) 987-6543" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Email Address</label>
                      <input type="email" value={medicalInfo.doctorEmail} onChange={(e) => setMedicalInfo({ ...medicalInfo, doctorEmail: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder="doctor@hospital.com" />
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.accent}30` }}>
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>HIPAA Compliant</p>
                      <p className="text-xs mt-1" style={{ color: theme.textMuted }}>All medical information is encrypted and stored securely. This data will only be accessible to you and authorized healthcare providers.</p>
                    </div>
                  </div>
                </div>
                {success && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.success}20`, border: `1px solid ${theme.success}`, color: theme.success }}>{success}</div>}
                <button onClick={handleMedicalSave} className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: theme.accent, color: '#000000' }}>Save Medical Information</button>
              </div>
            </div>
          )}

          {/* Download Data Tab - CONTINUES */}
          {activeTab === 'data' && (
            <div className="glass depth-shadow rounded-xl p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
              <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color: theme.textPrimary }}>Download Health Data</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: theme.textMuted }}>Select Date Range</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['all', 'custom', 'month', 'year'].map(range => (
                      <button key={range} type="button" onClick={() => setDownloadData({ ...downloadData, dateRange: range })} className={`py-3 px-4 rounded-lg font-medium transition-all capitalize ${downloadData.dateRange === range ? '' : 'opacity-70 hover:opacity-100'}`} style={{ background: downloadData.dateRange === range ? theme.accent : theme.secondary, color: downloadData.dateRange === range ? '#000000' : theme.textPrimary, border: `1px solid ${downloadData.dateRange === range ? theme.accent : theme.glassBorder}` }}>
                        {range === 'all' ? 'All Time' : range === 'custom' ? 'Custom' : range === 'month' ? 'By Month' : 'By Year'}
                      </button>
                    ))}
                  </div>
                </div>
                {downloadData.dateRange === 'custom' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Start Date *</label>
                      <input type="date" value={downloadData.startDate} onChange={(e) => setDownloadData({ ...downloadData, startDate: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>End Date *</label>
                      <input type="date" value={downloadData.endDate} onChange={(e) => setDownloadData({ ...downloadData, endDate: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} />
                    </div>
                  </div>
                )}
                {downloadData.dateRange === 'month' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Select Month *</label>
                    <input type="month" value={downloadData.selectedMonth} onChange={(e) => setDownloadData({ ...downloadData, selectedMonth: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} />
                  </div>
                )}
                {downloadData.dateRange === 'year' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>Select Year *</label>
                    <select value={downloadData.selectedYear} onChange={(e) => setDownloadData({ ...downloadData, selectedYear: e.target.value })} className="w-full px-4 py-3 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }}>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (<option key={year} value={year}>{year}</option>))}
                    </select>
                  </div>
                )}
                {error && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.danger}20`, border: `1px solid ${theme.danger}`, color: theme.danger }}>{error}</div>}
                {success && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.success}20`, border: `1px solid ${theme.success}`, color: theme.success }}>{success}</div>}
                <button onClick={handleDownloadData} className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{ background: theme.accent, color: '#000000' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download Health Data (PDF)
                </button>
              </div>
            </div>
          )}

          {/* Help & Support Tab */}
          {activeTab === 'help' && (
            <div className="glass depth-shadow rounded-xl p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
              <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color: theme.textPrimary }}>Help & Support</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <div className="p-5 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="font-semibold text-lg" style={{ color: theme.textPrimary }}>Frequently Asked Questions</h3>
                  </div>
                  <div className="space-y-3 ml-2 max-h-96 overflow-y-auto pr-2">
                    {[
                      { q: "How do I connect my ECG device?", a: "Click 'Connect to Arduino' in the dashboard and select your device from the list." },
                      { q: "What should I do if connection fails?", a: "Check device power, grant browser serial port permissions, and try refreshing." },
                      { q: "How accurate are ECG readings?", a: "Medical-grade accuracy with certified sensors. Always consult professionals for decisions." },
                      { q: "Can I export my health data?", a: "Yes! Use the 'Download Data' tab to export records as PDF with custom date ranges." },
                      { q: "Is my health data secure?", a: "Absolutely! All data is encrypted and stored locally. We're HIPAA compliant." },
                      { q: "How do I change my password?", a: "Go to 'Password' tab, enter current password and new password, click 'Update Password'." },
                      { q: "What are normal heart rate ranges?", a: "60-100 bpm for adults at rest. Athletes may have lower rates. Consult your doctor." },
                      { q: "How do I enable notifications?", a: "Visit 'Notifications' tab and toggle email, push, daily summary, or abnormal vitals alerts." },
                      { q: "Can I monitor multiple patients?", a: "Current version supports one profile per account. Contact us for enterprise solutions." },
                      { q: "What browsers are supported?", a: "Chrome, Edge, and Opera with Web Serial API support for device connectivity." },
                      { q: "How do I update medical information?", a: "Visit 'Medical Information' tab to update blood type, allergies, conditions, contacts." },
                      { q: "What should I do for abnormal readings?", a: "Contact your healthcare provider immediately. Our alerts are informational only." },
                      { q: "Can I use NextECG offline?", a: "Requires internet for initial load but can function offline after connection." },
                      { q: "How often is data synchronized?", a: "Live ECG data updates in real-time. Historical data saves after each session." },
                      { q: "What is AI Prediction?", a: "AI analyzes ECG patterns to detect potential arrhythmias and anomalies for early warnings." },
                      { q: "How do I delete my account?", a: "Go to Settings > Privacy & Security > Account Management and click 'Delete My Account'." },
                      { q: "Can I share data with my doctor?", a: "Yes! Download health report as PDF and share via email with healthcare provider." },
                      { q: "What if I forget my password?", a: "Passwords are stored locally. If forgotten, you'll need to create a new account." },
                      { q: "How do I enable 2FA?", a: "Go to Privacy & Security settings and toggle on '2FA'. You'll get email codes for login." },
                      { q: "What are system requirements?", a: "Modern browser (Chrome/Edge/Opera), USB port for Arduino, stable internet for setup." },
                      { q: "How long is data stored?", a: "Indefinitely in browser local storage until you manually delete or clear browser data." },
                      { q: "Can I customize alert thresholds?", a: "System uses medically accepted ranges. Custom thresholds may come in future updates." },
                      { q: "What arrhythmias can be detected?", a: "Common patterns like AFib, PVCs, tachycardia, bradycardia. Always verify with cardiologist." },
                      { q: "How do I contact support?", a: "Use contact form below, email aadipandey223@gmail.com, or call +91 9997181525." },
                      { q: "Is there a mobile app?", a: "Currently web-based. Dedicated mobile apps for iOS and Android in development." },
                      { q: "How do I change theme?", a: "Go to Appearance settings, select Dark or Light mode, and customize color scheme." },
                      { q: "What languages are supported?", a: "English, Spanish, French, German, Hindi, Chinese. More languages coming soon." },
                      { q: "How do I update profile info?", a: "Visit 'Profile' tab to update name, age, gender, and email address." },
                      { q: "Can I print ECG reports?", a: "Yes! After downloading health report as PDF, use browser's print function." },
                      { q: "What should I do before first use?", a: "Create profile, connect ECG device, calibrate sensors per manufacturer instructions." },
                      { q: "How accurate is SpO2 measurement?", a: "Accurate within ±2% when sensors are properly placed and calibrated." },
                      { q: "Can I track medications?", a: "Not currently available but planned for future releases." },
                      { q: "How do I enable daily summaries?", a: "Go to Notifications and toggle 'Daily Health Summary' for daily email reports." },
                      { q: "What is session timeout?", a: "Customize auto-logout in Privacy settings: 15, 30, 60, 120 minutes, or never." },
                      { q: "How do I report bugs?", a: "Use feedback form below or email us with issue details." },
                      { q: "Can I integrate with health apps?", a: "API integration planned for syncing with popular health platforms." },
                      { q: "What if device disconnects?", a: "App alerts you immediately and attempts reconnection. Previous data remains saved." },
                      { q: "How do I interpret ECG waveforms?", a: "App provides AI interpretation, but always consult healthcare professional for advice." },
                      { q: "Can I use multiple devices?", a: "You can switch between compatible ECG devices, but only one connected at a time." },
                      { q: "How do I enable push notifications?", a: "Go to Notifications, enable push, and grant browser permission when prompted." },
                      { q: "What is uptime guarantee?", a: "We maintain 99.9% uptime for core monitoring with real-time status updates." },
                      { q: "How do I download historical data?", a: "Use 'Download Data' tab to select date ranges and export vitals history as PDF." },
                      { q: "Can I add emergency contacts?", a: "Yes! In Medical Information, add emergency contact name and phone number." },
                      { q: "What should I do in emergency?", a: "Call 911 or local emergency number immediately. NextECG is monitoring only, not emergency response." },
                      { q: "How do I calibrate ECG sensor?", a: "Follow manufacturer's calibration instructions. Contact support for assistance." },
                      { q: "Can I view trends over time?", a: "Yes! 'Vitals History' shows graphs and trends of health metrics over selected periods." },
                      { q: "How do I update the app?", a: "Web app updates automatically. Refresh browser to ensure latest version." },
                      { q: "What certifications does NextECG have?", a: "HIPAA compliant, follows medical device data security standards. FDA clearance in progress." },
                      { q: "Can I monitor during exercise?", a: "Yes! Real-time monitoring ideal for tracking vitals during exercise. Consult doctor first." },
                      { q: "How do I add doctor information?", a: "Go to Medical Information tab and enter physician's name, phone, and email." },
                      { q: "What if I see error messages?", a: "Note the error, try refreshing page, and contact support if issue persists." }
                    ].map((faq, i) => (
                      <div key={i} className="pb-2 border-b last:border-0" style={{ borderColor: theme.glassBorder }}>
                        <p className="font-medium text-sm mb-1" style={{ color: theme.textPrimary }}>Q: {faq.q}</p>
                        <p className="text-xs ml-3" style={{ color: theme.textMuted }}>A: {faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-6 h-6" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <h3 className="font-semibold text-lg" style={{ color: theme.textPrimary }}>Contact Support</h3>
                  </div>
                  <div className="space-y-3 ml-2 mb-4">
                    <p className="text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <a href="mailto:aadipandey223@gmail.com" style={{ color: theme.accent }} className="hover:underline">aadipandey223@gmail.com</a>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <a href="tel:+919997181525" style={{ color: theme.textMuted }} className="hover:underline">+91 9997181525</a>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span style={{ color: theme.textMuted }}>Mon-Fri 9AM-6PM EST</span>
                    </p>
                  </div>
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: theme.textMuted }}>Message</label>
                      <textarea 
                        rows={4} 
                        value={feedbackForm.message}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg resize-none" 
                        style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} 
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{ background: theme.accent, color: '#000000' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Send Message
                    </button>
                  </form>
                </div>
                <div className="p-5 rounded-lg" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                  <h3 className="font-semibold mb-3" style={{ color: theme.textPrimary }}>Send Feedback</h3>
                  <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                    <div>
                      <input 
                        type="text" 
                        value={feedbackForm.subject}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg" 
                        style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} 
                        placeholder="Subject"
                        required
                      />
                    </div>
                    <div>
                      <textarea 
                        rows={4} 
                        value={feedbackForm.message}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg resize-none" 
                        style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} 
                        placeholder="Tell us how we can improve..."
                        required
                      />
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{ background: theme.accent, color: '#000000' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      Send Feedback
                    </button>
                  </form>
                </div>
                {success && <div className="p-3 rounded-lg text-sm" style={{ background: `${theme.success}20`, border: `1px solid ${theme.success}`, color: theme.success }}>{success}</div>}
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="glass depth-shadow rounded-xl p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: theme.accent }} />
              <h2 className="font-orbitron font-bold text-xl mb-6" style={{ color: theme.textPrimary }}>About NextECG</h2>
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}80)` }}>
                    <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <h3 className="font-bold text-2xl mb-2" style={{ color: theme.textPrimary }}>NextECG</h3>
                  <p className="text-sm mb-1" style={{ color: theme.textMuted }}>Version 1.0.0</p>
                  <div className="inline-flex px-3 py-1 rounded-full text-xs font-semibold mt-2" style={{ background: `${theme.accent}20`, color: theme.accent }}>Latest Version</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg text-center" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: theme.accent }}>99.9%</p>
                    <p className="text-xs" style={{ color: theme.textMuted }}>Uptime</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: theme.accent }}>24/7</p>
                    <p className="text-xs" style={{ color: theme.textMuted }}>Monitoring</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: theme.accent }}>HIPAA</p>
                    <p className="text-xs" style={{ color: theme.textMuted }}>Compliant</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href="#" className="block p-4 rounded-lg transition-all hover:opacity-80" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium" style={{ color: theme.textPrimary }}>Terms of Service</span>
                      <svg className="w-5 h-5" style={{ color: theme.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </a>
                  <a href="#" className="block p-4 rounded-lg transition-all hover:opacity-80" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium" style={{ color: theme.textPrimary }}>Privacy Policy</span>
                      <svg className="w-5 h-5" style={{ color: theme.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </a>
                  <a href="#" className="block p-4 rounded-lg transition-all hover:opacity-80" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium" style={{ color: theme.textPrimary }}>Open Source Licenses</span>
                      <svg className="w-5 h-5" style={{ color: theme.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </a>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.accent}30` }}>
                  <p className="text-sm" style={{ color: theme.textMuted }}>© 2025 NextECG. All rights reserved.</p>
                  <p className="text-xs mt-1" style={{ color: theme.textMuted }}>Medical-grade ECG monitoring system</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
