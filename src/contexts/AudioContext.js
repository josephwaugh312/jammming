import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  const playTrack = (trackId) => {
    if (currentlyPlayingId === trackId) {
      setCurrentlyPlayingId(null);
    } else {
      setCurrentlyPlayingId(trackId);
    }
  };

  return (
    <AudioContext.Provider value={{ currentlyPlayingId, playTrack }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};