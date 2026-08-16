import React, { useState } from 'react';
import { X, Crown, Gift, Sparkles, Trophy } from 'lucide-react';
import {
  MOCK_SUB_GIFTERS_MONTHLY,
  MOCK_SUB_GIFTERS_ALL_TIME,
  type SubGifterEntry
} from '../lib/subGiftLeaderboardData';
import { soundFX } from '../lib/soundFx';

interface SubGiftLeaderboardModalProps {
  streamerName: string;
  onClose: () => void;
}

export const SubGiftLeaderboardModal: React.FC<SubGiftLeaderboardModalProps> = ({
  streamerName,
  onClose
}) => {
  const [tab, setTab] = useState<'MONTHLY' | 'ALL_TIME'>('MONTHLY');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const gifters: SubGifterEntry[] = tab === 'MONTHLY' ? MOCK_SUB_GIFTERS_MONTHLY : MOCK_SUB_GIFTERS_ALL_TIME;

  const handleGiftBatch = (count: number) => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    setToastMsg(`🎁 You gifted ${count} Community Book Passes to @${streamerName}'s readers! Your gift crown has been upgraded!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="subgift-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="subgift-modal-header">
          <div className="subgift-title-group">
            <div className="subgift-badge">
              <Crown size={16} />
              <span>GRAND PATRON SUB GIFTING LEADERBOARD</span>
            </div>
            <h3>@{streamerName}'s Community Benefactors</h3>
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

        {/* Tab Filters */}
        <div className="subgift-filter-tabs">
          <button
            type="button"
            className={`subgift-tab-btn ${tab === 'MONTHLY' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setTab('MONTHLY');
            }}
          >
            🗓️ Top Gifters This Month
          </button>
          <button
            type="button"
            className={`subgift-tab-btn ${tab === 'ALL_TIME' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setTab('ALL_TIME');
            }}
          >
            👑 All-Time Hall of Fame
          </button>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="subgift-podium-grid">
          {gifters.slice(0, 3).map((g) => (
            <div key={g.username} className={`podium-card rank-${g.rank}`}>
              <div className="podium-crown-wrap">
                <span className="podium-rank-pill">#{g.rank}</span>
                <span className="podium-crown-emoji">{g.badgeEmoji}</span>
              </div>
              <img src={g.avatarUrl} alt={g.username} className="podium-avatar" />
              <strong className="podium-username">{g.username}</strong>
              <span className="podium-subs-count">{g.subsGiftedCount} Passes Gifted</span>
              <span className="podium-title-tag">{g.badgeTitle}</span>
            </div>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="subgift-list-section">
          <label className="sec-label">FULL GIFTER ROSTER:</label>
          <div className="subgift-list-grid">
            {gifters.map(g => (
              <div key={g.username} className="subgift-row-card">
                <div className="subgift-row-left">
                  <span className="rank-num">#{g.rank}</span>
                  <img src={g.avatarUrl} alt={g.username} className="mini-avatar" />
                  <div>
                    <strong>{g.username}</strong>
                    <span className="subgift-badge-title">{g.badgeTitle}</span>
                  </div>
                </div>

                <div className="subgift-row-right">
                  <Gift size={14} color="#ffd700" />
                  <span><strong>{g.subsGiftedCount}</strong> Gifted</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instant Gift Sub Passes CTA */}
        <div className="instant-gift-box">
          <div className="gift-cta-text">
            <Trophy size={18} color="#ffd700" />
            <div>
              <h4>Join the Benefactor Leaderboard!</h4>
              <p>Gift Community Book Passes to active viewers in chat.</p>
            </div>
          </div>

          <div className="gift-buttons-row">
            <button
              type="button"
              className="btn-gift-batch"
              onClick={() => handleGiftBatch(5)}
            >
              🎁 Gift 5 Subs
            </button>
            <button
              type="button"
              className="btn-gift-batch"
              onClick={() => handleGiftBatch(20)}
            >
              👑 Gift 20 Subs
            </button>
            <button
              type="button"
              className="btn-gift-batch highlight-gold"
              onClick={() => handleGiftBatch(50)}
            >
              ⚡ Gift 50 Subs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
