import React, { useState } from 'react';
import { X, Package, Sparkles, CheckCircle2, Gift } from 'lucide-react';
import { DEFAULT_PARCELS, type BlindDateBookParcel } from '../lib/blindDateUnboxingData';
import { soundFX } from '../lib/soundFx';

interface BlindDateUnboxingModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BlindDateUnboxingModal: React.FC<BlindDateUnboxingModalProps> = ({
  streamerName,
  onClose
}) => {
  const [parcels, setParcels] = useState<BlindDateBookParcel[]>(DEFAULT_PARCELS);
  const [selectedParcelId, setSelectedParcelId] = useState<string>('parcel_001');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTearWrappingPaper = (parcel: BlindDateBookParcel) => {
    soundFX.playPageRustle();
    soundFX.playApplause();
    setParcels(prev => prev.map(p => p.id === parcel.id ? {
      ...p,
      status: 'UNVEILED',
      unboxedBookTitle: p.unboxedBookTitle || 'Neuromancer by William Gibson'
    } : p));
    setToastMsg(`🎁 TORE OFF WRAPPING PAPER! Unveiled mystery book on stream!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="blind-date-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="blind-date-modal-header">
          <div className="blind-date-title-group">
            <div className="blind-date-badge">
              <Package size={16} />
              <span>MYSTERY BLIND DATE WITH A BOOK UNBOXING QUEUE</span>
            </div>
            <h3>@{streamerName}'s Mystery Parcel Unboxing</h3>
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

        {/* Parcel Hero Showcase Banner */}
        <div className="blind-date-hero-banner">
          <div className="parcel-3d-box">
            <div className="parcel-wrapping">
              <span className="parcel-string">🎀</span>
              <span className="wax-initial">{currentParcel.waxStampInitial}</span>
            </div>
            <span className="parcel-status-pill">{currentParcel.status.replace(/_/g, ' ')}</span>
          </div>

          <div className="blind-date-hero-meta">
            <div className="donor-row">
              <Gift size={14} color="#ffd700" />
              <span>Gifted By: <strong>@{currentParcel.donorViewerName}</strong></span>
            </div>

            <div className="genre-keywords-pills">
              {currentParcel.genreKeywords.map((kw, idx) => (
                <span key={idx} className="keyword-chip">🏷️ {kw}</span>
              ))}
            </div>

            <p className="parcel-hint-quote">{currentParcel.hintQuote}</p>

            {currentParcel.status === 'UNVEILED' && currentParcel.unboxedBookTitle ? (
              <div className="unveiled-book-banner">
                <span>📖 Revealed Title: <strong>{currentParcel.unboxedBookTitle}</strong></span>
              </div>
            ) : (
              <button
                type="button"
                className="btn-tear-paper"
                onClick={() => handleTearWrappingPaper(currentParcel)}
              >
                <Package size={16} />
                <span>Tear Wrapping Paper & Reveal Book Live</span>
              </button>
            )}
          </div>
        </div>

        {/* Queue Grid */}
        <div className="parcels-queue-grid">
          {parcels.map(p => (
            <div
              key={p.id}
              className={`parcel-tile ${p.id === selectedParcelId ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedParcelId(p.id);
              }}
            >
              <div className="parcel-tile-top">
                <strong>From @{p.donorViewerName}</strong>
                <span className={`status-pill-sm ${p.status.toLowerCase()}`}>{p.status.split('_')[0]}</span>
              </div>
              <span className="parcel-style-sub">Wrapped: {p.wrappingPaperStyle.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="blind-date-modal-footer">
          <span className="footer-blind-note">
            📦 Viewers can submit mystery books via the Channel Merch PO Box or digital secret drops.
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
