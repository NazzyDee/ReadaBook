import React, { useState } from 'react';
import { X, Gift, CheckCircle2, Sparkles, Clock, Check } from 'lucide-react';
import { MOCK_VIEWER_DROPS, type LiteraryDropItem } from '../lib/viewerDropsData';
import { soundFX } from '../lib/soundFx';

interface ViewerDropsModalProps {
  onClose: () => void;
}

export const ViewerDropsModal: React.FC<ViewerDropsModalProps> = ({
  onClose
}) => {
  const [drops, setDrops] = useState<LiteraryDropItem[]>(MOCK_VIEWER_DROPS);
  const [claimToast, setClaimToast] = useState<string | null>(null);

  const handleClaimDrop = (dropId: string, title: string) => {
    soundFX.playChestClaim();
    soundFX.playApplause();

    setDrops(prev =>
      prev.map(d => (d.id === dropId ? { ...d, isClaimed: true } : d))
    );

    setClaimToast(`🎁 Claimed "${title}"! Added to your ReadaBook Vault.`);
    setTimeout(() => setClaimToast(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drops-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drops-modal-header">
          <div className="drops-title-group">
            <div className="drops-badge">
              <Gift size={16} />
              <span>LIVE BROADCAST DROPS & LOOT VAULT</span>
            </div>
            <h3>Active Channel Drops & Rewards</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {claimToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{claimToast}</span>
          </div>
        )}

        <p className="drops-intro-text">
          Earn exclusive digital reading loot, isolated audio stems, and chat runes simply by watching live reading streams!
        </p>

        {/* Drops List */}
        <div className="drops-grid-list">
          {drops.map(drop => {
            const progressPercent = Math.min(
              100,
              Math.round((drop.currentWatchedMinutes / drop.requiredWatchMinutes) * 100)
            );

            return (
              <div key={drop.id} className={`drop-card-item ${drop.isClaimed ? 'claimed' : drop.isUnlocked ? 'ready' : 'in-progress'}`}>
                <img src={drop.imageUrl} alt={drop.title} className="drop-thumb" />

                <div className="drop-card-info">
                  <div className="drop-type-row">
                    <span className="drop-type-tag">{drop.type}</span>
                    <span className="drop-watch-time">
                      <Clock size={12} /> {drop.requiredWatchMinutes} mins required
                    </span>
                  </div>

                  <h4>{drop.title}</h4>
                  <p className="drop-desc">{drop.description}</p>

                  {/* Progress Meter */}
                  <div className="drop-progress-wrap">
                    <div className="drop-progress-labels">
                      <span>{drop.currentWatchedMinutes} / {drop.requiredWatchMinutes} mins ({progressPercent}%)</span>
                      {drop.isClaimed && <span className="claimed-text">Claimed to Vault</span>}
                    </div>

                    <div className="drop-track-bar">
                      <div className="drop-fill-bar" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>

                  {/* Claim Button */}
                  <div className="drop-action-row">
                    {drop.isClaimed ? (
                      <span className="btn-claimed-state">
                        <Check size={14} />
                        <span>In Your Loot Vault</span>
                      </span>
                    ) : drop.isUnlocked ? (
                      <button
                        type="button"
                        className="btn-primary btn-claim-drop"
                        onClick={() => handleClaimDrop(drop.id, drop.title)}
                      >
                        <CheckCircle2 size={16} />
                        <span>Claim Reward</span>
                      </button>
                    ) : (
                      <span className="locked-time-sub">
                        Watch {drop.requiredWatchMinutes - drop.currentWatchedMinutes} more minutes to unlock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
