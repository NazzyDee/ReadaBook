import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Zap, Swords, Clock } from 'lucide-react';
import { DEFAULT_ANNOTATION_MATCH, type AnnotationShowdownMatch } from '../lib/annotationShowdownData';
import { soundFX } from '../lib/soundFx';

interface AnnotationShowdownModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AnnotationShowdownModal: React.FC<AnnotationShowdownModalProps> = ({
  streamerName,
  onClose
}) => {
  const [match, setMatch] = useState<AnnotationShowdownMatch>(DEFAULT_ANNOTATION_MATCH);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCastAudienceVote = (winner: 'A' | 'B') => {
    soundFX.playPop();
    soundFX.playApplause();
    setMatch(prev => ({ ...prev, audienceVoteWinner: winner }));
    const participant = winner === 'A' ? match.participantA : match.participantB;
    setToastMsg(`⚡ Voted for @${participant.streamerName} in the Speed Annotation Battle!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="showdown-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="showdown-modal-header">
          <div className="showdown-title-group">
            <div className="showdown-badge">
              <Zap size={16} />
              <span>LIVE COMPETITIVE SPEED-ANNOTATING ESPORTS (SHOWDOWN)</span>
            </div>
            <h3>@{streamerName}'s Literary Showdown Arena</h3>
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

        {/* Match Header Banner */}
        <div className="showdown-hero-banner">
          <div className="timer-box">
            <Clock size={32} color="#00ff88" />
            <span className="timer-seconds-num">{match.timeRemainingSeconds}s</span>
            <span className="timer-sub-label">ROUND TIME</span>
          </div>

          <div className="showdown-hero-meta">
            <span className="match-tag">🏆 1v1 LIVE SHOWDOWN</span>
            <h4>{match.excerptTitle}</h4>
            <p className="showdown-explainer">
              Competitors race against the clock to highlight metaphors, syntax patterns, and historical allusions. Audience vote decides tiebreaks.
            </p>
          </div>
        </div>

        {/* 1v1 Competitor Split Cards */}
        <div className="showdown-grid-1v1">
          {/* Participant A */}
          <div className={`competitor-card ${match.audienceVoteWinner === 'A' ? 'winning' : ''}`}>
            <div className="comp-header">
              <strong>@{match.participantA.streamerName}</strong>
              <span className="score-pill">{match.participantA.score} PTS</span>
            </div>
            <div className="comp-stats">
              <span>✍️ {match.participantA.annotationsCount} Annotations</span>
              <span>🎯 {match.participantA.accuracyRatingPct}% Accuracy</span>
            </div>
            <p className="theme-quote">"{match.participantA.topThemeIdentified}"</p>
            <button
              type="button"
              className="btn-vote-competitor"
              onClick={() => handleCastAudienceVote('A')}
            >
              <Swords size={14} />
              <span>Vote @{match.participantA.streamerName}</span>
            </button>
          </div>

          {/* Participant B */}
          <div className={`competitor-card ${match.audienceVoteWinner === 'B' ? 'winning' : ''}`}>
            <div className="comp-header">
              <strong>@{match.participantB.streamerName}</strong>
              <span className="score-pill">{match.participantB.score} PTS</span>
            </div>
            <div className="comp-stats">
              <span>✍️ {match.participantB.annotationsCount} Annotations</span>
              <span>🎯 {match.participantB.accuracyRatingPct}% Accuracy</span>
            </div>
            <p className="theme-quote">"{match.participantB.topThemeIdentified}"</p>
            <button
              type="button"
              className="btn-vote-competitor"
              onClick={() => handleCastAudienceVote('B')}
            >
              <Swords size={14} />
              <span>Vote @{match.participantB.streamerName}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="showdown-modal-footer">
          <span className="footer-showdown-note">
            ⚡ Live telemetry powered by WebSockets with sub-20ms annotation sync.
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
