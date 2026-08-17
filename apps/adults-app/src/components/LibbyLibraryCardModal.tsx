import React, { useState } from 'react';
import { X, Landmark, Sparkles, CheckCircle2, BookOpen } from 'lucide-react';
import { DEFAULT_LIBRARY_BRANCHES, type LibraryBranch } from '../lib/libbyLibraryCardData';
import { soundFX } from '../lib/soundFx';

interface LibbyLibraryCardModalProps {
  streamerName: string;
  onClose: () => void;
}

export const LibbyLibraryCardModal: React.FC<LibbyLibraryCardModalProps> = ({
  streamerName,
  onClose
}) => {
  const [branches] = useState<LibraryBranch[]>(DEFAULT_LIBRARY_BRANCHES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleBorrowStreamBook = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg(`🏛️ Borrowed "The Fellowship of the Ring" for free from NYPL via OverDrive / Libby API!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="libby-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="libby-modal-header">
          <div className="libby-title-group">
            <div className="libby-badge">
              <Landmark size={16} />
              <span>PUBLIC LIBRARY CARD (OVERDRIVE / LIBBY) INTEGRATION</span>
            </div>
            <h3>@{streamerName}'s Free Public Library Bridge</h3>
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

        {/* Hero Banner */}
        <div className="libby-hero-banner">
          <div className="libby-icon-dial">
            <Landmark size={44} color="#00ff88" />
            <span className="free-reads-tag">100% FREE BORROWING</span>
          </div>

          <div className="libby-hero-meta">
            <h4>Read Along Legally For Free With Your Library Card</h4>
            <p className="libby-explainer">
              Link your local municipal library card to borrow official EPUB and audiobooks instantly when your favorite streamers go live.
            </p>

            <button
              type="button"
              className="btn-borrow-libby"
              onClick={handleBorrowStreamBook}
            >
              <BookOpen size={14} />
              <span>Borrow Active Stream Book via Libby</span>
            </button>
          </div>
        </div>

        {/* Linked Library Cards List */}
        <div className="libby-cards-list">
          <h4>Linked Library Cards ({branches.length})</h4>
          {branches.map(branch => (
            <div key={branch.id} className="library-card-tile">
              <div className="card-tile-left">
                <Landmark size={22} color="#ffd700" />
                <div className="branch-info">
                  <strong>{branch.librarySystemName}</strong>
                  <span className="barcode-sub">Card: •••• •••• {branch.cardBarcode.slice(-4)} • {branch.loansActiveCount} active loans</span>
                </div>
              </div>

              <div className="card-tile-right">
                <span className="linked-badge">
                  <CheckCircle2 size={12} />
                  <span>LIBBY LINKED</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="libby-modal-footer">
          <span className="footer-libby-note">
            🏛️ Powered by OverDrive Circulation API & Library Simplified Open Access.
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
