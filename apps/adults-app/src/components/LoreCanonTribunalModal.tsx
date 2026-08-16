import React, { useState } from 'react';
import { X, Scale, Sparkles, CheckCircle2, Check, Ban } from 'lucide-react';
import { DEFAULT_CANON_DISPUTES, type CanonDispute } from '../lib/loreCanonTribunalData';
import { soundFX } from '../lib/soundFx';

interface LoreCanonTribunalModalProps {
  streamerName: string;
  onClose: () => void;
}

export const LoreCanonTribunalModal: React.FC<LoreCanonTribunalModalProps> = ({
  streamerName,
  onClose
}) => {
  const [disputes, setDisputes] = useState<CanonDispute[]>(DEFAULT_CANON_DISPUTES);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>('disp_balrog_wings');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleVoteVerdict = (isCanon: boolean) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setDisputes(prev => prev.map(d => {
      if (d.id === selectedDisputeId) {
        return {
          ...d,
          proCanonVotes: isCanon ? d.proCanonVotes + 1 : d.proCanonVotes,
          antiCanonVotes: !isCanon ? d.antiCanonVotes + 1 : d.antiCanonVotes
        };
      }
      return d;
    }));
    setToastMsg(`⚖️ Cast your vote on Canon Tribunal: [${isCanon ? 'VERIFIED CANON' : 'HERESY / APOCRYPHA'}]!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentDispute = disputes.find(d => d.id === selectedDisputeId) || disputes[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tribunal-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tribunal-modal-header">
          <div className="tribunal-title-group">
            <div className="tribunal-badge">
              <Scale size={16} />
              <span>LORE FACT-CHECKER & CANON DISPUTE TRIBUNAL</span>
            </div>
            <h3>@{streamerName}'s High Canon Court</h3>
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

        {/* Hero Banner Case File */}
        <div className="tribunal-hero-banner">
          <div className="tribunal-scale-box">
            <Scale size={32} color="#ffd700" />
            <span className={`verdict-pill ${currentDispute.tribunalVerdict.toLowerCase()}`}>
              {currentDispute.tribunalVerdict.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="tribunal-hero-meta">
            <span className="source-citation-tag">📖 {currentDispute.bookSource}</span>
            <h4>"{currentDispute.disputedClaim}"</h4>
            <div className="citation-quote-box">
              <p>{currentDispute.primaryCitation}</p>
            </div>

            <div className="tribunal-vote-actions">
              <button
                type="button"
                className="btn-canon-vote pro"
                onClick={() => handleVoteVerdict(true)}
              >
                <Check size={16} />
                <span>Canon ({currentDispute.proCanonVotes})</span>
              </button>

              <button
                type="button"
                className="btn-canon-vote anti"
                onClick={() => handleVoteVerdict(false)}
              >
                <Ban size={16} />
                <span>Heresy ({currentDispute.antiCanonVotes})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Disputes Docket Grid */}
        <div className="tribunal-docket-list">
          {disputes.map(d => (
            <div
              key={d.id}
              className={`docket-tile ${d.id === selectedDisputeId ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedDisputeId(d.id);
              }}
            >
              <div className="docket-top">
                <strong>{d.disputedClaim}</strong>
                <span className={`docket-verdict-badge ${d.tribunalVerdict.toLowerCase()}`}>
                  {d.tribunalVerdict}
                </span>
              </div>
              <span className="docket-sub">{d.bookSource}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="tribunal-modal-footer">
          <span className="footer-tribunal-note">
            🛡️ High Archivist Guild members receive 2x voting weight on disputed citations.
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
