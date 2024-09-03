import React from 'react';
import './TapCounter.css';

const TapCounter = ({ count }) => {
  return (
    <div className="tap-counter">
      <span className="tap-counter-icon">🎋</span>
      <span className="tap-counter-value">{count}</span>
    </div>
  );
};

export default TapCounter;