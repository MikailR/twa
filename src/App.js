import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get } from "firebase/database";
import { useAuth } from './context/AuthContext';
import { firebaseApp } from './firebaseConfig';
import TapCounter from './components/TapCounter/TapCounter';
import TapButton from './components/TapButton/TapButton';
import './App.css';

const database = getDatabase(firebaseApp);

function App() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUserData(user.uid);
    }
  }, [user]);

  const loadUserData = async (userId) => {
    const userRef = ref(database, 'users/' + userId);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      setTapCount(userData.tapCount || 0);
    }
    setLoading(false);
  };

  const handleTap = (e) => {
    e.preventDefault();
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    if (user) {
      set(ref(database, 'users/' + user.uid), { tapCount: newTapCount })
        .then(() => console.log('Tap count updated'))
        .catch((error) => console.error(`Error updating tap count: ${error.message}`));
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );

  return (
    <div className="App">
      <TapCounter count={tapCount} />
      <TapButton onTap={handleTap} />
      {/* <div className='tap-button' onMouseUp={handleTap} onTouchEnd={handleTap} /> */}
      <p>Welcome, {user?.displayName || 'User'}!</p>
    </div>
  );
}

export default App;
