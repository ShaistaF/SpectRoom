import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../store/usersSlice'
import { setActiveProfile, setProfiles } from '../store/profilesSlice'
import { persistor } from '../store/store'
import { useNavigate } from 'react-router-dom'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleSignOut() {
    if (window.confirm('Are you sure you want to sign out?')) {
      signOut(auth)
        .then(() => {
          dispatch(setUser(null))
          dispatch(setActiveProfile(null))
          dispatch(setProfiles([]))
          persistor.purge()
          console.log('Signed Out')
          navigate('/login')
        })
        .catch((error) => {
          console.error('Sign out error:', error)
        })
    }
  }


  function handleChangeProfile() {
    dispatch(setActiveProfile(null))
    dispatch(setProfiles([])) 
    navigate('/profileselection')
  }

  return (
    <div className="header">
      <button onClick={handleChangeProfile} className="btn primary">
        Change Profile
      </button>
      <button onClick={handleSignOut} className="btn secondary">
        Logout
      </button>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .header {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 10px;
        }

        .btn {
          font-family: 'Press Start 2P', cursive;
          font-size: 12px;
          padding: 10px 15px;
          border: none;
          cursor: pointer;
          position: relative;
          top: 0;
          transition: top 0.1s;
        }

        .btn.primary {
          background-color: #5BA58C;
          color: #2F2A3F;
          box-shadow: 0 4px 0 #3D7A68;
        }

        .btn.secondary {
          background-color: #A66E5A;
          color: #D9B88F;
          box-shadow: 0 4px 0 #7A4E3D;
          z-index: 1000; 
        }

        .btn:active {
          top: 4px;
          box-shadow: 0 0 0 #000;
        }

        @media (max-width: 768px) {
          .header {
            position: static;
            justify-content: center;
            padding: 10px;
          }

          .btn {
            font-size: 10px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  )
}

export default Header;