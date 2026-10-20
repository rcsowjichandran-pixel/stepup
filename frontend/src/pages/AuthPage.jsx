import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ setCurrentPage }) {
  const { login, register, isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('user@stepup.in'); // default test user
  const [loginPassword, setLoginPassword] = useState('user123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const res = await login(loginEmail, loginPassword);
    setLoading(false);
    if (res.success) {
      setSuccess('Logged in successfully! Redirecting...');
      setTimeout(() => setCurrentPage('home'), 1200);
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const names = regName.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    const res = await register({
      email: regEmail,
      password: regPassword,
      first_name: firstName,
      last_name: lastName
    });
    setLoading(false);

    if (res.success) {
      setSuccess('Account created successfully! Welcome to StepUp.');
      setTimeout(() => setCurrentPage('home'), 1200);
    } else {
      setError(res.error || 'Registration failed. Please check details.');
    }
  };

  const handleGoogleMock = () => {
    setError(null);
    setLoading(true);
    setTimeout(async () => {
      // Auto login with demo account
      const res = await login('user@stepup.in', 'user123');
      setLoading(false);
      if (res.success) {
        setSuccess('Logged in via Google account (Rohan Sharma)!');
        setTimeout(() => setCurrentPage('home'), 1000);
      }
    }, 700);
  };

  return (
    <div className="auth-page" style={{ padding: '36px 20px 70px 20px', minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Back Link */}
      <div style={{ width: '100%', maxWidth: '440px', marginBottom: '16px' }}>
        <button
          onClick={() => setCurrentPage('home')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#2F4F4F',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Auth Card (matching Figma Screenshot 5) */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 30px rgba(47, 79, 79, 0.08)',
        padding: '32px 28px',
        position: 'relative'
      }}>
        
        {/* Tab Switcher: [Login] [Register] */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: '#F1F5F5',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '28px'
        }}>
          <button
            onClick={() => { setActiveTab('login'); setError(null); setSuccess(null); }}
            style={{
              padding: '10px 0',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: activeTab === 'login' ? '#2F4F4F' : 'transparent',
              color: activeTab === 'login' ? '#FFFFFF' : '#555555',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s'
            }}
          >
            Log In
          </button>
          
          <button
            onClick={() => { setActiveTab('register'); setError(null); setSuccess(null); }}
            style={{
              padding: '10px 0',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: activeTab === 'register' ? '#2F4F4F' : 'transparent',
              color: activeTab === 'register' ? '#FFFFFF' : '#555555',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s'
            }}
          >
            Register
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFEBEE',
            border: '1px solid #FFCDD2',
            color: '#C62828',
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '13px',
            marginBottom: '18px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#E8F5E9',
            border: '1px solid #A5D6A7',
            color: '#2E7D32',
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '13px',
            marginBottom: '18px'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            
            {/* Email Id */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Email Id
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2F4F4F'}
                  onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                />
              </div>
            </div>

            {/* Password with Eye Toggle */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2F4F4F'}
                  onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#888888',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right', marginBottom: '22px' }}>
              <button
                type="button"
                onClick={() => alert('Password reset instructions sent to your registered email address.')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFA0A0',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Log In Button in #2F4F4F */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#2F4F4F',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 12px rgba(47, 79, 79, 0.2)',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E3333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F4F4F'}
            >
              {loading ? 'Authenticating...' : 'Log In'}
            </button>

            {/* Or Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '22px 0',
              color: '#888888',
              fontSize: '12px',
              textTransform: 'uppercase'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              <span style={{ padding: '0 12px' }}>Or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={handleGoogleMock}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                color: '#333333',
                border: '1px solid #CBD5E1',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Bottom Switch Tab */}
            <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#666666' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFA0A0',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Register
              </button>
            </div>

          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            
            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Full Name
              </label>
              <input 
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Rohan Sharma"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#2F4F4F'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
              />
            </div>

            {/* Email Id */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Email Id
              </label>
              <input 
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="rohan@example.com"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#2F4F4F'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Password (min 6 chars)
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create secure password"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2F4F4F'}
                  onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#888888',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#2F4F4F',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 12px rgba(47, 79, 79, 0.2)',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E3333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F4F4F'}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Bottom Switch Tab */}
            <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#666666' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFA0A0',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Log In
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
