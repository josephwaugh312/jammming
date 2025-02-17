import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = () => {
    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scope = 'playlist-modify-public playlist-modify-private user-read-private';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem('spotify_access_token');
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  const handleCallback = (token) => {
    localStorage.setItem('spotify_access_token', token);
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        login,
        logout,
        handleCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};