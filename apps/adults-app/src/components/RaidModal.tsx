import React, { useState, useEffect } from 'react';
import { STREAMERS, type StreamerProfile } from '../lib/streamersData';
import { Radio, X, Users } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface RaidModalProps {
  currentViewerCount: number;
  currentStreamerId: string;
  onInitiateRaid: (targetStreamer: StreamerProfile) => void;
  onClose: () => void;
}

export const RaidModal: React.FC<RaidModalProps> = ({
  currentViewerCount,
  currentStreamerId,
  onInitiateRaid,
  onClose
}) => {
  const [selectedStreamer, setSelectedStreamer] = useState<StreamerProfile | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const activeCandidates = Object.values(STREAMERS).filter(
    s => s.id !== currentStreamerId && s.isLive
  );

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0 && selectedStreamer) {
      soundFX.playRaidHorn();
      onInitiateRaid(selectedStreamer);
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, selectedStreamer, onInitiateRaid, onClose]);

  const handleStartCountdown = (streamer: StreamerProfile) => {
    setSelectedStreamer(streamer);
    setCountdown(10);
  };

  const handleRaidNow = () => {
    if (selectedStreamer) {
      soundFX.playRaidHorn();
      onInitiateRaid(selectedStreamer);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="raid-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Radio size={20} color="var(--accent-secondary)" />
            <h3>Raid Another Literature Stream</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {countdown !== null && selectedStreamer ? (
          <div className="raid-countdown-view">
            <div className="raid-countdown-ring">
              <span className="countdown-number">{countdown}</span>
              <span className="countdown-sub">seconds</span>
            </div>

            <h4>Raiding {selectedStreamer.displayName} with {currentViewerCount.toLocaleString()} readers!</h4>
            <p className="raid-target-title">📖 Reading: <em>{selectedStreamer.currentStreamTitle}</em></p>

            <div className="raid-actions-row">
              <button
                type="button"
                onClick={() => setCountdown(null)}
                className="btn-secondary"
              >
                Cancel Raid
              </button>
              <button
                type="button"
                onClick={handleRaidNow}
                className="btn-primary btn-raid-fire"
              >
                <Radio size={16} />
                <span>Raid Now!</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="raid-picker-view">
            <p className="raid-picker-subtitle">
              Send your <strong>{currentViewerCount.toLocaleString()}</strong> live readers to another storyteller when ending your broadcast!
            </p>

            <div className="raid-candidates-list">
              {activeCandidates.map(candidate => (
                <div
                  key={candidate.id}
                  className="raid-candidate-card"
                  onClick={() => handleStartCountdown(candidate)}
                >
                  <img src={candidate.avatarUrl} alt={candidate.displayName} className="candidate-avatar" />
                  <div className="candidate-info">
                    <h5>{candidate.displayName}</h5>
                    <span className="candidate-title">{candidate.currentStreamTitle}</span>
                    <span className="candidate-viewers">
                      <Users size={12} />
                      {(candidate.followersCount / 20).toFixed(0)} live viewers
                    </span>
                  </div>
                  <button className="btn-raid-select">
                    Raid Channel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
