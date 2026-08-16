import React, { useState } from 'react';
import { X, Trophy, Sparkles, CheckCircle2, Crown, Swords } from 'lucide-react';
import { DEFAULT_TOURNAMENT_MATCHUPS, type TournamentMatchup } from '../lib/bookTournamentData';
import { soundFX } from '../lib/soundFx';

interface BookTournamentBracketModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BookTournamentBracketModal: React.FC<BookTournamentBracketModalProps> = ({
  streamerName,
  onClose
}) => {
  const [matchups, setMatchups] = useState<TournamentMatchup[]>(DEFAULT_TOURNAMENT_MATCHUPS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleVote = (matchId: string, side: 'A' | 'B') => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setMatchups(prev => prev.map(m => {
      if (m.matchId === matchId) {
        return side === 'A'
          ? { ...m, bookAVotes: m.bookAVotes + 1 }
          : { ...m, bookBVotes: m.bookBVotes + 1 };
      }
      return m;
    }));

    const votedBook = side === 'A'
      ? matchups.find(m => m.matchId === matchId)?.bookATitle
      : matchups.find(m => m.matchId === matchId)?.bookBTitle;

    setToastMsg(`🗳️ CAST VOTE for "${votedBook}" in the Grand Tournament Arena!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tournament-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tournament-modal-header">
          <div className="tournament-title-group">
            <div className="tournament-badge">
              <Trophy size={16} />
              <span>GRAND TOURNAMENT BRACKET & BOOK OF THE YEAR ARENA</span>
            </div>
            <h3>@{streamerName}'s Community Tournament Bracket</h3>
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

        {/* Grand Championship Matchup Hero */}
        <div className="finals-matchup-banner">
          <div className="finals-header-row">
            <Crown size={18} color="#ffd700" />
            <strong>🏆 LIVE GRAND FINALS: BOOK OF THE YEAR 2026</strong>
          </div>

          <div className="matchup-dueling-sides">
            {/* Side A */}
            <div className="duel-side left">
              <h4>{matchups[2].bookATitle}</h4>
              <p>{matchups[2].bookAAuthor}</p>
              <span className="votes-count">{matchups[2].bookAVotes} Votes</span>
              <button
                type="button"
                className="btn-vote-side"
                onClick={() => handleVote('match_grand_finals', 'A')}
              >
                <span>Vote Left</span>
              </button>
            </div>

            <div className="vs-badge-circle">
              <Swords size={20} color="#ffd700" />
              <span>VS</span>
            </div>

            {/* Side B */}
            <div className="duel-side right">
              <h4>{matchups[2].bookBTitle}</h4>
              <p>{matchups[2].bookBAuthor}</p>
              <span className="votes-count">{matchups[2].bookBVotes} Votes</span>
              <button
                type="button"
                className="btn-vote-side"
                onClick={() => handleVote('match_grand_finals', 'B')}
              >
                <span>Vote Right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Semi-Finals Matchups Grid */}
        <div className="tournament-matchups-grid">
          {matchups.slice(0, 2).map(m => (
            <div key={m.matchId} className="sub-matchup-card">
              <span className="round-name-tag">{m.roundName}</span>
              <div className="sub-matchup-rows">
                <div className={`sub-side-row ${m.winnerId === 'A' ? 'winner' : ''}`}>
                  <div>
                    <strong>{m.bookATitle}</strong>
                    <span>{m.bookAAuthor}</span>
                  </div>
                  <span className="sub-votes">{m.bookAVotes}</span>
                </div>
                <div className={`sub-side-row ${m.winnerId === 'B' ? 'winner' : ''}`}>
                  <div>
                    <strong>{m.bookBTitle}</strong>
                    <span>{m.bookBAuthor}</span>
                  </div>
                  <span className="sub-votes">{m.bookBVotes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="tournament-modal-footer">
          <span className="tournament-notice">
            ✨ Voting is live throughout the chapter broadcast. Winner advances to the Grand Hall of Legend.
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
