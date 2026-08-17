import React, { useState } from 'react';
import { X, Users, Sparkles, CheckCircle2, Share2, Radio } from 'lucide-react';
import { DEFAULT_SQUAD_RELAY, type SquadRelayEvent } from '../lib/squadReadingRelayData';
import { soundFX } from '../lib/soundFx';

interface SquadReadingRelayModalProps {
  streamerName: string;
  onClose: () => void;
}

export const SquadReadingRelayModal: React.FC<SquadReadingRelayModalProps> = ({
  streamerName,
  onClose
}) => {
  const [relay] = useState<SquadRelayEvent>(DEFAULT_SQUAD_RELAY);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePassTheBaton = () => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg(' baton passed to @Elena Rostova for Chapter 16 with automatic stream host raid!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="squad-relay-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="squad-relay-modal-header">
          <div className="squad-relay-title-group">
            <div className="squad-relay-badge">
              <Users size={16} />
              <span>MULTI-STREAMER RELAY BOOK CLUBS (SQUAD STREAMING)</span>
            </div>
            <h3>@{streamerName}'s Multi-Streamer Relay Squad</h3>
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
        <div className="squad-relay-hero-banner">
          <div className="squad-icon-dial">
            <Users size={44} color="#00ff88" />
            <span className="relay-duration-tag">{relay.totalRunTimeHours}HR MARATHON</span>
          </div>

          <div className="squad-relay-hero-meta">
            <h4>{relay.eventTitle}</h4>
            <p className="squad-explainer">
              Seamless 24-hour synchronized read-a-thons where multiple streamers take turns reading consecutive chapters without interrupting viewer flow.
            </p>

            <button
              type="button"
              className="btn-pass-baton"
              onClick={handlePassTheBaton}
            >
              <Share2 size={14} />
              <span>Pass Relay Baton & Raid Next Broadcaster</span>
            </button>
          </div>
        </div>

        {/* Streamers Relay Roster */}
        <div className="squad-streamers-list">
          <h4>Broadcaster Relay Schedule</h4>
          {relay.streamers.map(s => (
            <div key={s.streamerId} className="streamer-relay-card">
              <div className="streamer-left">
                <div className="streamer-avatar-ph">{s.streamerName[0]}</div>
                <div className="streamer-info">
                  <strong>@{s.streamerName}</strong>
                  <span className="chapter-slot-sub">Ch. {s.currentChapterAssigned} • {s.relaySlotTime}</span>
                </div>
              </div>

              <div className="streamer-right">
                {s.isCurrentlyLive ? (
                  <span className="live-baton-pill">
                    <Radio size={12} />
                    <span>READING NOW ({s.viewersOnlineCount})</span>
                  </span>
                ) : (
                  <span className="on-deck-pill">ON DECK</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="squad-relay-modal-footer">
          <span className="footer-squad-note">
            🌍 Synchronized chat, channel points, and charity pots across all participating channels.
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
