import React from 'react';
import Spotify from '../../utils/Spotify';

const Login = () => {
  const handleSpotifyLogin = () => {
    console.log('Login button clicked');
    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${Spotify.clientId}&response_type=token&scope=${encodeURIComponent(Spotify.scope)}&redirect_uri=${encodeURIComponent(Spotify.redirectUri)}&show_dialog=true`;
    console.log('Redirecting to:', authorizeUrl);
    window.location.href = authorizeUrl;
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#121212',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  };

  const cardStyle = {
    maxWidth: '450px',
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: '0.5rem',
    padding: '2rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    border: '1px solid #333333'
  };

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00E5FF',
    marginBottom: '1.5rem'
  };

  const subtitleStyle = {
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1DB954', // Spotify green
    color: 'white',
    fontWeight: 600,
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Welcome to Jammming</h2>
        <p style={subtitleStyle}>Connect with Spotify to create and manage your playlists</p>
        <button
          onClick={handleSpotifyLogin}
          style={buttonStyle}
        >
          Continue with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login;