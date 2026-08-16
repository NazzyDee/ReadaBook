import React, { useState, useEffect } from 'react';
import { type PollData } from './ChatPollModal';
import { BarChart2, Clock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface PollBannerProps {
  poll: PollData;
  onVote: (optionId: string) => void;
  onDismiss: () => void;
  userVotedOptionId?: string | null;
}

export const PollBanner: React.FC<PollBannerProps> = ({
  poll,
  onVote,
  onDismiss,
  userVotedOptionId
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return Math.max(0, Math.round((poll.endsAt - Date.now()) / 1000));
  });

  const isEnded = timeLeft <= 0;

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.round((poll.endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [poll.endsAt]);

  const handleOptionClick = (optId: string) => {
    if (userVotedOptionId || isEnded) return;
    soundFX.playPop();
    onVote(optId);
  };

  const totalVotes = Math.max(1, poll.totalVotes);
  const leadingOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className={`live-poll-banner ${isEnded ? 'is-ended' : ''} ${collapsed ? 'collapsed' : ''}`}>
      {/* Poll Header */}
      <div className="poll-banner-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="poll-header-left">
          <div className="poll-live-chip">
            <BarChart2 size={13} />
            <span>{isEnded ? 'POLL ENDED' : 'LIVE POLL'}</span>
          </div>
          <span className="poll-question-snip">{poll.question}</span>
        </div>

        <div className="poll-header-right">
          {!isEnded ? (
            <span className="poll-countdown">
              <Clock size={12} />
              <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </span>
          ) : (
            <span className="poll-winner-tag">
              Winner: <strong>{leadingOption?.text}</strong>
            </span>
          )}

          <button className="btn-poll-toggle" title="Toggle Poll">
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
        </div>
      </div>

      {/* Poll Options */}
      {!collapsed && (
        <div className="poll-body-options">
          {poll.options.map(opt => {
            const pct = Math.round((opt.votes / totalVotes) * 100);
            const isUserChoice = userVotedOptionId === opt.id;
            const isWinner = isEnded && opt.id === leadingOption?.id;

            return (
              <div
                key={opt.id}
                className={`poll-option-row ${!userVotedOptionId && !isEnded ? 'clickable' : ''} ${isUserChoice ? 'selected' : ''} ${isWinner ? 'winner' : ''}`}
                onClick={() => handleOptionClick(opt.id)}
              >
                {/* Progress bar background fill */}
                <div
                  className="poll-bar-fill"
                  style={{ width: `${pct}%` }}
                />

                <div className="poll-option-content">
                  <div className="poll-opt-text-group">
                    {isUserChoice && <CheckCircle2 size={13} className="vote-check" />}
                    <span className="poll-opt-title">{opt.text}</span>
                  </div>
                  <span className="poll-opt-percentage">
                    {pct}% <span className="votes-count">({opt.votes})</span>
                  </span>
                </div>
              </div>
            );
          })}

          <div className="poll-footer-row">
            <span className="poll-votes-total">
              {poll.totalVotes} total {poll.totalVotes === 1 ? 'vote' : 'votes'}
            </span>
            {isEnded && (
              <button onClick={onDismiss} className="btn-dismiss-poll">
                Dismiss Poll
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
