import React, { useState, useEffect } from 'react';
import { Flame, Clock, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface HypeTrainProps {
  isActive: boolean;
  onClose?: () => void;
}

export const HypeTrainBanner: React.FC<HypeTrainProps> = ({ isActive, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [level, setLevel] = useState(2);
  const [progress, setProgress] = useState(68); // 68% of Level 2
  const [timeLeft, setTimeLeft] = useState(245); // seconds
  const [conductors] = useState<{
    topCheerer: { name: string; amount: number; avatar: string };
    topSubber: { name: string; amount: number; avatar: string };
  }>({
    topCheerer: {
      name: 'ElessarReader',
      amount: 2500,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
    },
    topSubber: {
      name: 'BibliophileKing',
      amount: 10,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
    }
  });

  const [unlockedEmotes] = useState([
    { code: 'HypeDragon', icon: '🐲' },
    { code: 'GoldenTome', icon: '📖' },
    { code: 'DiamondScroll', icon: '📜' }
  ]);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const handleBoost = () => {
    soundFX.playCheer();
    setProgress(prev => {
      const next = prev + 15;
      if (next >= 100) {
        setLevel(l => Math.min(5, l + 1));
        return next - 100;
      }
      return next;
    });
  };

  if (!isActive || timeLeft <= 0) return null;

  return (
    <div className={`hype-train-container ${collapsed ? 'is-collapsed' : ''}`}>
      {/* Header */}
      <div className="hype-train-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="hype-train-title-row">
          <div className="hype-train-badge">
            <Flame size={14} className="flame-pulse" />
            <span>HYPE TRAIN LVL {level}</span>
          </div>
          <span className="hype-train-percent">{progress}%</span>
        </div>

        <div className="hype-train-header-right">
          <div className="hype-timer">
            <Clock size={12} />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>

          <button className="btn-hype-toggle" title="Toggle">
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="btn-hype-close"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="hype-progress-track">
        <div
          className="hype-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Expanded Details */}
      {!collapsed && (
        <div className="hype-train-body">
          <div className="hype-conductors-row">
            <div className="conductor-card">
              <div className="conductor-badge">👑 Conductor</div>
              <div className="conductor-user">
                <img src={conductors.topCheerer.avatar} alt="" />
                <span>{conductors.topCheerer.name}</span>
              </div>
              <span className="conductor-stat">{conductors.topCheerer.amount.toLocaleString()} Sparks</span>
            </div>

            <div className="conductor-card">
              <div className="conductor-badge">🎁 Top Gifter</div>
              <div className="conductor-user">
                <img src={conductors.topSubber.avatar} alt="" />
                <span>{conductors.topSubber.name}</span>
              </div>
              <span className="conductor-stat">{conductors.topSubber.amount} Subs</span>
            </div>
          </div>

          <div className="hype-rewards-preview">
            <span className="rewards-label">Level {level} Emote Unlocks for All Chatters:</span>
            <div className="hype-emotes-list">
              {unlockedEmotes.slice(0, level).map(e => (
                <span key={e.code} className="hype-reward-chip" title={e.code}>
                  <span className="reward-emoji">{e.icon}</span>
                  <span className="reward-name">{e.code}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="hype-actions-bar">
            <button onClick={handleBoost} className="btn-hype-boost">
              <Sparkles size={14} />
              <span>Boost Hype Train</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
