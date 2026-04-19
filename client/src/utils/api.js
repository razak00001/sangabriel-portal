import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://sangabriel-portal.onrender.com/api';

const api = axios.create({
  baseURL,
});

// Request interceptor: Attach Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Centralized Session Management (Billion Dollar Pattern)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 (Unauthorized), it means the session expired or token is invalid
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Force a page refresh to clear state and redirect to login
        // This is the most robust way to ensure all stale sensitive data is wiped
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
