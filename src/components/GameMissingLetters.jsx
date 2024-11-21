import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileGameProgress } from '../store/profilesSlice';
import './GameMissingLetters.css';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const GameMissingLetters = () => {
  const dispatch = useDispatch();
  const activeProfile = useSelector((state) => state.profiles.activeProfile);


  // State variables for the game
  const [letters, setLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [missingLetters, setMissingLetters] = useState([]);
  const [userInputs, setUserInputs] = useState([]);
  const [gameState, setGameState] = useState('start');

  // Fetch word data from Firestore (Example Firestore structure)
  const fetchWordData = async () => {
    // Simulate fetching data by returning a mock object
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          word: 'developer',
          missingIndexes: [0, 3, 5],
        });
      }, 100); // Simulate a small delay
    });
  };

  // Initialize game
  const initializeGame = async () => {
    setGameState('loading');
    const data = await fetchWordData();
    if (data) {
      setCurrentWord(data.word);
      setMissingLetters(data.missingIndexes);
      setUserInputs(Array(data.word.length).fill(''));
      setGameState('playing');
    } else {
      setGameState('error');
    }
  };

  // Handle user input for missing letters
  const handleInput = (index, value) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  // Check the answers
  const checkAnswers = () => {
    let allCorrect = true;
    missingLetters.forEach((index) => {
      if (userInputs[index] !== currentWord[index]) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setGameState('won');
      // Update game progress here
      dispatch(updateProfileGameProgress({
        profileId: activeProfile.id,
        game: 'MissingLetters',
        score: 100 // Example score
      }));
    } else {
      setGameState('retry');
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  if (!activeProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="game-missingletters">
      {gameState === 'start' && <button onClick={initializeGame}>Start Game</button>}
      {gameState === 'playing' && (
        <div>
          <h2>Fill in the Missing Letters</h2>
          <div>
            {currentWord.split('').map((letter, index) =>
              missingLetters.includes(index) ? (
                <input
                  key={index}
                  value={userInputs[index]}
                  onChange={(e) => handleInput(index, e.target.value)}
                />
              ) : (
                <span key={index}>{letter}</span>
              )
            )}
          </div>
          <button onClick={checkAnswers}>Submit Answers</button>
        </div>
      )}
      {gameState === 'won' && <div>Congratulations! You have completed the challenge.</div>}
      {gameState === 'retry' && <div>Try Again. <button onClick={initializeGame}>Retry</button></div>}
      {gameState === 'error' && <div>Error loading game data.</div>}
    </div>
  );
};

export default GameMissingLetters;