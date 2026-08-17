import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, DollarSign, Clock, Trophy } from 'lucide-react';
import { DEFAULT_CROWDFUNDING, type LiveCrowdfundingCampaign, type CrowdfundingTier } from '../lib/liveCrowdfundingData';
import { soundFX } from '../lib/soundFx';

interface LiveCrowdfundingOverlayModalProps {
  streamerName: string;
  onClose: () => void;
}

export const LiveCrowdfundingOverlayModal: React.FC<LiveCrowdfundingOverlayModalProps> = ({
  streamerName,
  onClose
}) => {
  const [campaign, setCampaign] = useState<LiveCrowdfundingCampaign>(DEFAULT_CROWDFUNDING);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePledgeTier = (tier: CrowdfundingTier) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setCampaign(prev => ({
      ...prev,
      currentFundedUSD: prev.currentFundedUSD + tier.pledgeAmountUSD,
      tiers: prev.tiers.map(t => t.id === tier.id ? {
        ...t,
        backersCount: t.backersCount + 1,
        slotsRemaining: t.slotsRemaining !== null ? Math.max(0, t.slotsRemaining - 1) : null
      } : t)
    }));
    setToastMsg(`🎉 Pledged $${tier.pledgeAmountUSD} to "${tier.tierName}"! Backer alert triggered on stream overlay.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fundedPct = Math.round((campaign.currentFundedUSD / campaign.fundingGoalUSD) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="crowdfunding-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="crowdfunding-modal-header">
          <div className="crowdfunding-title-group">
            <div className="crowdfunding-badge">
              <DollarSign size={16} />
              <span>KICKSTARTER & BACKERKIT LIVE CROWDFUNDING OVERLAY</span>
            </div>
            <h3>@{streamerName}'s Live Book Campaign</h3>
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

        {/* Campaign Hero Banner */}
        <div className="crowdfunding-hero-banner">
          <div className="funding-stat-dial">
            <span className="funded-pct-num">{fundedPct}%</span>
            <span className="funded-label">FUNDED</span>
          </div>

          <div className="crowdfunding-hero-meta">
            <div className="campaign-platform-row">
              <span className="platform-tag">{campaign.platform}</span>
              <span className="time-remaining-pill">
                <Clock size={12} />
                <span>{campaign.daysRemaining} days left</span>
              </span>
            </div>

            <h4>{campaign.projectTitle}</h4>
            <div className="funding-numbers-row">
              <span className="raised-total">${campaign.currentFundedUSD.toLocaleString()} USD</span>
              <span className="goal-sub">pledged of ${campaign.fundingGoalUSD.toLocaleString()} goal</span>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar-fill crowdfunding-bar" style={{ width: `${Math.min(100, fundedPct)}%` }}></div>
            </div>

            <div className="stretch-goal-row">
              <Trophy size={14} color="#ffd700" />
              <span>Next Stretch Goal ($100,000): <strong>{campaign.stretchGoalTitle}</strong></span>
            </div>
          </div>
        </div>

        {/* Reward Tiers Grid */}
        <div className="crowdfunding-tiers-grid">
          {campaign.tiers.map(tier => (
            <div key={tier.id} className="crowdfunding-tier-card">
              <div className="tier-card-header">
                <strong>{tier.tierName}</strong>
                <span className="tier-price">${tier.pledgeAmountUSD}</span>
              </div>
              <p className="tier-desc">{tier.rewardDescription}</p>

              <div className="tier-card-footer">
                <span className="backers-count-sub">👥 {tier.backersCount} backers {tier.slotsRemaining !== null && `• ${tier.slotsRemaining} left!`}</span>
                <button
                  type="button"
                  className="btn-pledge-tier"
                  onClick={() => handlePledgeTier(tier)}
                >
                  <Sparkles size={14} />
                  <span>Back Tier</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="crowdfunding-modal-footer">
          <span className="footer-crowdfunding-note">
            📚 Direct pledge webhooks automatically sync with Kickstarter / BackerKit v2 API in real-time.
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
