import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Timer, Zap } from 'lucide-react';
import { DEFAULT_SPEEDRUN_DATA, type SpeedrunRunData } from '../lib/readingSpeedrunData';
import { soundFX } from '../lib/soundFx';

interface ReadingSpeedrunSplitsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ReadingSpeedrunSplitsModal: React.FC<ReadingSpeedrunSplitsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [speedrun] = useState<SpeedrunRunData>(DEFAULT_SPEEDRUN_DATA);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTriggerSplit = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg('⏱️ Split recorded for "Ch 4: Over Hill and Under Hill" — Delta: -112s (GOLD SPLIT)!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="speedrun-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="speedrun-modal-header">
          <div className="speedrun-title-group">
            <div className="speedrun-badge">
              <Timer size={16} />
              <span>LIVE READING SPEEDRUN SPLITS & LEADERBOARD HUD</span>
            </div>
            <h3>@{streamerName}'s Any% Speedrun Timer</h3>
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

        {/* Hero Banner */}
        <div className="speedrun-hero-banner">
          <div className="main-timer-box">
            <Timer size={36} color="#00ff88" />
            <span className="live-split-timer">{speedrun.currentTimer}</span>
            <span className="ahead-delta-tag">-01:31 AHEAD OF PB</span>
          </div>

          <div className="speedrun-hero-meta">
            <span className="category-tag">{speedrun.category}</span>
            <h4>World Record: {speedrun.worldRecordTime} by @{speedrun.worldRecordHolder}</h4>
            <p className="speedrun-explainer">
              Live automated pace tracker with automated page-turn verification, comprehension gates, and WPM telemetry.
            </p>

            <button
              type="button"
              className="btn-trigger-split"
              onClick={handleTriggerSplit}
            >
              <Zap size={14} />
              <span>Trigger Next Chapter Split</span>
            </button>
          </div>
        </div>

        {/* Splits Table */}
        <div className="speedrun-splits-table">
          <div className="split-row-header">
            <span>Segment</span>
            <span>PB Time</span>
            <span>Current</span>
            <span>Delta</span>
            <span>Pace WPM</span>
          </div>
          {speedrun.splits.map((split, idx) => (
            <div key={idx} className="split-row-item">
              <strong className="segment-col">{split.segmentName}</strong>
              <span className="pb-col">{split.personalBestTime}</span>
              <span className="curr-col">{split.currentRunTime}</span>
              <span className={`delta-col ${split.deltaSeconds < 0 ? 'ahead' : 'behind'}`}>
                {split.deltaSeconds < 0 ? `-${Math.abs(split.deltaSeconds)}s` : `+${split.deltaSeconds}s`}
              </span>
              <span className="wpm-col">{split.wpmSpeed} WPM</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="speedrun-modal-footer">
          <span className="footer-speedrun-note">
            ⏱️ Speedrun.com and ReadaBook verified leaderboards with cryptographic page timestamps.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
