// frontend/src/api.js


import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export const getProducts = () => api.get('/api/products');
export const getProductById = (id) => api.get(`/api/products/${id}`);
export const getUserOrders = (userId) => api.get(`/api/orders/user/${userId}`);
export const updateUserProfile = (userId, userData) => api.put(`/api/users/${userId}`, userData);