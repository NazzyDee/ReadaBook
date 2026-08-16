import React, { useState } from 'react';
import { X, Palette, Sparkles, CheckCircle2, Sliders, Eye } from 'lucide-react';
import { AVAILABLE_OVERLAY_THEMES, type OverlayTheme } from '../lib/overlayThemesData';
import { soundFX } from '../lib/soundFx';

interface OverlayThemesStudioModalProps {
  streamerName: string;
  onClose: () => void;
}

export const OverlayThemesStudioModal: React.FC<OverlayThemesStudioModalProps> = ({
  streamerName,
  onClose
}) => {
  const [themes, setThemes] = useState<OverlayTheme[]>(AVAILABLE_OVERLAY_THEMES);
  const [activeThemeId, setActiveThemeId] = useState<string>('theme_high_fantasy');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];

  const handleApplyTheme = (theme: OverlayTheme) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setActiveThemeId(theme.id);
    setThemes(prev => prev.map(t => ({ ...t, isActive: t.id === theme.id })));
    setToastMsg(`🎨 Applied Broadcast Overlay Theme: "${theme.name}"`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="overlay-themes-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="overlay-themes-modal-header">
          <div className="overlay-themes-title-group">
            <div className="overlay-themes-badge">
              <Palette size={16} />
              <span>CUSTOM STREAM OVERLAY & PARCHMENT THEME STUDIO</span>
            </div>
            <h3>@{streamerName}'s Broadcast Overlay Themes</h3>
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

        {/* Live Overlay Preview Simulation Screen */}
        <div className="overlay-preview-banner">
          <div
            className="simulated-stream-screen"
            style={{
              borderColor: activeTheme.primaryColor,
              boxShadow: `0 0 25px ${activeTheme.primaryColor}33`
            }}
          >
            <img src={activeTheme.previewThumbnail} alt={activeTheme.name} className="screen-bg" />
            <div className="simulated-hud-top">
              <span className="live-pill-mini">🔴 LIVE</span>
              <span className="chapter-overlay-tag" style={{ color: activeTheme.primaryColor }}>
                Chapter 14: The Council of Elrond
              </span>
            </div>
            <div className="simulated-hud-bottom">
              <span className="theme-accent-badge" style={{ borderColor: activeTheme.primaryColor, color: activeTheme.primaryColor }}>
                THEME: {activeTheme.name.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="preview-meta-col">
            <h4>{activeTheme.name}</h4>
            <span className="theme-genre-pill">{activeTheme.genreTag}</span>
            <div className="theme-spec-rows">
              <div className="spec-row">
                <span className="spec-label">Border Style:</span>
                <strong>{activeTheme.borderStyle}</strong>
              </div>
              <div className="spec-row">
                <span className="spec-label">Typography:</span>
                <strong>{activeTheme.fontFamily}</strong>
              </div>
              <div className="spec-row">
                <span className="spec-label">Accent Color:</span>
                <span className="color-swatch-pill" style={{ backgroundColor: activeTheme.primaryColor }}>
                  {activeTheme.primaryColor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Themes Selection Grid */}
        <div className="themes-selection-grid">
          {themes.map(theme => {
            const isSelected = theme.id === activeThemeId;
            return (
              <div
                key={theme.id}
                className={`theme-card-tile ${isSelected ? 'active' : ''}`}
                onClick={() => handleApplyTheme(theme)}
              >
                <div className="theme-img-wrap">
                  <img src={theme.previewThumbnail} alt={theme.name} />
                  {isSelected && (
                    <span className="applied-check-badge">
                      <CheckCircle2 size={16} color="#00ff88" />
                    </span>
                  )}
                </div>
                <div className="theme-card-info">
                  <strong>{theme.name}</strong>
                  <span className="genre-label">{theme.genreTag}</span>
                  <div className="card-actions-row">
                    <span className="swatch-dot" style={{ backgroundColor: theme.primaryColor }}></span>
                    <button type="button" className="btn-select-theme">
                      {isSelected ? 'ACTIVE' : 'APPLY'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="overlay-themes-modal-footer">
          <div className="footer-left-info">
            <Sliders size={14} color="var(--accent-teal)" />
            <span>Overlays automatically generate browser source URLs for OBS / Streamlabs.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <Eye size={16} />
            <span>Done Styling</span>
          </button>
        </div>
      </div>
    </div>
  );
};
