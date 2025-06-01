import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || localStorage.getItem('isAdmin') === 'true';

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};