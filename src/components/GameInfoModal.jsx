import React, { useEffect } from 'react';
import './GameInfoModal.css';
import { getGameInfo } from '../utils/gameRules';

const GameInfoModal = ({ game, rulesMap, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !game) return null;

  const info = getGameInfo(game, rulesMap);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="game-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close game info">
          &times;
        </button>

        <div className="modal-header">
          <div className="modal-badge">Game Rules</div>
          <h2 id="game-title" className="modal-title">{info.name}</h2>
        </div>

        <div className="modal-content">
          {info.deal && (
            <div className="rule-section">
              <div className="rule-heading">
                <span className="rule-icon">🃏</span>
                <span>Deal</span>
              </div>
              <p className="rule-text">{info.deal}</p>
            </div>
          )}

          {info.rules && (
            <div className="rule-section">
              <div className="rule-heading">
                <span className="rule-icon">🎯</span>
                <span>Rules</span>
              </div>
              <p className="rule-text">{info.rules}</p>
            </div>
          )}

          {info.winner && (
            <div className="rule-section">
              <div className="rule-heading">
                <span className="rule-icon">🏆</span>
                <span>Pot & Split</span>
              </div>
              <p className="rule-text">{info.winner}</p>
            </div>
          )}
        </div>

        <button className="modal-done-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default GameInfoModal;
