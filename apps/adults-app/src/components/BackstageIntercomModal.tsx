import React, { useState } from 'react';
import { X, Mic, Sparkles, CheckCircle2, Volume2, Radio, Lock } from 'lucide-react';
import { DEFAULT_CREW_MEMBERS, type IntercomCrewMember } from '../lib/backstageIntercomData';
import { soundFX } from '../lib/soundFx';

interface BackstageIntercomModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BackstageIntercomModal: React.FC<BackstageIntercomModalProps> = ({
  streamerName,
  onClose
}) => {
  const [crew] = useState<IntercomCrewMember[]>(DEFAULT_CREW_MEMBERS);
  const [isTalking, setIsTalking] = useState<boolean>(false);
  const [activeChannel] = useState<string>('MAIN_STAGE_EARPIECE');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleStartTalk = () => {
    soundFX.playPop();
    setIsTalking(true);
    setToastMsg(`🎙️ Intercom Open -> Channel: [${activeChannel}] (Broadcast Muted)`);
  };

  const handleStopTalk = () => {
    setIsTalking(false);
    setToastMsg(null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="intercom-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="intercom-modal-header">
          <div className="intercom-title-group">
            <div className="intercom-badge">
              <Radio size={16} />
              <span>BACKSTAGE INTERCOM & PRODUCER TALKBACK CHANNEL</span>
            </div>
            <h3>@{streamerName}'s Secret In-Ear Intercom</h3>
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

        {/* Intercom PTT Hero Banner */}
        <div className="intercom-hero-banner">
          <button
            type="button"
            className={`btn-ptt-large ${isTalking ? 'transmitting' : ''}`}
            onMouseDown={handleStartTalk}
            onMouseUp={handleStopTalk}
            onTouchStart={handleStartTalk}
            onTouchEnd={handleStopTalk}
          >
            <Mic size={32} />
            <strong>{isTalking ? 'TRANSMITTING TO IN-EAR...' : 'HOLD TO TALK TO BACKSTAGE'}</strong>
            <span>(Stream viewers cannot hear this audio)</span>
          </button>

          <div className="intercom-meta-box">
            <div className="channel-select-pill">
              <Lock size={12} color="#00ff88" />
              <span>Encrypted Backstage Opus 48kHz Stream</span>
            </div>
            <h4>Direct Earpiece Talkback</h4>
            <p>
              Lets producers warn the reader about mic clipping, cue incoming sponsor ads, or announce incoming raid hosts directly into narrator in-ear monitors.
            </p>
          </div>
        </div>

        {/* Crew Grid */}
        <div className="intercom-crew-grid">
          {crew.map(c => (
            <div key={c.id} className="crew-member-tile">
              <img src={c.avatarUrl} alt={c.name} className="crew-avatar" />
              <div className="crew-meta">
                <strong>{c.name}</strong>
                <span className="crew-role">{c.role}</span>
                <span className="crew-channel-tag">{c.channel}</span>
              </div>
              <Volume2 size={16} color="#00ff88" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="intercom-modal-footer">
          <span className="footer-intercom-sub">
            🎧 Zero-latency WebRTC Audio Channel with separate audio ducking bus.
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
