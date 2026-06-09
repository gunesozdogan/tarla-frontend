import axios from 'axios';

// Create axios instance with smart base URL detection
const getBaseURL = () => {
  // If we have a production API URL (Railway deployment)
  if (process.env.REACT_APP_API_BASE_URL && process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_BASE_URL;
  }

  // If we have a development API URL specified
  if (process.env.REACT_APP_API_BASE_URL && process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_BASE_URL;
  }

  // For local development with proxy, use relative URLs
  return '';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Add request interceptor to include auth token
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

// For backward compatibility, export both api and default axios
export default api;
export { api };
