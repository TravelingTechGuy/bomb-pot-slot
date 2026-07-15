import React, { useState, useEffect, useRef } from 'react';
import './SlotMachine.css';
import { playTickSound, playWinSound } from '../utils/audio';

const MULTIPLIER = 30;
const ITEM_HEIGHT = 48;

const SlotMachine = ({ games = [], isSpinning, onStop }) => {
  const [position, setPosition] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(0);
  const positionRef = useRef(0);
  const spinIntervalRef = useRef(null);

  const rollerItems = Array.from({ length: MULTIPLIER }, () => games).flat();
  
  useEffect(() => {
    if (games.length > 0) {
      // Initial random position in block 1
      const initialPos = Math.floor(Math.random() * games.length);
      setPosition(initialPos);
      positionRef.current = initialPos;
    }
  }, [games]);

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
