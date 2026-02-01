import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
  logout: () => api.post('/auth/logout'),
};

// Employee API calls
export const employeeAPI = {
  // Get all employees with optional query parameters
  getAll: (params = {}) => api.get('/employees', { params }),
  
  // Get single employee by ID
  getById: (id) => api.get(`/employees/${id}`),
  
  // Create new employee
  create: (employeeData) => api.post('/employees', employeeData),
  
  // Update employee
  update: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  
  // Delete employee
  delete: (id) => api.delete(`/employees/${id}`),
  
  // Get employee statistics
  getStats: () => api.get('/employees/stats'),
};

// Utility functions for API responses
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.errors) {
    return error.response.data.errors.map(err => err.message).join(', ');
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const handleApiSuccess = (response) => {
  return response.data;
};

export default api;