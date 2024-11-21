import React, { useState } from 'react';
import './avatar.css';
import AvatarDisplay from './AvatarDisplay';

const AvatarSelection = ({ currentAvatar = 1, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const totalAvatars = 4;

  const handlePrevious = () => {
    setIsChanging(true);
    const newAvatarId = currentAvatar === 1 ? totalAvatars : currentAvatar - 1;
    onSelect(newAvatarId);
    setTimeout(() => setIsChanging(false), 300);
  };

  const handleNext = () => {
    setIsChanging(true);
    const newAvatarId = currentAvatar === totalAvatars ? 1 : currentAvatar + 1;
    onSelect(newAvatarId);
    setTimeout(() => setIsChanging(false), 300); 
  };

  const avatarNames = {
    1: "Skeleton",
    2: "Penguin",
    3: "Bear",
    4: "Ghost"
  };

  return (
    <div className="avatar-selection">
      <button 
        className="nav-button prev"
        onClick={handlePrevious}
        aria-label="Previous avatar"
      />

      <div className={`avatar-preview ${isChanging ? 'changing' : ''}`}>
        <div className="avatar-name">{avatarNames[currentAvatar]}</div>
        <div 
          className="avatar-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AvatarDisplay 
            avatarId={currentAvatar}
            isAnimating={isHovered}
            size="lg"
          />
        </div>
      </div>

      <button 
        className="nav-button next"
        onClick={handleNext}
        aria-label="Next avatar"
      />
    </div>
  );
};

export default AvatarSelection;