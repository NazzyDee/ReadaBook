import React, { useState } from 'react';
import { X, Zap, Trophy, Users, Clock, Sparkles, CheckCircle2, Gift } from 'lucide-react';
import { DEFAULT_HYPE_TRAIN_DATA, type HypeTrainState } from '../lib/hypeTrainData';
import { soundFX } from '../lib/soundFx';

interface HypeTrainEngineModalProps {
  streamerName: string;
  onClose: () => void;
}

export const HypeTrainEngineModal: React.FC<HypeTrainEngineModalProps> = ({
  streamerName,
  onClose
}) => {
  const [train, setTrain] = useState<HypeTrainState>(DEFAULT_HYPE_TRAIN_DATA);
  const [boostToast, setBoostToast] = useState<string | null>(null);

  const percentCurrentLevel = Math.min(
    100,
    Math.round((train.currentPoints / train.targetPoints) * 100)
  );

  const handleBoostTrain = (points: number, label: string) => {
    soundFX.playChestClaim();
    soundFX.playThunder();

    const nextPoints = train.currentPoints + points;
    const isLevelUp = nextPoints >= train.targetPoints && train.currentLevel < 5;

    if (isLevelUp) {
      soundFX.playDragonRoar();
      soundFX.playApplause();
    }

    setTrain(prev => ({
      ...prev,
      currentPoints: isLevelUp ? nextPoints - prev.targetPoints : nextPoints,
      currentLevel: isLevelUp ? prev.currentLevel + 1 : prev.currentLevel,
      targetPoints: isLevelUp ? prev.targetPoints * 1.8 : prev.targetPoints,
      totalContributors: prev.totalContributors + 1,
      recentActions: [
        {
          user: 'You (Reader)',
          action: label,
          points,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        },
        ...prev.recentActions.slice(0, 4)
      ]
    }));

    setBoostToast(
      isLevelUp
        ? `🔥 HYPE TRAIN LEVELED UP TO LEVEL ${train.currentLevel + 1}!`
        : `⚡ +${points} Points contributed to @${streamerName}'s Hype Train!`
    );
    setTimeout(() => setBoostToast(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="hype-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="hype-modal-header">
          <div className="hype-title-group">
            <div className="hype-badge">
              <Zap size={16} />
              <span>THE LORE HYPE TRAIN 2.0</span>
            </div>
            <h3>@{streamerName}'s Live Guild Hype Train</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {boostToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{boostToast}</span>
          </div>
        )}

        {/* Hero Conductor HUD */}
        <div className="hype-conductor-card">
          <div className="conductor-top-row">
            <div className="level-badge-large">
              <span>LEVEL</span>
              <strong>{train.currentLevel}</strong>
            </div>

            <div className="conductor-center-info">
              <h4>🔥 Hype Train in Progress!</h4>
              <p>Contributors receive exclusive channel rune badges and emotes at each level.</p>
            </div>

            <div className="conductor-timer-box">
              <Clock size={16} color="#ffd700" />
              <span>{Math.floor(train.secondsRemaining / 60)}:{(train.secondsRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Progress Meter */}
          <div className="hype-meter-wrap">
            <div className="hype-meter-labels">
              <span>Level {train.currentLevel} Progress: <strong>{train.currentPoints.toLocaleString()}</strong> / {Math.round(train.targetPoints).toLocaleString()} pts</span>
              <span className="percent-tag">{percentCurrentLevel}%</span>
            </div>

            <div className="hype-meter-track">
              <div className="hype-meter-fill" style={{ width: `${percentCurrentLevel}%` }} />
            </div>
          </div>

          {/* Boost Actions */}
          <div className="hype-boost-actions">
            <span className="boost-label">Fuel the Train:</span>
            <div className="boost-buttons-row">
              <button
                type="button"
                className="btn-hype-boost"
                onClick={() => handleBoostTrain(100, 'Cheered 500 Sparks')}
              >
                <Sparkles size={13} color="#ffd700" />
                <span>+100 Pts (500 Sparks)</span>
              </button>
              <button
                type="button"
                className="btn-hype-boost highlight-gold"
                onClick={() => handleBoostTrain(500, 'Gifted 1 Tier 1 Sub')}
              >
                <Gift size={13} />
                <span>+500 Pts (Gift 1 Sub)</span>
              </button>
              <button
                type="button"
                className="btn-hype-boost highlight-purple"
                onClick={() => handleBoostTrain(2500, 'Gifted 5 Subs Bomb')}
              >
                <Zap size={13} />
                <span>+2500 Pts (5-Sub Bomb)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column: Reward Levels & Recent Contributors */}
        <div className="hype-dual-grid">
          {/* Level Rewards */}
          <div className="hype-levels-panel">
            <h4>
              <Trophy size={16} color="#ffd700" />
              <span>Level Unlocks & Rewards</span>
            </h4>

            <div className="levels-track-list">
              {train.levels.map(lvl => {
                const isCompleted = train.currentLevel > lvl.level;
                const isCurrent = train.currentLevel === lvl.level;
                return (
                  <div
                    key={lvl.level}
                    className={`level-track-row ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    <span className="level-emote-icon">{lvl.rewardEmoteIcon}</span>
                    <div className="level-track-info">
                      <div className="level-name-row">
                        <strong>Level {lvl.level}: {lvl.rewardTitle}</strong>
                        {isCompleted && <span className="unlocked-chip"><CheckCircle2 size={11} /> Unlocked</span>}
                        {isCurrent && <span className="active-chip">Active Level</span>}
                      </div>
                      <p>{lvl.rewardDescription}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Train Boosters */}
          <div className="hype-contributors-panel">
            <h4>
              <Users size={16} color="var(--accent-secondary)" />
              <span>Recent Contributors ({train.totalContributors})</span>
            </h4>

            <div className="contributors-list">
              {train.recentActions.map((act, idx) => (
                <div key={idx} className="contributor-row">
                  <img src={act.avatar} alt={act.user} className="contributor-avatar" />
                  <div className="contributor-info">
                    <strong>@{act.user}</strong>
                    <span>{act.action}</span>
                  </div>
                  <span className="points-pill">+{act.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
