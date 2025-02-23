const TOKEN_KEY = 'spotify_token';
const TOKEN_EXPIRY_KEY = 'spotify_token_expiry';
const EXPIRATION_BUFFER = 300000; // 5 minutes in milliseconds

class TokenManager {
  static setToken(token, expiresIn) {
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  static getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getExpiryTime() {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry) : null;
  }

  static isTokenExpired() {
    const expiryTime = this.getExpiryTime();
    if (!expiryTime) return true;
    
    // Return true if token will expire within buffer time
    return Date.now() + EXPIRATION_BUFFER > expiryTime;
  }

  static clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  // Search term persistence
  static setLastSearchTerm(term) {
    localStorage.setItem('last_search_term', term);
  }

  static getLastSearchTerm() {
    return localStorage.getItem('last_search_term');
  }

  static clearLastSearchTerm() {
    localStorage.removeItem('last_search_term');
  }
}

export default TokenManager;