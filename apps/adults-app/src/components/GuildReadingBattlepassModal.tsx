import React, { useState } from 'react';
import { X, Trophy, Sparkles, CheckCircle2, Crown, Gift, Zap } from 'lucide-react';
import { SEASONAL_BATTLEPASS_DATA, type BattlepassTier } from '../lib/guildBattlepassData';
import { soundFX } from '../lib/soundFx';

interface GuildReadingBattlepassModalProps {
  streamerName: string;
  onClose: () => void;
}

export const GuildReadingBattlepassModal: React.FC<GuildReadingBattlepassModalProps> = ({
  streamerName,
  onClose
}) => {
  const [tiers, setTiers] = useState<BattlepassTier[]>(SEASONAL_BATTLEPASS_DATA);
  const [userXp] = useState(720);
  const [isPatronUnlocked, setIsPatronUnlocked] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleClaimTier = (tier: BattlepassTier) => {
    soundFX.playChestClaim();
    soundFX.playHarp();
    setTiers(prev => prev.map(t => t.tierNumber === tier.tierNumber ? { ...t, isClaimed: true } : t));
    setToastMsg(`🎁 CLAIMED TIER ${tier.tierNumber} REWARDS: "${tier.freeReward}" & "${tier.patronReward}"!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleUpgradePass = () => {
    soundFX.playChestClaim();
    setIsPatronUnlocked(true);
    setToastMsg('👑 Upgraded to Grand Patron Season Pass! All premium tiers unlocked.');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="battlepass-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="battlepass-modal-header">
          <div className="battlepass-title-group">
            <div className="battlepass-badge">
              <Trophy size={16} />
              <span>ARCHIVIST GUILD SEASONAL BATTLEPASS</span>
            </div>
            <h3>@{streamerName}'s Guild Battlepass (Season 4: The Fellowship)</h3>
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

        {/* Battlepass Progress Banner */}
        <div className="battlepass-hero-banner">
          <div className="season-info-col">
            <div className="season-tag-row">
              <span className="season-tag">SEASON 4 ACTIVE</span>
              <span className="days-left">⏳ 18 Days Remaining</span>
            </div>
            <h4>Earn XP by Listening to Live Chapters & Donating Sparks</h4>
            <p>Every 10 minutes of active stream listening awards +50 Season Battlepass XP.</p>
          </div>

          <div className="xp-summary-box">
            <div className="xp-label-row">
              <Zap size={14} color="#ffd700" />
              <strong>{userXp} / 1,000 XP (Tier 3)</strong>
            </div>
            <div className="battlepass-bar-track">
              <div className="battlepass-bar-fill" style={{ width: '72%' }}></div>
            </div>
          </div>
        </div>

        {/* Upgrade Callout */}
        {!isPatronUnlocked && (
          <div className="patron-upgrade-banner">
            <div className="upgrade-text">
              <Crown size={20} color="#ffd700" />
              <div>
                <strong>Unlock Grand Patron Premium Rewards Track</strong>
                <p>Get instant access to 3D avatar frames, golden trophies, and custom TTS voices.</p>
              </div>
            </div>

            <button
              type="button"
              className="btn-upgrade-patron"
              onClick={handleUpgradePass}
            >
              <span>Unlock Pass (1,000 Sparks)</span>
            </button>
          </div>
        )}

        {/* Tiers List */}
        <div className="battlepass-tiers-list">
          {tiers.map(tier => (
            <div
              key={tier.tierNumber}
              className={`battlepass-tier-row ${tier.isUnlocked ? 'unlocked' : 'locked'} ${tier.isClaimed ? 'claimed' : ''}`}
            >
              <div className="tier-badge-col">
                <span className="tier-num">Tier {tier.tierNumber}</span>
                <span className="tier-req-xp">{tier.xpRequired} XP</span>
              </div>

              <div className="free-reward-col">
                <span className="track-label">FREE TRACK:</span>
                <span className="reward-text">{tier.freeReward}</span>
              </div>

              <div className="patron-reward-col">
                <span className="track-label patron">👑 GRAND PATRON TRACK:</span>
                <span className="reward-text">{tier.patronReward}</span>
              </div>

              <div className="tier-action-col">
                {tier.isClaimed ? (
                  <span className="claimed-status">
                    <CheckCircle2 size={16} color="#00ff88" />
                    <span>Claimed</span>
                  </span>
                ) : tier.isUnlocked ? (
                  <button
                    type="button"
                    className="btn-claim-tier"
                    onClick={() => handleClaimTier(tier)}
                  >
                    <Gift size={14} />
                    <span>Claim</span>
                  </button>
                ) : (
                  <span className="locked-pill">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="battlepass-modal-footer">
          <span className="footer-meta">
            ✨ Unlocked rewards are permanently stored in your Archivist Profile Vault.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <span>Close Battlepass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
