import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Feather, Stamp } from 'lucide-react';
import { DEFAULT_BOOKPLATES, type SignedBookplate } from '../lib/digitalBookSigningData';
import { soundFX } from '../lib/soundFx';

interface DigitalBookSigningModalProps {
  streamerName: string;
  onClose: () => void;
}

export const DigitalBookSigningModal: React.FC<DigitalBookSigningModalProps> = ({
  streamerName,
  onClose
}) => {
  const [bookplates, setBookplates] = useState<SignedBookplate[]>(DEFAULT_BOOKPLATES);
  const [recipient, setRecipient] = useState<string>('Brave Reader');
  const [dedication, setDedication] = useState<string>('With deepest gratitude for reading along!');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSignNewBookplate = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPop();
    soundFX.playChestClaim();
    const newPlate: SignedBookplate = {
      id: `sign_${Date.now()}`,
      recipientName: recipient,
      authorDedication: `"${dedication}"`,
      signatureStyle: 'GOLD_FOIL_SCRIPT',
      waxSealColor: 'CRIMSON_ROYAL',
      waxSealInsignia: 'Dragon Crest with Quill',
      signedAt: 'Just now',
      certificateHash: `0x${Math.random().toString(16).substring(2, 10)}...cert`
    };
    setBookplates(prev => [newPlate, ...prev]);
    setToastMsg(`🖋️ Digital Bookplate signed & stamped for @${recipient}! Certificate generated.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const activePlate = bookplates[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="signing-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="signing-modal-header">
          <div className="signing-title-group">
            <div className="signing-badge">
              <Feather size={16} />
              <span>LIVE DIGITAL BOOK SIGNING & WAX SEAL CERTIFICATES</span>
            </div>
            <h3>@{streamerName}'s Live Author Signing Desk</h3>
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

        {/* Signed Bookplate Hero Showcase */}
        <div className="signing-hero-banner">
          <div className="parchment-bookplate">
            <div className="bookplate-inner-border">
              <div className="bookplate-header-row">
                <span className="ex-libris-title">EX LIBRIS READABOOK</span>
                <span className="cert-hash">{activePlate.certificateHash}</span>
              </div>

              <div className="bookplate-body">
                <p className="recipient-line">Inscribed Specially For: <strong>{activePlate.recipientName}</strong></p>
                <p className="dedication-quote">{activePlate.authorDedication}</p>
                <div className="author-signature-svg">
                  <span>~ {streamerName} 🪶</span>
                </div>
              </div>

              <div className="bookplate-seal-row">
                <div className={`wax-seal-badge ${activePlate.waxSealColor.toLowerCase()}`}>
                  <Stamp size={16} />
                  <span>WAX SEAL</span>
                </div>
                <span className="signed-date-stamp">Signed: {activePlate.signedAt}</span>
              </div>
            </div>
          </div>

          {/* Form to Sign for a Viewer */}
          <form className="signing-controls-meta" onSubmit={handleSignNewBookplate}>
            <h4>Sign Dedicated Bookplate</h4>
            <div className="form-group">
              <label>Viewer / Recipient Name</label>
              <input
                type="text"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="input-signing"
                placeholder="Enter viewer username..."
                required
              />
            </div>

            <div className="form-group">
              <label>Personalized Dedication Quote</label>
              <input
                type="text"
                value={dedication}
                onChange={e => setDedication(e.target.value)}
                className="input-signing"
                placeholder="Enter custom book dedication..."
                required
              />
            </div>

            <button type="submit" className="btn-sign-bookplate">
              <Feather size={16} />
              <span>Apply Gold Signature & Stamped Wax Seal</span>
            </button>
          </form>
        </div>

        {/* Recent Signed Plates Grid */}
        <div className="recent-plates-grid">
          {bookplates.map(plate => (
            <div key={plate.id} className="plate-mini-card">
              <div className="plate-mini-top">
                <strong>@{plate.recipientName}</strong>
                <span className="plate-cert">{plate.certificateHash}</span>
              </div>
              <p className="plate-quote">{plate.authorDedication}</p>
              <span className="plate-seal-sub">🎖️ {plate.waxSealInsignia}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="signing-modal-footer">
          <span className="footer-signing-note">
            🖋️ Signed digital bookplates embed cryptographically into the reader's EPUB and user profile showcase.
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
