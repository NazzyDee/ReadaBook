import React, { useState } from 'react';
import { X, Gauge, Sparkles, CheckCircle2, Activity, Zap } from 'lucide-react';
import { DEFAULT_WPM_HISTORY, type WpmHistoryRecord } from '../lib/wpmTachometerData';
import { soundFX } from '../lib/soundFx';

interface WpmTachometerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const WpmTachometerModal: React.FC<WpmTachometerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [history] = useState<WpmHistoryRecord[]>(DEFAULT_WPM_HISTORY);
  const [currentWpm, setCurrentWpm] = useState<number>(154);
  const [targetWpm] = useState<number>(150);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSimulateSpeedup = () => {
    soundFX.playPop();
    setCurrentWpm(190);
    setToastMsg('⚠️ PACING WARNING: Reading speed exceeded 185 WPM! Slow down for dramatic clarity.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tachometer-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tachometer-modal-header">
          <div className="tachometer-title-group">
            <div className="tachometer-badge">
              <Gauge size={16} />
              <span>LIVE BROADCASTER READING SPEED & CADENCE TACHOMETER</span>
            </div>
            <h3>@{streamerName}'s Speech Cadence HUD</h3>
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

        {/* Live Tachometer Dial Banner */}
        <div className="tachometer-hero-banner">
          <div className="tachometer-gauge-display">
            <div className="speed-circle-outer">
              <span className="wpm-big-num">{currentWpm}</span>
              <span className="wpm-unit">WORDS / MIN</span>
            </div>
            <div className={`cadence-pill ${currentWpm > 175 ? 'rushing' : currentWpm < 125 ? 'dragging' : 'optimal'}`}>
              {currentWpm > 175 ? '⚠️ RUSHING' : currentWpm < 125 ? '🐢 DRAGGING' : '✨ OPTIMAL PACING'}
            </div>
          </div>

          <div className="tachometer-meta-col">
            <h4>Live Syllable & Phoneme Speech Meter</h4>
            <p>Target Audiobook Standard: <strong>{targetWpm} WPM (Epic Fantasy Normal)</strong>.</p>
            <div className="pacing-tips-box">
              <span>💡 Tip: Maintain 130-140 WPM during emotional monologues; 160-170 WPM during battle scenes.</span>
            </div>
            <button
              type="button"
              className="btn-test-speedup"
              onClick={handleSimulateSpeedup}
            >
              <Zap size={14} />
              <span>Simulate Speed Spike</span>
            </button>
          </div>
        </div>

        {/* WPM History Graph Bars */}
        <div className="wpm-history-card">
          <div className="history-header">
            <label>CHAPTER READING PACING TIMELINE:</label>
            <span className="live-pill-sm">LIVE TELEMETRY</span>
          </div>

          <div className="wpm-bars-row">
            {history.map(rec => (
              <div key={rec.minute} className="wpm-bar-col">
                <div className="wpm-bar-num">{rec.wpm}</div>
                <div className="wpm-bar-track">
                  <div
                    className={`wpm-bar-fill ${rec.cadenceState === 'RUSHING' ? 'rush' : rec.cadenceState === 'DRAGGING' ? 'drag' : 'opt'}`}
                    style={{ height: `${(rec.wpm / 220) * 100}%` }}
                  ></div>
                </div>
                <span className="wpm-time-label">Min {rec.minute}</span>
                <span className="wpm-scene-sub">{rec.sceneContext.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="tachometer-modal-footer">
          <div className="footer-hud-note">
            <Activity size={14} color="var(--accent-teal)" />
            <span>Overlays gentle silent border flashes if narrator exceeds 190 WPM for over 10 seconds.</span>
          </div>
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
