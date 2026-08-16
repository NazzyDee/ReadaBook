import React, { useState } from 'react';
import { X, Crown, Sparkles, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { DEFAULT_USER_SUB_STATE, SUB_LOYALTY_TIERS, type UserSubMilestoneState } from '../lib/subMilestonesData';
import { soundFX } from '../lib/soundFx';

interface SubMilestonesModalProps {
  streamerName: string;
  onClose: () => void;
  onShareMessage?: (message: string) => void;
}

export const SubMilestonesModal: React.FC<SubMilestonesModalProps> = ({
  streamerName,
  onClose,
  onShareMessage
}) => {
  const [subState, setSubState] = useState<UserSubMilestoneState>(DEFAULT_USER_SUB_STATE);
  const [resubMsg, setResubMsg] = useState('6 months reading together! Loving this chapter in Moria! 📖🎉');
  const [sharedToast, setSharedToast] = useState<string | null>(null);

  const handleShare = () => {
    soundFX.playChestClaim();
    soundFX.playApplause();

    if (onShareMessage) {
      onShareMessage(resubMsg);
    }

    setSubState(prev => ({ ...prev, canShareMilestoneMessage: false }));
    setSharedToast(`🎉 Resubscription anniversary shared to @${streamerName}'s chat!`);
    setTimeout(() => {
      setSharedToast(null);
      onClose();
    }, 2200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="milestones-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="milestones-modal-header">
          <div className="milestones-title-group">
            <div className="milestones-badge">
              <Crown size={16} />
              <span>SUBSCRIBER TENURE & READING STREAK HUB</span>
            </div>
            <h3>Your Subscription to @{streamerName}</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {sharedToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{sharedToast}</span>
          </div>
        )}

        {/* Hero Current Tier Card */}
        <div className="milestone-hero-banner">
          <div className="hero-badge-circle" style={{ borderColor: subState.currentTier.badgeBorderColor }}>
            <span className="hero-icon-large">{subState.currentTier.badgeIcon}</span>
          </div>

          <div className="hero-banner-info">
            <div className="hero-tag-row">
              <span className="tier-tag-pill" style={{ borderColor: subState.currentTier.badgeBorderColor, color: subState.currentTier.badgeBorderColor }}>
                {subState.currentTier.tierTitle}
              </span>
              <span className="months-count-tag">{subState.currentStreakMonths} Month Streak</span>
            </div>
            <h4>You've been subscribed for {subState.totalMonthsSubscribed} months!</h4>
            <p>You have read over <strong>{subState.totalPagesReadWithStreamer.toLocaleString()} pages</strong> live on this channel.</p>
          </div>
        </div>

        {/* Evolving Badge Roadmap */}
        <div className="sub-roadmap-section">
          <h4>
            <Sparkles size={16} color="#ffd700" />
            <span>Evolving Loyalty Badges Roadmap</span>
          </h4>

          <div className="roadmap-tiers-grid">
            {SUB_LOYALTY_TIERS.map(tier => {
              const isUnlocked = subState.totalMonthsSubscribed >= tier.months;
              return (
                <div key={tier.months} className={`roadmap-tier-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  <span className="tier-badge-icon">{tier.badgeIcon}</span>
                  <div className="tier-card-meta">
                    <div className="tier-title-row">
                      <strong>{tier.months} Mo: {tier.tierTitle}</strong>
                      {isUnlocked && <CheckCircle2 size={13} color="var(--accent-success)" />}
                    </div>
                    <p>{tier.perksDescription}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Share Anniversary Message Box */}
        {subState.canShareMilestoneMessage ? (
          <div className="resub-composer-box">
            <h4>
              <Send size={15} color="var(--accent-primary)" />
              <span>Share Resub Celebration in Chat</span>
            </h4>

            <div className="composer-input-row">
              <textarea
                value={resubMsg}
                onChange={e => setResubMsg(e.target.value)}
                placeholder="Write a celebration message..."
                rows={2}
              />
              <button
                type="button"
                className="btn-primary btn-share-resub"
                onClick={handleShare}
              >
                <Sparkles size={14} />
                <span>Share in Chat</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="milestone-already-shared">
            <ShieldAlert size={16} color="var(--text-muted)" />
            <span>You've already shared your {subState.currentStreakMonths}-month milestone message this billing cycle.</span>
          </div>
        )}
      </div>
    </div>
  );
};
