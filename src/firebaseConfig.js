import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB5gN-aDfLMo8t92KRRLLHCp2ZyZBhVQiI",
  authDomain: "gemblock-871ce.firebaseapp.com",
  databaseURL: "gemblock-871ce-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gemblock-871ce",
  storageBucket: "gemblock-871ce.appspot.com",
  messagingSenderId: "573286145697",
  appId: "1:573286145697:web:5c6bde3410d17506b05ae0"
};

export const firebaseApp = initializeApp(firebaseConfig);