import React, { useState } from 'react';
import SlotMachine from './components/SlotMachine';
import { initAudio } from './utils/audio';
import './index.css';

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [lastBomb, setLastBomb] = useState(null);

  const handleSpin = () => {
    if (!audioInitialized) {
      initAudio();
      setAudioInitialized(true);
    }
    if (!isSpinning) {
      setIsSpinning(true);
      setSpinCount(c => c + 1);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Bomb Pot Game</h1>
      <SlotMachine isSpinning={isSpinning} onStop={(game) => { setIsSpinning(false); setLastBomb(game); }} />
      <div className={`bomb-button-container ${isSpinning ? 'spinning' : ''}`}>
        <div className="bomb-svg-container">
          <svg key={spinCount} viewBox="0 0 50 50" width="100%" height="100%">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path className="bomb-fuse-path" d="M 45 10 Q 20 20 10 50" />
            <g className={`bomb-spark-group ${isSpinning ? 'spinning' : ''}`}>
              {isSpinning && (
                <animateMotion 
                  dur="4s" 
                  repeatCount="1" 
                  fill="freeze"
                  path="M 45 10 Q 20 20 10 50"
                />
              )}
              <circle r="3" fill="#ffff00" filter="url(#glow)">
                 <animate attributeName="r" values="2; 5; 2" dur="0.1s" repeatCount="indefinite" />
                 <animate attributeName="fill" values="#ffaa00; #ffff00; #ffaa00" dur="0.1s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>
        <div className="bomb-neck"></div>
        <button 
          className="spin-button" 
          onClick={handleSpin} 
          disabled={isSpinning}
        >
          {isSpinning ? 'Rolling...' : 'Select Game'}
        </button>
      </div>

      {lastBomb && (
        <div className="last-bomb-label">
          Last bomb: <span>{lastBomb}</span>
        </div>
      )}

      <div className="footer-label">
        All rights reserved TravelingTech Guy LLC 2026
      </div>
    </div>
  );
}

export default App;
