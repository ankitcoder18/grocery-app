// client/src/api/groceryApi.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const groceryApi = {
  // Get all items
  getAllItems: () => api.get('/groceries'),

  // Search items
  searchItems: (query) => api.get('/groceries/search', { params: { query } }),

  // Get single item
  getItem: (id) => api.get(`/groceries/${id}`),

  // Create item
  createItem: (data) => api.post('/groceries', data),

  // Update item
  updateItem: (id, data) => api.patch(`/groceries/${id}`, data),

  // Delete item
  deleteItem: (id) => api.delete(`/groceries/${id}`),

  // Get price summary
  getPriceSummary: () => api.get('/groceries/prices/summary'),
};

export const expenseApi = {
  // Get all expenses
  getAllExpenses: () => api.get('/expenses'),

  // Get monthly summary
  getMonthlySummary: () => api.get('/expenses/summary/monthly'),

  // Create expense
  createExpense: (data) => api.post('/expenses', data),

  // Update expense
  updateExpense: (id, data) => api.patch(`/expenses/${id}`, data),

  // Delete expense
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

export const shoppingApi = {
  // Get all sessions
  getAllSessions: () => api.get('/shopping'),

  // Get single session
  getSession: (id) => api.get(`/shopping/${id}`),

  // Create new session
  createSession: (data) => api.post('/shopping', data),

  // Update session (add/edit items)
  updateSession: (id, data) => api.patch(`/shopping/${id}`, data),

  // Delete session
  deleteSession: (id) => api.delete(`/shopping/${id}`),
};

export default api;
