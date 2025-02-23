import React from 'react';
import Track from '../Track/Track';

const TrackList = ({ tracks, onAction, actionText, isRemoval, buttonColor }) => {
  // Simplified tracklist style - individual tracks handle their own spacing
  const tracklistStyle = {
    paddingBottom: '5px' // Small padding at bottom of list
  };

  // Display message when no tracks are available
  const emptyMessageStyle = {
    textAlign: 'center',
    color: '#aaaaaa',
    fontSize: '14px',
    padding: '20px 10px'
  };

  return (
    <div style={tracklistStyle}>
      {tracks.length > 0 ? (
        tracks.map(track => (
          <Track
            key={track.id}
            track={track}
            onAction={onAction}
            actionText={actionText}
            isRemoval={isRemoval}
            buttonColor={buttonColor} // Pass the buttonColor prop to Track component
          />
        ))
      ) : (
        <p style={emptyMessageStyle}>
          {isRemoval 
            ? "Add tracks from the results" 
            : "Search for songs to add"}
        </p>
      )}
    </div>
  );
};

export default TrackList;