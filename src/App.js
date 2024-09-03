import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyB5gN-aDfLMo8t92KRRLLHCp2ZyZBhVQiI",
  authDomain: "gemblock-871ce.firebaseapp.com",
  databaseURL: "gemblock-871ce-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gemblock-871ce",
  storageBucket: "gemblock-871ce.appspot.com",
  messagingSenderId: "573286145697",
  appId: "1:573286145697:web:5c6bde3410d17506b05ae0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const twa = window.Telegram.WebApp;

function App() {
  const [user, setUser] = useState(null);
  const [tapCount, setTapCount] = useState(0);
  const [signal, setSignal] = useState('');

  useEffect(() => {
    twa.ready();
    if (twa.initDataUnsafe?.user) {
      const telegramId = twa.initDataUnsafe.user.id.toString();
      const email = `${telegramId}@telegram.com`;
      const password = 'telegram_user';

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setUser(userCredential.user);
          loadUserData(userCredential.user.uid);
          setSignal('Connected to Telegram via Sign-In');
        })
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                setUser(userCredential.user);
                initializeUserData(userCredential.user.uid, telegramId);
                setSignal('Connected to Telegram via Create User');
              })
              .catch((error) => {
                console.error("Error creating user:", error);
                setSignal(`Error creating user: ${error.message}`);
              });
          } else {
            console.error("Error signing in:", error);
            setSignal(`Error signing in: ${error.message}`);
          }
        });
    }
  }, []);

  const loadUserData = async (userId) => {
    const userRef = ref(database, 'users/' + userId);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      setTapCount(userData.tapCount || 0);
    }
  };

  const initializeUserData = (userId, telegramId) => {
    set(ref(database, 'users/' + userId), {
      telegramId: telegramId,
      tapCount: 0,
    });
  };

  const handleTap = (e) => {
    e.preventDefault();
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    if (user) {
      setSignal('Updating tap count');
      const obj = set(ref(database, 'users/' + user.uid), {
        telegramId: user.uid,
        tapCount: newTapCount,
      })
      .then(() => setSignal('Tap count updated'))
      .catch((error) => setSignal(`Error updating tap count: ${error.message}`));
      setSignal(JSON.stringify(obj));
    }
  };

  const updateMyProfile = (user, displayName) => {
    updateProfile(user, {
      displayName: displayName,
    })
    .then(() => setSignal('Profile updated'))
    .catch((error) => setSignal(`Error updating profile: ${error.message}`));
  };

  return (
    <div className="App">
      <h1>Tap to Earn</h1>
      <p>Taps: {tapCount}</p>
      <div className='tap-button' onMouseUp={handleTap} onTouchEnd={handleTap}>Tap to Earn!</div>
      <p>Welcome, {twa.initDataUnsafe?.user?.first_name || 'User'}!</p>
      <p>{signal}</p>
      <button onClick={() => updateMyProfile(user, 'Young Panda')}>Update Profile</button>
      <p>{auth.currentUser?.displayName}</p>
    </div>
  );
}

export default App;
