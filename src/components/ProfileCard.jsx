import React from 'react';
import AvatarDisplay from './AvatarDisplay';
import './ProfileCard.css';

function ProfileCard({ profile, onClick }) {

  // Scores
  const totalScore = Object.values(profile.games || {}).reduce((total, game) => {
    return total + (game.easy?.score || 0) + (game.hard?.score || 0);
  }, 0);

  // Badges
  const getBadgeColor = (level) => {
    switch(level) {
      case 0: return '#ccc'; 
      case 1: return '#CD7F32'; 
      case 2: return '#C0C0C0'; 
      case 3: return '#FFD700'; 
      default: return '#ccc';
    }
  };

  return (
    <div 
      className="profile-card" 
      onClick={onClick}
      style={{ borderColor: profile.favoriteColor || '#ccc' }}
    >
      <div className="profile-info">
        <h3>{profile.nickname}</h3>
      </div>

      <div className="profile-picture">
        <AvatarDisplay
          avatarId={profile.profilePicture} 
          size="md"
        />
      </div>

      <div className="total-score">Score: {totalScore}</div>

      <div className="badges-container">
        {/* Easy Mode Badges  */}
        <div className="badge-row">
          {['CardMatching', 'MissingLetters', 'RevealThePath', 'SimonSays'].map(game => (
            <div 
              key={`Easy${game}`}
              className="badge"
              style={{ backgroundColor: getBadgeColor(profile.badges[`Easy${game}`]) }}
              title={`Easy ${game}`}
            >
              E
            </div>
          ))}
        </div>

        {/* Hard Mode Badges  */}
        <div className="badge-row">
          {['CardMatching', 'MissingLetters', 'RevealThePath', 'SimonSays'].map(game => (
            <div 
              key={`Hard${game}`}
              className="badge"
              style={{ backgroundColor: getBadgeColor(profile.badges[`Hard${game}`]) }}
              title={`Hard ${game}`}
            >
              H
            </div>
          ))}
        </div>

        {/* Streak Badge  */}
        <div className="badge-row streak-row">
          <div 
            className="badge streak-badge"
            style={{ backgroundColor: getBadgeColor(profile.badges.StreakBadge) }}
            title={`Streak Badge: ${profile.streakTracking} days`}
          >
            S
          </div>
        </div>
      </div>

      {profile.active && <div className="active-badge">(Active)</div>}
    </div>
  );
}

export default ProfileCard;
