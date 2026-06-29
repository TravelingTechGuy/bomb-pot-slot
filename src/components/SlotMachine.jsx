import React, { useState, useEffect, useRef } from 'react';
import './SlotMachine.css';
import { playTickSound, playWinSound } from '../utils/audio';
import GAMES from '../games.json';

const MULTIPLIER = 30;
const rollerItems = Array.from({ length: MULTIPLIER }, () => GAMES).flat();
const ITEM_HEIGHT = 48;

const SlotMachine = ({ isSpinning, onStop }) => {
  const [position, setPosition] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(0);
  const positionRef = useRef(0);
  const spinIntervalRef = useRef(null);
  
  useEffect(() => {
    // Initial random position in block 1
    const initialPos = Math.floor(Math.random() * GAMES.length);
    setPosition(initialPos);
    positionRef.current = initialPos;
  }, []);

  useEffect(() => {
    if (isSpinning) {
      // 1. Instantly move back to the first block if we're far down
      const currentEquivalent = positionRef.current % GAMES.length;
      setTransitionDuration(0);
      setPosition(currentEquivalent);
      positionRef.current = currentEquivalent;
      
      // 2. Start the spin after forcing the browser to paint the 0s transition reset
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          let winningGameIndex = Math.floor(Math.random() * GAMES.length);
          // Ensure we don't pick the same game twice in a row
          if (winningGameIndex === (positionRef.current % GAMES.length)) {
            winningGameIndex = (winningGameIndex + Math.floor(Math.random() * (GAMES.length - 1)) + 1) % GAMES.length;
          }
          const stopIndex = (MULTIPLIER - 5) * GAMES.length + winningGameIndex;
          
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
              const finalGame = GAMES[positionRef.current % GAMES.length];
              onStop(finalGame);
            }
          };
          
          spinIntervalRef.current = requestAnimationFrame(checkTick);
        });
      });
    }
    
    return () => {
      if (spinIntervalRef.current) cancelAnimationFrame(spinIntervalRef.current);
    };
  }, [isSpinning, onStop]);

  const offset = -(position * ITEM_HEIGHT);

  return (
    <div className="slot-machine-container">
      <div className="selector-line"></div>
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
