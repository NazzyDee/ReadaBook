import React, { useState } from 'react';
import { X, Flame, Sparkles, Zap, Gift } from 'lucide-react';
import { ACTIVE_SPARKS_PINATA, type SparksPinataData } from '../lib/sparksPinataData';
import { soundFX } from '../lib/soundFx';

interface CommunitySparksPinataModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CommunitySparksPinataModal: React.FC<CommunitySparksPinataModalProps> = ({
  streamerName,
  onClose
}) => {
  const [pinata, setPinata] = useState<SparksPinataData>(ACTIVE_SPARKS_PINATA);
  const [claimedLeaves, setClaimedLeaves] = useState<number[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const pct = Math.min(100, Math.round((pinata.currentSparks / pinata.goalSparks) * 100));

  const handleCheerSparks = (amount: number) => {
    soundFX.playPop();
    soundFX.playChestClaim();

    const newTotal = pinata.currentSparks + amount;
    const isUnleashed = newTotal >= pinata.goalSparks;

    if (isUnleashed) {
      soundFX.playDragonRoar();
      soundFX.playApplause();
      setToastMsg(`🐉 THE DRAGON IS UNLEASHED! Raining Golden Parchment Leaves across chat!`);
    } else {
      setToastMsg(`✨ Contributed ${amount.toLocaleString()} Sparks to the Dragon Piñata!`);
    }

    setPinata(prev => ({
      ...prev,
      currentSparks: newTotal,
      dragonState: isUnleashed ? 'UNLEASHED' : 'AWAKENING'
    }));

    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleClaimLeaf = (leafIndex: number) => {
    if (claimedLeaves.includes(leafIndex)) return;
    soundFX.playChestClaim();
    setClaimedLeaves(prev => [...prev, leafIndex]);
    setToastMsg(`🍂 Looted Golden Leaf #${leafIndex + 1}! (+50 Sparks claimed)`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="pinata-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="pinata-modal-header">
          <div className="pinata-title-group">
            <div className="pinata-badge">
              <Flame size={16} />
              <span>THE LORE DRAGON SPARKS PIÑATA</span>
            </div>
            <h3>@{streamerName}'s Community Hoard Event</h3>
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

        {/* Dragon Hoard Banner */}
        <div className="dragon-hoard-banner">
          <div className="dragon-visual">
            <span className="dragon-emoji">
              {pinata.dragonState === 'UNLEASHED' ? '🐉💥' : pinata.dragonState === 'AWAKENING' ? '🐲🔥' : '😴💤'}
            </span>
          </div>

          <div className="dragon-info">
            <div className="dragon-status-row">
              <span className="dragon-state-pill">{pinata.dragonState}</span>
              <strong className="dragon-sparks-num">
                {pinata.currentSparks.toLocaleString()} / {pinata.goalSparks.toLocaleString()} Sparks
              </strong>
            </div>

            <div className="hoard-bar-track">
              <div className="hoard-bar-fill" style={{ width: `${pct}%` }}></div>
            </div>

            <p className="hoard-reward-note">
              <Gift size={14} color="#ffd700" />
              <span>{pinata.bonusRewardDrop}</span>
            </p>
          </div>
        </div>

        {/* Quick Cheering Sparks Buttons */}
        <div className="pinata-cheer-row">
          <span className="cheer-label">CHEER TO FILL THE PIÑATA:</span>
          <div className="cheer-buttons">
            {[100, 500, 1000, 2500].map(amt => (
              <button
                key={amt}
                type="button"
                className="btn-cheer-pinata"
                onClick={() => handleCheerSparks(amt)}
              >
                <Zap size={14} color="#ffd700" />
                <span>+ {amt.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Gold Leaf Drop Shower */}
        <div className="gold-leaf-shower-box">
          <label>CLICK FALLING GOLDEN PARCHMENT LEAVES TO LOOT:</label>
          <div className="leaves-container">
            {[0, 1, 2, 3, 4, 5].map(idx => {
              const isClaimed = claimedLeaves.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  className={`leaf-item-btn ${isClaimed ? 'claimed' : ''}`}
                  onClick={() => handleClaimLeaf(idx)}
                  disabled={isClaimed}
                >
                  <span>{isClaimed ? '✅ +50' : '🍂 LOOT'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Donors */}
        <div className="top-hoard-donors">
          <label>TOP HOARD CONTRIBUTORS:</label>
          <div className="donors-list">
            {pinata.topDonors.map((d, i) => (
              <div key={d.username} className="donor-pill">
                <span className="donor-rank">#{i + 1}</span>
                <img src={d.avatar} alt={d.username} />
                <span>@{d.username}</span>
                <strong>+{d.sparksContributed.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pinata-modal-footer">
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <span>Close Piñata</span>
          </button>
        </div>
      </div>
    </div>
  );
};
