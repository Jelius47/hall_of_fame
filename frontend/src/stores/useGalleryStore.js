import { create } from 'zustand';
import { galleryAPI, artworksAPI } from '../services/api';

const useGalleryStore = create((set) => ({
  artworks: [],
  featured: [],
  loading: false,
  error: null,

  // Fetch gallery
  fetchGallery: async (skip = 0, limit = 50) => {
    set({ loading: true, error: null });
    try {
      const response = await galleryAPI.getGallery({ skip, limit });
      set({
        artworks: response.data.artworks,
        featured: response.data.featured,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to load gallery',
        loading: false
      });
    }
  },

  // Fetch featured artworks
  fetchFeatured: async (limit = 10) => {
    try {
      const response = await galleryAPI.getFeatured({ limit });
      set({ featured: response.data });
    } catch (error) {
      console.error('Failed to fetch featured:', error);
    }
  },

  // Fetch latest artworks
  fetchLatest: async (limit = 20) => {
    set({ loading: true });
    try {
      const response = await galleryAPI.getLatest({ limit });
      set({ artworks: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to load artworks',
        loading: false
      });
    }
  },

  // Add heart to artwork
  addHeart: async (artworkId) => {
    try {
      const response = await artworksAPI.addHeart(artworkId);

      // Update artwork in artworks array
      set((state) => ({
        artworks: state.artworks.map(art =>
          art.id === artworkId ? response.data : art
        ),
        featured: state.featured.map(art =>
          art.id === artworkId ? response.data : art
        )
      }));

      return response.data;
    } catch (error) {
      console.error('Failed to add heart:', error);
      return null;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useGalleryStore;
