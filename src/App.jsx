import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';

function pageName(pathname) {
  if (pathname === '/') return 'Dashboard';
  if (pathname === '/expenses') return 'Expenses';
  if (pathname === '/categories') return 'Categories';
  if (pathname === '/budgets') return 'Budgets';
  return '';
}

function Layout({ onLogout }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('expensio_user') || '{}');
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #fdf4ff 100%)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
          padding: '14px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 8px rgba(139,92,246,0.06)'
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e1b4b' }}>
              {pageName(location.pathname)}
            </div>
            <div style={{ fontSize: '12px', color: '#a78bfa', marginTop: '2px' }}>{today}</div>
          </div>

          {/* User + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</span>
            <button
              onClick={onLogout}
              style={{
                backgroundColor: '#fef2f2', color: '#ef4444',
                border: '1px solid #fecaca', padding: '7px 14px',
                borderRadius: '8px', fontSize: '13px',
                fontWeight: '500', cursor: 'pointer'
              }}
            >
              Logout
            </button>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '700', fontSize: '14px',
              boxShadow: '0 2px 8px rgba(124,58,237,0.3)'
            }}>
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem('expensio_token')
);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
  localStorage.removeItem('expensio_user');
  localStorage.removeItem('expensio_token');
  setIsLoggedIn(false);
};

  return (
    <Router>
      {isLoggedIn
        ? <Layout onLogout={handleLogout} />
        : <Login onLogin={handleLogin} />
      }
    </Router>
  );
}

export default App;