import React, { useState } from 'react';
import {
  X,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { usePoints } from '../lib/PointsContext';
import { soundFX } from '../lib/soundFx';

interface SprintSummaryModalProps {
  targetPages: number;
  onClose: () => void;
}

export const SprintSummaryModal: React.FC<SprintSummaryModalProps> = ({
  targetPages,
  onClose
}) => {
  const [pagesRead, setPagesRead] = useState<number>(targetPages || 15);
  const [isLogged, setIsLogged] = useState(false);
  const { addPoints } = usePoints();

  const earnedTokens = 50 + pagesRead * 5;

  const handleLogSprint = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playChestClaim();
    addPoints(earnedTokens);
    setIsLogged(true);
  };

  return (
    <div className="modal-backdrop">
      <div className="sprint-summary-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Award size={22} color="#ffd700" />
            <div>
              <h3>Reading Sprint Complete! 🎉</h3>
              <span className="modal-subtitle">Log your progress and claim bonus Book Tokens</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {!isLogged ? (
          <form onSubmit={handleLogSprint} className="sprint-summary-form">
            <div className="sprint-stats-summary-box">
              <div className="summary-stat-col">
                <span className="stat-lbl">Sprint Target</span>
                <strong>{targetPages} Pages</strong>
              </div>
              <div className="summary-stat-col">
                <span className="stat-lbl">Duration</span>
                <strong>25 Minutes</strong>
              </div>
              <div className="summary-stat-col">
                <span className="stat-lbl">Reward Tokens</span>
                <strong style={{ color: '#ffd700' }}>+{earnedTokens} 🪙</strong>
              </div>
            </div>

            <div className="pages-input-section">
              <label className="section-label">How many pages did you read during this sprint?</label>
              <div className="pages-stepper-row">
                <button
                  type="button"
                  onClick={() => setPagesRead(Math.max(1, pagesRead - 1))}
                  className="btn-step"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={pagesRead}
                  onChange={e => setPagesRead(parseInt(e.target.value, 10) || 1)}
                  className="pages-number-input"
                />
                <button
                  type="button"
                  onClick={() => setPagesRead(pagesRead + 1)}
                  className="btn-step"
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Sparkles size={16} />
                <span>Claim +{earnedTokens} Book Tokens</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="sprint-logged-celebration">
            <CheckCircle2 size={44} color="#00ff88" className="pulse-fast" />
            <h4>{pagesRead} Pages Logged to Your Reading Stats!</h4>
            <p>You earned <strong>+{earnedTokens} Book Tokens</strong> for completing this silent sprint.</p>
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                onClose();
              }}
              className="btn-primary"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
