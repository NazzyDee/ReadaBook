import React, { useState } from 'react';
import { X, Gift, Trophy, RotateCw, Tag } from 'lucide-react';
import {
  MOCK_GIVEAWAY_PRIZES,
  MOCK_ELIGIBLE_CHATTERS,
  type GiveawayPrize
} from '../lib/mysteryBoxData';
import { soundFX } from '../lib/soundFx';

interface MysteryBookBoxModalProps {
  streamerName: string;
  onClose: () => void;
}

export const MysteryBookBoxModal: React.FC<MysteryBookBoxModalProps> = ({
  streamerName,
  onClose
}) => {
  const [prizes] = useState<GiveawayPrize[]>(MOCK_GIVEAWAY_PRIZES);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string>('prize_hardcover');
  const [subscribersOnly, setSubscribersOnly] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<{ username: string; claimCode: string } | null>(null);

  const activePrize = prizes.find(p => p.id === selectedPrizeId) || prizes[0];

  const handleSpinWheel = () => {
    setIsSpinning(true);
    setWinner(null);
    soundFX.playPop();

    // Wheel spin sound simulation
    const interval = setInterval(() => {
      soundFX.playPop();
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      const chosenUser = MOCK_ELIGIBLE_CHATTERS[Math.floor(Math.random() * MOCK_ELIGIBLE_CHATTERS.length)];
      const code = `READ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      setWinner({
        username: chosenUser,
        claimCode: code
      });
      setIsSpinning(false);
      soundFX.playDragonRoar();
      soundFX.playApplause();
    }, 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="mystery-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="mystery-modal-header">
          <div className="mystery-title-group">
            <div className="mystery-badge">
              <Gift size={16} />
              <span>MYSTERY BOOK BOX & COMMUNITY PRIZE WHEEL</span>
            </div>
            <h3>@{streamerName}'s Live Book Giveaway Wheel</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Winner Celebration Deck */}
        {winner ? (
          <div className="mystery-winner-banner">
            <div className="winner-trophy-wrap">
              <Trophy size={42} color="#ffd700" className="trophy-pulse-anim" />
            </div>

            <div className="winner-details-text">
              <span className="winner-pill">🎉 WE HAVE A WINNER!</span>
              <h4>@{winner.username} won the {activePrize.name}!</h4>
              <p>Valued at ${activePrize.estimatedValueUsd.toFixed(2)} USD • Claim code sent to private Whispers.</p>

              <div className="claim-code-box">
                <Tag size={14} /> Claim Verification Code: <strong>{winner.claimCode}</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary btn-spin-again"
              onClick={() => setWinner(null)}
            >
              <span>Spin for Another Winner</span>
            </button>
          </div>
        ) : (
          <>
            <p className="mystery-intro-text">
              Select a prize package and spin the wheel to reward active chatters or loyal subscribers with physical novels, signed bookplates, and exclusive swag!
            </p>

            {/* Prize Selector Grid */}
            <div className="prizes-selection-grid">
              {prizes.map(p => (
                <div
                  key={p.id}
                  className={`prize-card-item ${selectedPrizeId === p.id ? 'active' : ''}`}
                  style={{ borderColor: selectedPrizeId === p.id ? p.color : undefined }}
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedPrizeId(p.id);
                  }}
                >
                  <span className="prize-emoji-icon">{p.icon}</span>
                  <div className="prize-card-info">
                    <span className="prize-cat-tag">{p.category}</span>
                    <h4>{p.name}</h4>
                    <p>{p.description}</p>
                    <span className="prize-value-tag">${p.estimatedValueUsd.toFixed(2)} Value</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Giveaway Settings Row */}
            <div className="giveaway-settings-bar">
              <label className="sub-only-checkbox">
                <input
                  type="checkbox"
                  checked={subscribersOnly}
                  onChange={e => setSubscribersOnly(e.target.checked)}
                />
                <span>Subscribers & Guild Patrons Only (2x Luck)</span>
              </label>

              <span className="eligible-count-label">
                👥 {MOCK_ELIGIBLE_CHATTERS.length} Eligible Chatters Active
              </span>
            </div>

            {/* Footer Wheel Launcher */}
            <div className="mystery-modal-footer">
              <button
                type="button"
                className={`btn-primary btn-spin-wheel ${isSpinning ? 'spinning' : ''}`}
                disabled={isSpinning}
                onClick={handleSpinWheel}
              >
                <RotateCw size={18} className={isSpinning ? 'spin-icon-anim' : ''} />
                <span>{isSpinning ? 'Selecting Winner...' : 'Spin Prize Wheel!'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
