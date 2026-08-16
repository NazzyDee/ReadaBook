import React, { useState } from 'react';
import {
  X,
  Trophy,
  Crown,
  Zap,
  Gift,
  BookOpen
} from 'lucide-react';
import { HALL_OF_FAME_RECORDS, type HallOfFameRecord } from '../lib/hallOfFameData';
import { soundFX } from '../lib/soundFx';

interface HallOfFameModalProps {
  onClose: () => void;
}

export const HallOfFameModal: React.FC<HallOfFameModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'marathon' | 'trivia' | 'patron'>('marathon');

  const records: HallOfFameRecord[] = HALL_OF_FAME_RECORDS[activeTab] || HALL_OF_FAME_RECORDS.marathon;
  const rank1 = records.find(r => r.rank === 1);
  const rank2 = records.find(r => r.rank === 2);
  const rank3 = records.find(r => r.rank === 3);

  const handleTabChange = (tab: 'marathon' | 'trivia' | 'patron') => {
    soundFX.playPop();
    setActiveTab(tab);
  };

  return (
    <div className="modal-backdrop">
      <div className="hall-fame-modal-card">
        {/* Header */}
        <div className="hall-fame-header">
          <div className="hall-fame-title-group">
            <Trophy size={24} color="#ffd700" className="pulse-fast" />
            <div>
              <h3>🏆 ReadaBook Global Hall of Fame</h3>
              <span className="modal-subtitle">All-Time Platform Records, Grand Sprinters & Trivia Champions</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="hall-fame-tabs-row">
          <button
            type="button"
            onClick={() => handleTabChange('marathon')}
            className={`hall-tab-btn ${activeTab === 'marathon' ? 'active' : ''}`}
          >
            <BookOpen size={14} />
            <span>📖 Reading Marathoners</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('trivia')}
            className={`hall-tab-btn ${activeTab === 'trivia' ? 'active' : ''}`}
          >
            <Zap size={14} />
            <span>👑 Trivia Lore Gods</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('patron')}
            className={`hall-tab-btn ${activeTab === 'patron' ? 'active' : ''}`}
          >
            <Gift size={14} />
            <span>🎁 Literary Patrons</span>
          </button>
        </div>

        {/* Olympic Victory Podium */}
        <div className="fame-podium-container">
          {/* Silver Rank 2 */}
          {rank2 && (
            <div className="podium-pillar rank-2">
              <div className="podium-avatar-box">
                <img src={rank2.avatarUrl} alt="" className="podium-avatar silver" />
                <span className="podium-crown-badge">🥈</span>
              </div>
              <strong className="podium-user">{rank2.username}</strong>
              <span className="podium-metric">{rank2.metricValue}</span>
              <div className="podium-block step-2">
                <span>#2</span>
              </div>
            </div>
          )}

          {/* Gold Rank 1 (Center & Taller) */}
          {rank1 && (
            <div className="podium-pillar rank-1">
              <div className="podium-avatar-box">
                <Crown size={24} color="#ffd700" className="gold-crown-icon pulse-fast" />
                <img src={rank1.avatarUrl} alt="" className="podium-avatar gold" />
                <span className="podium-crown-badge">🥇</span>
              </div>
              <strong className="podium-user gold-name">{rank1.username}</strong>
              <span className="podium-metric gold-metric">{rank1.metricValue}</span>
              <div className="podium-block step-1">
                <span>#1 CHAMPION</span>
              </div>
            </div>
          )}

          {/* Bronze Rank 3 */}
          {rank3 && (
            <div className="podium-pillar rank-3">
              <div className="podium-avatar-box">
                <img src={rank3.avatarUrl} alt="" className="podium-avatar bronze" />
                <span className="podium-crown-badge">🥉</span>
              </div>
              <strong className="podium-user">{rank3.username}</strong>
              <span className="podium-metric">{rank3.metricValue}</span>
              <div className="podium-block step-3">
                <span>#3</span>
              </div>
            </div>
          )}
        </div>

        {/* Full Leaderboard List */}
        <div className="fame-records-list">
          {records.map(rec => (
            <div key={rec.rank} className={`fame-record-row ${rec.rank === 1 ? 'rank-gold-row' : ''}`}>
              <div className="fame-rank-num">#{rec.rank}</div>
              <img src={rec.avatarUrl} alt="" className="fame-row-avatar" />
              <div className="fame-row-user-info">
                <strong className="fame-row-username">{rec.username}</strong>
                <span className="fame-row-season">{rec.seasonTitle}</span>
              </div>
              <span className="fame-badge-chip">{rec.badge}</span>
              <div className="fame-metric-box">
                <strong>{rec.metricValue}</strong>
                <span>{rec.metricLabel}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Close Hall of Fame
          </button>
        </div>
      </div>
    </div>
  );
};
