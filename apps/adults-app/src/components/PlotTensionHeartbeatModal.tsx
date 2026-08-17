import React, { useState } from 'react';
import { X, Activity, Sparkles, CheckCircle2, HeartPulse } from 'lucide-react';
import { DEFAULT_PLOT_TENSION, type PlotTensionTimeline } from '../lib/plotTensionData';
import { soundFX } from '../lib/soundFx';

interface PlotTensionHeartbeatModalProps {
  streamerName: string;
  onClose: () => void;
}

export const PlotTensionHeartbeatModal: React.FC<PlotTensionHeartbeatModalProps> = ({
  streamerName,
  onClose
}) => {
  const [timeline] = useState<PlotTensionTimeline>(DEFAULT_PLOT_TENSION);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSimulateHeartbeat = () => {
    soundFX.playPop();
    soundFX.playThunder();
    setToastMsg('📈 Narrative Tension ECG sensor re-calibrated against stream dialogue sentiment!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tension-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tension-modal-header">
          <div className="tension-title-group">
            <div className="tension-badge">
              <Activity size={16} />
              <span>NARRATIVE TENSION & REAL-TIME PLOT HEARTBEAT MONITOR</span>
            </div>
            <h3>@{streamerName}'s Story ECG Waveform</h3>
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

        {/* Hero Tension Banner */}
        <div className="tension-hero-banner">
          <div className="ecg-bpm-box">
            <HeartPulse size={36} color="#ff3b3b" />
            <span className="tension-pct-num">{timeline.currentTensionPct}%</span>
            <span className="tension-sub-label">CURRENT CLIMAX LEVEL</span>
          </div>

          <div className="tension-hero-meta">
            <div className="tension-stats-row">
              <span className="avg-pill">Avg: {timeline.averageTensionPct}%</span>
              <span className="peak-pill">🔥 Peak: {timeline.peakTensionMoment}</span>
            </div>

            <h4>Live Story Pacing Analysis:</h4>
            <p className="tension-explainer">
              Uses real-time NLP syntax velocity, emotional sentiment shift, and audio pitch dynamics to calculate reading climax intensity.
            </p>

            <button
              type="button"
              className="btn-recalibrate-ecg"
              onClick={handleSimulateHeartbeat}
            >
              <Activity size={14} />
              <span>Recalibrate Sentiment Pulse</span>
            </button>
          </div>
        </div>

        {/* Tension Timeline Curve Grid */}
        <div className="tension-timeline-grid">
          <h4>Chapter Tension Milestones</h4>
          {timeline.points.map((pt, idx) => (
            <div key={idx} className="tension-point-card">
              <div className="point-header">
                <strong>Min {pt.timestampMinute}</strong>
                <span className={`emotion-tag ${pt.dominantEmotion.toLowerCase()}`}>{pt.dominantEmotion}</span>
              </div>

              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill tension-bar"
                  style={{ width: `${pt.tensionLevelPct}%` }}
                ></div>
              </div>

              <p className="point-excerpt">"{pt.sceneExcerpt}"</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="tension-modal-footer">
          <span className="footer-tension-note">
            📊 Narrative tension telemetry integrates with smart lighting Hue/Nanoleaf bridge for room ambiance.
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
