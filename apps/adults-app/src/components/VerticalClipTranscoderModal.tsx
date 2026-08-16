import React, { useState } from 'react';
import { X, Smartphone, Sparkles, CheckCircle2, Scissors, Share2 } from 'lucide-react';
import { DEFAULT_CLIP_PRESETS, type VerticalClipPreset } from '../lib/verticalClipData';
import { soundFX } from '../lib/soundFx';

interface VerticalClipTranscoderModalProps {
  streamerName: string;
  onClose: () => void;
}

export const VerticalClipTranscoderModal: React.FC<VerticalClipTranscoderModalProps> = ({
  streamerName,
  onClose
}) => {
  const [presets] = useState<VerticalClipPreset[]>(DEFAULT_CLIP_PRESETS);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset_tiktok_hype');
  const [isTranscoding, setIsTranscoding] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleExportClip = () => {
    soundFX.playPop();
    setIsTranscoding(true);
    setTimeout(() => {
      soundFX.playChestClaim();
      setIsTranscoding(false);
      setToastMsg('⚡ Vertical 9:16 Clip Transcoded! Ready to share directly to TikTok & Instagram Reels.');
      setTimeout(() => setToastMsg(null), 3000);
    }, 2000);
  };

  const currentPreset = presets.find(p => p.id === selectedPresetId) || presets[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="vertical-clip-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="vertical-clip-modal-header">
          <div className="vertical-clip-title-group">
            <div className="vertical-clip-badge">
              <Smartphone size={16} />
              <span>INSTANT 9:16 TIKTOK / REELS / SHORTS VERTICAL TRANSCODER</span>
            </div>
            <h3>@{streamerName}'s BookTok Viral Clip Studio</h3>
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

        {/* 9:16 Mockup Canvas & Preview */}
        <div className="vertical-clip-hero-banner">
          <div className="phone-preview-mockup">
            <div className="phone-screen-inner">
              {/* Stacked View: Top Face / Bottom Book */}
              <div className="phone-top-half">
                <span className="camera-label">👤 NARRATOR FACE</span>
              </div>
              <div className="phone-karaoke-subtitles animate-pulse">
                <span>"All that is gold does not glitter..."</span>
              </div>
              <div className="phone-bottom-half">
                <span className="camera-label">📖 MANUSCRIPT TEXT</span>
              </div>
            </div>
            <span className="vertical-res-tag">9:16 (1080x1920)</span>
          </div>

          <div className="clip-hero-meta">
            <h4>One-Click Viral BookTok Engine</h4>
            <p>
              Auto-detects high-emotion voice spikes and formats 16:9 streams into 9:16 stacked vertical video with kinetic bouncy karaoke captions.
            </p>
            <div className="clip-spec-badges">
              <span>Preset: <strong>{currentPreset.name}</strong></span>
              <span>Subtitles: <strong>{currentPreset.captionStyle}</strong></span>
            </div>

            <button
              type="button"
              className="btn-transcode-action"
              disabled={isTranscoding}
              onClick={handleExportClip}
            >
              <Scissors size={16} />
              <span>{isTranscoding ? 'Rendering Vertical H.264...' : 'Transcode Last 45s Highlight'}</span>
            </button>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="clip-presets-grid">
          {presets.map(p => {
            const isSelected = p.id === selectedPresetId;
            return (
              <div
                key={p.id}
                className={`clip-preset-tile ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedPresetId(p.id);
                }}
              >
                <div className="preset-top-row">
                  <strong>{p.name}</strong>
                  <CheckCircle2 size={14} color={isSelected ? '#00ff88' : 'var(--text-muted)'} />
                </div>
                <div className="preset-meta-row">
                  <span>{p.aspectRatio}</span>
                  <span>{p.durationSec}s Max</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="vertical-clip-modal-footer">
          <div className="footer-share-row">
            <Share2 size={14} color="var(--accent-teal)" />
            <span>Direct OAuth Export supported for TikTok, Instagram Reels, YouTube Shorts & Bluesky.</span>
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
