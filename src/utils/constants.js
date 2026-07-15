// ── Income Types ──
export const INCOME_TYPES = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'business', label: 'Business Owner' },
  { value: 'student', label: 'Student' },
];

// ── Risk Levels ──
export const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk', description: 'Prefer safety over returns' },
  { value: 'medium', label: 'Medium Risk', description: 'Balance of growth and safety' },
  { value: 'high', label: 'High Risk', description: 'Maximize returns, accept volatility' },
];

// ── Asset Categories ──
export const ASSET_CATEGORIES = [
  { value: 'fd', label: 'Fixed Deposits' },
  { value: 'mutual_funds', label: 'Mutual Funds' },
  { value: 'sip', label: 'SIP' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'gold', label: 'Gold' },
  { value: 'etf', label: 'ETFs' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'ppf', label: 'PPF' },
  { value: 'nps', label: 'NPS' },
];

// ── Goal Presets ──
export const GOAL_PRESETS = [
  { value: 'emergency_fund', label: 'Emergency Fund', icon: '🛡️' },
  { value: 'house', label: 'Buy House', icon: '🏠' },
  { value: 'car', label: 'Buy Car', icon: '🚗' },
  { value: 'marriage', label: 'Marriage', icon: '💍' },
  { value: 'retirement', label: 'Retirement', icon: '🏖️' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'education', label: 'Child Education', icon: '🎓' },
  { value: 'wealth', label: 'Wealth Growth', icon: '📈' },
  { value: 'custom', label: 'Custom Goal', icon: '🎯' },
];

// ── Goal Priorities ──
export const GOAL_PRIORITIES = [
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'low', label: 'Low', color: '#10b981' },
];

// ── Lifestyle Priorities ──
export const LIFESTYLE_PRIORITIES = [
  { value: 'save_more', label: 'Save More', description: 'Maximize savings rate' },
  { value: 'balance', label: 'Balanced', description: 'Balance lifestyle & investing' },
  { value: 'aggressive', label: 'Aggressive Growth', description: 'Aggressive wealth building' },
];

// ── Expense Categories ──
export const EXPENSE_CATEGORIES = [
  { value: 'housing', label: 'Housing / Rent', icon: '🏠', color: '#4f8cff' },
  { value: 'food', label: 'Food & Dining', icon: '🍕', color: '#f59e0b' },
  { value: 'transport', label: 'Transport', icon: '🚗', color: '#10b981' },
  { value: 'utilities', label: 'Utilities', icon: '💡', color: '#8b5cf6' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥', color: '#ef4444' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#ec4899' },
  { value: 'education', label: 'Education', icon: '📚', color: '#06b6d4' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: '#f97316' },
  { value: 'insurance', label: 'Insurance', icon: '🛡️', color: '#14b8a6' },
  { value: 'emi', label: 'EMI / Loans', icon: '💳', color: '#e11d48' },
  { value: 'other', label: 'Other', icon: '📦', color: '#64748b' },
];

// ── Countries ──
export const COUNTRIES = [
  { value: 'India', currency: 'INR', symbol: '₹' },
  { value: 'USA', currency: 'USD', symbol: '$' },
  { value: 'UK', currency: 'GBP', symbol: '£' },
  { value: 'Canada', currency: 'CAD', symbol: 'C$' },
  { value: 'Australia', currency: 'AUD', symbol: 'A$' },
  { value: 'Germany', currency: 'EUR', symbol: '€' },
];

// ── API Base URL ──
export const API_BASE = '/api';

// ── Navigation Items ──
export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { path: '/goals', label: 'Goals', icon: 'Flag' },
  { path: '/expenses', label: 'Expenses', icon: 'Receipt' },
  { path: '/advisor', label: 'AI Advisor', icon: 'Psychology' },
  { path: '/simulator', label: 'Simulator', icon: 'TuneOutlined' },
];
