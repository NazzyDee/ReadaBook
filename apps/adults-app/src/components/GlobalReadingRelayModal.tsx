import React, { useState } from 'react';
import { X, Flame, Sparkles, CheckCircle2, Clock, Globe } from 'lucide-react';
import { DEFAULT_RELAY_LEGS, DEFAULT_GLOBAL_RELAY, type RelayChannelLeg, type GlobalRelayStatus } from '../lib/globalReadingRelayData';
import { soundFX } from '../lib/soundFx';

interface GlobalReadingRelayModalProps {
  streamerName: string;
  onClose: () => void;
}

export const GlobalReadingRelayModal: React.FC<GlobalReadingRelayModalProps> = ({
  streamerName,
  onClose
}) => {
  const [legs] = useState<RelayChannelLeg[]>(DEFAULT_RELAY_LEGS);
  const [relay] = useState<GlobalRelayStatus>(DEFAULT_GLOBAL_RELAY);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePassBaton = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg('🔥 Passed the 24-Hour Read-a-thon Baton to Next Streamer!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const pctToWorldRecord = Math.round((relay.totalWorldPagesRead / relay.worldRecordTargetPages) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="relay-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relay-modal-header">
          <div className="relay-title-group">
            <div className="relay-badge">
              <Globe size={16} />
              <span>GLOBAL SPEED READING RELAY & 24HR READ-A-THON BATON</span>
            </div>
            <h3>@{streamerName}'s Marathon Relay Hub</h3>
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

        {/* Global World Progress Gauge Banner */}
        <div className="relay-hero-banner">
          <div className="relay-torch-dial">
            <Flame size={32} color="#ff3b3b" />
            <span className="pages-count-big">{relay.totalWorldPagesRead.toLocaleString()}</span>
            <span className="pages-label">PAGES READ LIVE</span>
          </div>

          <div className="relay-hero-meta">
            <h4>{relay.relayTitle}</h4>
            <div className="relay-time-row">
              <Clock size={14} color="#ffd700" />
              <span>Hour {relay.hoursElapsed} of {relay.totalHours} • World Record Goal: {relay.worldRecordTargetPages.toLocaleString()} Pages</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${pctToWorldRecord}%` }}></div>
            </div>
            <span className="pct-goal-sub">{pctToWorldRecord}% of Global Read-a-thon Target Achieved</span>
          </div>
        </div>

        {/* Relay Baton Channel Legs Grid */}
        <div className="relay-legs-list">
          {legs.map(leg => (
            <div key={leg.id} className={`relay-leg-tile ${leg.status.toLowerCase()}`}>
              <img src={leg.avatarUrl} alt={leg.channelName} className="leg-avatar" />
              <div className="leg-info-col">
                <div className="leg-name-row">
                  <strong>@{leg.channelName}</strong>
                  <span className={`leg-status-pill ${leg.status.toLowerCase()}`}>{leg.status}</span>
                </div>
                <span className="leg-book-section">{leg.bookSection}</span>
                <span className="leg-time-slot">{leg.timeSlotFormatted}</span>
              </div>
              <div className="leg-pages-col">
                <strong>{leg.pagesRead}</strong>
                <span>Pages</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relay-modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePassBaton}
          >
            <Flame size={14} color="#ff3b3b" />
            <span>Pass Relay Baton</span>
          </button>

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
