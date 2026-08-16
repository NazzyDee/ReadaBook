import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Play, BellRing } from 'lucide-react';
import { AVAILABLE_SCREEN_FX, type ScreenFxEffect } from '../lib/screenFxEmoteData';
import { soundFX } from '../lib/soundFx';

interface ScreenFxEmoteCannonModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ScreenFxEmoteCannonModal: React.FC<ScreenFxEmoteCannonModalProps> = ({
  streamerName,
  onClose
}) => {
  const [effects] = useState<ScreenFxEffect[]>(AVAILABLE_SCREEN_FX);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [density, setDensity] = useState<number>(60);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTestEffect = (fx: ScreenFxEffect) => {
    soundFX.playPop();
    if (fx.effectType === 'ARCANE_LIGHTNING') {
      soundFX.playThunder();
    } else if (fx.effectType === 'DRAGON_FIRE_BLAST') {
      soundFX.playDragonRoar();
    } else {
      soundFX.playChestClaim();
    }

    setActiveAnimation(fx.name);
    setToastMsg(`💥 BLASTED SCREEN FX: "${fx.name}" with density ${density}%!`);
    setTimeout(() => {
      setActiveAnimation(null);
    }, fx.durationSec * 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="screen-fx-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="screen-fx-modal-header">
          <div className="screen-fx-title-group">
            <div className="screen-fx-badge">
              <Sparkles size={16} />
              <span>CUSTOM HYPE EMOTE WALLS & SPARKS CANNONS</span>
            </div>
            <h3>@{streamerName}'s Broadcast Particle FX Studio</h3>
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

        {/* Live Active Animation Canvas Stage */}
        <div className="screen-fx-stage-banner">
          {activeAnimation ? (
            <div className="active-burst-display">
              <span className="burst-icon-huge animate-spin-slow">✨💥📜🔥⚡</span>
              <h4>{activeAnimation} FIRING ACROSS STREAM CANVAS!</h4>
              <p>Rendering {density * 5} physics particles in real-time...</p>
            </div>
          ) : (
            <div className="idle-stage-display">
              <span className="idle-sparkle">🎆</span>
              <h4>Particle FX Engine Ready</h4>
              <p>Click any preset below to test live particle physics on stream.</p>
            </div>
          )}
        </div>

        {/* Particle Density Slider */}
        <div className="particle-density-slider-card">
          <div className="slider-header-row">
            <label>PARTICLE DENSITY / INTENSITY:</label>
            <strong>{density}% ({density * 5} Particles)</strong>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={density}
            onChange={e => setDensity(Number(e.target.value))}
            className="density-slider"
          />
        </div>

        {/* FX Presets Grid */}
        <div className="screen-fx-presets-grid">
          {effects.map(fx => (
            <div key={fx.id} className="fx-preset-card">
              <div className="fx-card-top">
                <span className="fx-emoji">{fx.iconEmoji}</span>
                <span className="fx-duration-pill">{fx.durationSec}s Duration</span>
              </div>
              <h4>{fx.name}</h4>
              <p>{fx.triggerEvent}</p>

              <button
                type="button"
                className="btn-test-fx"
                onClick={() => handleTestEffect(fx)}
              >
                <Play size={14} />
                <span>Test Particle Burst</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="screen-fx-modal-footer">
          <div className="footer-meta-fx">
            <BellRing size={14} color="#ffd700" />
            <span>Sparks cannons automatically synchronize with subscriber sound alerts.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Save FX Config</span>
          </button>
        </div>
      </div>
    </div>
  );
};
