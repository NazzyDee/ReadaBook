import React, { useState } from 'react';
import { X, Film, Sparkles, Play, Download, Smartphone, Tv } from 'lucide-react';
import { MOCK_HIGHLIGHT_CLIPS, type HighlightClipItem } from '../lib/highlightReelData';
import { soundFX } from '../lib/soundFx';

interface HighlightReelGeneratorModalProps {
  streamerName: string;
  onClose: () => void;
}

export const HighlightReelGeneratorModal: React.FC<HighlightReelGeneratorModalProps> = ({
  streamerName,
  onClose
}) => {
  const [clips] = useState<HighlightClipItem[]>(MOCK_HIGHLIGHT_CLIPS);
  const [selectedClipId, setSelectedClipId] = useState<string>('clip_1');
  const [aspectRatio, setAspectRatio] = useState<'VERTICAL_9_16' | 'HORIZONTAL_16_9'>('VERTICAL_9_16');
  const [bgMusic, setBgMusic] = useState<string>('epic_orchestral');
  const [captionStyle, setCaptionStyle] = useState<string>('kinetic_yellow');
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedClip = clips.find(c => c.id === selectedClipId) || clips[0];

  const handleExportReel = () => {
    soundFX.playPop();
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      soundFX.playChestClaim();
      soundFX.playApplause();
      setToastMsg(`🎬 Generated & Downloaded: "${selectedClip.title}" (${aspectRatio === 'VERTICAL_9_16' ? '9:16 Shorts/TikTok' : '16:9 YouTube'})!`);
      setTimeout(() => setToastMsg(null), 4000);
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="highlight-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="highlight-modal-header">
          <div className="highlight-title-group">
            <div className="highlight-badge">
              <Film size={16} />
              <span>NARRATOR HIGHLIGHT REEL & SHORTS GENERATOR</span>
            </div>
            <h3>@{streamerName}'s Audiobook Video Producer</h3>
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

        {/* Aspect Ratio Selector */}
        <div className="aspect-ratio-toggle-row">
          <span className="aspect-label">TARGET VIDEO FORMAT:</span>
          <div className="aspect-buttons-group">
            <button
              type="button"
              className={`btn-aspect ${aspectRatio === 'VERTICAL_9_16' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setAspectRatio('VERTICAL_9_16');
              }}
            >
              <Smartphone size={15} />
              <span>9:16 Vertical (TikTok / Shorts / Reels)</span>
            </button>

            <button
              type="button"
              className={`btn-aspect ${aspectRatio === 'HORIZONTAL_16_9' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setAspectRatio('HORIZONTAL_16_9');
              }}
            >
              <Tv size={15} />
              <span>16:9 Widescreen (YouTube / VOD Highlight)</span>
            </button>
          </div>
        </div>

        {/* Clips Grid */}
        <div className="clips-selection-section">
          <label className="sec-label">SELECT STREAM CLIP MOMENT:</label>
          <div className="clips-grid">
            {clips.map(c => (
              <div
                key={c.id}
                className={`clip-select-card ${selectedClipId === c.id ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedClipId(c.id);
                }}
              >
                <div className="clip-thumb-wrap">
                  <img src={c.thumbnailUrl} alt={c.title} />
                  <span className="duration-pill">{c.durationSeconds}s</span>
                  <div className="play-overlay-icon">
                    <Play size={18} fill="#fff" />
                  </div>
                </div>

                <div className="clip-info">
                  <h4>{c.title}</h4>
                  <span className="chapter-sub">{c.chapterLabel}</span>
                  <span className="views-meta">👁️ {c.viewCount.toLocaleString()} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Styling Controls Grid */}
        <div className="styling-controls-grid">
          <div className="control-group">
            <label>Background Score:</label>
            <select value={bgMusic} onChange={e => setBgMusic(e.target.value)}>
              <option value="epic_orchestral">⚔️ Epic Orchestral Quest Theme</option>
              <option value="lofi_hearth">🪵 Lo-Fi Cozy Hearth Fireplace</option>
              <option value="gothic_suspense">🔮 Gothic Dark Mystery Strings</option>
              <option value="none">🔇 No Background Score (Voice Only)</option>
            </select>
          </div>

          <div className="control-group">
            <label>Kinetic Subtitles Style:</label>
            <select value={captionStyle} onChange={e => setCaptionStyle(e.target.value)}>
              <option value="kinetic_yellow">⚡ Neon Gold Highlight Wave</option>
              <option value="bold_white">🔤 Clean Bold White Glow</option>
              <option value="karaoke_glow">🎤 Karaoke Syllable Bouncing Dot</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="highlight-modal-footer">
          <span className="video-engine-meta">
            Hardware GPU Transcoder: H.264 / 60 FPS • 1080p Export
          </span>

          <button
            type="button"
            className="btn-primary btn-export-highlight"
            onClick={handleExportReel}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Sparkles size={16} className="spin-slow" />
                <span>Rendering Reel...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Export Highlight Reel (MP4)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
