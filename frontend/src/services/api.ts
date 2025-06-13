import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const handleApiError = (error: AxiosError): ApiError => {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as { message?: string; code?: string };
    return {
      message: data.message || 'An error occurred',
      code: data.code,
      status: error.response.status
    };
  }
  return {
    message: 'Network error occurred',
    code: 'NETWORK_ERROR'
  };
};

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(handleApiError(error));
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Here you would typically refresh the token
          // For now, we'll just retry the original request
          return api(originalRequest);
        }
      } catch {
        // Handle refresh token error
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(handleApiError(error));
      }
    }
    
    return Promise.reject(handleApiError(error));
  }
);

// Auth API
export const auth = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/api/auth/login', data),
  getCurrentUser: () => api.get<ApiResponse<User>>('/api/auth/me'),
};

// GIFs API
export const gifs = {
  search: (query: string, limit = 20, offset = 0) =>
    api.get<ApiResponse<unknown>>('/api/gifs/search', { params: { q: query, limit, offset } }),
  getById: (id: string) => api.get<ApiResponse<unknown>>(`/api/gifs/${id}`),
  getTrending: (limit = 20, offset = 0) =>
    api.get<ApiResponse<unknown>>('/api/gifs/trending', { params: { limit, offset } }),
};

// Ratings API
export const ratings = {
  create: (data: { gifId: string; rating: number }) =>
    api.post<ApiResponse<unknown>>('/api/ratings', data),
  getByGifId: (gifId: string) => api.get<ApiResponse<unknown>>(`/api/ratings/${gifId}`),
  delete: (gifId: string) => api.delete<ApiResponse<unknown>>(`/api/ratings/${gifId}`),
};

// Comments API
export const comments = {
  create: (data: { gifId: string; content: string }) =>
    api.post<ApiResponse<unknown>>('/api/comments', data),
  getByGifId: (gifId: string) => api.get<ApiResponse<unknown>>(`/api/comments/gif/${gifId}`),
  update: (id: string, data: { content: string }) =>
    api.put<ApiResponse<unknown>>(`/api/comments/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<unknown>>(`/api/comments/${id}`),
};

export default api; 