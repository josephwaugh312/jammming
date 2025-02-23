// utils/SpotifyPremiumCheck.js
const checkSpotifyPremium = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      return data.product === 'premium';
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  };
  
  export default checkSpotifyPremium;