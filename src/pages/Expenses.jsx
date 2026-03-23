import React, { useState, useEffect } from 'react';
import { getExpenses, getAllExpenses, addExpense, updateExpense, deleteExpense, getCategories } from '../api/expenseApi';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [form, setForm] = useState({
    title: '',
    amount: '',
    date: '',
    notes: '',
    category: { id: '' }
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [selectedMonth, selectedYear]);

  const fetchExpenses = async () => {
    try {
      const res = await getExpenses(selectedMonth, selectedYear);
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.date || !form.category.id) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, form);
      } else {
        await addExpense(form);
      }
      fetchExpenses();
      resetForm();
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setForm({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      notes: expense.notes || '',
      category: { id: expense.category.id }
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    }
  };

  const resetForm = () => {
    setForm({ title: '', amount: '', date: '', notes: '', category: { id: '' } });
    setEditingExpense(null);
    setShowForm(false);
  };

  // Filter by search
  const filtered = expenses.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

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
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#111827' }}>Expenses</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            {sorted.length} transactions · Total: ₹{totalAmount.toLocaleString()}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} style={primaryBtnStyle}>
          + Add Expense
        </button>
      </div>

      {/* Filters Row */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '20px',
        backgroundColor: '#fff', padding: '16px', borderRadius: '12px',
        border: '1px solid #e5e7eb', flexWrap: 'wrap'
      }}>
        {/* Month */}
        <select
          style={selectStyle}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {months.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        {/* Year */}
        <select
          style={selectStyle}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Search */}
        <input
          style={{ ...selectStyle, flex: 1, minWidth: '200px' }}
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Sort */}
        <select
          style={selectStyle}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div style={{
          backgroundColor: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '12px', padding: '24px', marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input
                style={inputStyle}
                placeholder="e.g. Swiggy order"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Amount (₹) *</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="e.g. 620"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Date *</label>
              <input
                style={inputStyle}
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
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
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notes</label>
              <input
                style={inputStyle}
                placeholder="Optional notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={handleSubmit} style={primaryBtnStyle}>
              {editingExpense ? 'Update Expense' : 'Save Expense'}
            </button>
            <button onClick={resetForm} style={cancelBtnStyle}>Cancel</button>
          </div>
        </div>
      )}

      {/* Expense Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {sorted.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            No expenses found for this month.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Notes</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((expense, index) => (
                <tr key={expense.id} style={{
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                }}>
                  <td style={tdStyle}>{expense.title}</td>
                  <td style={tdStyle}>
                    <span style={{
                      backgroundColor: expense.category?.color + '22',
                      color: expense.category?.color,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {expense.category?.name}
                    </span>
                  </td>
                  <td style={tdStyle}>{expense.date}</td>
                  <td style={{ ...tdStyle, color: '#9ca3af' }}>{expense.notes || '—'}</td>
                  <td style={{ ...tdStyle, fontWeight: '600', color: '#111827' }}>
                    ₹{expense.amount.toLocaleString()}
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(expense)} style={editBtnStyle}>Edit</button>
                    <button onClick={() => handleDelete(expense.id)} style={deleteBtnStyle}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '500',
  color: '#374151', marginBottom: '6px'
};
const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
  borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#111827'
};
const selectStyle = {
  padding: '10px 12px', border: '1px solid #d1d5db',
  borderRadius: '8px', fontSize: '14px', outline: 'none',
  color: '#111827', backgroundColor: '#fff', cursor: 'pointer'
};
const primaryBtnStyle = {
  backgroundColor: '#4f46e5', color: '#fff', border: 'none',
  padding: '10px 20px', borderRadius: '8px', fontSize: '14px',
  fontWeight: '600', cursor: 'pointer'
};
const cancelBtnStyle = {
  backgroundColor: '#fff', color: '#6b7280', border: '1px solid #d1d5db',
  padding: '10px 24px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer'
};
const editBtnStyle = {
  backgroundColor: '#eef2ff', color: '#4f46e5', border: 'none',
  padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
  fontWeight: '600', cursor: 'pointer', marginRight: '8px'
};
const deleteBtnStyle = {
  backgroundColor: '#fef2f2', color: '#ef4444', border: 'none',
  padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
  fontWeight: '600', cursor: 'pointer'
};
const thStyle = {
  padding: '12px 16px', textAlign: 'left', fontSize: '12px',
  fontWeight: '600', color: '#6b7280', textTransform: 'uppercase',
  letterSpacing: '0.05em'
};
const tdStyle = {
  padding: '14px 16px', fontSize: '14px', color: '#374151'
};

export default Expenses;