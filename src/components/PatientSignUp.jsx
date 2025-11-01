import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BackgroundAnimation from './BackgroundAnimation';

const PatientSignUp = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const generatePatientId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PAT-${year}-${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.age || !formData.gender || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if email already exists
    const existingPatients = JSON.parse(localStorage.getItem('nextECG_patients') || '[]');
    if (existingPatients.find(p => p.email === formData.email)) {
      setError('Email already registered. Please login instead.');
      return;
    }

    // Create patient data
    const patientId = generatePatientId();
    const newPatient = {
      id: patientId,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      email: formData.email,
      password: formData.password, // In production, hash this!
      createdAt: new Date().toISOString(),
      lastCheckup: new Date().toISOString(),
      bloodType: 'Unknown', // Can be updated later
    };

    // Store patient data
    existingPatients.push(newPatient);
    localStorage.setItem('nextECG_patients', JSON.stringify(existingPatients));

    setSuccess(true);
    
    // Auto login after successful registration
    setTimeout(() => {
      const result = login('patient', {
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/patient');
      } else {
        setError('Registration successful but login failed. Please try logging in manually.');
        setTimeout(() => navigate('/login'), 2000);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundAnimation />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              className="font-orbitron font-bold text-3xl md:text-4xl mb-2"
              style={{ color: theme.textPrimary }}
            >
              Patient Sign Up
            </h1>
            <p 
              className="text-sm md:text-base"
              style={{ color: theme.textMuted }}
            >
              Create your patient account
            </p>
            <div 
              className="w-16 h-1 mx-auto mt-3 rounded-full"
              style={{ background: theme.accent }}
            />
          </div>

          {/* Sign Up Form */}
          <div className="glass glass-hover depth-shadow rounded-xl p-8 relative overflow-hidden slide-in">
            <div 
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: theme.accent }}
            />

            {success ? (
              <div className="text-center py-8">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: `${theme.success}20`,
                    border: `2px solid ${theme.success}`,
                    color: theme.success,
                  }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 
                  className="font-orbitron font-bold text-xl mb-2"
                  style={{ color: theme.textPrimary }}
                >
                  Account Created!
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: theme.textMuted }}
                >
                  Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label 
                    className="block text-xs font-medium mb-2"
                    style={{ color: theme.textMuted }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: theme.secondary,
                      border: `1px solid ${theme.glassBorder}`,
                      color: theme.textPrimary,
                    }}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label 
                      className="block text-xs font-medium mb-2"
                      style={{ color: theme.textMuted }}
                    >
                      Age *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: theme.secondary,
                        border: `1px solid ${theme.glassBorder}`,
                        color: theme.textPrimary,
                      }}
                      placeholder="Age"
                      required
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-xs font-medium mb-2"
                      style={{ color: theme.textMuted }}
                    >
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: theme.secondary,
                        border: `1px solid ${theme.glassBorder}`,
                        color: theme.textPrimary,
                      }}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label 
                    className="block text-xs font-medium mb-2"
                    style={{ color: theme.textMuted }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: theme.secondary,
                      border: `1px solid ${theme.glassBorder}`,
                      color: theme.textPrimary,
                    }}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label 
                    className="block text-xs font-medium mb-2"
                    style={{ color: theme.textMuted }}
                  >
                    Create Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: theme.secondary,
                      border: `1px solid ${theme.glassBorder}`,
                      color: theme.textPrimary,
                    }}
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label 
                    className="block text-xs font-medium mb-2"
                    style={{ color: theme.textMuted }}
                  >
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: theme.secondary,
                      border: `1px solid ${theme.glassBorder}`,
                      color: theme.textPrimary,
                    }}
                    placeholder="Re-enter password"
                    required
                  />
                </div>

                {error && (
                  <div 
                    className="p-3 rounded-lg text-sm"
                    style={{
                      background: `${theme.danger}20`,
                      border: `1px solid ${theme.danger}`,
                      color: theme.danger,
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90 hover:scale-105"
                  style={{
                    background: theme.accent,
                    color: '#000000',
                  }}
                >
                  Create Account
                </button>
              </form>
            )}

            {/* Switch to Login */}
            <div className="mt-6 text-center">
              <p 
                className="text-xs mb-3"
                style={{ color: theme.textMuted }}
              >
                Already have an account?
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium transition-all hover:opacity-80"
                style={{ color: theme.accent }}
              >
                Login Instead →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSignUp;

