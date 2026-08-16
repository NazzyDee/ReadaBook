import React, { useState } from 'react';
import { X, Eye, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DEFAULT_EYE_CONTACT_CONFIG, type EyeContactConfig } from '../lib/eyeContactData';
import { soundFX } from '../lib/soundFx';

interface EyeContactCorrectorModalProps {
  streamerName: string;
  onClose: () => void;
}

export const EyeContactCorrectorModal: React.FC<EyeContactCorrectorModalProps> = ({
  streamerName,
  onClose
}) => {
  const [config, setConfig] = useState<EyeContactConfig>(DEFAULT_EYE_CONTACT_CONFIG);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggle = () => {
    soundFX.playPop();
    setConfig(prev => {
      const nextState = !prev.isEnabled;
      setToastMsg(nextState ? '👁️ AI Eye Contact Redirection Activated!' : 'Eye Contact Redirection Disabled.');
      return { ...prev, isEnabled: nextState };
    });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ Teleprompter Eye Contact AI Corrector synced to Live Video DSP!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="eye-contact-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="eye-contact-modal-header">
          <div className="eye-contact-title-group">
            <div className="eye-contact-badge">
              <Eye size={16} />
              <span>TELEPROMPTER EYE-CONTACT AI CORRECTOR & GAZE REDIRECTION</span>
            </div>
            <h3>@{streamerName}'s AI Eye-Contact Engine</h3>
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

        {/* Hero Gaze Comparison Banner */}
        <div className="eye-contact-hero-banner">
          <div className="gaze-visual-demo">
            <div className="gaze-box">
              <span className="gaze-tag">REALITY</span>
              <p>Looking down at desk reading book</p>
              <div className="gaze-arrow down">↓</div>
            </div>
            <div className="gaze-neural-link">
              <ShieldCheck size={20} color="#00ff88" />
              <span>AI CORRECTION</span>
            </div>
            <div className="gaze-box corrected">
              <span className="gaze-tag">STREAM FEED</span>
              <p>Direct confident eye contact with chat</p>
              <div className="gaze-arrow direct">⊙</div>
            </div>
          </div>

          <div className="eye-contact-meta">
            <h4>Deep Neural Gaze Redirection</h4>
            <p>
              Reads physical book pages, Kindle tablets, or laptop teleprompter scripts while neural AI smoothly synthetic-redirects pupil gaze straight into the camera lens.
            </p>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="eye-contact-controls">
          <div className="toggle-feature-box">
            <div>
              <strong>Enable Real-Time Gaze Redirection</strong>
              <p>Auto-corrects pupil vectors in 60 FPS 1080p stream.</p>
            </div>
            <button
              type="button"
              className={`btn-toggle-switch ${config.isEnabled ? 'on' : 'off'}`}
              onClick={handleToggle}
            >
              {config.isEnabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>PUPIL REDIRECTION INTENSITY:</label>
              <strong>{config.intensityPct}%</strong>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={config.intensityPct}
              onChange={e => setConfig(prev => ({ ...prev, intensityPct: Number(e.target.value) }))}
              className="eye-slider"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="eye-contact-modal-footer">
          <span className="footer-neural-note">
            👁️ NVIDIA Broadcast & WebAssembly ONNX neural eye tracking acceleration supported.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Apply Eye Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};
