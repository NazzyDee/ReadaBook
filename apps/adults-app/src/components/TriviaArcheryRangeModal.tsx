import React, { useState } from 'react';
import { X, Target, Sparkles, CheckCircle2, Trophy, Crosshair } from 'lucide-react';
import { DEFAULT_ARCHERY_ROUND, type ArcheryTriviaRound, type ArcheryTargetRing } from '../lib/triviaArcheryData';
import { soundFX } from '../lib/soundFx';

interface TriviaArcheryRangeModalProps {
  streamerName: string;
  onClose: () => void;
}

export const TriviaArcheryRangeModal: React.FC<TriviaArcheryRangeModalProps> = ({
  streamerName,
  onClose
}) => {
  const [round, setRound] = useState<ArcheryTriviaRound>(DEFAULT_ARCHERY_ROUND);
  const [selectedRing, setSelectedRing] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleShootArrow = (ring: ArcheryTargetRing) => {
    soundFX.playPop();
    if (ring.isCorrect) {
      soundFX.playApplause();
    } else {
      soundFX.playThunder();
    }
    setSelectedRing(ring.ringName);
    setRound(prev => ({
      ...prev,
      totalArrowsShot: prev.totalArrowsShot + 1,
      targetRings: prev.targetRings.map(r => r.ringName === ring.ringName ? { ...r, votesCount: r.votesCount + 1 } : r)
    }));
    setToastMsg(ring.isCorrect ? `🎯 BULLSEYE! Chat arrow hit the correct answer: "${ring.triviaAnswer}"!` : `🏹 Missed Bullseye! Arrow landed on "${ring.triviaAnswer}".`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="archery-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="archery-modal-header">
          <div className="archery-title-group">
            <div className="archery-badge">
              <Target size={16} />
              <span>COMMUNITY ARCHERY & TRIVIA TARGET RANGE</span>
            </div>
            <h3>@{streamerName}'s Live Archery Range</h3>
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

        {/* Archery Target Hero Banner */}
        <div className="archery-hero-banner">
          <div className="archery-target-board">
            <div className="target-ring outer-white">
              <div className="target-ring mid-blue">
                <div className="target-ring inner-gold">
                  <div className="target-ring center-bullseye">
                    <Crosshair size={20} color="#ff3b3b" />
                  </div>
                </div>
              </div>
            </div>
            <span className="arrows-shot-pill">🏹 {round.totalArrowsShot} Arrows Fired</span>
          </div>

          <div className="archery-hero-meta">
            <div className="trivia-time-row">
              <Trophy size={14} color="#ffd700" />
              <span>Live Question (200 Sparks Pool)</span>
            </div>
            <h4>{round.question}</h4>
            <p>
              Viewers shoot arrows at the 4 target rings by clicking or typing in chat. Correct answers award bonus channel points!
            </p>
          </div>
        </div>

        {/* Target Rings Choices Grid */}
        <div className="archery-rings-grid">
          {round.targetRings.map(ring => {
            const isChosen = selectedRing === ring.ringName;
            return (
              <div
                key={ring.ringName}
                className={`archery-ring-card ${ring.ringName.toLowerCase()} ${isChosen ? 'chosen' : ''}`}
                onClick={() => handleShootArrow(ring)}
              >
                <div className="ring-card-header">
                  <span className="ring-type-tag">{ring.ringName.replace('_', ' ')}</span>
                  <span className="ring-pts">+{ring.points} PTS</span>
                </div>
                <strong>{ring.triviaAnswer}</strong>
                <div className="ring-votes-bar">
                  <span>{ring.votesCount} arrows</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="archery-modal-footer">
          <span className="footer-archery-note">
            🎯 Real-time physics engine animates arrows flying from the chat box into the target.
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
