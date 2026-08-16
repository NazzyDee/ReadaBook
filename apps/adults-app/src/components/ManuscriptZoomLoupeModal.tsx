import React, { useState } from 'react';
import { X, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { DEFAULT_MANUSCRIPT_ZOOM, type ManuscriptZoomConfig } from '../lib/manuscriptZoomData';
import { soundFX } from '../lib/soundFx';

interface ManuscriptZoomLoupeModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ManuscriptZoomLoupeModal: React.FC<ManuscriptZoomLoupeModalProps> = ({
  streamerName,
  onClose
}) => {
  const [config, setConfig] = useState<ManuscriptZoomConfig>(DEFAULT_MANUSCRIPT_ZOOM);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ 4K Manuscript Macro-Loupe lens activated in Desk Camera feed!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="manuscript-zoom-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="manuscript-zoom-modal-header">
          <div className="manuscript-zoom-title-group">
            <div className="manuscript-zoom-badge">
              <Search size={16} />
              <span>MACRO-LENS MANUSCRIPT ZOOM LOUPE & 4K CALLIGRAPHY MAGNIFIER</span>
            </div>
            <h3>@{streamerName}'s Manuscript Desk Loupe</h3>
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

        {/* Loupe Visual Preview */}
        <div className="manuscript-zoom-hero-banner">
          <div className="loupe-preview-canvas">
            <img
              src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80"
              alt="Manuscript"
              className="manuscript-bg-feed"
            />
            <div
              className={`loupe-circle-glass ${config.loupeShape.toLowerCase()}`}
              style={{
                boxShadow: `0 0 30px rgba(255, 215, 0, ${config.illuminationGlowPct / 100})`
              }}
            >
              <span className="magnify-factor-badge">{config.zoomFactor}x ZOOM</span>
            </div>
          </div>

          <div className="manuscript-zoom-meta">
            <h4>Ultra-HD Book Detail Magnifier</h4>
            <p>
              Provides floating picture-in-picture magnification of illuminated medieval drop caps, gold leaf bindings, and miniature illustrations.
            </p>
            <div className="filter-mode-pill">
              <span>Filter: <strong>{config.colorFilter}</strong></span>
            </div>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="manuscript-zoom-controls">
          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>MAGNIFICATION LEVEL:</label>
              <strong>{config.zoomFactor}x OPTICAL ZOOM</strong>
            </div>
            <input
              type="range"
              min="1.5"
              max="8.0"
              step="0.5"
              value={config.zoomFactor}
              onChange={e => setConfig(prev => ({ ...prev, zoomFactor: Number(e.target.value) }))}
              className="zoom-slider"
            />
          </div>

          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>MACRO RING-LIGHT ILLUMINATION:</label>
              <strong>{config.illuminationGlowPct}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={config.illuminationGlowPct}
              onChange={e => setConfig(prev => ({ ...prev, illuminationGlowPct: Number(e.target.value) }))}
              className="zoom-slider"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="manuscript-zoom-modal-footer">
          <span className="footer-lens-note">
            🔍 Supports Elgato Cam Link 4K, Sony FX3 & Lumix GH6 macro lenses via HDMI pass-through.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Enable Loupe Magnifier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
