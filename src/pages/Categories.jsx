import { getCategories, addCategory, deleteCategory } from '../api/expenseApi';

import React, { useState, useEffect } from 'react';


function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [form, setForm] = useState({ name: '', color: '#4f46e5' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async () => {
    if (!form.name) {
      alert('Please enter a category name');
      return;
    }
    try {
      await addCategory(form);
      fetchCategories();
      setForm({ name: '', color: '#4f46e5' });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected category?`)) {
      try {
        await Promise.all(selectedIds.map(id => deleteCategory(id)));
        setSelectedIds([]);
        fetchCategories();
      } catch (err) {
        console.error('Error deleting categories:', err);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map(c => c.id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#111827' }}>Categories</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            {categories.length} categories
            {selectedIds.length > 0 && ` · ${selectedIds.length} selected`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedIds.length > 0 && (
            <button onClick={handleDeleteSelected} style={deleteBtnStyle}>
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button onClick={handleSelectAll} style={cancelBtnStyle}>
            {selectedIds.length === categories.length ? 'Deselect All' : 'Select All'}
          </button>
          <button onClick={() => setShowForm(!showForm)} style={primaryBtnStyle}>
            + Add Category
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{
          backgroundColor: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '12px', padding: '24px', marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>New Category</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Category Name *</label>
              <input
                style={inputStyle}
                placeholder="e.g. Food, Transport"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  style={{ width: '48px', height: '42px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', padding: '2px' }}
                />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>{form.color}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={handleSubmit} style={primaryBtnStyle}>Save Category</button>
            <button onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {categories.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>No categories yet.</p>
        ) : (
          categories.map(cat => {
            const isSelected = selectedIds.includes(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => toggleSelect(cat.id)}
                style={{
                  backgroundColor: '#fff',
                  border: isSelected ? `2px solid #4f46e5` : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  backgroundColor: isSelected ? '#eef2ff' : '#fff'
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                  border: isSelected ? '2px solid #4f46e5' : '2px solid #d1d5db',
                  backgroundColor: isSelected ? '#4f46e5' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                {/* Color dot */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  backgroundColor: cat.color + '22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: cat.color }} />
                </div>

                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>{cat.name}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{cat.color}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#111827' };
const primaryBtnStyle = { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const cancelBtnStyle = { backgroundColor: '#fff', color: '#6b7280', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' };
const deleteBtnStyle = { backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };

export default Categories;