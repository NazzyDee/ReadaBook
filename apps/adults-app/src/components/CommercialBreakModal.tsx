import React, { useState, useEffect } from 'react';
import { X, Coffee, Clock, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { INTERMISSION_DURATION_OPTIONS, MOCK_PUBLISHER_SPONSORS, type IntermissionDurationOption } from '../lib/commercialData';
import { soundFX } from '../lib/soundFx';

interface CommercialBreakModalProps {
  streamerName: string;
  onClose: () => void;
  onRunBreak?: (seconds: number) => void;
}

export const CommercialBreakModal: React.FC<CommercialBreakModalProps> = ({
  streamerName,
  onClose,
  onRunBreak
}) => {
  const [selectedDuration, setSelectedDuration] = useState<IntermissionDurationOption>(INTERMISSION_DURATION_OPTIONS[1]);
  const [countdownRemaining, setCountdownRemaining] = useState<number | null>(null);
  const [breakToast, setBreakToast] = useState<string | null>(null);

  useEffect(() => {
    if (countdownRemaining === null || countdownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCountdownRemaining(prev => (prev && prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownRemaining]);

  const handleStartIntermission = () => {
    soundFX.playChestClaim();
    soundFX.playPageRustle();
    setCountdownRemaining(selectedDuration.seconds);

    if (onRunBreak) {
      onRunBreak(selectedDuration.seconds);
    }

    setBreakToast(`☕ Intermission started for ${selectedDuration.seconds}s! Pre-rolls snoozed for ${selectedDuration.preRollSnoozeMins} mins.`);
  };

  const handleCancelBreak = () => {
    soundFX.playPop();
    setCountdownRemaining(null);
    setBreakToast('Intermission cancelled early.');
    setTimeout(() => setBreakToast(null), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="intermission-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="intermission-modal-header">
          <div className="intermission-title-group">
            <div className="intermission-badge">
              <Coffee size={16} />
              <span>CHAPTER INTERMISSION & TEA BREAK MANAGER</span>
            </div>
            <h3>Broadcast Intermission Control</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {breakToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{breakToast}</span>
          </div>
        )}

        {/* Active Intermission HUD */}
        {countdownRemaining !== null && countdownRemaining > 0 ? (
          <div className="active-intermission-hud">
            <div className="intermission-coffee-icon">
              <Coffee size={36} color="#ffd700" className="steam-icon-anim" />
            </div>

            <div className="intermission-status-text">
              <h4>☕ Intermission in Progress...</h4>
              <p>Chat has been notified: <em>“@{streamerName} is refilling tea — Back shortly!”</em></p>
            </div>

            <div className="intermission-timer-display">
              <span>{Math.floor(countdownRemaining / 60)}:{(countdownRemaining % 60).toString().padStart(2, '0')}</span>
            </div>

            <button
              type="button"
              className="btn-secondary btn-cancel-break"
              onClick={handleCancelBreak}
            >
              Resume Broadcast Now
            </button>
          </div>
        ) : (
          <>
            <p className="intermission-intro-text">
              Take a comfortable break while keeping viewers engaged with cozy lo-fi hearth visuals and official publisher book promos. Running an intermission also disables pre-roll ads for incoming viewers!
            </p>

            {/* Duration Selector Grid */}
            <div className="duration-options-grid">
              {INTERMISSION_DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.seconds}
                  type="button"
                  className={`duration-opt-card ${selectedDuration.seconds === opt.seconds ? 'active' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedDuration(opt);
                  }}
                >
                  <Clock size={18} color={selectedDuration.seconds === opt.seconds ? '#ffd700' : 'var(--text-muted)'} />
                  <div className="opt-meta">
                    <strong>{opt.label}</strong>
                    <span>Snoozes pre-rolls for {opt.preRollSnoozeMins}m</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Sponsor Preview */}
            <div className="publisher-sponsor-preview-card">
              <div className="sponsor-preview-header">
                <ShieldCheck size={14} color="var(--accent-secondary)" />
                <span>Featured Publisher Spotlight During Break</span>
              </div>

              <div className="sponsor-card-body">
                <img src={MOCK_PUBLISHER_SPONSORS[0].bannerUrl} alt="Tor Books" className="sponsor-banner-thumb" />
                <div className="sponsor-info-text">
                  <h4>{MOCK_PUBLISHER_SPONSORS[0].bookTitle}</h4>
                  <p>{MOCK_PUBLISHER_SPONSORS[0].description}</p>
                  <span className="discount-tag">
                    <Tag size={12} /> Code: <strong>{MOCK_PUBLISHER_SPONSORS[0].discountCode}</strong> (20% Off)
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="intermission-modal-footer">
              <button
                type="button"
                className="btn-primary btn-start-intermission"
                onClick={handleStartIntermission}
              >
                <Coffee size={16} />
                <span>Start {selectedDuration.label}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
