import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.REACT_APP_API_BASE_URL) {
    return import.meta.env.REACT_APP_API_BASE_URL;
  }

  return '';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

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

export default api;
export { api };
