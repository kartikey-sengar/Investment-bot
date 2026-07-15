import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { userAPI, authAPI } from '../services/api.js';

const UserContext = createContext(null);
const TOKEN_KEY = 'finpilot_token';

export function UserProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateSession = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.validate();
      setProfile(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Session validation failed:', err);
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setProfile(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setProfile(res.data);
      setIsAuthenticated(true);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await authAPI.register(name, email, password);
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setProfile(res.data);
      setIsAuthenticated(true);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (data) => {
    if (!profile?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await userAPI.update(profile.id, data);
      setProfile(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Alias createProfile to updateProfile since registration creates the initial shell
  const createProfile = async (data) => {
    return updateProfile(data);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setProfile(null);
    setIsAuthenticated(false);
  }, []);

  const refreshProfile = useCallback(() => {
    validateSession();
  }, [validateSession]);

  const value = {
    userId: profile?.id,
    profile,
    loading,
    error,
    isAuthenticated,
    isOnboarded: !!(isAuthenticated && profile && (
      profile.updatedAt !== profile.createdAt || 
      (profile.finances && profile.finances.monthlyIncome > 0) || 
      (profile.goals && profile.goals.length > 0) ||
      (profile.preferences && profile.preferences.preferredAssets && profile.preferences.preferredAssets.length > 0)
    )),
    login,
    register,
    createProfile,
    updateProfile,
    refreshProfile,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
