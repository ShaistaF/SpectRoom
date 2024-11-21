import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import NotificationPanel from '../components/NotificationPanel';
import BackgroundMusic from '../components/SoundsMusic';
import doorImage from '../assets/door.png';
import './MainMenu.css';

function MainMenu() {
  
  const [isOpening, setIsOpening] = useState(Array(4).fill(false));
  const [isClosing, setIsClosing] = useState(Array(4).fill(false));

  const activeProfile = useSelector((state) => state.profiles.activeProfile);

  const getLevelInfo = (gameName) => {
    if (!activeProfile || !activeProfile.games || !activeProfile.games[gameName]) {
      return { easy: 1, hard: 1 };
    }
    const gameData = activeProfile.games[gameName];
    return {
      easy: gameData.easy?.level || 1,
      hard: gameData.hard?.level || 1,
    };
  };

  const handleAnimationEnd = (index) => {
    if (isClosing[index]) {
      setIsClosing(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }
  };

  const gameNames = ['CardMatching', 'RevealThePath', 'SimonSays', 'MissingLetters'];
  const paths = ['/cardmatching', '/revealthepath', '/simonsays', '/missletters'];
  const displayNames = ['Card Matching', 'Reveal the Path', 'Simon Says', 'Missing Letters'];

  return (
    <div className="main-menu">
      <Header pageTitle="Main Menu" />
      {activeProfile && (
        <div className="welcome-message">
          <span>Welcome, {activeProfile.nickname}!</span>
        </div>
      )}
      <div className="menu-container">
        <div className="games-container">
          {paths.map((path, index) => {
            const gameName = gameNames[index];
            const levels = getLevelInfo(gameName);
            return (
              <div key={index} className="game-section">
                <div className="game-details">
                  <span className="game-title">{displayNames[index]}</span>
                  <div className="level-info">
                    Easy: {levels.easy} <br />
                    Hard: {levels.hard}
                  </div>
                </div>
                <Link 
                  to={path} 
                  className="door-container"
                  onMouseEnter={() => {
                    setIsOpening(prev => {
                      const newState = [...prev];
                      newState[index] = true;
                      return newState;
                    });
                    setIsClosing(prev => {
                      const newState = [...prev];
                      newState[index] = false;
                      return newState;
                    });
                  }}
                  onMouseLeave={() => {
                    setIsOpening(prev => {
                      const newState = [...prev];
                      newState[index] = false;
                      return newState;
                    });
                    setIsClosing(prev => {
                      const newState = [...prev];
                      newState[index] = true;
                      return newState;
                    });
                  }}
                >
                  <div 
                    className={`door-image ${isOpening[index] ? 'opening' : ''} ${isClosing[index] ? 'closing' : ''}`}
                    onAnimationEnd={() => handleAnimationEnd(index)}
                  />
                </Link>
              </div>
            );
          })}
        </div>
        <Link to="/settings" className="settings-link">
          <FontAwesomeIcon icon={faCog} />
        </Link>
        <h1 className="spectroom-title">Welcome to SpectRoom</h1>
      </div>
      <NotificationPanel />
    </div>
  );
}

export default MainMenu;