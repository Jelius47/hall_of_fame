import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  claimArt: (data) => api.post('/auth/claim-art', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Artworks API
export const artworksAPI = {
  upload: (formData) => api.post('/artworks/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getById: (id) => api.get(`/artworks/${id}`),
  getByArtist: (artistId, params) => api.get(`/artworks/artist/${artistId}`, { params }),
  addHeart: (id) => api.post(`/artworks/${id}/heart`),
  delete: (id) => api.delete(`/artworks/${id}`),
};

// Gallery API
export const galleryAPI = {
  getGallery: (params) => api.get('/gallery/', { params }),
  getFeatured: (params) => api.get('/gallery/featured', { params }),
  getLatest: (params) => api.get('/gallery/latest', { params }),
};

// Health check
export const healthCheck = () => axios.get(`${API_URL}/health`);

export default api;
