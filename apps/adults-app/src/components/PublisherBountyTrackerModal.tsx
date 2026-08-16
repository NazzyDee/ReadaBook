import React, { useState } from 'react';
import { X, Award, Sparkles, CheckCircle2, DollarSign, Clock, Building2 } from 'lucide-react';
import { DEFAULT_PUBLISHER_BOUNTIES, type PublisherBounty } from '../lib/publisherBountyData';
import { soundFX } from '../lib/soundFx';

interface PublisherBountyTrackerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const PublisherBountyTrackerModal: React.FC<PublisherBountyTrackerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [bounties, setBounties] = useState<PublisherBounty[]>(DEFAULT_PUBLISHER_BOUNTIES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAcceptBounty = (bounty: PublisherBounty) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setBounties(prev => prev.map(b => b.id === bounty.id ? { ...b, status: 'ACCEPTED' } : b));
    setToastMsg(`🌟 ACCEPTED PUBLISHER BOUNTY: "${bounty.bookTitle}" ($${bounty.payoutAmountUsd} USD)`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bounty-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bounty-modal-header">
          <div className="bounty-title-group">
            <div className="bounty-badge">
              <Award size={16} />
              <span>PUBLISHER BOUNTY BOARD & SPONSORSHIP TRACKER</span>
            </div>
            <h3>@{streamerName}'s Publisher Sponsorship Contracts</h3>
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

        {/* Total Bounty Pipeline Banner */}
        <div className="bounty-pipeline-banner">
          <div className="pipeline-stat">
            <DollarSign size={20} color="#00ff88" />
            <div>
              <span className="stat-label">TOTAL EARNINGS OPPORTUNITY</span>
              <strong>$4,900 USD</strong>
            </div>
          </div>

          <div className="pipeline-stat">
            <Building2 size={20} color="#ffd700" />
            <div>
              <span className="stat-label">VERIFIED PUBLISHER PARTNERS</span>
              <strong>Tor, Penguin, Orbit</strong>
            </div>
          </div>
        </div>

        {/* Bounties List */}
        <div className="bounties-list-container">
          {bounties.map(b => (
            <div key={b.id} className={`bounty-item-card ${b.status.toLowerCase()}`}>
              <div className="bounty-top-row">
                <div>
                  <span className="publisher-tag">{b.publisherName}</span>
                  <h4>{b.bookTitle}</h4>
                </div>
                <span className="bounty-payout">${b.payoutAmountUsd} USD</span>
              </div>

              <p className="bounty-reqs-text">{b.requirements}</p>

              <div className="bounty-footer-row">
                <div className="bounty-deadline">
                  <Clock size={14} />
                  <span>{b.deadlineDays > 0 ? `${b.deadlineDays} days remaining to broadcast` : 'Broadcast completed'}</span>
                </div>

                {b.status === 'AVAILABLE' && (
                  <button
                    type="button"
                    className="btn-accept-bounty"
                    onClick={() => handleAcceptBounty(b)}
                  >
                    <CheckCircle2 size={14} />
                    <span>Accept Sponsorship</span>
                  </button>
                )}

                {b.status === 'ACCEPTED' && (
                  <span className="badge-bounty-status accepted">🚀 Contract Active & Scheduled</span>
                )}

                {b.status === 'COMPLETED' && (
                  <span className="badge-bounty-status completed">✅ Paid Out via Direct Deposit</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bounty-modal-footer">
          <span className="bounty-legal-note">
            ⚖️ FTC Disclosure #ad banner will be automatically toggled on live stream video during sponsored segments.
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
