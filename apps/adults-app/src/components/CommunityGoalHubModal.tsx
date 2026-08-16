import React, { useState } from 'react';
import { X, Target, Trophy, Sparkles, CheckCircle2, Lock, Plus, BookOpen, Gift } from 'lucide-react';
import { MOCK_COMMUNITY_GOALS, type CommunityReadingGoal } from '../lib/communityGoalData';
import { soundFX } from '../lib/soundFx';

interface CommunityGoalHubModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CommunityGoalHubModal: React.FC<CommunityGoalHubModalProps> = ({
  streamerName,
  onClose
}) => {
  const [goal, setGoal] = useState<CommunityReadingGoal>(MOCK_COMMUNITY_GOALS[0]);
  const [contributionToast, setContributionToast] = useState<string | null>(null);

  const percentComplete = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

  const handleContributePages = (pages: number) => {
    soundFX.playChestClaim();
    soundFX.playApplause();

    const nextVal = goal.currentValue + pages;
    const updatedMilestones = goal.milestones.map(m =>
      nextVal >= m.milestoneTarget ? { ...m, isUnlocked: true } : m
    );

    setGoal(prev => ({
      ...prev,
      currentValue: nextVal,
      milestones: updatedMilestones
    }));

    setContributionToast(`🎉 Contributed +${pages} pages to @${streamerName}'s Community Goal!`);
    setTimeout(() => setContributionToast(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="goal-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="goal-modal-header">
          <div className="goal-title-group">
            <div className="goal-badge">
              <Target size={16} />
              <span>COMMUNITY READING GOALS & STRETCH REWARDS</span>
            </div>
            <h3>@{streamerName}'s Community Reading Challenge</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {contributionToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{contributionToast}</span>
          </div>
        )}

        {/* Hero Goal Progress Card */}
        <div className="goal-hero-card">
          <div className="goal-hero-top">
            <div>
              <h4>{goal.title}</h4>
              <p className="goal-hero-desc">{goal.description}</p>
            </div>
            <span className="goal-deadline-pill">Deadline: {goal.deadline}</span>
          </div>

          <div className="goal-meter-wrap">
            <div className="goal-meter-labels">
              <span><strong>{goal.currentValue.toLocaleString()}</strong> / {goal.targetValue.toLocaleString()} {goal.unit}</span>
              <span className="percent-bold">{percentComplete}%</span>
            </div>

            <div className="goal-meter-track">
              <div className="goal-meter-fill" style={{ width: `${percentComplete}%` }} />
            </div>
          </div>

          {/* Quick Contribution Buttons */}
          <div className="goal-contribute-row">
            <span className="contribute-label">Log your reading to help unlock:</span>
            <div className="contribute-buttons">
              <button
                type="button"
                className="btn-quick-log"
                onClick={() => handleContributePages(25)}
              >
                <BookOpen size={13} />
                <span>+25 Pages</span>
              </button>
              <button
                type="button"
                className="btn-quick-log"
                onClick={() => handleContributePages(100)}
              >
                <Plus size={13} />
                <span>+100 Pages</span>
              </button>
              <button
                type="button"
                className="btn-quick-log highlight-gold"
                onClick={() => handleContributePages(500)}
              >
                <Gift size={13} />
                <span>+500 Marathon Boost</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stretch Milestones List */}
        <div className="milestones-section">
          <h4>
            <Trophy size={16} color="#ffd700" />
            <span>Stretch Reward Tiers</span>
          </h4>

          <div className="milestones-grid">
            {goal.milestones.map(m => (
              <div
                key={m.id}
                className={`milestone-tier-card ${m.isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="tier-header">
                  <div className="tier-title-row">
                    {m.isUnlocked ? (
                      <CheckCircle2 size={16} color="var(--accent-success)" />
                    ) : (
                      <Lock size={16} color="var(--text-muted)" />
                    )}
                    <strong>{m.rewardTitle}</strong>
                  </div>

                  <span className="tier-target-pill">
                    {m.milestoneTarget.toLocaleString()} Pages ({m.unlockedAtPercent}%)
                  </span>
                </div>

                <p className="tier-desc">{m.rewardDescription}</p>

                <div className="tier-status-chip">
                  {m.isUnlocked ? '✅ UNLOCKED' : '🔒 IN PROGRESS'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
