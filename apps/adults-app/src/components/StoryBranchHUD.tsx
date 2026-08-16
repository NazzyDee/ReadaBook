import React, { useState, useEffect } from 'react';
import { Compass, Clock, CheckCircle2, Trophy, X, ShieldAlert } from 'lucide-react';
import { MOCK_BRANCH_SESSION, type StoryBranchSession, type StoryBranchOption } from '../lib/branchingData';
import { soundFX } from '../lib/soundFx';

interface StoryBranchHUDProps {
  onClose: () => void;
  onOptionSelected?: (option: StoryBranchOption) => void;
}

export const StoryBranchHUD: React.FC<StoryBranchHUDProps> = ({
  onClose,
  onOptionSelected
}) => {
  const [session, setSession] = useState<StoryBranchSession>(MOCK_BRANCH_SESSION);
  const [timeLeft, setTimeLeft] = useState<number>(session.durationSeconds);
  const [hasVoted, setHasVoted] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  // Live Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResolved(true);
      soundFX.playApplause();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResolved(true);
          soundFX.playApplause();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Vote handler
  const handleVote = (optionId: string) => {
    if (hasVoted || isResolved) return;
    soundFX.playPop();
    setHasVoted(optionId);

    setSession(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      )
    }));
  };

  const totalVotes = session.options.reduce((acc, curr) => acc + curr.votes, 0);

  // Calculate winner
  const winningOption = [...session.options].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="story-branch-hud-overlay">
      <div className="story-branch-card">
        {/* HUD Top Bar */}
        <div className="branch-top-bar">
          <div className="branch-badge">
            <Compass size={16} className="spin-slow" />
            <span>CHOOSE YOUR OWN ADVENTURE • LIVE AUDIENCE VOTE</span>
          </div>

          <div className="branch-timer-pill">
            <Clock size={14} />
            <span>{isResolved ? 'DECIDED' : `${timeLeft}s Remaining`}</span>
          </div>

          <button onClick={onClose} className="branch-close-btn" title="Dismiss HUD">
            <X size={18} />
          </button>
        </div>

        {/* Narrative Question & Context */}
        <div className="branch-header-info">
          <h3>{session.question}</h3>
          <p className="branch-context-lore">
            <ShieldAlert size={14} />
            <span>{session.contextLore}</span>
          </p>
        </div>

        {/* Options List */}
        <div className="branch-options-grid">
          {session.options.map(opt => {
            const isWinner = isResolved && opt.id === winningOption.id;
            const isMyVote = hasVoted === opt.id;
            const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

            return (
              <div
                key={opt.id}
                className={`branch-option-card ${isMyVote ? 'my-vote' : ''} ${isWinner ? 'winner' : ''}`}
                onClick={() => handleVote(opt.id)}
              >
                {/* Progress bar fill */}
                <div
                  className="branch-vote-fill"
                  style={{ width: `${percentage}%` }}
                />

                <div className="branch-opt-content">
                  <div className="branch-opt-header">
                    <span className="branch-opt-icon">{opt.icon}</span>
                    <div className="branch-opt-text">
                      <div className="branch-opt-label-row">
                        <h4>{opt.label}</h4>
                        {isWinner && (
                          <span className="winner-pill">
                            <Trophy size={12} />
                            <span>WINNER</span>
                          </span>
                        )}
                        {isMyVote && (
                          <span className="voted-pill">
                            <CheckCircle2 size={12} />
                            <span>Your Vote</span>
                          </span>
                        )}
                      </div>
                      <p className="branch-opt-desc">{opt.description}</p>
                    </div>
                  </div>

                  <div className="branch-opt-stats">
                    <span className="branch-opt-page">Turn to Page {opt.targetPage}</span>
                    <div className="branch-percent-badge">{percentage}% ({opt.votes} votes)</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* HUD Footer */}
        <div className="branch-hud-footer">
          <div className="branch-footer-info">
            <span>Total Community Votes: <strong>{totalVotes}</strong></span>
            {isResolved ? (
              <span className="outcome-text">
                🎉 Audience decided: <strong>{winningOption.label}</strong> (Turn to p. {winningOption.targetPage})
              </span>
            ) : (
              <span>Click any path above to cast your live vote!</span>
            )}
          </div>

          {isResolved && (
            <button
              className="btn-primary btn-advance-story"
              onClick={() => {
                soundFX.playPageRustle();
                if (onOptionSelected) onOptionSelected(winningOption);
                onClose();
              }}
            >
              📖 Turn to Page {winningOption.targetPage}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
