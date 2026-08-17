import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Trophy, Users } from 'lucide-react';
import { DEFAULT_TRIVIA_ROYALE, type TriviaRoyaleRound } from '../lib/triviaBattleRoyaleData';
import { soundFX } from '../lib/soundFx';

interface TriviaBattleRoyaleModalProps {
  streamerName: string;
  onClose: () => void;
}

export const TriviaBattleRoyaleModal: React.FC<TriviaBattleRoyaleModalProps> = ({
  streamerName,
  onClose
}) => {
  const [round] = useState<TriviaRoyaleRound>(DEFAULT_TRIVIA_ROYALE);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectAnswer = (idx: number) => {
    soundFX.playPop();
    setSelectedAnswerIndex(idx);
    if (idx === round.correctOptionIndex) {
      soundFX.playChestClaim();
      setToastMsg('🎉 CORRECT! You survived Round #8 and advance to the Top 100!');
    } else {
      soundFX.playThunder();
      setToastMsg('❌ ELIMINATED! Better luck in the next Battle Royale match.');
    }
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="royale-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="royale-modal-header">
          <div className="royale-title-group">
            <div className="royale-badge">
              <Trophy size={16} />
              <span>1,000-PLAYER LITERARY TRIVIA BATTLE ROYALE</span>
            </div>
            <h3>@{streamerName}'s Live Trivia Elimination Match</h3>
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
        <div className="royale-hero-banner">
          <div className="players-alive-box">
            <Users size={32} color="#00ff88" />
            <span className="players-alive-num">{round.playersRemaining}</span>
            <span className="players-alive-sub">PLAYERS ALIVE</span>
          </div>

          <div className="royale-hero-meta">
            <div className="royale-stats-row">
              <span className="round-pill">Question {round.questionNumber} of 12</span>
              <span className="sparks-prize-pill">💰 {round.prizePoolSparks.toLocaleString()} Sparks Prize Pool</span>
            </div>
            <h4>{round.questionText}</h4>
          </div>
        </div>

        {/* Options Grid */}
        <div className="royale-options-grid">
          {round.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              className={`royale-option-btn ${selectedAnswerIndex === idx ? (idx === round.correctOptionIndex ? 'correct' : 'wrong') : ''}`}
              onClick={() => handleSelectAnswer(idx)}
              disabled={selectedAnswerIndex !== null}
            >
              <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="opt-text">{opt}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="royale-modal-footer">
          <span className="footer-royale-note">
            🧠 Real-time 15-second survival window with instant Bits/Sparks smart prize distribution.
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
