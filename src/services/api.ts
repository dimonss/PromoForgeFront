import axios, { AxiosError, AxiosResponse } from 'axios';
import type { LoginResponse, PromoCodeStatusResponse, DeactivateResponse, ApiError } from '../types';

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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) => 
    api.post<LoginResponse>('/auth/login', { username, password }),
  
  getCurrentUser: () => 
    api.get<{ user: { id: number; username: string; fullName: string } }>('/auth/me'),
  
  logout: () =>
    api.post('/auth/logout')
};

// Promo API
export const promoAPI = {
  checkStatus: (promoCode: string) => 
    api.get<PromoCodeStatusResponse>(`/promo/status/${promoCode}`),
  
  deactivate: (promoCode: string) => 
    api.post<DeactivateResponse>('/promo/deactivate', { promoCode })
};

export default api;

