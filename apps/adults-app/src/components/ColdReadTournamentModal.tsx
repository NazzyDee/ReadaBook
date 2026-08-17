import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Mic2, Trophy, Star } from 'lucide-react';
import { DEFAULT_COLD_READ_AUDITIONERS, type ColdReadAuditioner } from '../lib/coldReadTournamentData';
import { soundFX } from '../lib/soundFx';

interface ColdReadTournamentModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ColdReadTournamentModal: React.FC<ColdReadTournamentModalProps> = ({
  streamerName,
  onClose
}) => {
  const [auditioners, setAuditioners] = useState<ColdReadAuditioner[]>(DEFAULT_COLD_READ_AUDITIONERS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleVoteAuditioner = (aud: ColdReadAuditioner) => {
    soundFX.playPop();
    soundFX.playApplause();
    setAuditioners(prev => prev.map(a => ({
      ...a,
      hasAudienceSelected: a.id === aud.id,
      judgeVotesCount: a.id === aud.id ? a.judgeVotesCount + 1 : a.judgeVotesCount
    })));
    setToastMsg(`🎭 Voted for @${aud.viewerHandle}'s cold-read dramatic audition for "${aud.roleTarget}"!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="cold-read-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cold-read-modal-header">
          <div className="cold-read-title-group">
            <div className="cold-read-badge">
              <Mic2 size={16} />
              <span>LIVE DRAMATIC COLD-READ AUDITION TOURNAMENTS</span>
            </div>
            <h3>@{streamerName}'s Community Casting Call</h3>
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
        <div className="cold-read-hero-banner">
          <div className="theatre-mask-dial">
            <Star size={44} color="#ffd700" />
            <span className="live-audition-tag">ROUND 3: FINALS</span>
          </div>

          <div className="cold-read-hero-meta">
            <h4>Blind Script Cold-Reading Tournament</h4>
            <p className="cold-read-explainer">
              Audience members jump on Guest Star stage with zero preparation to perform blind script lines. Real-time pitch, emotion, and acting scores are tabulated by judges and chat.
            </p>
          </div>
        </div>

        {/* Auditioners List */}
        <div className="auditioners-list">
          <h4>Finalist Audition Performances</h4>
          {auditioners.map(aud => (
            <div key={aud.id} className="auditioner-card">
              <div className="aud-left">
                <Mic2 size={22} color="#ffd700" />
                <div className="aud-info">
                  <span className="role-target-pill">{aud.roleTarget}</span>
                  <strong>@{aud.viewerHandle}</strong>
                  <span className="aud-sub">Score: {aud.dramaticScore}/100 • {aud.emotionalRangePct}% Emotional Range • {aud.judgeVotesCount} Votes</span>
                </div>
              </div>

              <div className="aud-right">
                <button
                  type="button"
                  className={`btn-vote-aud ${aud.hasAudienceSelected ? 'voted' : ''}`}
                  onClick={() => handleVoteAuditioner(aud)}
                >
                  <Trophy size={14} />
                  <span>{aud.hasAudienceSelected ? 'Voted' : 'Vote Voice'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="cold-read-modal-footer">
          <span className="footer-cold-read-note">
            🎭 Winner receives Guest Star Voice Actor role in the next live Audiobook stream!
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
