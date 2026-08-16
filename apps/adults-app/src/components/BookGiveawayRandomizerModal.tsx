import React, { useState } from 'react';
import { X, Gift, Sparkles, CheckCircle2, Trophy, Users, Dices } from 'lucide-react';
import { DEFAULT_GIVEAWAYS, type GiveawayItem } from '../lib/bookGiveawayData';
import { soundFX } from '../lib/soundFx';

interface BookGiveawayRandomizerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BookGiveawayRandomizerModal: React.FC<BookGiveawayRandomizerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [giveaways, setGiveaways] = useState<GiveawayItem[]>(DEFAULT_GIVEAWAYS);
  const [isSpinning, setIsSpinning] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleRollWinner = (giveawayId: string) => {
    soundFX.playPop();
    setIsSpinning(true);
    setTimeout(() => {
      soundFX.playChestClaim();
      soundFX.playApplause();
      const mockWinner = 'MithrilReader_42';
      setGiveaways(prev => prev.map(g => g.id === giveawayId ? { ...g, winnerUsername: mockWinner } : g));
      setIsSpinning(false);
      setToastMsg(`🎉 GIVEAWAY WINNER CHOSEN: Congratulations @${mockWinner}!`);
      setTimeout(() => setToastMsg(null), 4000);
    }, 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="giveaway-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="giveaway-modal-header">
          <div className="giveaway-title-group">
            <div className="giveaway-badge">
              <Gift size={16} />
              <span>COMMUNITY BOOK BOX GIVEAWAYS & RANDOM ROLL PICKER</span>
            </div>
            <h3>@{streamerName}'s Live Book Giveaways</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Active Giveaway Hero Banner */}
        <div className="giveaway-hero-banner">
          <div className="giveaway-hero-left">
            <span className="gift-icon-huge">{isSpinning ? '🎲✨' : '🎁📦'}</span>
            <div>
              <h4>{giveaways[0].title}</h4>
              <p>{giveaways[0].itemDescription}</p>
              <span className="sponsor-pill">Sponsored by {giveaways[0].sponsorName}</span>
            </div>
          </div>

          <div className="giveaway-roll-col">
            <div className="eligible-readers-count">
              <Users size={14} color="#ffd700" />
              <span>{giveaways[0].eligibleViewersCount} Active Readers in Pool</span>
            </div>

            {giveaways[0].winnerUsername ? (
              <div className="winner-announced-box">
                <Trophy size={18} color="#ffd700" />
                <div>
                  <span className="winner-label">WINNER:</span>
                  <strong>@{giveaways[0].winnerUsername}</strong>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn-roll-winner"
                disabled={isSpinning}
                onClick={() => handleRollWinner(giveaways[0].id)}
              >
                <Dices size={16} />
                <span>{isSpinning ? 'Rolling Fortune Wheel...' : 'Roll Random Winner'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Past Giveaways List */}
        <div className="past-giveaways-card">
          <label>RECENT BROADCAST GIVEAWAYS:</label>
          <div className="giveaways-list">
            {giveaways.slice(1).map(g => (
              <div key={g.id} className="giveaway-row-tile">
                <div>
                  <strong>{g.title}</strong>
                  <p>{g.sponsorName}</p>
                </div>
                <span className="past-winner-pill">🏆 Winner: @{g.winnerUsername}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="giveaway-modal-footer">
          <span className="giveaway-rules-sub">
            ✨ Eligible entrants are verified active chat readers who have listened for at least 15 minutes.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
