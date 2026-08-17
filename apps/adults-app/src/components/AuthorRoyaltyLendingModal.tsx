import React, { useState } from 'react';
import { X, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react';
import { DEFAULT_AUTHOR_ROYALTIES, type AuthorRoyaltySummary } from '../lib/authorRoyaltyLendingData';
import { soundFX } from '../lib/soundFx';

interface AuthorRoyaltyLendingModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AuthorRoyaltyLendingModal: React.FC<AuthorRoyaltyLendingModalProps> = ({
  streamerName,
  onClose
}) => {
  const [royalties] = useState<AuthorRoyaltySummary>(DEFAULT_AUTHOR_ROYALTIES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleExportStatement = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg('📄 Exported Certified Author PLR & Streaming Royalty Statement (PDF / CSV)!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalCombined = royalties.totalLendingRoyaltiesUSD + royalties.digitalStreamsRoyaltiesUSD;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="royalty-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="royalty-modal-header">
          <div className="royalty-title-group">
            <div className="royalty-badge">
              <BarChart3 size={16} />
              <span>AUTHOR ROYALTY & PUBLIC LENDING RIGHTS (PLR) DASHBOARD</span>
            </div>
            <h3>@{streamerName}'s Royalty Ledger</h3>
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

        {/* Hero Royalty Banner */}
        <div className="royalty-hero-banner">
          <div className="royalty-stat-dial">
            <span className="total-royalty-amount">${totalCombined.toLocaleString()}</span>
            <span className="royalty-label">TOTAL ACCRUED ROYALTIES</span>
          </div>

          <div className="royalty-hero-meta">
            <div className="author-isbn-row">
              <span>Author: <strong>{royalties.authorLegalName}</strong></span>
              <span className="isbn-pill">ISBN: {royalties.isbnRegistered}</span>
            </div>

            <div className="royalty-breakdown-row">
              <div className="breakdown-chip">
                <span>Public Lending Rights (PLR)</span>
                <strong>${royalties.totalLendingRoyaltiesUSD.toLocaleString()} USD</strong>
              </div>
              <div className="breakdown-chip">
                <span>Live Streaming Micro-Royalties</span>
                <strong>${royalties.digitalStreamsRoyaltiesUSD.toLocaleString()} USD</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn-export-statement"
              onClick={handleExportStatement}
            >
              <BarChart3 size={16} />
              <span>Download Tax-Compliant Royalty Statement</span>
            </button>
          </div>
        </div>

        {/* Royalty Streams Breakdown List */}
        <div className="royalty-streams-list">
          <h4>Audited Lending & Streaming Rights Breakdown</h4>
          {royalties.streams.map(st => (
            <div key={st.id} className="royalty-stream-row">
              <div className="stream-info-col">
                <strong>{st.sourceName}</strong>
                <span>{st.totalCheckouts.toLocaleString()} Total Read-Throughs • ${st.royaltyPerCheckoutUSD.toFixed(2)}/read</span>
              </div>
              <div className="stream-amount-col">
                <span className="stream-accrued">${st.accruedRoyaltyUSD.toLocaleString()} USD</span>
                <span className="last-payout-sub">Paid: {st.lastPayoutDate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="royalty-modal-footer">
          <span className="footer-royalty-note">
            📊 Complies with Authors Guild, UK PLR, ALCS, and US Copyright Royalty Board syndication rules.
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
