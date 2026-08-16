import React, { useState } from 'react';
import { Scissors, X, Play, Pause, Check, Share2, Sparkles } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface ClipEditorModalProps {
  streamerName: string;
  bookTitle: string;
  onClose: () => void;
}

export const ClipEditorModal: React.FC<ClipEditorModalProps> = ({
  streamerName,
  bookTitle,
  onClose
}) => {
  const [clipTitle, setClipTitle] = useState('');
  const [trimStart, setTrimStart] = useState(10);
  const [trimEnd, setTrimEnd] = useState(40);
  const [isPlaying, setIsPlaying] = useState(true);
  const [publishedClipUrl, setPublishedClipUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const clipDuration = trimEnd - trimStart;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clipTitle.trim()) return;

    soundFX.playChestClaim();
    const mockClipId = `clip_${Date.now()}`;
    setPublishedClipUrl(`https://readabook.tv/clips/${mockClipId}`);
  };

  const handleCopyLink = () => {
    if (!publishedClipUrl) return;
    navigator.clipboard.writeText(publishedClipUrl);
    soundFX.playPop();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="clip-editor-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Scissors size={20} color="var(--accent-secondary)" />
            <h3>Create a Stream Clip</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {publishedClipUrl ? (
          <div className="clip-published-view">
            <div className="clip-published-badge">
              <Sparkles size={24} color="#00ff88" />
              <h4>Clip Published Successfully!</h4>
            </div>

            <p className="clip-published-title">"{clipTitle}"</p>
            <span className="clip-published-meta">Clipped from {streamerName} • {bookTitle}</span>

            <div className="clip-share-box">
              <input type="text" readOnly value={publishedClipUrl} className="clip-url-input" />
              <button onClick={handleCopyLink} className="btn-primary btn-copy-clip">
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <button onClick={onClose} className="btn-secondary" style={{ marginTop: '16px' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="clip-editor-form">
            {/* Preview Frame */}
            <div className="clip-preview-frame">
              <div className="clip-simulated-video">
                <div className="clip-streamer-avatar-tag">
                  <span>📖 {streamerName}</span>
                </div>
                <div className="clip-center-play" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: '4px' }} />}
                </div>
                <span className="clip-duration-badge">{clipDuration}s clip</span>
              </div>
            </div>

            {/* Trimmer Scrubber */}
            <div className="clip-trimmer-box">
              <div className="trimmer-labels">
                <span>Start: 00:{trimStart.toString().padStart(2, '0')}</span>
                <span className="duration-tag">{clipDuration} Seconds</span>
                <span>End: 00:{trimEnd.toString().padStart(2, '0')}</span>
              </div>

              <div className="trimmer-sliders-row">
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, trimEnd - 5)}
                  value={trimStart}
                  onChange={(e) => setTrimStart(Number(e.target.value))}
                  className="trimmer-slider start"
                />
                <input
                  type="range"
                  min={trimStart + 5}
                  max={60}
                  value={trimEnd}
                  onChange={(e) => setTrimEnd(Number(e.target.value))}
                  className="trimmer-slider end"
                />
              </div>
            </div>

            {/* Title Input */}
            <div className="form-group">
              <label>Clip Title:</label>
              <input
                type="text"
                placeholder="e.g., That intense ending reaction! 😱"
                value={clipTitle}
                onChange={(e) => setClipTitle(e.target.value)}
                className="settings-text-input"
                required
                maxLength={100}
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Scissors size={16} />
                <span>Publish Clip</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
