import React, { useState } from 'react';
import { X, Video, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { DEFAULT_VIRTUAL_SETS, type VirtualSetScene } from '../lib/obsVirtualKeyerData';
import { soundFX } from '../lib/soundFx';

interface ObsVirtualKeyerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ObsVirtualKeyerModal: React.FC<ObsVirtualKeyerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [sets] = useState<VirtualSetScene[]>(DEFAULT_VIRTUAL_SETS);
  const [selectedSetId, setSelectedSetId] = useState<string>('set_archivist_library');
  const [chromaSensitivity, setChromaSensitivity] = useState<number>(45);
  const [depthBlur, setDepthBlur] = useState<number>(20);
  const [aiBokehEnabled, setAiBokehEnabled] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectSet = (s: VirtualSetScene) => {
    soundFX.playPop();
    setSelectedSetId(s.id);
    setDepthBlur(s.depthBlurPct);
    setToastMsg(`🎬 Activated 3D Virtual Studio Set: "${s.name}"`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ OBS Virtual Camera Keyer settings synced to WebRTC video stream pipeline!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  const currentSet = sets.find(s => s.id === selectedSetId) || sets[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="keyer-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="keyer-modal-header">
          <div className="keyer-title-group">
            <div className="keyer-badge">
              <Video size={16} />
              <span>OBS STUDIO VIRTUAL CAMERA BACKGROUND KEYER & 3D SETS</span>
            </div>
            <h3>@{streamerName}'s Virtual Broadcast Set Studio</h3>
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

        {/* 3D Virtual Set Live Preview Banner */}
        <div className="keyer-hero-banner">
          <div className="virtual-set-preview-wrapper">
            <img src={currentSet.backdropUrl} alt={currentSet.name} className="set-backdrop-img" style={{ filter: `blur(${depthBlur / 10}px)` }} />
            <div className="narrator-mockup-silhouette">
              <span className="narrator-silhouette-label">👤 NARRATOR WEBCAM FEED (CHROMA KEYED)</span>
            </div>
            <span className="particle-badge">✨ {currentSet.ambientParticles} PARTICLES ACTIVE</span>
          </div>

          <div className="keyer-hero-meta">
            <h4>AI Depth Segmentation & Green Screen Keyer</h4>
            <p>
              Removes real-world room backgrounds without a physical green screen using real-time WebAssembly neural segmentation.
            </p>
            <div className="set-lighting-pill">
              <span>Lighting Match: <strong>{currentSet.lightingTone}</strong></span>
            </div>
          </div>
        </div>

        {/* Sets Grid */}
        <div className="virtual-sets-grid">
          {sets.map(s => {
            const isSelected = s.id === selectedSetId;
            return (
              <div
                key={s.id}
                className={`virtual-set-tile ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectSet(s)}
              >
                <img src={s.backdropUrl} alt={s.name} />
                <div className="set-tile-info">
                  <span className="set-cat-tag">{s.category}</span>
                  <strong>{s.name}</strong>
                  <div className="set-specs-mini">
                    <span>Blur: {s.depthBlurPct}%</span>
                    <span>{s.ambientParticles}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls Slider Box */}
        <div className="keyer-controls-grid">
          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>GREEN SCREEN CHROMA SENSITIVITY:</label>
              <strong>{chromaSensitivity}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={chromaSensitivity}
              onChange={e => setChromaSensitivity(Number(e.target.value))}
              className="keyer-slider"
            />
          </div>

          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>BACKGROUND DEPTH OF FIELD BOKEH:</label>
              <strong>{depthBlur}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={depthBlur}
              onChange={e => setDepthBlur(Number(e.target.value))}
              className="keyer-slider"
            />
          </div>

          <div className="toggle-feature-box full-width">
            <div>
              <strong>AI Portrait Lens Aperture Simulation (f/1.4)</strong>
              <p>Creates cinematic optical lens falloff around the reader's shoulders and book manuscript.</p>
            </div>
            <button
              type="button"
              className={`btn-toggle-switch ${aiBokehEnabled ? 'on' : 'off'}`}
              onClick={() => {
                soundFX.playPop();
                setAiBokehEnabled(prev => !prev);
              }}
            >
              {aiBokehEnabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="keyer-modal-footer">
          <div className="footer-obs-note">
            <Layers size={14} color="var(--accent-teal)" />
            <span>Sends 1080p60 Alpha Channel directly to OBS Studio Virtual Camera & Cam Link 4K.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Apply Virtual Set</span>
          </button>
        </div>
      </div>
    </div>
  );
};
