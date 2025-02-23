// src/utils/api.js - Add this to your React project
import axios from 'axios';
import Spotify from './Spotify'; // Import your existing Spotify utility

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  async config => {
    try {
      // Get access token from Spotify utility
      const token = Spotify.getAccessToken();
      if (token) {
        config.headers['x-spotify-token'] = token;
      }
    } catch (error) {
      console.error('Error getting Spotify token:', error);
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Helper functions for common API operations

// Store Spotify user in MongoDB
export const storeSpotifyUser = async (user) => {
  if (!user || !user.id) return null;
  
  try {
    const userData = {
      spotifyId: user.id,
      name: user.display_name,
      email: user.email,
      profileUrl: user.external_urls?.spotify,
      imageUrl: user.images?.[0]?.url
    };
    
    const response = await api.post('/spotify-users/spotify', userData);
    return response.data;
  } catch (error) {
    console.error('Error storing Spotify user:', error);
    return null;
  }
};

// Save playlist record to MongoDB
export const savePlaylistRecord = async (spotifyId, playlistName, spotifyPlaylistId, trackCount) => {
  try {
    const response = await api.post('/playlists', {
      spotifyId,
      playlistName,
      spotifyPlaylistId,
      trackCount
    });
    return response.data;
  } catch (error) {
    console.error('Error saving playlist record:', error);
    return null;
  }
};

// Get user's playlist history
export const getPlaylistHistory = async (spotifyId) => {
  try {
    const response = await api.get(`/playlists/user/${spotifyId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting playlist history:', error);
    return [];
  }
};

export default api;