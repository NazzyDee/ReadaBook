import React, { useState } from 'react';
import { X, Trophy, Crown, BookOpen, Gift, Award, Sparkles } from 'lucide-react';
import { MOCK_LEADERBOARDS_DATA, type LeaderboardEntry } from '../lib/leaderboardsData';
import { soundFX } from '../lib/soundFx';

interface StreamLeaderboardsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const StreamLeaderboardsModal: React.FC<StreamLeaderboardsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'patrons' | 'sprints' | 'finishers'>('patrons');

  const getEntries = (): LeaderboardEntry[] => {
    if (activeTab === 'patrons') return MOCK_LEADERBOARDS_DATA.topPatrons;
    if (activeTab === 'sprints') return MOCK_LEADERBOARDS_DATA.topSprintReaders;
    return MOCK_LEADERBOARDS_DATA.hallOfFameFinishers;
  };

  const entries = getEntries();
  const top1 = entries.find(e => e.rank === 1);
  const top2 = entries.find(e => e.rank === 2);
  const top3 = entries.find(e => e.rank === 3);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="leaderboards-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="leaderboards-modal-header">
          <div className="leaderboards-title-group">
            <div className="leaderboards-badge">
              <Trophy size={16} />
              <span>CHANNEL PATRON & READING LEADERBOARDS</span>
            </div>
            <h3>@{streamerName}'s Community Hall of Fame</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="leaderboards-tabs">
          <button
            className={`lead-tab-btn ${activeTab === 'patrons' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setActiveTab('patrons');
            }}
          >
            <Gift size={14} />
            <span>Top Book Patrons</span>
          </button>

          <button
            className={`lead-tab-btn ${activeTab === 'sprints' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setActiveTab('sprints');
            }}
          >
            <BookOpen size={14} />
            <span>Top Sprint Readers</span>
          </button>

          <button
            className={`lead-tab-btn ${activeTab === 'finishers' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setActiveTab('finishers');
            }}
          >
            <Award size={14} />
            <span>First to Finish</span>
          </button>
        </div>

        {/* 3-Step Podium (Rank 2, Rank 1, Rank 3) */}
        <div className="podium-section">
          {/* Rank 2 */}
          {top2 && (
            <div className="podium-column rank-2">
              <span className="podium-rank-icon">🥈</span>
              <img src={top2.avatarUrl} alt={top2.username} className="podium-avatar" />
              <strong>@{top2.username}</strong>
              <span className="podium-metric">{top2.metricValue}</span>
              <div className="podium-pedestal p2">
                <span>2ND</span>
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {top1 && (
            <div className="podium-column rank-1">
              <Crown size={28} color="#ffd700" className="podium-crown-gold" />
              <img src={top1.avatarUrl} alt={top1.username} className="podium-avatar champ" />
              <strong>@{top1.username}</strong>
              <span className="podium-metric gold">{top1.metricValue}</span>
              <div className="podium-pedestal p1">
                <span>1ST PLACE</span>
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {top3 && (
            <div className="podium-column rank-3">
              <span className="podium-rank-icon">🥉</span>
              <img src={top3.avatarUrl} alt={top3.username} className="podium-avatar" />
              <strong>@{top3.username}</strong>
              <span className="podium-metric">{top3.metricValue}</span>
              <div className="podium-pedestal p3">
                <span>3RD</span>
              </div>
            </div>
          )}
        </div>

        {/* Full Rankings Table */}
        <div className="rankings-table-panel">
          <h4>
            <Sparkles size={15} color="#ffd700" />
            <span>Full Leaderboard Standings</span>
          </h4>

          <div className="rankings-list">
            {entries.map(entry => (
              <div key={entry.rank} className="ranking-row">
                <span className="rank-num">#{entry.rank}</span>
                <img src={entry.avatarUrl} alt={entry.username} className="rank-user-avatar" />

                <div className="rank-user-info">
                  <strong>@{entry.username}</strong>
                  <span className="rank-badge-tag">{entry.badge}</span>
                </div>

                <div className="rank-metric-val">
                  <strong>{entry.metricValue}</strong>
                  <span>{entry.metricLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
