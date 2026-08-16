import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Download, Sparkles, CheckCircle2, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { MOCK_PAYOUTS_SUMMARY, type CreatorEarningsSummary } from '../lib/payoutsData';
import { soundFX } from '../lib/soundFx';

interface CreatorPayoutsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CreatorPayoutsModal: React.FC<CreatorPayoutsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [summary] = useState<CreatorEarningsSummary>(MOCK_PAYOUTS_SUMMARY);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownloadInvoice = (payoutId: string, amount: number) => {
    soundFX.playChestClaim();
    setDownloadToast(`📄 Downloaded Tax Remittance & Invoice for payout ${payoutId} ($${amount.toFixed(2)} USD)`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="payouts-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="payouts-modal-header">
          <div className="payouts-title-group">
            <div className="payouts-badge">
              <CreditCard size={16} />
              <span>CREATOR REVENUE & STRIPE PAYOUTS HUB</span>
            </div>
            <h3>{streamerName}'s Creator Revenue & Payouts</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Banner */}
        {downloadToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="payouts-stats-grid">
          <div className="payout-stat-card primary-balance">
            <span className="payout-stat-sub">CURRENT CREATOR BALANCE</span>
            <div className="balance-val-row">
              <h2>${summary.currentBalanceUSD.toFixed(2)}</h2>
              <span className="payout-eligible-chip">
                <CheckCircle2 size={13} />
                <span>Eligible for Direct Deposit</span>
              </span>
            </div>
            <p className="payout-schedule-sub">
              <Calendar size={13} />
              <span>Next automated deposit: <strong>{summary.nextPayoutDate}</strong></span>
            </p>
          </div>

          <div className="payout-stat-card">
            <span className="payout-stat-sub">LINKED PAYOUT METHOD</span>
            <div className="payout-method-row">
              <CreditCard size={20} color="var(--accent-secondary)" />
              <strong>{summary.payoutMethod}</strong>
            </div>
            <span className="payout-threshold-note">
              $50.00 USD Minimum Threshold Reached (100%)
            </span>
          </div>

          <div className="payout-stat-card">
            <span className="payout-stat-sub">LIFETIME REVENUE</span>
            <div className="lifetime-row">
              <h2>${summary.totalLifetimeEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              <TrendingUp size={18} color="var(--accent-success)" />
            </div>
            <span className="lifetime-sub">100% On-Time Creator Payout Record</span>
          </div>
        </div>

        {/* 2-Column Section: Revenue Sources & Historical Invoices */}
        <div className="payouts-dual-grid">
          {/* Revenue Breakdown */}
          <div className="payout-sources-panel">
            <h4>
              <DollarSign size={16} color="var(--accent-success)" />
              <span>Monthly Revenue Breakdown</span>
            </h4>

            <div className="sources-list">
              {summary.sources.map((src, idx) => (
                <div key={idx} className="source-item-row">
                  <div className="source-item-left">
                    <span className="source-icon">{src.icon}</span>
                    <div className="source-text">
                      <strong>{src.category}</strong>
                      <div className="source-bar-track">
                        <div className="source-bar-fill" style={{ width: `${src.percentage}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="source-item-right">
                    <strong>${src.amount.toFixed(2)}</strong>
                    <span>{src.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Payouts & Invoices */}
          <div className="payout-history-panel">
            <h4>
              <ArrowUpRight size={16} color="var(--accent-secondary)" />
              <span>Recent Payout Invoices</span>
            </h4>

            <div className="history-list">
              {summary.recentPayoutHistory.map(pay => (
                <div key={pay.id} className="history-item-row">
                  <div className="history-meta">
                    <strong>${pay.amount.toFixed(2)} USD</strong>
                    <span>Deposited on {pay.date}</span>
                  </div>

                  <div className="history-actions">
                    <span className="payout-paid-chip">{pay.status}</span>
                    <button
                      type="button"
                      className="btn-download-invoice"
                      onClick={() => handleDownloadInvoice(pay.id, pay.amount)}
                      title="Download PDF Tax Remittance"
                    >
                      <Download size={14} />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
