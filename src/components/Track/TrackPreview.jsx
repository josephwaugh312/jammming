import React, { useEffect, useRef, useState } from 'react';
import checkSpotifyPremium from '../../utils/SpotifyPremiumCheck';
import { initializePlayer, getPlayer } from '../../utils/SpotifySDK';

const TrackPreview = ({ track, isPlaying, onPlayToggle }) => {
  const [isPremium, setIsPremium] = useState(false);
  const audioRef = useRef(null);
  const hasPreview = track && Boolean(track.preview_url);

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        const accessToken = localStorage.getItem('spotify_token');
        const premium = await checkSpotifyPremium(accessToken);
        setIsPremium(premium);

        if (premium) {
          await initializePlayer(accessToken);
        }
      } catch (error) {
        console.error('Error setting up player:', error);
        setIsPremium(false);
      }
    };

    setupPlayer();
  }, []);

  // Handle preview playback for non-premium users
  useEffect(() => {
    if (!hasPreview || isPremium) return;

    if (!audioRef.current && track.preview_url) {
      audioRef.current = new Audio(track.preview_url);
      audioRef.current.addEventListener('ended', () => {
        onPlayToggle(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.remove();
        audioRef.current = null;
      }
    };
  }, [track, hasPreview, isPremium, onPlayToggle]);

  useEffect(() => {
    const handlePlayback = async () => {
      try {
        if (isPremium) {
          const player = getPlayer();
          if (player) {
            if (isPlaying) {
              const deviceId = localStorage.getItem('spotify_device_id');
              await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [track.uri] }),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`
                }
              });
            } else {
              await player.pause();
            }
          }
        } else if (audioRef.current) {
          if (isPlaying) {
            await audioRef.current.play();
          } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
      } catch (error) {
        console.error('Playback error:', error);
        onPlayToggle(false);
      }
    };

    handlePlayback();
  }, [isPlaying, isPremium, track.uri, onPlayToggle]);

  const handlePlayToggle = () => {
    if (!hasPreview && !isPremium) {
      window.open(track.external_urls?.spotify, '_blank');
      return;
    }
    onPlayToggle(!isPlaying);
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      marginRight: '10px',
      minWidth: '40px'
    }}>
      <button 
        onClick={handlePlayToggle}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#00b4ff',
          cursor: 'pointer',
          fontSize: '24px',
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: (hasPreview || isPremium) ? 1 : 0.7,
          transition: 'opacity 0.2s ease'
        }}
        title={
          isPremium ? 'Play on Spotify' :
          hasPreview ? 'Play preview' :
          'Open in Spotify'
        }
      >
        {(hasPreview || isPremium) ? (isPlaying ? '⏸' : '▶') : '🎵'}
      </button>
    </div>
  );
};

export default TrackPreview;