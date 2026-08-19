import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request Interceptor: Attach JWT token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract envelope data or handle errors
axiosClient.interceptors.response.use(
  (response) => {
    // Spatial endpoints return raw GeoJSON (type: "FeatureCollection")
    if (response.data && response.data.type === 'FeatureCollection') {
      return response.data;
    }
    // Standard API response envelope: return response.data
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized on a protected route
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') && !currentPath.includes('/login')) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    }

    const customError = {
      status: error.response?.status || 500,
      code: error.response?.data?.error?.code || 'SERVER_ERROR',
      message: error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Terjadi kesalahan pada server',
      details: error.response?.data?.error?.details || null,
    };

    return Promise.reject(customError);
  }
);

export default axiosClient;
