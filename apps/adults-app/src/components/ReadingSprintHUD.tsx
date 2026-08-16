import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  Plus,
  Sliders,
  BookOpen
} from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface ReadingSprintHUDProps {
  isBroadcaster?: boolean;
  onOpenAmbientMixer?: () => void;
  onSprintCompleted: (pagesTarget: number) => void;
}

export const ReadingSprintHUD: React.FC<ReadingSprintHUDProps> = ({
  isBroadcaster = false,
  onOpenAmbientMixer,
  onSprintCompleted
}) => {
  const [totalDurationSecs, setTotalDurationSecs] = useState(25 * 60); // 25 min default
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [targetPages] = useState(15);
  const [isBreak] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          soundFX.playChestClaim();
          onSprintCompleted(targetPages);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, targetPages]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(
    0,
    Math.min(100, ((totalDurationSecs - secondsRemaining) / totalDurationSecs) * 100)
  );

  const handleTogglePlay = () => {
    soundFX.playPop();
    setIsRunning(!isRunning);
  };

  const handleAddFiveMin = () => {
    soundFX.playPop();
    setSecondsRemaining(prev => prev + 300);
    setTotalDurationSecs(prev => prev + 300);
  };

  return (
    <div className="reading-sprint-hud-bar">
      {/* Sprint Info & Type */}
      <div className="sprint-status-group">
        <span className={`sprint-pulse-dot ${isRunning ? 'active' : 'paused'}`}></span>
        <div className="sprint-title-box">
          <span className="sprint-label">
            {isBreak ? '☕ COMMUNITY BREAK' : '📖 SILENT READING SPRINT'}
          </span>
          <div className="sprint-time-row">
            <Clock size={14} color={isBreak ? '#ffd700' : '#00ff88'} />
            <strong className="sprint-digits">{formatTime(secondsRemaining)}</strong>
          </div>
        </div>
      </div>

      {/* Target Goal Pill */}
      <div className="sprint-target-pill">
        <BookOpen size={13} color="var(--accent-secondary)" />
        <span>Target: <strong>{targetPages} Pages</strong></span>
      </div>

      {/* Mini Progress Track */}
      <div className="sprint-progress-wrapper">
        <div className="sprint-progress-bar">
          <div className="sprint-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Action Controls */}
      <div className="sprint-actions-group">
        {onOpenAmbientMixer && (
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              onOpenAmbientMixer();
            }}
            className="btn-sprint-ambient"
            title="Open Lo-Fi Ambient Sound Mixer"
          >
            <Sliders size={13} />
            <span>Lo-Fi Mixer</span>
          </button>
        )}

        {isBroadcaster && (
          <>
            <button
              type="button"
              onClick={handleTogglePlay}
              className="btn-sprint-ctrl"
              title={isRunning ? 'Pause Sprint' : 'Resume Sprint'}
            >
              {isRunning ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button
              type="button"
              onClick={handleAddFiveMin}
              className="btn-sprint-ctrl"
              title="Add 5 minutes to sprint"
            >
              <Plus size={13} /> +5m
            </button>
          </>
        )}
      </div>
    </div>
  );
};
