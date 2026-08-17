import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Trophy, BarChart3, Star, Plus } from 'lucide-react';
import { DEFAULT_FANTASY_LEAGUE, type FantasyLeagueLeague } from '../lib/fantasyBookDraftData';
import { soundFX } from '../lib/soundFx';

interface FantasyBookDraftModalProps {
  streamerName: string;
  onClose: () => void;
}

export const FantasyBookDraftModal: React.FC<FantasyBookDraftModalProps> = ({
  streamerName,
  onClose
}) => {
  const [league] = useState<FantasyLeagueLeague>(DEFAULT_FANTASY_LEAGUE);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleDraftNewPick = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg('📊 Drafted "The Olympian Affair" by Jim Butcher to your active roster (+420 Projected Fantasy PTS)!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="draft-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="draft-modal-header">
          <div className="draft-title-group">
            <div className="draft-badge">
              <BarChart3 size={16} />
              <span>FANTASY LITERARY DRAFT & BOOK CLUB FANTASY LEAGUE</span>
            </div>
            <h3>@{streamerName}'s Fantasy Book League</h3>
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
        <div className="draft-hero-banner">
          <div className="rank-dial-box">
            <Trophy size={36} color="#ffd700" />
            <span className="rank-number">#{league.currentRank}</span>
            <span className="rank-sub-label">LEAGUE STANDING</span>
          </div>

          <div className="draft-hero-meta">
            <h4>{league.leagueName}</h4>
            <div className="team-meta-row">
              <span className="team-name-tag">{league.userTeamName}</span>
              <span className="pts-tag">🌟 {league.totalTeamPoints.toLocaleString()} Total PTS</span>
            </div>
            <p className="draft-explainer">
              Draft upcoming bestsellers, award winners, and indie breakouts. Earn points when your drafted books chart on NYT, hit Goodreads records, and get streamed.
            </p>

            <button
              type="button"
              className="btn-draft-pick"
              onClick={handleDraftNewPick}
            >
              <Plus size={14} />
              <span>Draft Next Book Pick</span>
            </button>
          </div>
        </div>

        {/* Active Draft Roster */}
        <div className="draft-roster-list">
          <h4>Active Starting Lineup ({league.roster.length} Books)</h4>
          {league.roster.map(book => (
            <div key={book.id} className="roster-card">
              <div className="roster-left">
                <Star size={20} color="#ffd700" />
                <div className="roster-info">
                  <strong>{book.bookTitle}</strong>
                  <span className="roster-sub">by {book.author} • Goodreads: ⭐ {book.goodreadsRating} • Rank #{book.projectedSalesRank}</span>
                </div>
              </div>

              <div className="roster-right">
                <span className="fantasy-pts-badge">+{book.fantasyPoints} PTS</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="draft-modal-footer">
          <span className="footer-draft-note">
            📊 Points updated weekly via BookScan, Goodreads API & ReadaBook Stream viewership metrics.
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
