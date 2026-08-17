import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Trophy, Feather, Crown } from 'lucide-react';
import { DEFAULT_AWARD_NOMINEES, type AwardNominee } from '../lib/goldenQuillAwardsData';
import { soundFX } from '../lib/soundFx';

interface GoldenQuillAwardsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const GoldenQuillAwardsModal: React.FC<GoldenQuillAwardsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [nominees, setNominees] = useState<AwardNominee[]>(DEFAULT_AWARD_NOMINEES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCastVote = (nominee: AwardNominee) => {
    soundFX.playPop();
    soundFX.playApplause();
    setNominees(prev => prev.map(n => ({
      ...n,
      hasUserVoted: n.id === nominee.id ? true : (n.category === nominee.category ? false : n.hasUserVoted),
      votesCount: n.id === nominee.id ? n.votesCount + 1 : n.votesCount
    })));
    setToastMsg(`🏆 Cast your Golden Quill Award ballot for "${nominee.nomineeName}" in [${nominee.category}]!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="awards-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="awards-modal-header">
          <div className="awards-title-group">
            <div className="awards-badge">
              <Trophy size={16} />
              <span>THE ANNUAL READABOOK GOLDEN QUILL AWARDS GALA</span>
            </div>
            <h3>2026 Golden Quill Book Broadcasting Gala (@{streamerName})</h3>
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
        <div className="awards-hero-banner">
          <div className="trophy-dial-box">
            <Crown size={44} color="#ffd700" />
            <span className="awards-year-tag">GALA DEC 12</span>
          </div>

          <div className="awards-hero-meta">
            <h4>Celebrate the Best Book Streamers, Authors & Voice Narrators</h4>
            <p className="awards-explainer">
              Vote across 12 live categories for the official industry-recognized Golden Quill statuette broadcasted live with red carpet interviews.
            </p>
          </div>
        </div>

        {/* Nominees Grid */}
        <div className="awards-nominees-grid">
          <h4>Official Category Nominees</h4>
          {nominees.map(nom => (
            <div key={nom.id} className="nominee-card">
              <div className="nominee-left">
                <Feather size={22} color="#ffd700" />
                <div className="nominee-info">
                  <span className="category-pill">{nom.category}</span>
                  <strong>{nom.nomineeName}</strong>
                  <span className="nominee-sub">{nom.bookTitleOrChannel} • {nom.votesCount.toLocaleString()} votes</span>
                </div>
              </div>

              <div className="nominee-right">
                <button
                  type="button"
                  className={`btn-vote-nominee ${nom.hasUserVoted ? 'voted' : ''}`}
                  onClick={() => handleCastVote(nom)}
                >
                  <Trophy size={14} />
                  <span>{nom.hasUserVoted ? 'Voted' : 'Vote'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="awards-modal-footer">
          <span className="footer-awards-note">
            🏆 All votes cryptographically verified via reader account level 5+ requirement.
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
