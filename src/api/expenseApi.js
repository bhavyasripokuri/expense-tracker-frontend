import axios from 'axios';

const BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('expensio_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) =>
  axios.post(`${BASE}/auth/login`, data);

export const register = (data) =>
  axios.post(`${BASE}/auth/register`, data);

export const getCategories = () =>
  api.get('/categories');

export const addCategory = (data) =>
  api.post('/categories', data);

export const getExpenses = (month, year) =>
  api.get('/expenses', { params: { month, year } });

export const getAllExpenses = () =>
  api.get('/expenses');

export const addExpense = (data) =>
  api.post('/expenses', data);

export const updateExpense = (id, data) =>
  api.put(`/expenses/${id}`, data);

export const deleteExpense = (id) =>
  api.delete(`/expenses/${id}`);

export const getMonthlySummary = (month, year) =>
  api.get('/expenses/summary', { params: { month, year } });

export const getBudgets = (month, year) =>
  api.get('/budgets', { params: { month, year } });

export const addBudget = (data) =>
  api.post('/budgets', data);

export const deleteBudget = (id) =>
  api.delete(`/budgets/${id}`);

export const deleteCategory = (id) =>
    api.delete(`/categories/${id}`);