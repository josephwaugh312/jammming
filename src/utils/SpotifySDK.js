let playerInstance = null;

export const initializePlayer = (accessToken) => {
  console.log('Initializing Spotify Player...');
  return new Promise((resolve, reject) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('SDK Ready, setting up player...');
      if (!playerInstance) {
        const player = new window.Spotify.Player({
          name: 'Jammming Web Player',
          getOAuthToken: cb => cb(accessToken)
        });

        // Ready handler
        player.addListener('ready', ({ device_id }) => {
          console.log('✅ Player ready with Device ID:', device_id);
          localStorage.setItem('spotify_device_id', device_id);
          playerInstance = player;
          resolve(player);
        });

        // Error handling with more detailed logs
        player.addListener('initialization_error', ({ message }) => {
          console.error('❌ Failed to initialize:', message);
          reject(message);
        });

        player.addListener('authentication_error', ({ message }) => {
          console.error('❌ Failed to authenticate:', message);
          reject(message);
        });

        player.addListener('account_error', ({ message }) => {
          console.error('❌ Failed to validate Spotify account:', message);
          reject(message);
        });

        player.addListener('playback_error', ({ message }) => {
          console.error('❌ Playback error:', message);
        });

        console.log('Connecting to Spotify...');
        player.connect();
      } else {
        console.log('Using existing player instance');
        resolve(playerInstance);
      }
    };
  });
};