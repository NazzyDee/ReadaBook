import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, HeartPulse, Droplet, Clock } from 'lucide-react';
import { DEFAULT_VOCAL_HEALTH, type VocalHealthMetrics } from '../lib/vocalHealthData';
import { soundFX } from '../lib/soundFx';

interface VocalHealthTelemetryModalProps {
  streamerName: string;
  onClose: () => void;
}

export const VocalHealthTelemetryModal: React.FC<VocalHealthTelemetryModalProps> = ({
  streamerName,
  onClose
}) => {
  const [metrics] = useState<VocalHealthMetrics>(DEFAULT_VOCAL_HEALTH);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleDrinkWater = () => {
    soundFX.playPop();
    soundFX.playPageRustle();
    setToastMsg('💧 Hydration Logged! Vocal cord lubrication score refreshed.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="vocal-health-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="vocal-health-modal-header">
          <div className="vocal-health-title-group">
            <div className="vocal-health-badge">
              <HeartPulse size={16} />
              <span>VOICE FATIGUE & VOCAL CORD HEALTH TELEMETRY DECK</span>
            </div>
            <h3>@{streamerName}'s Narrator Vocal Cord Biometrics</h3>
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

        {/* Vocal Health Hero Banner */}
        <div className="vocal-health-hero-banner">
          <div className="vocal-strain-gauge">
            <HeartPulse size={36} color="#00ff88" />
            <div className="strain-pct-box">
              <span className="strain-num">{metrics.vocalStrainScorePct}%</span>
              <span className="strain-label">STRAIN INDEX</span>
            </div>
            <span className="status-badge optimal">{metrics.vocalStatus}</span>
          </div>

          <div className="vocal-hero-meta">
            <h4>Real-Time Glottal Waveform Telemetry</h4>
            <p>
              Monitors vocal fold fatigue, acoustic jitter, and fundamental frequency drift during marathon audiobook recording sessions.
            </p>
            <div className="vocal-stats-row">
              <div className="vocal-stat-chip">
                <Clock size={12} color="var(--accent-teal)" />
                <span>{metrics.continuousSpeakingMinutes} mins reading</span>
              </div>
              <div className="vocal-stat-chip">
                <Droplet size={12} color="#00b4d8" />
                <span>Drink {metrics.recommendedHydrationMl}ml water</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biometrics Grid */}
        <div className="vocal-telemetry-grid">
          <div className="telemetry-box">
            <span className="telemetry-label">FUNDAMENTAL PITCH:</span>
            <strong className="telemetry-val">{metrics.currentPitchHz} Hz</strong>
            <span className="telemetry-sub">Stable resonant baritone range</span>
          </div>

          <div className="telemetry-box">
            <span className="telemetry-label">FREQUENCY JITTER:</span>
            <strong className="telemetry-val">{metrics.pitchJitterPct}%</strong>
            <span className="telemetry-sub">Low friction & clear diction</span>
          </div>
        </div>

        {/* Footer */}
        <div className="vocal-health-modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleDrinkWater}
          >
            <Droplet size={14} color="#00b4d8" />
            <span>Log Hydration Break</span>
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
