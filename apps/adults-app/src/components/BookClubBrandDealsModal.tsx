import React, { useState } from 'react';
import { X, Briefcase, Sparkles, CheckCircle2, Handshake, ShieldCheck } from 'lucide-react';
import { DEFAULT_BRAND_DEALS, type BrandSponsorshipDeal } from '../lib/bookClubBrandDealsData';
import { soundFX } from '../lib/soundFx';

interface BookClubBrandDealsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BookClubBrandDealsModal: React.FC<BookClubBrandDealsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [deals, setDeals] = useState<BrandSponsorshipDeal[]>(DEFAULT_BRAND_DEALS);
  const [selectedDealId, setSelectedDealId] = useState<string>('deal_harper');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAcceptDeal = (deal: BrandSponsorshipDeal) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, status: 'ACTIVE_ON_AIR' } : d));
    setToastMsg(`🤝 ACCEPTED SPONSORSHIP DEAL with ${deal.sponsorName}! $${deal.payoutBudgetUSD} held in escrow.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentDeal = deals.find(d => d.id === selectedDealId) || deals[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="brand-deals-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="brand-deals-modal-header">
          <div className="brand-deals-title-group">
            <div className="brand-deals-badge">
              <Briefcase size={16} />
              <span>SPONSORED BOOK CLUB BRAND DEALS & PUBLISHER ESCROW MARKETPLACE</span>
            </div>
            <h3>@{streamerName}'s Sponsorship Portal</h3>
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

        {/* Hero Deal Banner */}
        <div className="brand-deal-hero-banner">
          <div className="deal-payout-box">
            <span className="payout-num">${currentDeal.payoutBudgetUSD.toLocaleString()}</span>
            <span className="payout-sub">USD ESCROW</span>
          </div>

          <div className="brand-deal-hero-meta">
            <div className="deal-status-row">
              <span className={`deal-category-pill ${currentDeal.brandCategory.toLowerCase()}`}>{currentDeal.brandCategory}</span>
              <span className={`deal-status-pill ${currentDeal.status.toLowerCase()}`}>{currentDeal.status.replace(/_/g, ' ')}</span>
            </div>

            <h4>{currentDeal.sponsorName}</h4>
            <p className="deal-objective-text">{currentDeal.campaignObjective}</p>

            <div className="deliverables-checklist">
              <strong>Deliverables Required:</strong>
              {currentDeal.deliverablesRequired.map((del, idx) => (
                <div key={idx} className="deliverable-item">
                  <CheckCircle2 size={12} color="#00ff88" />
                  <span>{del}</span>
                </div>
              ))}
            </div>

            {currentDeal.status === 'OFFER_RECEIVED' ? (
              <button
                type="button"
                className="btn-accept-deal"
                onClick={() => handleAcceptDeal(currentDeal)}
              >
                <Handshake size={16} />
                <span>Accept Sponsorship & Lock Escrow ($ {currentDeal.payoutBudgetUSD})</span>
              </button>
            ) : (
              <div className="on-air-badge">
                <ShieldCheck size={14} color="#00ff88" />
                <span>Campaign Active on Stream Overlay</span>
              </div>
            )}
          </div>
        </div>

        {/* Deals List */}
        <div className="brand-deals-grid">
          {deals.map(d => (
            <div
              key={d.id}
              className={`brand-deal-tile ${d.id === selectedDealId ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedDealId(d.id);
              }}
            >
              <div className="deal-tile-top">
                <strong>{d.sponsorName}</strong>
                <span className="deal-price-badge">${d.payoutBudgetUSD}</span>
              </div>
              <span className="deal-cat-sub">{d.brandCategory}</span>
              <span className={`deal-status-sub ${d.status.toLowerCase()}`}>{d.status}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="brand-deals-modal-footer">
          <span className="footer-deals-note">
            🤝 100% Guaranteed Escrow: Brands deposit funds upfront before streamer goes live.
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
