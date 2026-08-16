import React, { useState } from 'react';
import { X, Briefcase, DollarSign, Sparkles, CheckCircle2, Clock, BookOpen, Trophy } from 'lucide-react';
import { PUBLISHER_BOUNTIES, type PublisherBounty } from '../lib/bountyData';
import { soundFX } from '../lib/soundFx';

interface PublisherBountyBoardModalProps {
  streamerName?: string;
  onClose: () => void;
  onBountyClaimed?: (bounty: PublisherBounty) => void;
}

export const PublisherBountyBoardModal: React.FC<PublisherBountyBoardModalProps> = ({
  streamerName: _streamerName,
  onClose,
  onBountyClaimed
}) => {
  const [bounties, setBounties] = useState<PublisherBounty[]>(PUBLISHER_BOUNTIES);
  const [selectedBounty, setSelectedBounty] = useState<PublisherBounty>(PUBLISHER_BOUNTIES[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'available'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleAcceptBounty = (bountyId: string) => {
    soundFX.playPop();
    setBounties(prev =>
      prev.map(b => (b.id === bountyId ? { ...b, status: 'in_progress' } : b))
    );
    setSelectedBounty(prev => (prev.id === bountyId ? { ...prev, status: 'in_progress' } : prev));
    setSuccessToast(`🎯 Accepted sponsored bounty for "${selectedBounty.bookTitle}" from ${selectedBounty.publisherName}!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleClaimPayout = (bounty: PublisherBounty) => {
    soundFX.playApplause();
    soundFX.playChestClaim();
    setBounties(prev =>
      prev.map(b => (b.id === bounty.id ? { ...b, status: 'claimed' } : b))
    );
    setSelectedBounty(prev => ({ ...prev, status: 'claimed' }));
    setSuccessToast(`💰 Payout Claimed! +$${bounty.payoutAmount} USD deposited to Creator Balance & +${bounty.xpReward} Odyssey XP awarded!`);

    if (onBountyClaimed) {
      onBountyClaimed(bounty);
    }

    setTimeout(() => setSuccessToast(null), 4000);
  };

  const filteredBounties = bounties.filter(b => {
    if (activeTab === 'in_progress') return b.status === 'in_progress' || b.status === 'completed';
    if (activeTab === 'available') return b.status === 'available';
    return true;
  });

  const totalEarnings = bounties
    .filter(b => b.status === 'completed' || b.status === 'claimed')
    .reduce((acc, curr) => acc + curr.payoutAmount, 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bounty-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bounty-modal-header">
          <div className="bounty-title-group">
            <div className="bounty-badge">
              <Briefcase size={16} />
              <span>OFFICIAL PUBLISHER SPONSORSHIP HUB</span>
            </div>
            <h3>Publisher Bounty Board</h3>
          </div>

          <div className="bounty-header-right">
            <div className="bounty-earnings-pill">
              <DollarSign size={15} color="var(--accent-success)" />
              <span>${totalEarnings.toLocaleString()} Earned</span>
            </div>

            <button onClick={onClose} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toast */}
        {successToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{successToast}</span>
          </div>
        )}

        <p className="bounty-intro-text">
          Earn verified sponsorships by partnering with top publishers. Read upcoming novel excerpts live, meet broadcast milestones, and receive direct cash payouts + Odyssey Pass XP.
        </p>

        {/* Filter Tabs */}
        <div className="bounty-filter-tabs">
          <button
            className={`bounty-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Bounties ({bounties.length})
          </button>
          <button
            className={`bounty-tab-btn ${activeTab === 'in_progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in_progress')}
          >
            Active & Ready ({bounties.filter(b => b.status === 'in_progress' || b.status === 'completed').length})
          </button>
          <button
            className={`bounty-tab-btn ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Quests ({bounties.filter(b => b.status === 'available').length})
          </button>
        </div>

        {/* 2-Column Section: Bounty List & Details Panel */}
        <div className="bounty-grid-layout">
          {/* Left: Bounties List */}
          <div className="bounties-list-col">
            {filteredBounties.map(b => {
              const isSelected = selectedBounty.id === b.id;

              return (
                <div
                  key={b.id}
                  className={`bounty-item-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedBounty(b);
                  }}
                >
                  <img src={b.bookCoverUrl} alt={b.bookTitle} className="bounty-book-thumb" />

                  <div className="bounty-card-info">
                    <div className="bounty-pub-row">
                      <span className="pub-tag">{b.publisherLogo} {b.publisherName}</span>
                      <span className="bounty-payout">${b.payoutAmount}</span>
                    </div>

                    <h4>{b.bookTitle}</h4>
                    <span className="bounty-author">by {b.bookAuthor}</span>

                    <div className="bounty-status-row">
                      <span className={`bounty-status-chip ${b.status}`}>
                        {b.status === 'completed' ? 'READY TO CLAIM' : b.status === 'in_progress' ? 'IN PROGRESS' : b.status === 'claimed' ? 'PAID' : 'AVAILABLE'}
                      </span>
                      <span className="bounty-xp-tag">+{b.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Bounty Details */}
          <div className="bounty-details-panel">
            <div className="bounty-detail-header">
              <div className="bounty-detail-meta">
                <span className="detail-pub-tag">{selectedBounty.publisherLogo} {selectedBounty.publisherName}</span>
                <h3>{selectedBounty.bookTitle}</h3>
                <span className="detail-author">by {selectedBounty.bookAuthor} • {selectedBounty.genre}</span>
              </div>

              <div className="bounty-reward-box">
                <span className="reward-label">Bounty Payout</span>
                <strong className="reward-val">${selectedBounty.payoutAmount} USD</strong>
                <span className="reward-xp">+{selectedBounty.xpReward} Odyssey XP</span>
              </div>
            </div>

            {/* Progress Meters */}
            <div className="bounty-progress-box">
              <div className="progress-item">
                <div className="progress-label-row">
                  <span>
                    <BookOpen size={14} />
                    <span>Pages Read Live</span>
                  </span>
                  <strong>{selectedBounty.currentPagesRead} / {selectedBounty.requiredReadPages} pages</strong>
                </div>
                <div className="progress-track-bounty">
                  <div
                    className="progress-fill-bounty"
                    style={{ width: `${Math.min(100, (selectedBounty.currentPagesRead / selectedBounty.requiredReadPages) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label-row">
                  <span>
                    <Clock size={14} />
                    <span>Broadcast Airtime</span>
                  </span>
                  <strong>{selectedBounty.currentMinutesStreamed} / {selectedBounty.requiredStreamMinutes} mins</strong>
                </div>
                <div className="progress-track-bounty">
                  <div
                    className="progress-fill-bounty"
                    style={{ width: `${Math.min(100, (selectedBounty.currentMinutesStreamed / selectedBounty.requiredStreamMinutes) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="bounty-deliverables-box">
              <h4>Sponsorship Deliverables</h4>
              <ul className="deliverables-list">
                {selectedBounty.deliverables.map((del, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={15} color="var(--accent-success)" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="bounty-action-footer">
              {selectedBounty.status === 'completed' ? (
                <button
                  className="btn-primary btn-claim-payout"
                  onClick={() => handleClaimPayout(selectedBounty)}
                >
                  <Trophy size={18} />
                  <span>Claim ${selectedBounty.payoutAmount} Payout & +{selectedBounty.xpReward} XP</span>
                </button>
              ) : selectedBounty.status === 'available' ? (
                <button
                  className="btn-primary btn-accept-bounty"
                  onClick={() => handleAcceptBounty(selectedBounty.id)}
                >
                  <Briefcase size={18} />
                  <span>Accept Sponsorship Quest</span>
                </button>
              ) : selectedBounty.status === 'claimed' ? (
                <div className="bounty-paid-notice">
                  <CheckCircle2 size={18} color="var(--accent-success)" />
                  <span>Bounty Completed & Payout Processed</span>
                </div>
              ) : (
                <div className="bounty-active-notice">
                  <Clock size={16} color="var(--accent-secondary)" />
                  <span>Active Quest • Complete remaining pages on your next stream!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
