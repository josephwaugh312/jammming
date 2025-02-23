import React from 'react';
import TrackList from '../Tracklist/TrackList';

const SearchResults = ({ searchResults, onAdd }) => {
  // Updated container style to match width with Playlist
  const containerStyle = {
    backgroundColor: '#383838',
    borderRadius: '10px',
    width: '100%', // Take full width of parent
    border: '2px solid #444444',
    overflow: 'hidden' // Ensure clean rounded corners
  };

  // Content container for scrolling
  const contentContainerStyle = {
    maxHeight: '350px',
    overflowY: 'auto'
  };

  // Updated title style
  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'normal',
    textAlign: 'center',
    padding: '10px 0',
    margin: '0',
    color: 'white',
    borderBottom: '1px solid #444444'
  };

  // Custom scrollbar styles for webkit browsers
  const scrollbarStyle = `
    .results-content::-webkit-scrollbar {
      width: 8px;
    }
    .results-content::-webkit-scrollbar-track {
      background: #555555;
      border-radius: 4px;
    }
    .results-content::-webkit-scrollbar-thumb {
      background: #888888;
      border-radius: 4px;
    }
  `;

  return (
    <>
      <style>{scrollbarStyle}</style>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Results</h2>
        <div style={contentContainerStyle} className="results-content">
          <TrackList 
            tracks={searchResults}
            onAction={onAdd}
            actionText="+"
            isRemoval={false}
          />
        </div>
      </div>
    </>
  );
};

export default SearchResults;