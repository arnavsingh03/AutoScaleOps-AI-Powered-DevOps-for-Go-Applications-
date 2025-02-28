import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8081/api/v1',
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/profile'),
};

export const restaurantAPI = {
    getAll: (params) => api.get('/restaurants', { params }),
    getById: (id) => api.get(`/restaurants/${id}`),
    getTables: (restaurantId) => api.get(`/tables/restaurant/${restaurantId}`),
};

export const bookingAPI = {
    create: (bookingData) => api.post('/bookings', bookingData),
    getUserBookings: () => api.get('/bookings'),
    updateStatus: (bookingId, status) => 
        api.put(`/bookings/${bookingId}/status`, { status }),
};

export default api;