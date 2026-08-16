import React, { useState } from 'react';
import { X, Scissors, Film, Play, Smartphone, Monitor, Download, Sparkles } from 'lucide-react';
import { DEFAULT_CLIP_STATE, MOCK_CLIP_TEMPLATES, type ClipEditorState } from '../lib/clipEditorData';
import { soundFX } from '../lib/soundFx';

interface ClipEditorStudioModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ClipEditorStudioModal: React.FC<ClipEditorStudioModalProps> = ({
  streamerName,
  onClose
}) => {
  const [clip, setClip] = useState<ClipEditorState>(DEFAULT_CLIP_STATE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const durationSec = Math.max(1, clip.endTimeSec - clip.startTimeSec);
  const selectedTemplate = MOCK_CLIP_TEMPLATES.find(t => t.id === clip.selectedTemplateId) || MOCK_CLIP_TEMPLATES[0];

  const handleTogglePlay = () => {
    soundFX.playPop();
    setIsPlaying(!isPlaying);
  };

  const handleExport = () => {
    soundFX.playChestClaim();
    setIsExporting(true);

    setTimeout(() => {
      setIsExporting(false);
      soundFX.playApplause();
      setExportToast(`🎬 Rendered "${clip.title}" (${selectedTemplate.aspectRatio}) in 1080p60! Download ready.`);
      setTimeout(() => setExportToast(null), 4000);
    }, 1800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="clip-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="clip-modal-header">
          <div className="clip-title-group">
            <div className="clip-badge">
              <Scissors size={16} />
              <span>VOD CHAPTER HIGHLIGHTS & TIKTOK/SHORTS STUDIO</span>
            </div>
            <h3>Highlight Reel & Clip Trimmer</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {exportToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{exportToast}</span>
          </div>
        )}

        <div className="clip-studio-grid">
          {/* Left: Video Preview Player */}
          <div className="clip-player-column">
            <div className={`clip-video-preview-deck ${selectedTemplate.aspectRatio === '9:16' ? 'vertical-deck' : 'landscape-deck'}`}>
              <img
                src={selectedTemplate.previewImageUrl}
                alt={clip.title}
                className="clip-preview-frame"
              />

              {/* Dynamic Overlay & Karaoke Subtitles */}
              {clip.includeKaraokeSubtitles && (
                <div className="karaoke-subtitle-overlay">
                  <span className="quote-text">“You cannot pass! I am a servant of the Secret Fire...”</span>
                </div>
              )}

              {clip.includeAuthorAttribution && (
                <div className="clip-watermark-tag">
                  <span>@{streamerName} • {clip.bookTitle}</span>
                </div>
              )}

              <button
                type="button"
                className="btn-play-preview-overlay"
                onClick={handleTogglePlay}
              >
                <Play size={24} fill="#fff" />
              </button>
            </div>

            {/* Timeline Waveform Scrubber */}
            <div className="timeline-scrubber-card">
              <div className="scrubber-top-row">
                <span>Clip Range: <strong>{clip.startTimeSec}s</strong> to <strong>{clip.endTimeSec}s</strong></span>
                <span className="duration-tag">{durationSec}s Total</span>
              </div>

              {/* Waveform Bar Track */}
              <div className="audio-waveform-bar">
                <div
                  className="waveform-highlight-selection"
                  style={{
                    left: `${(clip.startTimeSec / clip.totalDurationSec) * 100}%`,
                    width: `${(durationSec / clip.totalDurationSec) * 100}%`
                  }}
                />
              </div>

              <div className="scrubber-inputs-row">
                <div className="scrubber-input-group">
                  <label>Start Time (sec):</label>
                  <input
                    type="number"
                    min={0}
                    max={clip.endTimeSec - 5}
                    value={clip.startTimeSec}
                    onChange={e => setClip({ ...clip, startTimeSec: Number(e.target.value) })}
                  />
                </div>

                <div className="scrubber-input-group">
                  <label>End Time (sec):</label>
                  <input
                    type="number"
                    min={clip.startTimeSec + 5}
                    max={clip.totalDurationSec}
                    value={clip.endTimeSec}
                    onChange={e => setClip({ ...clip, endTimeSec: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Clip Metadata & Export Options */}
          <div className="clip-settings-column">
            <div className="clip-setting-card">
              <h4>
                <Film size={16} color="var(--accent-primary)" />
                <span>Clip Details</span>
              </h4>

              <div className="clip-input-wrap">
                <label>Clip Title:</label>
                <input
                  type="text"
                  value={clip.title}
                  onChange={e => setClip({ ...clip, title: e.target.value })}
                  placeholder="e.g. Crazy plot twist reaction!"
                />
              </div>

              <div className="clip-input-wrap">
                <label>Chapter / Passage:</label>
                <input
                  type="text"
                  value={clip.chapterTitle}
                  onChange={e => setClip({ ...clip, chapterTitle: e.target.value })}
                />
              </div>
            </div>

            {/* Format Selection */}
            <div className="clip-setting-card">
              <h4>
                <Smartphone size={16} color="var(--accent-secondary)" />
                <span>Export Format</span>
              </h4>

              <div className="template-cards-row">
                {MOCK_CLIP_TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    className={`template-select-btn ${clip.selectedTemplateId === t.id ? 'active' : ''}`}
                    onClick={() => {
                      soundFX.playPop();
                      setClip({ ...clip, selectedTemplateId: t.id });
                    }}
                  >
                    {t.aspectRatio === '9:16' ? <Smartphone size={16} /> : <Monitor size={16} />}
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overlays Toggles */}
            <div className="clip-setting-card">
              <h4>
                <Sparkles size={16} color="var(--accent-success)" />
                <span>Captions & Overlays</span>
              </h4>

              <label className="clip-checkbox-label">
                <input
                  type="checkbox"
                  checked={clip.includeKaraokeSubtitles}
                  onChange={e => setClip({ ...clip, includeKaraokeSubtitles: e.target.checked })}
                />
                <span>Auto-generate animated karaoke captions</span>
              </label>

              <label className="clip-checkbox-label">
                <input
                  type="checkbox"
                  checked={clip.includeAuthorAttribution}
                  onChange={e => setClip({ ...clip, includeAuthorAttribution: e.target.checked })}
                />
                <span>Include broadcaster and book watermark</span>
              </label>
            </div>

            {/* Export Button */}
            <button
              type="button"
              className="btn-primary btn-render-clip"
              disabled={isExporting}
              onClick={handleExport}
            >
              <Download size={16} />
              <span>{isExporting ? 'Rendering 1080p60 Highlight...' : 'Export & Download Clip'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
