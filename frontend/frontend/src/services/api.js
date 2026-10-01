import axios from 'axios';
import { toast } from 'react-toastify';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://ecommerce-fullstack-x4mv.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Access denied. You do not have permission.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          if (data && data.message) {
            toast.error(data.message);
          } else {
            toast.error('An error occurred. Please try again.');
          }
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// Product API
export const productAPI = {
  getAllProducts: () => api.get('/api/products'),
  getProductById: (id) => api.get(`/api/products/${id}`),
  addProduct: (data) => api.post('/api/products', data),
  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
  getMyProducts: () => api.get('/api/products/my-products'),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addToCart: (productId) => api.post(`/api/cart/add/${productId}`),
  increaseQuantity: (id) => api.put(`/api/cart/increase/${id}`),
  decreaseQuantity: (id) => api.put(`/api/cart/decrease/${id}`),
  removeFromCart: (id) => api.delete(`/api/cart/remove/${id}`),
};

// Order API
export const orderAPI = {
  placeOrder: () => api.post('/api/orders/placeorder'),
  getOrders: () => api.get('/api/orders'),
  getOrderById: (id) => api.get(`/api/orders/${id}`),
};

// Payment API
export const paymentAPI = {
  processPayment: (orderId, paymentMode) => 
    api.post(`/api/payments/${orderId}?paymentMode=${paymentMode}`),
};

// Seller Request API
export const sellerRequestAPI = {
  sendRequest: () => api.post('/api/seller/request'),
  getAllRequests: () => api.get('/api/seller/requests'),
  approveSeller: (id) => api.post(`/api/seller/approve/${id}`),
  rejectSeller: (id) => api.post(`/api/seller/reject/${id}`),
};

// User API
export const userAPI = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
};

export default api;
