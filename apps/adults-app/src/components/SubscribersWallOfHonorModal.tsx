import React, { useState } from 'react';
import { X, Crown, Sparkles, Award, Star, Heart } from 'lucide-react';
import { FOUNDING_READERS_LIST, type FoundingSubscriber } from '../lib/subscribersWallData';
import { soundFX } from '../lib/soundFx';

interface SubscribersWallOfHonorModalProps {
  streamerName: string;
  onClose: () => void;
}

export const SubscribersWallOfHonorModal: React.FC<SubscribersWallOfHonorModalProps> = ({
  streamerName,
  onClose
}) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSaluteFounder = (founder: FoundingSubscriber) => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg(`📜 Saluted Founder #${founder.rank} @${founder.username} (${founder.totalTenureMonths} Months of Patronage)!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="wall-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="wall-modal-header">
          <div className="wall-title-group">
            <div className="wall-badge">
              <Crown size={16} />
              <span>FOUNDING READERS & GRAND SCRIBE WALL OF HONOR</span>
            </div>
            <h3>@{streamerName}'s Hall of First Patrons</h3>
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

        {/* Plaque Intro */}
        <div className="museum-plaque-banner">
          <div className="plaque-icon-wrap">
            <Award size={36} color="#ffd700" />
          </div>
          <div className="plaque-text">
            <h4>The First 10 Founding Patrons</h4>
            <p>
              These immortal scribes pledged their allegiance on Day 1 of the broadcast. Their names are etched in gold across all future audiobook editions.
            </p>
          </div>
        </div>

        {/* Founders Grid */}
        <div className="founders-grid">
          {FOUNDING_READERS_LIST.map(founder => (
            <div key={founder.rank} className="founder-card">
              <div className="founder-top-row">
                <span className="founder-rank-badge">#{founder.rank}</span>
                <span className="founder-wax-seal">⚜️ FOUNDER</span>
              </div>

              <div className="founder-avatar-wrap">
                <img src={founder.avatarUrl} alt={founder.username} />
                <Star size={14} color="#ffd700" className="founder-star-icon" />
              </div>

              <h4>@{founder.username}</h4>
              <span className="founder-title-pill">{founder.badgeTitle}</span>

              <div className="founder-meta-row">
                <span>{founder.foundingDate}</span>
                <strong>{founder.totalTenureMonths} Mo. Streak</strong>
              </div>

              <button
                type="button"
                className="btn-salute-founder"
                onClick={() => handleSaluteFounder(founder)}
              >
                <Heart size={12} color="#ff3b3b" />
                <span>Salute Scribe</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="wall-modal-footer">
          <span className="wall-notice">
            🏛️ 4 / 10 Founding Slots Claimed • 6 Slots Remaining for New Patrons
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <span>Close Wall of Honor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
