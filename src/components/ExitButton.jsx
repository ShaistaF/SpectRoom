import React from 'react';
import { useNavigate } from 'react-router-dom';

function ExitButton() {
  const navigate = useNavigate();

  const handleExit = () => {
    // Confirm before exiting
    if (window.confirm("Are you sure you want to exit this activity?")) {
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleExit}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '8px 16px',
        fontSize: '16px',
        cursor: 'pointer'
      }}
    >
      Exit
    </button>
  );
}

export default ExitButton;
