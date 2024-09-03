import React, { createContext, useState, useEffect, useContext } from 'react';
import { firebaseApp } from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";

const twa = window.Telegram.WebApp;
const auth = getAuth(firebaseApp);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    twa.ready();

    if (twa.initDataUnsafe?.user) {
      const telegramId = twa.initDataUnsafe.user.id.toString();
      const email = `${telegramId}@telegram.com`;
      const password = 'telegram_user';

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => setUser(userCredential.user))
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                setUser(userCredential.user);
                updateProfile(userCredential.user, { displayName: twa.initDataUnsafe?.displayName || "Young Panda" })
                  .then(() => setUser(prevUser => ({ ...prevUser, displayName })))
                  .catch((error) => setSignal(`Error updating profile: ${error.message}`));
              })
              .catch((error) => console.error("Error creating user:", error));
          } else {
            console.error("Error signing in:", error);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}