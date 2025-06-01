import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name: string; email: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getProfile();
          setUser({ ...userData, isAdmin: userData.role === 'admin' });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login({ email, password });
    const userData = await authService.getProfile();
    setUser({ ...userData, isAdmin: userData.role === 'admin' });
    if (userData.role === 'admin') {
      localStorage.setItem('isAdmin', 'true');
    }
  };

  const register = async (name: string, email: string, password: string, isAdmin = false) => {
    await authService.register({ name, email, password, isAdmin });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (data: { name: string; email: string; phone?: string }) => {
    const updatedUser = await authService.updateProfile(data);
    setUser({ ...updatedUser, isAdmin: updatedUser.role === 'admin' });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};