import React, { useState, useEffect, useRef } from 'react';
import './SlotMachine.css';
import { playTickSound, playWinSound } from '../utils/audio';

const MULTIPLIER = 30;
const ITEM_HEIGHT = 48;

const SlotMachine = ({ games = [], isSpinning, onStop, onInitialSelect, onInfoClick }) => {
  const [position, setPosition] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(0);
  const positionRef = useRef(0);
  const spinIntervalRef = useRef(null);
  const isInitializedRef = useRef(false);

  const rollerItems = Array.from({ length: MULTIPLIER }, () => games).flat();
  
  useEffect(() => {
    if (games.length > 0 && !isInitializedRef.current) {
      isInitializedRef.current = true;
      // Initial random position in block 1
      const initialPos = Math.floor(Math.random() * games.length);
      setPosition(initialPos);
      positionRef.current = initialPos;
      if (onInitialSelect) {
        onInitialSelect(games[initialPos]);
      }
    }
  }, [games, onInitialSelect]);

  useEffect(() => {
    if (isSpinning && games.length > 0) {
      let winningGameIndex = Math.floor(Math.random() * games.length);
      // Ensure we don't pick the same game twice in a row
      if (winningGameIndex === (positionRef.current % games.length)) {
        winningGameIndex = (winningGameIndex + Math.floor(Math.random() * (games.length - 1)) + 1) % games.length;
      }
      const stopIndex = (MULTIPLIER - 5) * games.length + winningGameIndex;
      
      const spinTime = 4000;
      setTransitionDuration(spinTime / 1000);
      setPosition(stopIndex);
      
      const totalItemsToCross = stopIndex - positionRef.current;
      positionRef.current = stopIndex;

      // Approximate tick sounds based on CSS easeOut
      let startTime = Date.now();
      let lastItemCrossed = 0;
      
      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const checkTick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinTime, 1);
        const currentEasedProgress = easeOutQuart(progress);
        const currentItem = Math.floor(currentEasedProgress * totalItemsToCross);
        
        if (currentItem > lastItemCrossed) {
          playTickSound();
          lastItemCrossed = currentItem;
        }
        
        if (progress < 1) {
          spinIntervalRef.current = requestAnimationFrame(checkTick);
        } else {
          playWinSound();
          
          // Instantly reset the roller position back to the equivalent low index
          const finalIndex = positionRef.current % games.length;
          setTransitionDuration(0);
          setPosition(finalIndex);
          positionRef.current = finalIndex;
          
          const finalGame = games[finalIndex];
          onStop(finalGame);
        }
      };
      
      spinIntervalRef.current = requestAnimationFrame(checkTick);
    }
    
    return () => {
      if (spinIntervalRef.current) cancelAnimationFrame(spinIntervalRef.current);
    };
  }, [isSpinning, onStop, games]);

  const offset = -(position * ITEM_HEIGHT);

  return (
    <div className="slot-machine-container">
      <div className="selector-line"></div>
      <button 
        type="button" 
        className="info-icon-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onInfoClick?.();
        }} 
        disabled={isSpinning || games.length === 0}
        title="Game rules & how to play"
        aria-label="How to play this game"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </button>
      <div 
        className="roller"
        style={{
          transform: `translateY(${offset}px)`,
          transition: `transform ${transitionDuration}s cubic-bezier(0.165, 0.84, 0.44, 1)`
        }}
      >
        {rollerItems.map((game, index) => {
          const isActive = !isSpinning && transitionDuration > 0 && index === position;
          return (
            <div 
              key={index} 
              className={`game-item ${isActive ? 'active' : ''}`}
            >
              {game}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SlotMachine;
