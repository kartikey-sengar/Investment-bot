import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext.jsx';
import Loader from './Loader.jsx';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useUser();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
