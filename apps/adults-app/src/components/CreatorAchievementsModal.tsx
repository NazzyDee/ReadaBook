import React, { useState } from 'react';
import { X, Trophy, Sparkles, CheckCircle2, Lock, Gift } from 'lucide-react';
import { MOCK_CREATOR_ACHIEVEMENTS, type CreatorAchievement } from '../lib/creatorAchievementsData';
import { soundFX } from '../lib/soundFx';

interface CreatorAchievementsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CreatorAchievementsModal: React.FC<CreatorAchievementsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [achievements] = useState<CreatorAchievement[]>(MOCK_CREATOR_ACHIEVEMENTS);
  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filtered = achievements.filter(
    a => filterCat === 'ALL' || a.category === filterCat
  );

  const handleClaimReward = (ach: CreatorAchievement) => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    setToastMsg(`🎉 Claimed reward: "${ach.rewardText}"!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="achieve-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="achieve-modal-header">
          <div className="achieve-title-group">
            <div className="achieve-badge">
              <Trophy size={16} />
              <span>BROADCASTER QUESTS & CREATOR ACHIEVEMENTS</span>
            </div>
            <h3>@{streamerName}'s Storyteller Progression Tree</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Summary Card */}
        <div className="achieve-overview-banner">
          <div className="overview-left">
            <Trophy size={36} color="#ffd700" />
            <div>
              <h4>Path to Master Storyteller</h4>
              <p>Complete milestones to unlock custom animated emotes, subscriber perks, and higher revenue splits.</p>
            </div>
          </div>

          <div className="overview-right">
            <span className="unlocked-pill">{unlockedCount} / {achievements.length} Unlocked</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="achieve-filter-tabs">
          {['ALL', 'Broadcasting', 'Literary Mastery', 'Community', 'Revenue'].map(cat => (
            <button
              key={cat}
              type="button"
              className={`achieve-tab-btn ${filterCat === cat ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setFilterCat(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="achievements-grid">
          {filtered.map(ach => {
            const pct = Math.min(100, Math.round((ach.currentProgress / ach.targetProgress) * 100));
            return (
              <div key={ach.id} className={`achieve-card ${ach.isUnlocked ? 'unlocked' : ''}`}>
                <div className="achieve-card-top">
                  <span className="achieve-icon">{ach.icon}</span>
                  <div className="achieve-title-wrap">
                    <span className="achieve-cat-tag">{ach.category}</span>
                    <h4>{ach.title}</h4>
                  </div>
                  {ach.isUnlocked ? (
                    <CheckCircle2 size={18} color="var(--accent-success)" />
                  ) : (
                    <Lock size={16} color="var(--text-muted)" />
                  )}
                </div>

                <p className="achieve-desc">{ach.description}</p>

                {/* Progress Bar */}
                <div className="achieve-progress-box">
                  <div className="progress-labels">
                    <span>Progress</span>
                    <strong>{ach.currentProgress} / {ach.targetProgress} {ach.unit} ({pct}%)</strong>
                  </div>
                  <div className="achieve-progress-bar-bg">
                    <div className="achieve-progress-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>

                {/* Reward Banner */}
                <div className="achieve-reward-row">
                  <div className="reward-text-group">
                    <Gift size={13} color="#ffd700" />
                    <span>Reward: <strong>{ach.rewardText}</strong></span>
                  </div>

                  {ach.isUnlocked && (
                    <button
                      type="button"
                      className="btn-claim-reward"
                      onClick={() => handleClaimReward(ach)}
                    >
                      <span>Claim</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
