import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Login from '../Authentication/Login';
import SignUp from '../Authentication/SignUp'; // Import the SignUp component
import Spotify from '../../utils/Spotify';
import api from '../../utils/api'; // Import the API utility for MongoDB
import { AudioProvider } from '../../contexts/AudioContext';

const JammingApp = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState({
    name: '', // Empty string instead of 'My Playlist'
    tracks: []
  });
  const navigate = useNavigate();

  // Effect to store user profile in MongoDB after successful Spotify login
  useEffect(() => {
    const storeUserProfile = async () => {
      try {
        const spotifyUser = await Spotify.getCurrentUser();
        if (spotifyUser) {
          // Store Spotify user data in MongoDB
          await api.post('/users/spotify', { 
            spotifyId: spotifyUser.id,
            name: spotifyUser.display_name,
            email: spotifyUser.email,
            profileUrl: spotifyUser.external_urls?.spotify,
            imageUrl: spotifyUser.images?.[0]?.url
          });
        }
      } catch (error) {
        console.error('Error storing user profile:', error);
        // Non-blocking error - don't prevent app usage if this fails
      }
    };

    storeUserProfile();
  }, []);

  const search = async (term) => {
    const results = await Spotify.search(term);
    setSearchResults(results);
  };

  const addTrackToPlaylist = (track) => {
    if (playlist.tracks.find(savedTrack => savedTrack.id === track.id)) return;
    setPlaylist({
      ...playlist,
      tracks: [...playlist.tracks, track]
    });
  };

  const removeTrackFromPlaylist = (track) => {
    setPlaylist({
      ...playlist,
      tracks: playlist.tracks.filter(savedTrack => savedTrack.id !== track.id)
    });
  };

  const updatePlaylistName = (name) => {
    setPlaylist({ ...playlist, name });
  };

  const savePlaylist = async () => {
    const trackUris = playlist.tracks.map(track => track.uri);
    
    // Don't try to save if there are no tracks or no name
    if (!trackUris.length || !playlist.name.trim()) {
      throw new Error('Please add tracks and a playlist name before saving');
    }

    try {
      // Save to Spotify
      const savedPlaylist = await Spotify.savePlaylist(playlist.name, trackUris);
      
      // Also save playlist to MongoDB for history/tracking
      try {
        const spotifyUser = await Spotify.getCurrentUser();
        await api.post('/playlists', {
          spotifyId: spotifyUser.id,
          playlistName: playlist.name,
          spotifyPlaylistId: savedPlaylist?.id,
          trackCount: trackUris.length,
          createdAt: new Date()
        });
      } catch (mongoError) {
        console.error('Error saving playlist to MongoDB:', mongoError);
        // Non-blocking error - continue even if MongoDB storage fails
      }
      
      // Reset playlist only after successful save
      setPlaylist({
        name: 'New Playlist',
        tracks: []
      });

      return true; // Indicate success to Playlist component
    } catch (error) {
      console.error('Error saving playlist:', error);
      // Re-throw the error so Playlist component can handle it
      throw error;
    }
  };

  // Updated app container style with lighter gray background
  // Ensure it covers the entire page with no white space
  const appContainerStyle = {
    minHeight: '100vh',
    backgroundColor: '#2a2a2a', // Lighter gray background
    color: 'white',
    padding: '0',
    margin: '0',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%'
  };

  // Header style for the top section - UPDATED with bigger size and spacing
  const headerStyle = {
    backgroundColor: '#343434',
    padding: '35px 0', // Increased padding
    width: '100%',
    textAlign: 'center'
  };

  // Logo style for Jammming text - UPDATED with bigger size and letter spacing
  const logoStyle = {
    fontFamily: 'Impact, fantasy',
    fontSize: '56px', // Increased from 48px
    letterSpacing: '1px', // Changed from -2px to create more spacing between letters
    margin: '0'
  };

  // Content container style
  const contentStyle = {
    maxWidth: '500px', // Reduced to accommodate single column
    margin: '0 auto',
    padding: '0 20px',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '70px', // Add significant padding at the bottom
    paddingTop: '20px' // Added top padding to bring search bar down a bit
  };

  // Updated container for vertical layout (Results above Playlist)
  const verticalContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '50px', // Increased space between Results and Playlist (from 30px to 50px)
    marginTop: '30px',
    marginBottom: '30px',
    flex: '1'  // Allow it to expand to fill available space
  };

  // Add a style to fix the html/body background color
  const htmlStyle = `
    html, body {
      margin: 0;
      padding: 0;
      background-color: #2a2a2a;
      height: 100%;
      width: 100%;
      overflow-x: hidden;
    }
  `;

  // This is where you apply the styling changes - in the return statement
  return (
    <>
      <style>{htmlStyle}</style>
      <div style={appContainerStyle}>
        {/* Header with Jammming logo */}
        <header style={headerStyle}>
          <h1 style={logoStyle}>
            <span style={{ color: 'white' }}>Ja</span>
            <span style={{ color: '#00b4ff' }}>mmm</span>
            <span style={{ color: 'white' }}>ing</span>
          </h1>
        </header>
        
        <div style={contentStyle}>
          <SearchBar onSearch={search} />
          <div style={verticalContainerStyle}>
            <SearchResults 
              searchResults={searchResults} 
              onAdd={addTrackToPlaylist} 
            />
            <Playlist 
              playlist={playlist}
              onRemove={removeTrackFromPlaylist}
              onNameChange={updatePlaylistName}
              onSave={savePlaylist}
              // Pass the new styles as props to be used in the Playlist component
              playlistStyles={{
                containerStyle: {
                  overflow: 'hidden', // Prevent horizontal scrolling
                  marginBottom: '30px' // Add space after the playlist
                },
                titleBarStyle: {
                  padding: '10px', // Reduced title bar size
                  marginBottom: '10px' // Smaller margin
                },
                inputStyle: {
                  fontSize: '1.3rem', // Bigger text for playlist name
                  placeholder: 'Name your playlist' // New placeholder text
                },
                buttonStyle: {
                  color: '#00b4ff' // Change remove button color to match logo blue
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false); // Track whether to show signup

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This will either get the token or redirect to Spotify
        Spotify.getAccessToken();
        const user = await Spotify.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Loading screen with updated styling
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#2a2a2a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <p style={{ fontSize: '20px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <AudioProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <JammingApp />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/signup" 
            element={
              !isAuthenticated ? (
                <SignUp />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="/callback" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AudioProvider>
  );
};

export default App;