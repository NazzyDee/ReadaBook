import React, { useState, useEffect } from 'react';
import { Gift, X, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface GiftSubRouletteModalProps {
  streamerName: string;
  giftCount: number;
  onCompleteCelebration: (recipients: string[]) => void;
  onClose: () => void;
}

const CANDIDATE_CHATTERS = [
  'FrodoReader',
  'HermioneBooks',
  'GimliPageTurner',
  'SamwiseWise',
  'AragornKing',
  'LegolasArrow',
  'DumbledoreFan',
  'KatnissEverRead',
  'PercyJacksonFan',
  'GandalfTheWhite'
];

export const GiftSubRouletteModal: React.FC<GiftSubRouletteModalProps> = ({
  streamerName,
  giftCount,
  onCompleteCelebration,
  onClose
}) => {
  const [isSpinning, setIsSpinning] = useState(true);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  const [hasSettled, setHasSettled] = useState(false);

  useEffect(() => {
    // Pick N unique winners from candidates
    const shuffled = [...CANDIDATE_CHATTERS].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, Math.min(giftCount, CANDIDATE_CHATTERS.length));
    setSelectedWinners(winners);

    // Spin animation
    const targetDegrees = 1440 + Math.floor(Math.random() * 360);
    setRotationDegrees(targetDegrees);

    const spinTimer = setTimeout(() => {
      setIsSpinning(false);
      setHasSettled(true);
      soundFX.playCheer();
    }, 3200);

    return () => clearTimeout(spinTimer);
  }, [giftCount]);

  const handleFinish = () => {
    soundFX.playPop();
    onCompleteCelebration(selectedWinners);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="gift-roulette-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Gift size={20} color="#ffd700" />
            <h3>Community Gift Sub Roulette • {streamerName}</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Roulette Stage */}
        <div className="roulette-stage">
          <div className="roulette-wheel-container">
            <div className="roulette-pointer">▼</div>
            <div
              className="roulette-wheel"
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transition: isSpinning ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
              }}
            >
              {CANDIDATE_CHATTERS.map((name, i) => {
                const angle = (360 / CANDIDATE_CHATTERS.length) * i;
                return (
                  <div
                    key={name}
                    className="wheel-slice"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <span className="slice-text">{name}</span>
                  </div>
                );
              })}
            </div>
            <div className="wheel-center-hub">
              <Gift size={22} color="#ffd700" />
            </div>
          </div>

          <div className="roulette-status-text">
            {isSpinning ? (
              <span className="spin-status-label pulse-fast">
                🎰 Spinning for {giftCount} Lucky Community Members...
              </span>
            ) : (
              <span className="spin-status-label victory">
                🎉 {giftCount} Lucky Readers Chosen!
              </span>
            )}
          </div>
        </div>

        {/* Recipients Grid */}
        {hasSettled && (
          <div className="roulette-winners-section">
            <div className="section-header-row">
              <Trophy size={16} color="#ffd700" />
              <span>Gift Subscription Recipients:</span>
            </div>

            <div className="winners-grid">
              {selectedWinners.map((winner, idx) => (
                <div key={winner} className="winner-pill-card">
                  <span className="winner-num">#{idx + 1}</span>
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${winner}`}
                    alt={winner}
                    className="winner-avatar"
                  />
                  <div className="winner-meta">
                    <strong>{winner}</strong>
                    <span className="winner-sub-tier">Tier 1 • 1 Month</span>
                  </div>
                  <CheckCircle2 size={16} color="#00ff88" className="winner-check" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            onClick={handleFinish}
            disabled={isSpinning}
            className="btn-primary btn-gift-complete"
          >
            <Sparkles size={16} />
            <span>Announce & Distribute to Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
