import React from 'react';
import { Sparkles, Trophy, Moon, RotateCcw, X } from 'lucide-react';

interface StarCelebrationModalProps {
  bookTitle: string;
  onRestart: () => void;
  onClose: () => void;
}

export const StarCelebrationModal: React.FC<StarCelebrationModalProps> = ({
  bookTitle,
  onRestart,
  onClose
}) => {
  return (
    <div className="modal-backdrop">
      <div className="kid-star-celebration-card">
        <button onClick={onClose} className="kid-modal-close-btn">
          <X size={20} />
        </button>

        <div className="kid-star-crest-burst">
          <span className="big-golden-star">🌟</span>
        </div>

        <h2 className="kid-celebration-title">Story Complete! 🎉</h2>
        <p className="kid-celebration-sub">
          You finished <strong>{bookTitle}</strong>! You earned the <strong>Chapter Champion</strong> star badge!
        </p>

        <div className="kid-badges-unlocked-row">
          <div className="kid-badge-item">
            <span className="badge-emoji">⭐</span>
            <span>+50 Star Points</span>
          </div>
          <div className="kid-badge-item">
            <Trophy size={20} color="#ffd700" />
            <span>Story Explorer</span>
          </div>
          <div className="kid-badge-item">
            <Moon size={20} color="#00e5ff" />
            <span>Sweet Dreams</span>
          </div>
        </div>

        <div className="kid-celebration-actions">
          <button onClick={onRestart} className="btn-kid-action secondary">
            <RotateCcw size={18} />
            <span>Read Again</span>
          </button>
          <button onClick={onClose} className="btn-kid-action primary">
            <Sparkles size={18} />
            <span>Yay, Awesome!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
