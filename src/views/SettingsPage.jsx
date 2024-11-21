import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebase/config';
import { CirclePicker } from 'react-color';
import './SettingsPage.css';

function SettingsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    nickname: '',
    bloodType: '',
    favoriteColor: '#a52a2a',
    gradeClass: '',
    schoolName: '',
    schoolTeacher: '',
    schoolBusNumber: '',
    music: '',
    soundEffects: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        navigate('/login');
        return;
      }

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        setError('User data not found');
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      const activeProfile = userData.profiles.find(profile => profile.active);
      
      if (!activeProfile) {
        setError('No active profile found');
        setIsLoading(false);
        return;
      }

      setProfileData({
        nickname: activeProfile.nickname || '',
        bloodType: activeProfile.bloodType || '',
        favoriteColor: activeProfile.favoriteColor || '#a52a2a',
        gradeClass: activeProfile.gradeClass || '',
        schoolName: activeProfile.schoolName || '',
        schoolTeacher: activeProfile.schoolTeacher || '',
        schoolBusNumber: activeProfile.schoolBusNumber || '',
        music: activeProfile.music || '',
        soundEffects: activeProfile.soundEffects || ''
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load settings: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userId = auth.currentUser?.uid;
      const db = getFirestore();
      const userRef = doc(db, 'users', userId);
      
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const profiles = userData.profiles;
      const activeProfileIndex = profiles.findIndex(profile => profile.active);

      profiles[activeProfileIndex] = {
        ...profiles[activeProfileIndex],
        nickname: profileData.nickname,
        bloodType: profileData.bloodType,
        favoriteColor: profileData.favoriteColor,
        gradeClass: profileData.gradeClass,
        schoolName: profileData.schoolName,
        schoolTeacher: profileData.schoolTeacher,
        schoolBusNumber: profileData.schoolBusNumber,
        music: profileData.music,
        soundEffects: profileData.soundEffects
      };

      await updateDoc(userRef, {
        profiles: profiles
      });

      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color) => {
    setProfileData(prev => ({
      ...prev,
      favoriteColor: color.hex
    }));
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="settings-container">
      <button onClick={() => navigate('/')} className="back-button">
        Back
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      <h1 className="settings-title">Profile Settings</h1>

      <div className="settings-section">
        <h2>Sound Settings</h2>
        <div className="toggle-container">
          <label className="toggle-label">
            Sound Effects
            <input
              type="checkbox"
              checked={profileData.soundEffects !== 'off'}
              onChange={(e) => handleInputChange({
                target: {
                  name: 'soundEffects',
                  value: e.target.checked ? 'on' : 'off'
                }
              })}
            />
          </label>
        </div>

        <div className="toggle-container">
          <label className="toggle-label">
            Music
            <input
              type="checkbox"
              checked={profileData.music !== 'off'}
              onChange={(e) => handleInputChange({
                target: {
                  name: 'music',
                  value: e.target.checked ? 'on' : 'off'
                }
              })}
            />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <div className="personal-details-header">
          <h2>Profile Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`button ${isEditing ? 'save-button' : 'edit-button'}`}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="personal-details">
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="form-control">
                <label>Nickname</label>
                <input
                  type="text"
                  name="nickname"
                  value={profileData.nickname}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control">
                <label>Blood Type</label>
                <input
                  type="text"
                  name="bloodType"
                  value={profileData.bloodType}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control">
                <label>Grade/Class</label>
                <input
                  type="text"
                  name="gradeClass"
                  value={profileData.gradeClass}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control">
                <label>School Name</label>
                <input
                  type="text"
                  name="schoolName"
                  value={profileData.schoolName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control">
                <label>School Teacher</label>
                <input
                  type="text"
                  name="schoolTeacher"
                  value={profileData.schoolTeacher}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control">
                <label>School Bus Number</label>
                <input
                  type="text"
                  name="schoolBusNumber"
                  value={profileData.schoolBusNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control">
                <label>Favorite Color</label>
                <CirclePicker
                  color={profileData.favoriteColor}
                  onChangeComplete={handleColorChange}
                  colors={[
                    '#0000FF', '#FF0000', '#FFFF00', '#008000', '#800080',
                    '#FFA500', '#FFC0CB', '#006400', '#89CFF0', '#A52A2A'
                  ]}
                />
              </div>

              <button type="submit" className="button save-button">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="view-mode">
              <p><strong>Nickname:</strong> {profileData.nickname}</p>
              <p><strong>Blood Type:</strong> {profileData.bloodType}</p>
              <p><strong>Grade/Class:</strong> {profileData.gradeClass}</p>
              <p><strong>School Name:</strong> {profileData.schoolName}</p>
              <p><strong>School Teacher:</strong> {profileData.schoolTeacher}</p>
              <p><strong>School Bus Number:</strong> {profileData.schoolBusNumber}</p>
              <div>
                <strong>Favorite Color:</strong>
                <div 
                  className="color-preview"
                  style={{ backgroundColor: profileData.favoriteColor }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;