import React from 'react';

const LoadingScreen = ({ message }) => {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    backgroundColor: '#303030',
    padding: '20px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'white'
  };

  const spinnerStyle = {
    width: '40px',
    height: '40px',
    margin: '0 auto 15px',
    border: '4px solid #444',
    borderTop: '4px solid #00b4ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <div style={spinnerStyle} />
        <p style={{ margin: 0, fontSize: '1.1rem' }}>{message || 'Loading...'}</p>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;