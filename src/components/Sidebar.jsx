import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '⊞' },
    { path: '/expenses', label: 'Expenses', icon: '₹' },
    { path: '/categories', label: 'Categories', icon: '⊹' },
    { path: '/budgets', label: 'Budgets', icon: '◎' },
  ];

  return (
    <div style={{
      width: '240px',
      background: 'linear-gradient(160deg, #ffffff 0%, #f3f0ff 100%)',
      borderRight: '1px solid rgba(139, 92, 246, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      boxShadow: '2px 0 12px rgba(139, 92, 246, 0.07)'
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 20px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.08)'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#7c3aed',
          letterSpacing: '-0.5px'
        }}>
          💰 Expensio
        </div>
        <div style={{ fontSize: '11px', color: '#a78bfa', marginTop: '4px' }}>
          Personal Finance Tracker
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{
          fontSize: '10px',
          color: '#c4b5fd',
          letterSpacing: '0.1em',
          padding: '0 12px',
          marginBottom: '8px',
          fontWeight: '600'
        }}>
          MENU
        </div>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 14px',
                margin: '3px 0',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#7c3aed' : '#6b7280',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(124,58,237,0.1), rgba(167,139,250,0.06))'
                  : 'transparent',
                borderLeft: isActive ? '3px solid #7c3aed' : '3px solid transparent',
                boxShadow: isActive ? '0 2px 8px rgba(124,58,237,0.08)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '12px 24px', fontSize: '11px', color: '#c4b5fd' }}>
        Expensio v1.0
      </div>
    </div>
  );
}

export default Sidebar;