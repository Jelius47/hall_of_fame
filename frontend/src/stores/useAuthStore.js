import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  // Claim art (quest-based registration)
  claimArt: async (artistName, email) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.claimArt({ artist_name: artistName, email });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        loading: false
      });

      return { success: true, user };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to claim art';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Login
  login: async (artistName, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login({ artist_name: artistName, password });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        loading: false
      });

      return { success: true, user };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Login failed';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('token');
    set({
      token: null,
      user: null,
      isAuthenticated: false
    });
  },

  // Get current user
  fetchUser: async () => {
    if (!localStorage.getItem('token')) return;

    set({ loading: true });
    try {
      const response = await authAPI.getMe();
      set({ user: response.data, loading: false });
    } catch (error) {
      console.error('Fetch user error:', error);
      localStorage.removeItem('token');
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
