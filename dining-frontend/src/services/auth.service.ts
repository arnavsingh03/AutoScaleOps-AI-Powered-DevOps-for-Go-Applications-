import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileData {
  name: string;
  email: string;
  phone?: string;
}

export const authService = {
  async register(data: RegisterData) {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.isAdmin ? "admin" : "user"
    };
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user?.role === 'admin') {
        localStorage.setItem('isAdmin', 'true');
      }
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(data: ProfileData) {
    const response = await api.put('/profile', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  }
};