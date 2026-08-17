import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Scroll, Award, Gift, Lock } from 'lucide-react';
import { DEFAULT_BATTLE_PASS, type ReadingBattlePassSeason, type BattlePassTier } from '../lib/readingBattlePassData';
import { soundFX } from '../lib/soundFx';

interface ReadingBattlePassModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ReadingBattlePassModal: React.FC<ReadingBattlePassModalProps> = ({
  streamerName,
  onClose
}) => {
  const [pass, setPass] = useState<ReadingBattlePassSeason>(DEFAULT_BATTLE_PASS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleClaimReward = (tier: BattlePassTier) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setPass(prev => ({
      ...prev,
      tiers: prev.tiers.map(t => t.tierNumber === tier.tierNumber ? { ...t, isClaimed: true } : t)
    }));
    setToastMsg(`🎁 Claimed Tier #${tier.tierNumber} Reward: ${tier.rewardName}!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const xpProgressPct = Math.round((pass.currentXp / pass.maxXpForNextTier) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="battlepass-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="battlepass-modal-header">
          <div className="battlepass-title-group">
            <div className="battlepass-badge">
              <Scroll size={16} />
              <span>READING BATTLE PASS (TOME OF SEASONS)</span>
            </div>
            <h3>@{streamerName}'s Seasonal Scribe Track</h3>
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

        {/* Hero Banner */}
        <div className="battlepass-hero-banner">
          <div className="tier-level-box">
            <Award size={44} color="#ffd700" />
            <span className="tier-num-text">TIER {pass.currentTier}</span>
            <span className="days-left-tag">{pass.daysRemainingInSeason} DAYS LEFT</span>
          </div>

          <div className="battlepass-hero-meta">
            <h4>{pass.seasonTitle}</h4>
            <div className="xp-bar-wrapper">
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${xpProgressPct}%` }}></div>
              </div>
              <div className="xp-sub-labels">
                <span>{pass.currentXp.toLocaleString()} / {pass.maxXpForNextTier.toLocaleString()} XP</span>
                <span>{xpProgressPct}% to Tier {pass.currentTier + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Rewards List */}
        <div className="tier-rewards-list">
          <h4>Seasonal 100-Tier Progression Track</h4>
          {pass.tiers.map(tier => (
            <div key={tier.tierNumber} className="tier-reward-card">
              <div className="tier-left">
                <div className="tier-badge-ph">T{tier.tierNumber}</div>
                <div className="tier-info">
                  <span className="tier-type-pill">{tier.rewardType}</span>
                  <strong>{tier.rewardName}</strong>
                  <span className="tier-sub">Requires {tier.requiredXp} XP</span>
                </div>
              </div>

              <div className="tier-right">
                {tier.isClaimed ? (
                  <span className="claimed-pill">
                    <CheckCircle2 size={12} />
                    <span>CLAIMED</span>
                  </span>
                ) : tier.isUnlocked ? (
                  <button
                    type="button"
                    className="btn-claim-reward"
                    onClick={() => handleClaimReward(tier)}
                  >
                    <Gift size={14} />
                    <span>Claim Reward</span>
                  </button>
                ) : (
                  <span className="locked-pill">
                    <Lock size={12} />
                    <span>LOCKED</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="battlepass-modal-footer">
          <span className="footer-battlepass-note">
            📜 Earn Battle Pass XP by reading during live sprints, submitting reviews, and participating in trivia.
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
