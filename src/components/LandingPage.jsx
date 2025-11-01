import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import HeartbeatPulseBackground from './HeartbeatPulseBackground';

const LandingPage = () => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: theme.background }}>
      {/* Professional Heartbeat Pulse Animation Background */}
      <HeartbeatPulseBackground />
      
      {/* Glassmorphism Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-navbar-scrolled' : 'glass-navbar'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center glass-logo"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}20, ${theme.accentSecondary}20)`,
                  border: `1px solid ${theme.glassBorder}`,
                }}
              >
                <svg className="w-6 h-6" style={{ color: theme.accent }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span 
                className="text-xl font-bold tracking-tight"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  color: theme.text 
                }}
              >
                NextECG
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="nav-link" style={{ color: theme.textSecondary }}>Features</a>
              <a href="#technology" className="nav-link" style={{ color: theme.textSecondary }}>Technology</a>
              <a href="#about" className="nav-link" style={{ color: theme.textSecondary }}>About</a>
              <a href="#contact" className="nav-link" style={{ color: theme.textSecondary }}>Contact</a>
            </div>

            {/* CTA Button */}
            <Link to="/dashboard">
              <button 
                className="glass-button px-6 py-2.5 rounded-lg font-semibold transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                  color: '#000',
                  border: `1px solid ${theme.accent}`,
                }}
              >
                Launch Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-background"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass-badge"
              style={{
                background: `${theme.secondary}40`,
                border: `1px solid ${theme.glassBorder}`,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.success }}></span>
              <span style={{ color: theme.textMuted, fontSize: '0.875rem' }}>
                Real-time ECG Monitoring Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                color: theme.text,
                letterSpacing: '-0.02em'
              }}
            >
              Professional ECG
              <br />
              <span style={{ 
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Monitoring System
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
              style={{ color: theme.textSecondary, lineHeight: '1.6' }}
            >
              Advanced real-time cardiac monitoring powered by Arduino Nano and AI-driven analytics. 
              Compatible with Chords Serial Plotter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <button 
                  className="glass-button-large px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                    color: '#000',
                    border: `1px solid ${theme.accent}`,
                  }}
                >
                  Get Started
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <a href="#features">
                <button 
                  className="glass-button-outline px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  style={{
                    background: `${theme.secondary}60`,
                    color: theme.text,
                    border: `1px solid ${theme.glassBorder}`,
                  }}
                >
                  Learn More
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Floating Cards Preview */}
        <div className="container mx-auto mt-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '⚡', title: 'Real-time', desc: '250Hz sampling rate' },
              { icon: '🎯', title: 'Accurate', desc: 'R-peak detection' },
              { icon: '🔗', title: 'Connected', desc: 'WebSocket streaming' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="glass-card p-6 rounded-2xl transition-all duration-300 hover:scale-105 fade-in"
                style={{
                  background: `${theme.secondary}40`,
                  border: `1px solid ${theme.glassBorder}`,
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: theme.text }}>{item.title}</h3>
                <p style={{ color: theme.textMuted }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                color: theme.text 
              }}
            >
              Powerful Features
            </h2>
            <p className="text-xl" style={{ color: theme.textSecondary }}>
              Everything you need for professional ECG monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Live ECG Plotting',
                desc: 'Real-time waveform visualization with Chart.js at 250Hz sampling'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Heart Rate Detection',
                desc: 'Automatic R-peak detection and BPM calculation with trend analysis'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Vital Signs',
                desc: 'Monitor SpO2, blood pressure, temperature, and respiration rate'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Arduino Integration',
                desc: 'Compatible with Arduino Nano, Uno, and Mega boards via USB'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Chords Compatible',
                desc: 'Full compatibility with Upside Down Labs Chords binary protocol'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                ),
                title: 'Historical Data',
                desc: 'Track and analyze vitals history with beautiful visualizations'
              },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="glass-feature-card p-8 rounded-2xl transition-all duration-300 hover:scale-105 fade-in"
                style={{
                  background: `${theme.secondary}40`,
                  border: `1px solid ${theme.glassBorder}`,
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}20, ${theme.accentSecondary}20)`,
                    border: `1px solid ${theme.accent}40`,
                    color: theme.accent
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: theme.text }}>
                  {feature.title}
                </h3>
                <p style={{ color: theme.textSecondary, lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 px-6" style={{ background: `${theme.secondary}20` }}>
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-6"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    color: theme.text 
                  }}
                >
                  Built with Modern Technology
                </h2>
                <p className="text-lg mb-8" style={{ color: theme.textSecondary, lineHeight: '1.8' }}>
                  NextECG combines cutting-edge web technologies with professional-grade hardware 
                  to deliver a reliable, real-time cardiac monitoring solution.
                </p>
                <div className="space-y-4">
                  {[
                    'React + Vite for lightning-fast UI',
                    'WebSocket for real-time data streaming',
                    'Node.js backend with SerialPort',
                    'Chords binary packet protocol',
                    'Chart.js for smooth visualizations',
                    'Arduino firmware with 250Hz sampling',
                  ].map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ background: theme.accent }}
                      ></div>
                      <span style={{ color: theme.text }}>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div 
                className="glass-tech-card p-8 rounded-2xl"
                style={{
                  background: `${theme.secondary}60`,
                  border: `1px solid ${theme.glassBorder}`,
                }}
              >
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ color: theme.text }}>Arduino Integration</span>
                      <span style={{ color: theme.accent }}>100%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: theme.secondary }}>
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: '100%', background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentSecondary})` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ color: theme.text }}>Real-time Performance</span>
                      <span style={{ color: theme.accent }}>98%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: theme.secondary }}>
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: '98%', background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentSecondary})` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ color: theme.text }}>Signal Accuracy</span>
                      <span style={{ color: theme.accent }}>95%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: theme.secondary }}>
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: '95%', background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentSecondary})` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                color: theme.text 
              }}
            >
              About NextECG
            </h2>
            <p className="text-lg mb-8" style={{ color: theme.textSecondary, lineHeight: '1.8' }}>
              NextECG is an open-source real-time ECG monitoring platform designed for medical professionals, 
              researchers, and enthusiasts. Built on the Arduino ecosystem and compatible with Upside Down Labs' 
              Chords protocol, it provides hospital-grade monitoring at an accessible price point.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div>
                <div 
                  className="text-5xl font-bold mb-2"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  250Hz
                </div>
                <p style={{ color: theme.textSecondary }}>Sampling Rate</p>
              </div>
              <div>
                <div 
                  className="text-5xl font-bold mb-2"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  8Ch
                </div>
                <p style={{ color: theme.textSecondary }}>ADC Channels</p>
              </div>
              <div>
                <div 
                  className="text-5xl font-bold mb-2"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  &lt;1ms
                </div>
                <p style={{ color: theme.textSecondary }}>Latency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div 
            className="glass-cta-card max-w-4xl mx-auto p-12 rounded-3xl text-center"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}10, ${theme.accentSecondary}10)`,
              border: `1px solid ${theme.accent}40`,
            }}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                color: theme.text 
              }}
            >
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8" style={{ color: theme.textSecondary }}>
              Connect your Arduino and start monitoring in minutes
            </p>
            <Link to="/dashboard">
              <button 
                className="glass-button-large px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                  color: '#000',
                  border: `1px solid ${theme.accent}`,
                }}
              >
                Launch Dashboard Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 px-6"
        style={{
          borderTop: `1px solid ${theme.glassBorder}`,
          background: `${theme.secondary}20`
        }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}20, ${theme.accentSecondary}20)`,
                    border: `1px solid ${theme.glassBorder}`,
                  }}
                >
                  <svg className="w-5 h-5" style={{ color: theme.accent }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="font-bold" style={{ fontFamily: 'Orbitron, sans-serif', color: theme.text }}>
                  NextECG
                </span>
              </div>
              <p style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                Professional ECG monitoring powered by Arduino and modern web technologies.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: theme.text }}>Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="footer-link" style={{ color: theme.textSecondary }}>Features</a></li>
                <li><Link to="/dashboard" className="footer-link" style={{ color: theme.textSecondary }}>Dashboard</Link></li>
                <li><a href="#technology" className="footer-link" style={{ color: theme.textSecondary }}>Technology</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: theme.text }}>Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="footer-link" style={{ color: theme.textSecondary }}>Documentation</a></li>
                <li><a href="#" className="footer-link" style={{ color: theme.textSecondary }}>GitHub</a></li>
                <li><a href="#" className="footer-link" style={{ color: theme.textSecondary }}>Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: theme.text }}>Contact</h4>
              <ul className="space-y-2">
                <li><a href="#contact" className="footer-link" style={{ color: theme.textSecondary }}>Get in Touch</a></li>
                <li><a href="#" className="footer-link" style={{ color: theme.textSecondary }}>Report Issue</a></li>
              </ul>
            </div>
          </div>
          <div 
            className="pt-8 text-center"
            style={{
              borderTop: `1px solid ${theme.glassBorder}`,
              color: theme.textMuted,
              fontSize: '0.875rem'
            }}
          >
            <p>© 2025 NextECG. Built with Arduino Nano & Chords Protocol.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
