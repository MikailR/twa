import React, { useState } from 'react';
import './TapButton.css';

const TapButton = ({ onTap }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsPressed(true);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsPressed(false);
    onTap(e);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = (e) => {
    setIsPressed(false);
    onTap(e);
  };

  return (
    <div
      className={`tap-button ${isPressed ? 'pressed' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
};

export default TapButton;