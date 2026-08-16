import React, { useState } from 'react';
import { X, Coffee, Sparkles, Clock, Play, CheckCircle2, Flame } from 'lucide-react';
import { AVAILABLE_AD_BREAKS, type AdBreakConfig } from '../lib/adBreakCountdownData';
import { soundFX } from '../lib/soundFx';

interface AdBreakCountdownModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AdBreakCountdownModal: React.FC<AdBreakCountdownModalProps> = ({
  streamerName,
  onClose
}) => {
  const [selectedBreak, setSelectedBreak] = useState<AdBreakConfig>(AVAILABLE_AD_BREAKS[1]);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(selectedBreak.durationSeconds);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleStartBreak = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setIsRunning(true);
    setSecondsLeft(selectedBreak.durationSeconds);
    setToastMsg(`☕ Launched ${selectedBreak.durationSeconds}s Cozy Intermission! Viewers earn +${selectedBreak.viewerSparksReward} Sparks.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCancelBreak = () => {
    soundFX.playPop();
    setIsRunning(false);
    setToastMsg('⏹️ Intermission break ended early. Stream resumed live.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="ad-break-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ad-break-modal-header">
          <div className="ad-break-title-group">
            <div className="ad-break-badge">
              <Coffee size={16} />
              <span>COZY INTERMISSION & AD-REVENUE DECK</span>
            </div>
            <h3>@{streamerName}'s Broadcast Intermission Deck</h3>
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

        {/* Active Intermission Monitor Screen */}
        <div className="intermission-screen-card">
          <div className="cozy-hearth-visual">
            <span className="hearth-emoji">{isRunning ? '☕🔥🫖' : '🛋️✨'}</span>
            <div className="countdown-badge">
              <Clock size={16} color="#ffd700" />
              <strong>{isRunning ? `${secondsLeft}s Remaining` : 'Ready to Launch'}</strong>
            </div>
          </div>

          <div className="screen-details">
            <h4>{isRunning ? 'Cozy Hearth Intermission in Progress' : 'Schedule Mid-Roll Intermission'}</h4>
            <p>
              Subscribers receive seamless Picture-in-Picture audio playback. Non-subscribers enjoy cozy publisher trailers and earn bonus Sparks.
            </p>

            <div className="intermission-payout-box">
              <div className="payout-col">
                <span>CREATOR REVENUE:</span>
                <strong>+{selectedBreak.payoutSparksEstimated} Sparks</strong>
              </div>
              <div className="payout-col">
                <span>VIEWER BONUS:</span>
                <strong>+{selectedBreak.viewerSparksReward} Sparks / Reader</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Break Duration Selector Grid */}
        <div className="break-durations-grid">
          {AVAILABLE_AD_BREAKS.map(b => {
            const isSelected = selectedBreak.durationSeconds === b.durationSeconds;
            return (
              <div
                key={b.durationSeconds}
                className={`break-duration-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (!isRunning) {
                    soundFX.playPop();
                    setSelectedBreak(b);
                    setSecondsLeft(b.durationSeconds);
                  }
                }}
              >
                <div className="card-top">
                  <strong>{b.durationSeconds}s</strong>
                  <Flame size={14} color="#ffd700" />
                </div>
                <p>{b.label}</p>
                <span className="payout-pill">+{b.payoutSparksEstimated} Sparks</span>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="ad-break-actions-bar">
          {isRunning ? (
            <button
              type="button"
              className="btn-danger btn-cancel-break"
              onClick={handleCancelBreak}
            >
              <span>End Intermission Now</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary btn-start-break"
              onClick={handleStartBreak}
            >
              <Play size={16} />
              <span>Start {selectedBreak.durationSeconds}s Cozy Break</span>
            </button>
          )}

          <button
            type="button"
            className="btn-secondary"
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
