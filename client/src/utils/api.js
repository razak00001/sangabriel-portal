import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://sangabriel-portal.onrender.com/api';

const api = axios.create({
  baseURL,
});

// Add interceptor for Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
