import React, { useState } from 'react';
import { X, DollarSign, Sparkles, CheckCircle2, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { DEFAULT_PAYOUT_SUMMARY, type CreatorPayoutSummary } from '../lib/creatorStripePayoutsData';
import { soundFX } from '../lib/soundFx';

interface CreatorStripePayoutsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CreatorStripePayoutsModal: React.FC<CreatorStripePayoutsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [summary, setSummary] = useState<CreatorPayoutSummary>(DEFAULT_PAYOUT_SUMMARY);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTriggerInstantPayout = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    const payoutAmount = summary.availableUSD;
    setSummary(prev => ({
      ...prev,
      availableUSD: 0,
      recentPayouts: [
        { id: `po_${Date.now()}`, amountUSD: payoutAmount, dateFormatted: 'Today', status: 'PROCESSING' },
        ...prev.recentPayouts
      ]
    }));
    setToastMsg(`💸 Initiated Instant Stripe Express Payout of $${payoutAmount.toFixed(2)} to linked bank account!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="payout-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="payout-modal-header">
          <div className="payout-title-group">
            <div className="payout-badge">
              <DollarSign size={16} />
              <span>SPARKS MULTI-CURRENCY DIRECT STRIPE PAYOUTS</span>
            </div>
            <h3>@{streamerName}'s Author Earnings Dashboard</h3>
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

        {/* Balance Hero Banner */}
        <div className="payout-hero-banner">
          <div className="payout-balance-box">
            <span className="payout-sub-label">AVAILABLE FOR PAYOUT</span>
            <span className="available-usd">${summary.availableUSD.toFixed(2)} USD</span>
            <span className="sparks-equiv">⚡ {summary.sparksBalance.toLocaleString()} Sparks Balance</span>
          </div>

          <div className="payout-hero-meta">
            <div className="stripe-status-chip">
              <ShieldCheck size={14} color="#00ff88" />
              <span>Stripe Connect Express: <strong>Active & Verified</strong></span>
            </div>

            <div className="lifetime-row">
              <span>Lifetime Earnings: <strong>${summary.lifetimeEarningsUSD.toLocaleString()} USD</strong></span>
              <span>Pending Clearance: <strong>${summary.pendingUSD.toFixed(2)} USD</strong></span>
            </div>

            <button
              type="button"
              className="btn-instant-payout"
              disabled={summary.availableUSD <= 0}
              onClick={handleTriggerInstantPayout}
            >
              <ArrowUpRight size={16} />
              <span>Transfer to Bank Account via Stripe</span>
            </button>
          </div>
        </div>

        {/* Payout History List */}
        <div className="payouts-history-list">
          <h4>Recent Stripe Bank Transfers</h4>
          {summary.recentPayouts.map(p => (
            <div key={p.id} className="payout-history-row">
              <div className="history-info-col">
                <strong>${p.amountUSD.toFixed(2)} USD</strong>
                <span>{p.dateFormatted}</span>
              </div>
              <span className={`payout-status-tag ${p.status.toLowerCase()}`}>{p.status}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="payout-modal-footer">
          <span className="footer-payout-note">
            💳 95% revenue split directly into local currencies (USD, EUR, GBP, CAD, AUD, JPY) with 0 Stripe foreign exchange penalty.
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
