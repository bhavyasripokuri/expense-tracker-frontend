import React, { useState, useEffect } from 'react';
import { getAllExpenses, getCategories, getMonthlySummary, getBudgets, getExpenses } from '../api/expenseApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

function Dashboard() {
  const [allExpenses, setAllExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const monthName = today.toLocaleString('default', { month: 'long' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allExpRes, monthExpRes, catRes, summaryRes, budgetRes] = await Promise.all([
        getAllExpenses(),
        getExpenses(month, year),
        getCategories(),
        getMonthlySummary(month, year),
        getBudgets(month, year)
      ]);
      setAllExpenses(allExpRes.data);
      setMonthlyExpenses(monthExpRes.data);
      setCategories(catRes.data);
      setMonthlyTotal(summaryRes.data || 0);
      setBudgets(budgetRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const totalSpent = allExpenses.reduce((sum, e) => sum + e.amount, 0);

  const recentExpenses = [...monthlyExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const categoryData = categories.map(cat => {
    const total = monthlyExpenses
      .filter(e => e.category?.id === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.name, amount: total, color: cat.color };
  }).filter(c => c.amount > 0);

  const topCategory = categoryData.reduce(
    (max, c) => (c.amount > (max?.amount || 0) ? c : max), null
  );

  const getSpent = (categoryId) => {
    return monthlyExpenses
      .filter(e => e.category?.id === categoryId)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const overBudgetCount = budgets.filter(b => getSpent(b.category?.id) > b.limitAmount).length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#111827' }}>Dashboard</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          {monthName} {year} overview
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={cardStyle}>
          <div style={metricLabelStyle}>Total Spent (All time)</div>
          <div style={metricValueStyle}>₹{totalSpent.toLocaleString()}</div>
        </div>
        <div style={cardStyle}>
          <div style={metricLabelStyle}>This Month</div>
          <div style={metricValueStyle}>₹{monthlyTotal.toLocaleString()}</div>
        </div>
        <div style={cardStyle}>
          <div style={metricLabelStyle}>Transactions</div>
          <div style={metricValueStyle}>{monthlyExpenses.length}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>this month</div>
        </div>
        <div style={{ ...cardStyle, backgroundColor: overBudgetCount > 0 ? '#fef2f2' : '#f0fdf4' }}>
          <div style={metricLabelStyle}>Budget Alerts</div>
          <div style={{ ...metricValueStyle, color: overBudgetCount > 0 ? '#ef4444' : '#16a34a' }}>
            {overBudgetCount > 0 ? `${overBudgetCount} over budget!` : 'All good!'}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Bar Chart */}
        <div style={panelStyle}>
          <h3 style={panelTitleStyle}>Spending by Category — {monthName}</h3>
          {categoryData.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div style={panelStyle}>
          <h3 style={panelTitleStyle}>Spending breakdown</h3>
          {categoryData.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Budget Progress + Recent Expenses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Budget Progress */}
        <div style={panelStyle}>
          <h3 style={panelTitleStyle}>Budget Progress — {monthName}</h3>
          {budgets.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No budgets set for this month.</p>
          ) : (
            budgets.map(budget => {
              const spent = getSpent(budget.category?.id);
              const limit = budget.limitAmount;
              const percentage = Math.min(Math.round((spent / limit) * 100), 100);
              const isOver = spent > limit;
              const barColor = isOver ? '#ef4444' : percentage > 80 ? '#f59e0b' : '#4f46e5';

              return (
                <div key={budget.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                      {budget.category?.name}
                    </span>
                    <span style={{ fontSize: '13px', color: isOver ? '#ef4444' : '#6b7280' }}>
                      ₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: barColor, borderRadius: '10px' }} />
                  </div>
                  {isOver && (
                    <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>
                      Over by ₹{(spent - limit).toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Recent Expenses */}
        <div style={panelStyle}>
          <h3 style={panelTitleStyle}>Recent Expenses</h3>
          {recentExpenses.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No expenses this month.</p>
          ) : (
            recentExpenses.map(expense => (
              <div key={expense.id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '12px 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {expense.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                    {expense.date} · {expense.category?.name}
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>
                  −₹{expense.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  padding: '20px',
};
const metricLabelStyle = {
  fontSize: '13px', color: '#6b7280', marginBottom: '8px'
};
const metricValueStyle = {
  fontSize: '24px', fontWeight: '600', color: '#111827'
};
const panelStyle = {
  backgroundColor: '#fff', border: '1px solid #e5e7eb',
  borderRadius: '12px', padding: '20px'
};
const panelTitleStyle = {
  fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '16px'
};

export default Dashboard;