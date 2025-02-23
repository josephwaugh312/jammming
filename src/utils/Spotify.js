import TokenManager from './TokenManager';

const Spotify = {
  clientId: 'aeb656f246684dab8f4a8e108f130019',
  redirectUri: 'http://localhost:3000/callback',
  scope: 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state playlist-modify-public playlist-modify-private app-remote-control',

  getAccessToken() {
    console.log('getAccessToken called');

    // Check for forced reauthorization
    if (window.location.href.includes('/login')) {
      console.log('On login page, forcing new authorization');
      // Save current search term if any
      const searchInput = document.querySelector('input[type="search"]');
      if (searchInput?.value) {
        TokenManager.setLastSearchTerm(searchInput.value);
      }
      const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=token&scope=${encodeURIComponent(this.scope)}&redirect_uri=${encodeURIComponent(this.redirectUri)}&show_dialog=true`;
      window.location = authorizeUrl;
      return;
    }

    // Check if token exists and is not expired
    if (accessToken && !TokenManager.isTokenExpired()) {
      console.log('Existing valid token found:', accessToken);
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Store token with precise expiration
      TokenManager.setToken(accessToken, expiresIn);
      
      // Set timeout for token expiration
      window.setTimeout(() => {
        accessToken = '';
        TokenManager.clearToken();
      }, expiresIn * 1000);

      window.history.pushState('Access Token', null, '/');

      // Restore previous search term if exists
      const lastSearchTerm = TokenManager.getLastSearchTerm();
      if (lastSearchTerm) {
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
          searchInput.value = lastSearchTerm;
        }
        TokenManager.clearLastSearchTerm();
      }

      return accessToken;
    } else {
      // Save current search term before redirect
      const searchInput = document.querySelector('input[type="search"]');
      if (searchInput?.value) {
        TokenManager.setLastSearchTerm(searchInput.value);
      }

      const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=token&scope=${encodeURIComponent(this.scope)}&redirect_uri=${encodeURIComponent(this.redirectUri)}&show_dialog=true`;
      console.log('No token found, redirecting to:', authorizeUrl);
      window.location = authorizeUrl;
    }
  },

  async getCurrentUser() {
    const accessToken = this.getAccessToken();
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired during request
          TokenManager.clearToken();
          accessToken = '';
          return this.getCurrentUser();
        }
        throw new Error('Failed to get user info');
      }

      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  },

  async search(term) {
    const accessToken = this.getAccessToken();
    try {
      // Add market parameter and include_external to try to get more previews
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}&market=US&include_external=audio`, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log('Full search response:', jsonResponse); // Debug log

      if (!jsonResponse.tracks) {
        return [];
      }

      // Try to get tracks with previews
      const tracks = jsonResponse.tracks.items.map(track => {
        console.log('Individual track preview URL:', track.preview_url); // Debug log
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview_url: track.preview_url,
          external_urls: track.external_urls  // Add this line
        };
      });

      // Log tracks that have previews
      const tracksWithPreviews = tracks.filter(track => track.preview_url);
      console.log('Tracks with previews:', tracksWithPreviews.length);

      return tracks;
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
},

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    try {
      const userResponse = await fetch('https://api.spotify.com/v1/me', { headers });
      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          // Token expired during request
          TokenManager.clearToken();
          accessToken = '';
          return this.savePlaylist(name, trackUris);
        }
        throw new Error('Failed to get user info');
      }

      const jsonUserResponse = await userResponse.json();
      userId = jsonUserResponse.id;

      const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: name })
      });

      if (!playlistResponse.ok) {
        throw new Error('Failed to create playlist');
      }

      const jsonPlaylistResponse = await playlistResponse.json();
      const playlistId = jsonPlaylistResponse.id;

      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ uris: trackUris })
      });

      if (!addTracksResponse.ok) {
        throw new Error('Failed to add tracks to playlist');
      }

      return playlistId;
    } catch (error) {
      console.error('Error saving playlist:', error);
      throw error;
    }
  }
};

let accessToken;
export default Spotify;