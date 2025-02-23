import React from 'react';
import TrackPreview from './TrackPreview';
import { useAudio } from '../../contexts/AudioContext';

const Track = ({ track, onAction, actionText, isRemoval, buttonColor }) => {
  const { currentlyPlayingId, playTrack } = useAudio();
  console.log('Track data:', track);

  if (!track) {
    return null;
  }

  const isPlaying = currentlyPlayingId === track.id;

  const handlePlayToggle = (playState) => {
    playTrack(playState ? track.id : null);
  };

  const handleAction = () => {
    onAction(track);
  };

  const trackStyle = {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #444',
    padding: '10px',
    color: 'white',
    backgroundColor: '#303030',
    marginBottom: '5px',
    borderRadius: '5px'
  };

  const trackInfoStyle = {
    flex: 1,
    marginLeft: '10px'
  };

  const actionStyle = {
    cursor: 'pointer',
    padding: '5px 10px',
    fontSize: '1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: buttonColor || (isRemoval ? '#ff0000' : '#00b4ff')
  };

  return (
    <div style={trackStyle}>
      <TrackPreview 
        track={track}
        isPlaying={isPlaying}
        onPlayToggle={handlePlayToggle}
      />
      <div style={trackInfoStyle}>
        <h3 style={{ margin: '0', fontSize: '1.1rem' }}>{track.name}</h3>
        <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#b3b3b3' }}>
          {track.artist} | {track.album}
        </p>
      </div>
      <button style={actionStyle} onClick={handleAction}>
        {actionText || (isRemoval ? '-' : '+')}
      </button>
    </div>
  );
};

export default Track;