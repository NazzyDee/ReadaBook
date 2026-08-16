import React, { useState, useEffect } from 'react';
import { X, Swords, Trophy, Clock, CheckCircle2, XCircle, Sparkles, Award } from 'lucide-react';
import { SAMPLE_TRIVIA_QUESTION, type TriviaQuestion } from '../lib/triviaArenaData';
import { soundFX } from '../lib/soundFx';

interface BookTriviaArenaModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BookTriviaArenaModal: React.FC<BookTriviaArenaModalProps> = ({
  streamerName,
  onClose
}) => {
  const [trivia, setTrivia] = useState<TriviaQuestion>(SAMPLE_TRIVIA_QUESTION);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [resultToast, setResultToast] = useState<string | null>(null);

  useEffect(() => {
    if (trivia.timeRemainingSeconds <= 0 || isRevealed) return;
    const timer = setInterval(() => {
      setTrivia(t => {
        if (t.timeRemainingSeconds <= 1) {
          setIsRevealed(true);
          return { ...t, timeRemainingSeconds: 0, isAnswerRevealed: true };
        }
        return { ...t, timeRemainingSeconds: t.timeRemainingSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [trivia.timeRemainingSeconds, isRevealed]);

  const handleSelectOption = (optId: string) => {
    if (isRevealed) return;
    soundFX.playPop();
    setSelectedOptionId(optId);
  };

  const handleRevealAnswer = () => {
    soundFX.playChestClaim();
    setIsRevealed(true);
    setTrivia(t => ({ ...t, isAnswerRevealed: true, timeRemainingSeconds: 0 }));

    const selectedOpt = trivia.options.find(o => o.id === selectedOptionId);
    if (selectedOpt?.isCorrect) {
      soundFX.playDragonRoar();
      soundFX.playApplause();
      setResultToast('🎉 BRILLIANT! You answered correctly and earned +500 Sparks from the Jackpot!');
    } else {
      soundFX.playThunder();
      setResultToast('❌ Incorrect! Glamdring was Gandalf’s ancient Elven blade.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="trivia-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="trivia-modal-header">
          <div className="trivia-title-group">
            <div className="trivia-badge">
              <Swords size={16} />
              <span>LORE MASTER CHAPTER TRIVIA GAUNTLET</span>
            </div>
            <h3>@{streamerName}'s Live Book Trivia Duel</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Result Toast */}
        {resultToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{resultToast}</span>
          </div>
        )}

        {/* Question Header Card */}
        <div className="trivia-question-card">
          <div className="trivia-card-meta">
            <span className="trivia-book-pill">{trivia.bookTitle} • {trivia.chapterTitle}</span>
            <div className="trivia-timer-pill">
              <Clock size={13} />
              <span>{trivia.timeRemainingSeconds > 0 ? `${trivia.timeRemainingSeconds}s remaining` : 'TIME UP'}</span>
            </div>
          </div>

          <h4>{trivia.question}</h4>

          <div className="trivia-prize-row">
            <Trophy size={15} color="#ffd700" />
            <span>Prize Pool: <strong>{trivia.sparksPrizePool.toLocaleString()} Sparks</strong></span>
          </div>
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="trivia-options-grid">
          {trivia.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            let statusClass = '';
            if (isRevealed) {
              statusClass = opt.isCorrect ? 'correct' : isSelected ? 'incorrect' : '';
            }

            return (
              <button
                key={opt.id}
                type="button"
                className={`trivia-option-btn ${isSelected ? 'selected' : ''} ${statusClass}`}
                disabled={isRevealed}
                onClick={() => handleSelectOption(opt.id)}
              >
                <div className="option-left-group">
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="opt-text">{opt.text}</span>
                </div>

                {isRevealed && (
                  <div className="option-result-meta">
                    <span className="vote-pct">{opt.votePercentage}%</span>
                    {opt.isCorrect ? (
                      <CheckCircle2 size={16} color="var(--accent-success)" />
                    ) : isSelected ? (
                      <XCircle size={16} color="var(--accent-danger)" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="trivia-modal-footer">
          {!isRevealed ? (
            <button
              type="button"
              className="btn-primary btn-lock-answer"
              disabled={!selectedOptionId}
              onClick={handleRevealAnswer}
            >
              <Award size={15} />
              <span>Lock in Answer & Reveal</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary btn-close-trivia"
              onClick={onClose}
            >
              <span>Back to Stream</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
