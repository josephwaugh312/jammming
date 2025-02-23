import React, { useState } from 'react';
import TrackList from '../Tracklist/TrackList';

const Playlist = ({ playlist, onRemove, onNameChange, onSave, playlistStyles }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (isSaving) return;
    setError(null);

    try {
      setIsSaving(true);
      await onSave();
    } catch (error) {
      setError(error.message || 'Failed to save playlist');
      console.error('Error saving playlist:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Main container style - Added overflow: hidden to prevent horizontal scrolling
  const containerStyle = {
    backgroundColor: '#383838',
    borderRadius: '10px',
    width: '100%', // Take full width of parent
    position: 'relative',
    border: '2px solid #444444',
    overflow: 'hidden', // Prevents horizontal scrolling
    ...(playlistStyles?.containerStyle || {})
  };

  // Content container that holds everything except the button
  const contentContainerStyle = {
    overflowY: 'auto',
    overflowX: 'hidden', // Explicitly prevent horizontal scrolling
    maxHeight: '350px', // Fixed height for the scrollable part
    paddingBottom: '10px'
  };

  // Button container with fixed position at bottom
  const buttonContainerStyle = {
    backgroundColor: '#383838',
    borderTop: '1px solid #444444',
    padding: '15px 0',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px'
  };

  // Updated input style - Made text bigger and reduced width
  const inputStyle = {
    backgroundColor: '#444444',
    margin: '15px auto', // Center it
    width: '80%', // Reduced from 100% to make it not stretch the entire width
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    color: 'white',
    fontSize: '16px', // Increased from 14px to make text bigger
    outline: 'none',
    display: 'block', // Helps with centering
    ...(playlistStyles?.inputStyle || {})
  };

  const errorStyle = {
    color: '#ff4d4d',
    fontSize: '0.875rem',
    margin: '5px 15px 15px',
    textAlign: 'center'
  };

  // Updated button style - shorter and fatter like search button
  const buttonStyle = {
    backgroundColor: '#00b4ff',
    color: 'white',
    fontSize: '16px',
    padding: '15px 0', // Increased padding to make it "fatter"
    borderRadius: '20px',
    border: 'none',
    cursor: (isSaving || !playlist.tracks.length || !playlist.name.trim()) ? 'not-allowed' : 'pointer',
    width: '70%', // Reduced from 90% to make it shorter
    margin: '0 auto',
    display: 'block',
    textAlign: 'center',
    opacity: (isSaving || !playlist.tracks.length || !playlist.name.trim()) ? 0.7 : 1,
    fontWeight: 'bold' // Added bold to match search button style
  };

  // Custom scrollbar styles for webkit browsers
  const scrollbarStyle = `
    .playlist-content::-webkit-scrollbar {
      width: 8px;
    }
    .playlist-content::-webkit-scrollbar-track {
      background: #555555;
      border-radius: 4px;
    }
    .playlist-content::-webkit-scrollbar-thumb {
      background: #888888;
      border-radius: 4px;
    }
  `;

  return (
    <>
      <style>{scrollbarStyle}</style>
      <div style={containerStyle}>
        <div style={contentContainerStyle} className="playlist-content">
          <input
            type="text"
            value={playlist.name}
            onChange={(e) => onNameChange(e.target.value)}
            style={inputStyle}
            placeholder="Name your playlist" // Changed from "New Playlist"
          />
          {error && (
            <p style={errorStyle}>{error}</p>
          )}
          <TrackList 
            tracks={playlist.tracks}
            onAction={onRemove}
            actionText="-"
            isRemoval={true}
            buttonColor="#00b4ff" // Changed remove button color to match blue
          />
        </div>
        <div style={buttonContainerStyle}>
          <button
            onClick={handleSave}
            disabled={isSaving || !playlist.tracks.length || !playlist.name.trim()}
            style={buttonStyle}
          >
            {isSaving ? 'SAVING...' : 'SAVE TO SPOTIFY'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Playlist;