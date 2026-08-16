import React, { useState } from 'react';
import { Users, Star, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export interface CommunityGoal {
  id: string;
  type: 'subs' | 'followers' | 'sparks';
  title: string;
  current: number;
  target: number;
  unlockedReward: string;
}

interface CommunityGoalWidgetProps {
  goal?: CommunityGoal;
}

export const CommunityGoalWidget: React.FC<CommunityGoalWidgetProps> = ({
  goal = {
    id: 'goal_marathon',
    type: 'subs',
    title: 'Unlock 24-Hour Weekend Table Read Marathon ☕📖',
    current: 168,
    target: 200,
    unlockedReward: 'Full-cast voice acted read of The Hobbit!'
  }
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const isFinished = pct >= 100;

  return (
    <div className="community-goal-widget">
      <div className="goal-widget-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="goal-title-group">
          <div className="goal-icon-disc">
            {goal.type === 'subs' && <Star size={14} color="#ffd700" fill="#ffd700" />}
            {goal.type === 'followers' && <Users size={14} color="#00e5ff" />}
            {goal.type === 'sparks' && <Sparkles size={14} color="#9146ff" fill="#9146ff" />}
          </div>
          <div className="goal-labels">
            <span className="goal-type-tag">
              {goal.type === 'subs' && 'COMMUNITY SUB GOAL'}
              {goal.type === 'followers' && 'FOLLOWER MILESTONE'}
              {goal.type === 'sparks' && 'COMMUNITY SPARKS GOAL'}
            </span>
            <span className="goal-main-title">{goal.title}</span>
          </div>
        </div>

        <div className="goal-widget-right">
          <div className="goal-numbers">
            <strong>{goal.current}</strong> / {goal.target} ({pct}%)
          </div>
          <button className="btn-toggle-goal">
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      <div className="goal-progress-bar-track">
        <div
          className={`goal-progress-fill ${isFinished ? 'goal-completed' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {!collapsed && (
        <div className="goal-expanded-body">
          <p className="goal-reward-text">
            🎯 Milestone Reward: <strong>{goal.unlockedReward}</strong>
          </p>
          <span className="goal-remaining-subtext">
            {goal.target - goal.current} more {goal.type} needed to reach goal!
          </span>
        </div>
      )}
    </div>
  );
};
