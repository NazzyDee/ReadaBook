import React, { useState } from 'react';
import { X, Heart, Target, Sparkles, Trophy, Lock, Unlock } from 'lucide-react';
import { ACTIVE_CHARITY_CAMPAIGN, type CharityCampaign, type DonorEntry } from '../lib/charityData';
import { soundFX } from '../lib/soundFx';

interface CharityMarathonWidgetProps {
  onClose: () => void;
  onDonationSubmitted?: (amount: number, donorName: string, message: string) => void;
}

export const CharityMarathonWidget: React.FC<CharityMarathonWidgetProps> = ({
  onClose,
  onDonationSubmitted
}) => {
  const [campaign, setCampaign] = useState<CharityCampaign>(ACTIVE_CHARITY_CAMPAIGN);
  const [selectedDonation, setSelectedDonation] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('You');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const percentComplete = Math.min(100, Math.round((campaign.currentAmount / campaign.goalAmount) * 100));

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount ? parseFloat(customAmount) : selectedDonation;
    if (isNaN(amount) || amount <= 0) return;

    setIsSubmitting(true);
    soundFX.playPop();

    setTimeout(() => {
      setIsSubmitting(false);
      soundFX.playApplause();
      soundFX.playChestClaim();

      const newEntry: DonorEntry = {
        id: `d_${Date.now()}`,
        username: donorName.trim() || 'Anonymous Reader',
        amount,
        message: donorMessage.trim() || 'Supporting the literacy charity marathon!',
        timestamp: 'Just now'
      };

      const updatedAmount = campaign.currentAmount + amount;

      // Update unlocked milestones
      const updatedMilestones = campaign.milestones.map(m => ({
        ...m,
        isUnlocked: updatedAmount >= m.amountTarget
      }));

      setCampaign(prev => ({
        ...prev,
        currentAmount: updatedAmount,
        donorCount: prev.donorCount + 1,
        milestones: updatedMilestones,
        recentDonations: [newEntry, ...prev.recentDonations]
      }));

      setSuccessToast(`💖 Thank you for donating $${amount.toFixed(2)} to ${campaign.charityName}!`);
      if (onDonationSubmitted) {
        onDonationSubmitted(amount, newEntry.username, newEntry.message);
      }

      setDonorMessage('');
      setCustomAmount('');

      setTimeout(() => setSuccessToast(null), 4000);
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="charity-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="charity-modal-header">
          <div className="charity-logo-group">
            <span className="charity-emblem">{campaign.charityLogo}</span>
            <div>
              <div className="charity-tag">OFFICIAL CHARITY STREAM DRIVE</div>
              <h3>{campaign.charityName}</h3>
            </div>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Mission Statement */}
        <p className="charity-mission-text">{campaign.mission}</p>

        {/* Success Toast */}
        {successToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={20} color="#ffd700" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Live Thermometer Bar */}
        <div className="charity-thermometer-box">
          <div className="thermometer-stats-row">
            <div className="raised-stat">
              <span className="stat-label">Total Raised</span>
              <strong className="stat-value">${campaign.currentAmount.toLocaleString()}</strong>
            </div>

            <div className="goal-stat">
              <span className="stat-label">Campaign Goal</span>
              <strong className="stat-value">${campaign.goalAmount.toLocaleString()}</strong>
            </div>

            <div className="percent-stat">
              <span className="stat-label">Progress</span>
              <strong className="stat-value-percent">{percentComplete}%</strong>
            </div>
          </div>

          <div className="thermometer-track">
            <div className="thermometer-fill" style={{ width: `${percentComplete}%` }}>
              <span className="thermometer-glow" />
            </div>
          </div>

          <div className="thermometer-footer-note">
            <span>{campaign.donorCount} Generous Readers have contributed!</span>
            <span>${Math.max(0, campaign.goalAmount - campaign.currentAmount).toLocaleString()} remaining to hit 100%</span>
          </div>
        </div>

        {/* 2-Column Section: Milestones & Donation Form */}
        <div className="charity-content-cols">
          {/* Left: Milestones */}
          <div className="charity-milestones-column">
            <h4>
              <Target size={16} color="var(--accent-secondary)" />
              <span>Streamer Milestone Rewards</span>
            </h4>

            <div className="milestones-list">
              {campaign.milestones.map(m => (
                <div
                  key={m.id}
                  className={`milestone-item-card ${m.isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="milestone-status-icon">
                    {m.isUnlocked ? (
                      <Unlock size={16} color="var(--accent-success)" />
                    ) : (
                      <Lock size={16} color="var(--text-muted)" />
                    )}
                  </div>

                  <div className="milestone-text">
                    <div className="milestone-title-row">
                      <strong>${m.amountTarget.toLocaleString()} Goal</strong>
                      <span className="milestone-badge-tag">
                        {m.isUnlocked ? '✅ UNLOCKED' : '🔒 LOCKED'}
                      </span>
                    </div>
                    <h5>{m.icon} {m.title}</h5>
                    <p>{m.rewardDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Donate Simulator */}
          <div className="charity-donate-column">
            <h4>
              <Heart size={16} color="var(--accent-danger)" />
              <span>Make a Contribution</span>
            </h4>

            <form onSubmit={handleDonate} className="charity-donate-form">
              {/* Quick Amount Buttons */}
              <div className="donation-amounts-grid">
                {[10, 25, 50, 100].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className={`donation-amt-btn ${selectedDonation === amt && !customAmount ? 'active' : ''}`}
                    onClick={() => {
                      soundFX.playPop();
                      setSelectedDonation(amt);
                      setCustomAmount('');
                    }}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="custom-donate-input-wrapper">
                <span>$</span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={e => {
                    setCustomAmount(e.target.value);
                  }}
                  min="1"
                  step="1"
                />
              </div>

              {/* Donor Name & Message */}
              <div className="form-group-charity">
                <label>Your Display Name</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  placeholder="e.g. Fellow Bookworm"
                  required
                />
              </div>

              <div className="form-group-charity">
                <label>Donor Message (Displayed on Stream Ticker)</label>
                <textarea
                  value={donorMessage}
                  onChange={e => setDonorMessage(e.target.value)}
                  placeholder="Add a word of encouragement or book quote..."
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="btn-primary btn-submit-donation"
                disabled={isSubmitting}
              >
                <Heart size={16} fill="white" />
                <span>{isSubmitting ? 'Processing...' : `Donate $${customAmount || selectedDonation} to Charity`}</span>
              </button>
            </form>

            {/* Recent Donors Ticker Preview */}
            <div className="recent-donors-box">
              <span className="recent-donors-title">
                <Trophy size={14} color="#ffd700" />
                <span>Recent Live Donors</span>
              </span>

              <div className="donors-scroll-feed">
                {campaign.recentDonations.slice(0, 3).map(d => (
                  <div key={d.id} className="donor-feed-card">
                    <div className="donor-feed-header">
                      <strong>{d.username}</strong>
                      <span className="donor-amt-pill">+${d.amount}</span>
                    </div>
                    <p className="donor-feed-msg">"{d.message}"</p>
                    <span className="donor-feed-time">{d.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
