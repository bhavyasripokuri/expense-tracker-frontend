import React, { useState, useEffect } from 'react';
import { getBudgets, addBudget, deleteBudget } from '../api/expenseApi';
import { getCategories, getExpenses } from '../api/expenseApi';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [form, setForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    limitAmount: '',
    category: { id: '' }
  });

  useEffect(() => {
    fetchAll();
  }, [selectedMonth, selectedYear]);

  const fetchAll = async () => {
    try {
      const [budgetRes, catRes, expRes] = await Promise.all([
        getBudgets(selectedMonth, selectedYear),
        getCategories(),
        getExpenses(selectedMonth, selectedYear)
      ]);
      setBudgets(budgetRes.data);
      setCategories(catRes.data);
      setExpenses(expRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async () => {
    if (!form.limitAmount || !form.category.id) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await addBudget({ ...form, month: selectedMonth, year: selectedYear });
      fetchAll();
      setForm({ month: selectedMonth, year: selectedYear, limitAmount: '', category: { id: '' } });
      setShowForm(false);
    } catch (err) {
      console.error('Error saving budget:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      try {
        await deleteBudget(id);
        fetchAll();
      } catch (err) {
        console.error('Error deleting budget:', err);
      }
    }
  };

  // Calculate spent amount per category
  const getSpent = (categoryId) => {
    return expenses
      .filter(e => e.category?.id === categoryId)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const years = [2024, 2025, 2026, 2027];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#111827' }}>Budgets</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Set monthly spending limits per category
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={primaryBtnStyle}>
          + Set Budget
        </button>
      </div>

      {/* Month Year Filter */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '20px',
        backgroundColor: '#fff', padding: '16px',
        borderRadius: '12px', border: '1px solid #e5e7eb'
      }}>
        <select
          style={selectStyle}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {months.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select
          style={selectStyle}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Add Budget Form */}
      {showForm && (
        <div style={{
          backgroundColor: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '12px', padding: '24px', marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
            Set Budget for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                style={inputStyle}
                value={form.category.id}
                onChange={(e) => setForm({ ...form, category: { id: e.target.value } })}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Budget Limit (₹) *</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="e.g. 5000"
                value={form.limitAmount}
                onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={handleSubmit} style={primaryBtnStyle}>Save Budget</button>
            <button onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
          </div>
        </div>
      )}

      {/* Budget Cards with Progress Bars */}
      {budgets.length === 0 ? (
        <div style={{
          backgroundColor: '#fff', borderRadius: '12px',
          border: '1px solid #e5e7eb', padding: '48px',
          textAlign: 'center', color: '#9ca3af'
        }}>
          No budgets set for this month. Click "+ Set Budget" to add one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {budgets.map(budget => {
            const spent = getSpent(budget.category?.id);
            const limit = budget.limitAmount;
            const percentage = Math.min(Math.round((spent / limit) * 100), 100);
            const isOverBudget = spent > limit;
            const barColor = isOverBudget ? '#ef4444' : percentage > 80 ? '#f59e0b' : '#4f46e5';

            return (
              <div key={budget.id} style={{
                backgroundColor: '#fff', border: '1px solid #e5e7eb',
                borderRadius: '12px', padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      backgroundColor: budget.category?.color + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '14px', height: '14px', borderRadius: '50%',
                        backgroundColor: budget.category?.color
                      }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                        {budget.category?.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                        ₹{spent.toLocaleString()} spent of ₹{limit.toLocaleString()} limit
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isOverBudget && (
                      <span style={{
                        backgroundColor: '#fef2f2', color: '#ef4444',
                        padding: '4px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: '600'
                      }}>
                        Over budget!
                      </span>
                    )}
                    <span style={{
                      fontSize: '16px', fontWeight: '700',
                      color: isOverBudget ? '#ef4444' : '#111827'
                    }}>
                      {percentage}%
                    </span>
                    <button onClick={() => handleDelete(budget.id)} style={deleteBtnStyle}>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%', height: '10px', backgroundColor: '#f3f4f6',
                  borderRadius: '10px', overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`, height: '100%',
                    backgroundColor: barColor, borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>₹0</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    ₹{(limit - spent) > 0 ? (limit - spent).toLocaleString() + ' remaining' : 'Exceeded by ₹' + (spent - limit).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>₹{limit.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#111827' };
const selectStyle = { padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#111827', backgroundColor: '#fff', cursor: 'pointer' };
const primaryBtnStyle = { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const cancelBtnStyle = { backgroundColor: '#fff', color: '#6b7280', border: '1px solid #d1d5db', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' };
const deleteBtnStyle = { backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' };

export default Budgets;