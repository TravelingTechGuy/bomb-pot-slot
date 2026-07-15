import React, { useState, useEffect } from 'react';
import SlotMachine from './components/SlotMachine';
import { initAudio } from './utils/audio';
import './index.css';

function App() {
  const [games, setGames] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [lastBomb, setLastBomb] = useState(null);

  useEffect(() => {
    fetch('/games.json')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error("Error loading games.json:", err));
  }, []);

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
      <SlotMachine games={games} isSpinning={isSpinning} onStop={(game) => { setIsSpinning(false); setLastBomb(game); }} />
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
            <circle
              className={`bomb-spark ${isSpinning ? 'spinning' : ''}`}
              r="3"
              fill="#ffff00"
              filter="url(#glow)"
            />
          </svg>
        </div>
        <div className="bomb-neck"></div>
        <button 
          className="spin-button" 
          onClick={handleSpin} 
          disabled={isSpinning || games.length === 0}
        >
          {games.length === 0 ? 'Loading...' : (isSpinning ? 'Rolling...' : 'Select Game')}
        </button>
      </div>

      <div className={`last-bomb-label ${lastBomb ? 'visible' : ''}`}>
        Last bomb: <span>{lastBomb}</span>
      </div>

      <div className="footer-label">
        All rights reserved Traveling Tech Guy LLC {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default App;
