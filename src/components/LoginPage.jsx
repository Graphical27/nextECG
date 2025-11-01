import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import BackgroundAnimation from './BackgroundAnimation';

const LoginPage = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      if (userType === 'doctor') {
        const result = login('doctor', {
          username: formData.email === 'doctor@nextecg.com' ? 'doctor' : formData.email,
          password: formData.password,
          name: 'Dr. Smith',
          id: 'DOC001',
        });
        
        if (result && result.success) {
          navigate('/doctor');
        } else {
          setError(result?.error || 'Invalid credentials. Use doctor@nextecg.com / doctor123');
        }
      } else {
        const result = login('patient', { 
          email: formData.email, 
          password: formData.password 
        });
        
        if (result && result.success) {
          navigate('/patient');
        } else {
          setError(result?.error || 'Invalid email or password. Please sign up if you don\'t have an account.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <BackgroundAnimation />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse" style={{ background: theme.accent }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: theme.accent, animation: 'float 8s ease-in-out infinite' }} />
      </div>
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8 slide-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}80)`, boxShadow: `0 10px 40px ${theme.accent}40` }}>
            <svg className="w-12 h-12" style={{ color: '#000000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <h1 className="font-orbitron font-bold text-4xl mb-2" style={{ color: theme.textPrimary }}>NextECG</h1>
          <p className="text-base" style={{ color: theme.textMuted }}>Welcome back to your health dashboard</p>
        </div>
        <div className="glass depth-shadow-lg rounded-2xl p-8 relative overflow-hidden" style={{ animation: 'slideInUp 0.6s ease-out' }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: theme.accent }} />
          <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}` }}>
            <button type="button" onClick={() => setUserType('patient')} className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300" style={{ background: userType === 'patient' ? theme.accent : 'transparent', color: userType === 'patient' ? '#000000' : theme.textMuted }}>
              <div className="flex items-center justify-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>Patient</div>
            </button>
            <button type="button" onClick={() => setUserType('doctor')} className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300" style={{ background: userType === 'doctor' ? theme.accent : 'transparent', color: userType === 'doctor' ? '#000000' : theme.textMuted }}>
              <div className="flex items-center justify-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Doctor</div>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: theme.textMuted }}>Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: theme.textMuted }}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg></div>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder={userType === 'doctor' ? 'doctor@nextecg.com' : 'your.email@example.com'} autoComplete="email" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: theme.textMuted }}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: theme.textMuted }}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all" style={{ background: theme.secondary, border: `1px solid ${theme.glassBorder}`, color: theme.textPrimary }} placeholder={userType === 'doctor' ? 'doctor123' : ''} autoComplete="current-password" required />
              </div>
            </div>
            {error && (<div className="p-4 rounded-xl text-sm font-medium flex items-center gap-3" style={{ background: `${theme.danger}20`, border: `1px solid ${theme.danger}`, color: theme.danger }}><svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>)}
            <button type="submit" disabled={isLoading} className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" style={{ background: theme.accent, color: '#000000', boxShadow: `0 10px 30px ${theme.accent}40` }}>
              {isLoading ? (<><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Logging in...</>) : (<>Sign In<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>)}
            </button>
          </form>
          {userType === 'patient' && (<div className="mt-6 text-center"><p className="text-sm mb-2" style={{ color: theme.textMuted }}>Don''t have an account?</p><Link to="/patient/signup" className="font-semibold text-base transition-all hover:opacity-80 inline-flex items-center gap-2" style={{ color: theme.accent }}>Create Patient Account<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></Link></div>)}
          {userType === 'doctor' && (<div className="mt-6 p-4 rounded-xl text-xs" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.accent}30`, color: theme.textMuted }}><p className="font-semibold mb-1" style={{ color: theme.accent }}>Demo Credentials:</p><p>Email: doctor@nextecg.com</p><p>Password: doctor123</p></div>)}
        </div>
        <div className="text-center mt-6"><p className="text-xs" style={{ color: theme.textMuted }}> 2025 NextECG. Medical-grade ECG monitoring system.</p></div>
      </div>
      <style>{`@keyframes slideInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default LoginPage;
