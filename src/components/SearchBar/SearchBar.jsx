import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTermChange = (e) => {
    setTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    
    setIsLoading(true);
    try {
      await onSearch(term);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated container style to center the search bar
  const containerStyle = {
    margin: '40px auto',
    width: '300px',
    textAlign: 'center'
  };

  // Updated form style to stack elements vertically
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  // Updated input style to match wireframe
  const inputStyle = {
    width: '300px',
    padding: '10px 20px',
    borderRadius: '20px',
    backgroundColor: '#444444',
    border: '2px solid #555555',
    color: 'white',
    fontSize: '16px',
    marginBottom: '20px'
  };

  // Updated button style to match wireframe
  const buttonStyle = {
    backgroundColor: '#00b4ff',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'normal',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    width: '150px',
    marginBottom: '30px',
    opacity: isLoading ? 0.7 : 1
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          value={term}
          onChange={handleTermChange}
          placeholder="Search for a song, album, or artist"
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={buttonStyle}
        >
          {isLoading ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;