import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Lightbulb, Zap, Wifi } from 'lucide-react';
import { DEFAULT_LIGHTING_SCENES, type LightingScene } from '../lib/smartLightingData';
import { soundFX } from '../lib/soundFx';

interface SmartLightingSyncModalProps {
  streamerName: string;
  onClose: () => void;
}

export const SmartLightingSyncModal: React.FC<SmartLightingSyncModalProps> = ({
  streamerName,
  onClose
}) => {
  const [scenes] = useState<LightingScene[]>(DEFAULT_LIGHTING_SCENES);
  const [activeSceneId, setActiveSceneId] = useState<string>('light_candlelight');
  const [brightness, setBrightness] = useState<number>(35);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectScene = (sc: LightingScene) => {
    soundFX.playPop();
    setActiveSceneId(sc.id);
    setBrightness(sc.brightnessPct);
    setToastMsg(`🕯️ Synced Philips Hue / Nanoleaf Studio Bridge: "${sc.name}"`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ Smart Room Lighting & Hue Bridge synced to Live Narrative Engine!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  const selectedScene = scenes.find(s => s.id === activeSceneId) || scenes[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="lighting-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="lighting-modal-header">
          <div className="lighting-title-group">
            <div className="lighting-badge">
              <Lightbulb size={16} />
              <span>SMART AMBIENT LIGHTING SYNC & PHILIPS HUE / NANOLEAF BRIDGE</span>
            </div>
            <h3>@{streamerName}'s Studio Lighting Automation</h3>
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

        {/* Active Ambient Glow Preview Banner */}
        <div
          className="lighting-hero-banner"
          style={{
            background: `linear-gradient(135deg, ${selectedScene.primaryHex}22, ${selectedScene.secondaryHex}22)`,
            borderColor: selectedScene.primaryHex
          }}
        >
          <div className="light-orb-preview" style={{ backgroundColor: selectedScene.primaryHex, boxShadow: `0 0 30px ${selectedScene.primaryHex}` }}>
            <Zap size={20} color="#fff" />
          </div>

          <div className="lighting-hero-info">
            <div className="bridge-status-row">
              <Wifi size={14} color="#00ff88" />
              <span>Philips Hue Bridge Connected (12 Bulbs + 2 Lightstrips)</span>
            </div>
            <h4>Active Scene: {selectedScene.name}</h4>
            <p>{selectedScene.description}</p>
          </div>
        </div>

        {/* Lighting Scenes List */}
        <div className="lighting-scenes-grid">
          {scenes.map(sc => {
            const isSelected = sc.id === activeSceneId;
            return (
              <div
                key={sc.id}
                className={`lighting-scene-tile ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectScene(sc)}
              >
                <div className="scene-color-bar" style={{ background: `linear-gradient(90deg, ${sc.primaryHex}, ${sc.secondaryHex})` }}></div>
                <div className="scene-tile-body">
                  <strong>{sc.name}</strong>
                  <span className="genre-pill">{sc.genreType}</span>
                  <span className="pulse-tag">PULSE: {sc.pulseSpeed}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Brightness Slider */}
        <div className="lighting-slider-card">
          <div className="slider-label-row">
            <label>STUDIO AMBIENT BRIGHTNESS:</label>
            <strong>{brightness}%</strong>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={brightness}
            onChange={e => setBrightness(Number(e.target.value))}
            className="lighting-slider"
          />
        </div>

        {/* Footer */}
        <div className="lighting-modal-footer">
          <span className="lighting-auto-note">
            💡 Auto-shifts studio lighting atmosphere when chapters change or during intense soundboard cues.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Apply Lighting Scene</span>
          </button>
        </div>
      </div>
    </div>
  );
};
