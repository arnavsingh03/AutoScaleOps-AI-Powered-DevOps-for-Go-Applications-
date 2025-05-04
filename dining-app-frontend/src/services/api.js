import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust the base URL as needed
});

export const fetchRestaurants = () => api.get('/restaurants');
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (data) => api.post('/auth/register', data);

export default api;