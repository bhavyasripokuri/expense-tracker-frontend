import React, { useState } from 'react';
import { login, register } from '../api/expenseApi';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = isRegister
        ? await register({ email, password })
        : await login({ email, password });

      localStorage.setItem('expensio_token', res.data.token);
      localStorage.setItem('expensio_user', JSON.stringify({ email: res.data.email }));
      onLogin();
    } catch (err) {
      setError(err.response?.data || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #fdf4ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'flex', width: '900px', minHeight: '520px',
        borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(124,58,237,0.15)'
      }}>

        {/* Left panel */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(160deg, #ffffff 0%, #f3f0ff 100%)',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#7c3aed' }}>
              💰 Expensio
            </div>
            <div style={{ fontSize: '13px', color: '#a78bfa', marginTop: '4px' }}>
              Personal Finance Tracker
            </div>
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1e1b4b', marginBottom: '8px' }}>
            {isRegister ? 'Create account' : 'Welcome back!'}
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
            {isRegister ? 'Sign up to get started' : 'Sign in to manage your expenses'}
          </p>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              color: '#ef4444', padding: '12px 16px', borderRadius: '10px',
              fontSize: '13px', marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          {/* Toggle register/login */}
          <div style={{ marginTop: '20px', fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <span
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ color: '#7c3aed', fontWeight: '600', cursor: 'pointer', marginLeft: '6px' }}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(160deg, #7c3aed 0%, #a78bfa 50%, #c084fc 100%)',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>💸</div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.3' }}>
            Take control of your finances
          </h3>
          <p style={{ fontSize: '14px', opacity: 0.85, lineHeight: '1.7', maxWidth: '280px' }}>
            Track expenses, set budgets, and get insights into your spending habits all in one place.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px', width: '100%', maxWidth: '280px' }}>
            {[
              '📊 Visual spending charts',
              '🎯 Category budgets',
              '📅 Monthly tracking',
              '⚡ Real time updates'
            ].map((feature, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '10px', padding: '10px 16px',
                fontSize: '13px', fontWeight: '500',
                textAlign: 'left', backdropFilter: 'blur(8px)'
              }}>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '500',
  color: '#374151', marginBottom: '6px'
};

const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1px solid #e5e7eb', borderRadius: '10px',
  fontSize: '14px', outline: 'none', color: '#111827',
  backgroundColor: '#fff'
};

export default Login;