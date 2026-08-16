import React, { useState } from 'react';
import { X, Radio, Sparkles, CheckCircle2, Headphones, Wifi, BatteryCharging } from 'lucide-react';
import { STREAM_QUALITY_PROFILES, type StreamQualityProfile } from '../lib/streamLatencyData';
import { soundFX } from '../lib/soundFx';

interface StreamLatencySettingsModalProps {
  onClose: () => void;
  onSelectProfile?: (profile: StreamQualityProfile) => void;
}

export const StreamLatencySettingsModal: React.FC<StreamLatencySettingsModalProps> = ({
  onClose,
  onSelectProfile
}) => {
  const [selectedId, setSelectedId] = useState<string>('prof_ultra_low');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleApplyProfile = (prof: StreamQualityProfile) => {
    soundFX.playPop();
    setSelectedId(prof.id);

    if (onSelectProfile) {
      onSelectProfile(prof);
    }

    setToastMsg(`📻 Switched playback mode to: "${prof.name}" (${prof.isAudioOnly ? 'Audio-Only Commuter' : prof.videoResolution})`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="latency-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="latency-modal-header">
          <div className="latency-title-group">
            <div className="latency-badge">
              <Radio size={16} />
              <span>STREAM LATENCY & PLAYBACK QUALITY ENGINE</span>
            </div>
            <h3>Stream Latency & Audio-Only Transcoder</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        <p className="latency-intro-text">
          Customize playback latency for ultra-responsive live CYOA decisions, or enable Audio-Only Commuter Mode to enjoy hands-free audiobook streaming while preserving mobile data.
        </p>

        {/* Profiles Grid */}
        <div className="latency-profiles-grid">
          {STREAM_QUALITY_PROFILES.map(prof => {
            const isSelected = selectedId === prof.id;
            return (
              <div
                key={prof.id}
                className={`latency-profile-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleApplyProfile(prof)}
              >
                <div className="profile-card-top">
                  <div className="profile-badge-pill">{prof.badge}</div>
                  {isSelected && <CheckCircle2 size={16} color="var(--accent-success)" />}
                </div>

                <h4>{prof.name}</h4>

                <div className="profile-specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Video:</span>
                    <strong>{prof.videoResolution}</strong>
                  </div>

                  <div className="spec-item">
                    <span className="spec-label">Audio:</span>
                    <strong>{prof.audioBitrateKbps} kbps</strong>
                  </div>

                  <div className="spec-item">
                    <span className="spec-label">Latency:</span>
                    <strong>~{prof.latencySeconds}s</strong>
                  </div>

                  <div className="spec-item">
                    <span className="spec-label">Data:</span>
                    <strong>{prof.dataUsagePerHour}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commuter Highlight Banner */}
        <div className="commuter-mode-banner">
          <div className="commuter-banner-left">
            <Headphones size={20} color="#ffd700" />
            <div>
              <strong>Audio-Only Commuter Mode</strong>
              <p>Ideal for driving, walking, or background listening with screen off.</p>
            </div>
          </div>

          <div className="commuter-banner-right">
            <span className="save-data-tag">
              <BatteryCharging size={13} /> Saves 95% Battery & Data
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="latency-modal-footer">
          <div className="footer-status-pill">
            <Wifi size={13} color="var(--accent-success)" />
            <span>Connected: WebRTC Ultra-Low Latency Protocol</span>
          </div>

          <button
            type="button"
            className="btn-primary btn-done-latency"
            onClick={onClose}
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
