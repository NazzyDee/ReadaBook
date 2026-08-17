import React, { useState } from 'react';
import { X, Ticket, Sparkles, CheckCircle2, Calendar, Star } from 'lucide-react';
import { DEFAULT_VIP_EVENT, type VipLiveEvent, type VipTicketTier } from '../lib/vipTicketedEventsData';
import { soundFX } from '../lib/soundFx';

interface VipTicketedEventsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const VipTicketedEventsModal: React.FC<VipTicketedEventsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [event, setEvent] = useState<VipLiveEvent>(DEFAULT_VIP_EVENT);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePurchaseTicket = (tier: VipTicketTier) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setEvent(prev => ({
      ...prev,
      totalRevenueUSD: prev.totalRevenueUSD + tier.ticketPriceUSD,
      tiers: prev.tiers.map(t => t.id === tier.id ? { ...t, totalTicketsSold: t.totalTicketsSold + 1 } : t)
    }));
    setToastMsg(`🎟️ Reserved "${tier.tierName}" for $${tier.ticketPriceUSD}! Ticket pass added to your Reader Wallet.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="vip-ticket-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="vip-ticket-modal-header">
          <div className="vip-ticket-title-group">
            <div className="vip-ticket-badge">
              <Ticket size={16} />
              <span>VIP LIVE Q&A STAGE TICKETS & BACKSTAGE PASSES</span>
            </div>
            <h3>@{streamerName}'s Exclusive Ticketed Stage</h3>
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

        {/* Event Hero Banner */}
        <div className="vip-event-hero-banner">
          <div className="ticket-visual-box">
            <Ticket size={36} color="#ffd700" />
            <span className="event-exclusive-tag">VIP PASS</span>
            <span className="total-rev-sub">${event.totalRevenueUSD.toLocaleString()} USD</span>
          </div>

          <div className="vip-event-hero-meta">
            <div className="event-date-row">
              <Calendar size={14} color="#00ff88" />
              <span>{event.eventDateFormatted}</span>
            </div>

            <h4>{event.eventTitle}</h4>
            <p className="guest-author-name">Featuring Special Guest: <strong>{event.guestAuthorName}</strong></p>

            <div className="event-perks-brief">
              <span>🎤 Hot-Seat Voice Questions • 📹 Uncompressed 4K Masterclass VOD Archive</span>
            </div>
          </div>
        </div>

        {/* Tiers List */}
        <div className="vip-tiers-grid">
          {event.tiers.map(tier => (
            <div key={tier.id} className="vip-tier-card">
              <div className="tier-header-row">
                <strong>{tier.tierName}</strong>
                <span className="tier-price-tag">${tier.ticketPriceUSD} USD</span>
              </div>

              <div className="tier-perks-list">
                {tier.perksIncluded.map((perk, idx) => (
                  <div key={idx} className="perk-row">
                    <Star size={12} color="#ffd700" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="tier-card-action">
                <span className="tickets-remaining-sub">{tier.totalTicketsSold} / {tier.maxCap} tickets reserved</span>
                <button
                  type="button"
                  className="btn-buy-vip-ticket"
                  onClick={() => handlePurchaseTicket(tier)}
                >
                  <Ticket size={14} />
                  <span>Reserve Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="vip-ticket-modal-footer">
          <span className="footer-ticket-note">
            🎟️ Ticket holders receive private cryptographic stream tokens to join the hot-seat stage queue.
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
