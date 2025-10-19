import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
  
  logout: () =>
    api.post('/auth/logout')
};

// Promo API
export const promoAPI = {
  generate: (data) => 
    api.post('/promo/generate', data),
  
  checkStatus: (promoCode) => 
    api.get(`/promo/status/${promoCode}`),
  
  activate: (data) => 
    api.post('/promo/activate', data),
  
  getActivations: (page = 1, limit = 50) => 
    api.get(`/promo/activations?page=${page}&limit=${limit}`),
  
  getLogs: (page = 1, limit = 50) => 
    api.get(`/promo/logs?page=${page}&limit=${limit}`)
};

export default api;
