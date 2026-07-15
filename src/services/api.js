import { API_BASE } from '../utils/constants.js';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const token = localStorage.getItem('finpilot_token');
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    headers: { ...headers, ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.errors?.join(', ') || 'Request failed');
  }

  return data;
}

// ── Auth API ──
export const authAPI = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  validate: () => request('/auth/validate'),
};

// ── User API ──
export const userAPI = {
  update: (id, data) => request(`/users/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};

// ── Goals API ──
export const goalAPI = {
  create: (userId, goal) => request(`/goals/user/${userId}`, { method: 'POST', body: goal }),
  list: (userId) => request(`/goals/user/${userId}`),
  update: (id, data) => request(`/goals/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
};

// ── Expenses API ──
export const expenseAPI = {
  create: (userId, expense) => request(`/expenses/user/${userId}`, { method: 'POST', body: expense }),
  list: (userId, month, year) => {
    let endpoint = `/expenses/user/${userId}`;
    const params = new URLSearchParams();
    if (month) params.set('month', month);
    if (year) params.set('year', year);
    if (params.toString()) endpoint += `?${params}`;
    return request(endpoint);
  },
  summary: (userId) => request(`/expenses/user/${userId}/summary`),
  delete: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
};

// ── AI API ──
export const aiAPI = {
  getInsights: (userId, profile) => request('/ai/insights', { method: 'POST', body: { userId, profile } }),
  chat: (question, userId, profile, history) => request('/ai/chat', { method: 'POST', body: { question, userId, profile, history } }),
};
