import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [balance, setBalance] = useState(0);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    // TODO: Initialize Telegram Mini App SDK
    // Example: window.Telegram.WebApp.ready()
  }, []);

  const handleTap = () => {
    setTapCount(tapCount + 1);
    // TODO: Implement earning logic
    // Example: setBalance(balance + 0.1)
  };

  return (
    <div className="App">
      <h1>Tap to Earn</h1>
      <p>Balance: {balance.toFixed(2)} tokens</p>
      <p>Taps: {tapCount}</p>
      <button onClick={handleTap}>Tap to Earn!</button>
      {/* TODO: Add withdrawal button and logic */}
    </div>
  );
}

export default App;