import React, { useState } from 'react';
import { X, Flame, Sparkles, Calendar, CheckCircle2, Target } from 'lucide-react';
import { MOCK_READING_HABITS, type ReadingHabitsProfile } from '../lib/readingHabitsData';
import { soundFX } from '../lib/soundFx';

interface ReadingHabitsHubModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ReadingHabitsHubModal: React.FC<ReadingHabitsHubModalProps> = ({
  streamerName,
  onClose
}) => {
  const [habits, setHabits] = useState<ReadingHabitsProfile>(MOCK_READING_HABITS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleLogMinutes = () => {
    soundFX.playPop();
    const newMins = habits.todayMinutesRead + 15;
    setHabits(prev => ({
      ...prev,
      todayMinutesRead: newMins
    }));
    soundFX.playChestClaim();
    setToastMsg(`📖 Logged +15 minutes! Today's reading: ${newMins} mins.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleClaimStreakBadge = (title: string) => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    setToastMsg(`🔥 Claimed Streak Badge: "${title}"! Displayed in live chat.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const todayGoalMet = habits.todayMinutesRead >= habits.dailyGoalMinutes;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="habits-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="habits-modal-header">
          <div className="habits-title-group">
            <div className="habits-badge">
              <Flame size={16} />
              <span>COMMUNITY READING HABITS & DAILY STREAK HUB</span>
            </div>
            <h3>@{streamerName}'s Guild Habit & Streak Tracker</h3>
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

        {/* Streak & Today's Goal Row */}
        <div className="habits-top-stats-grid">
          {/* Flame Streak Banner */}
          <div className="streak-flame-card">
            <div className="flame-big-icon pulse-anim">🔥</div>
            <div className="streak-info">
              <span className="streak-pill">ACTIVE READING STREAK</span>
              <h4>{habits.currentStreakDays} Days in a Row!</h4>
              <p>Longest Record: {habits.longestStreakDays} Days • Top 5% of Readers</p>
            </div>
          </div>

          {/* Today Goal Card */}
          <div className="today-goal-card">
            <div className="goal-top-row">
              <Target size={18} color={todayGoalMet ? 'var(--accent-success)' : 'var(--accent-primary)'} />
              <span>TODAY'S DAILY GOAL</span>
            </div>

            <div className="goal-mins-text">
              <strong>{habits.todayMinutesRead}</strong> / {habits.dailyGoalMinutes} mins
            </div>

            <span className={`goal-status-tag ${todayGoalMet ? 'achieved' : ''}`}>
              {todayGoalMet ? '✓ Daily Target Met!' : `${habits.dailyGoalMinutes - habits.todayMinutesRead}m left to keep streak`}
            </span>
          </div>
        </div>

        {/* Weekly Contribution Heatmap */}
        <div className="habits-heatmap-section">
          <div className="heatmap-header">
            <Calendar size={15} color="var(--accent-teal)" />
            <h4>Weekly Reading Activity Heatmap</h4>
            <span className="monthly-rate">{habits.monthlyCompletionRatePercent}% Monthly Consistency</span>
          </div>

          <div className="heatmap-days-grid">
            {habits.weeklyHeatmap.map(d => (
              <div key={d.dayName} className={`heatmap-day-cell ${d.isCompleted ? 'active' : 'incomplete'}`}>
                <span className="day-name">{d.dayName}</span>
                <span className="day-mins">{d.minutes}m</span>
                {d.isCompleted && <CheckCircle2 size={12} color="#00ff88" />}
              </div>
            ))}
          </div>
        </div>

        {/* Streak Rewards */}
        <div className="streak-rewards-section">
          <label className="sec-label">STREAK MILESTONE BADGES:</label>
          <div className="streak-rewards-grid">
            {habits.streakRewardsUnlocked.map(rew => (
              <div key={rew.title} className={`streak-rew-card ${rew.isUnlocked ? 'unlocked' : 'locked'}`}>
                <span className="rew-badge-emoji">{rew.badgeIcon}</span>
                <div className="rew-info">
                  <strong>{rew.title}</strong>
                  <span>{rew.streakDaysRequired} Day Streak</span>
                </div>
                {rew.isUnlocked ? (
                  <button
                    type="button"
                    className="btn-claim-streak-badge"
                    onClick={() => handleClaimStreakBadge(rew.title)}
                  >
                    Claim
                  </button>
                ) : (
                  <span className="locked-pill">Locked</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="habits-modal-footer">
          <button type="button" className="btn-primary btn-log-reading" onClick={handleLogMinutes}>
            <Sparkles size={15} />
            <span>Log Reading Session (+15 Mins)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
