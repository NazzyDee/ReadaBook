import React, { useState } from 'react';
import { saveLocalClip, type Clip } from '../lib/clipsData';
import { Scissors, X, Film, Sparkles, Check, Share2 } from 'lucide-react';

interface ClipCreatorProps {
  streamerId: string;
  streamerName: string;
  streamerAvatar?: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  onClose: () => void;
}

export const ClipCreator: React.FC<ClipCreatorProps> = ({
  streamerId,
  streamerName,
  streamerAvatar,
  bookId,
  bookTitle,
  bookAuthor,
  bookCoverUrl,
  onClose
}) => {
  const [clipTitle, setClipTitle] = useState('');
  const [clipDuration, setClipDuration] = useState<number>(30);
  const [selectedTag, setSelectedTag] = useState('PlotTwist');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedClip, setPublishedClip] = useState<Clip | null>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clipTitle.trim()) return;

    setIsPublishing(true);

    const newClip: Clip = {
      id: `clip_${Date.now()}`,
      title: clipTitle.trim(),
      streamerId,
      streamerName,
      streamerAvatar: streamerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      bookId,
      bookTitle,
      bookAuthor,
      bookCoverUrl,
      thumbnailUrl: bookCoverUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      duration: clipDuration,
      viewsCount: 1,
      likesCount: 1,
      clippedBy: 'You',
      createdAt: new Date().toISOString(),
      tags: [selectedTag, 'Highlight', 'Live']
    };

    setTimeout(() => {
      saveLocalClip(newClip);
      setPublishedClip(newClip);
      setIsPublishing(false);
    }, 600);
  };

  return (
    <div className="modal-backdrop">
      <div className="clip-creator-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Scissors size={20} color="var(--accent-secondary)" />
            <h3>Clip that Moment!</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {publishedClip ? (
          <div className="clip-published-success">
            <div className="success-icon-badge">
              <Check size={32} color="#00e676" />
            </div>
            <h3>Clip Published to ReadaBook!</h3>
            <p className="clip-title-preview">"{publishedClip.title}"</p>
            <span className="clip-attribution">Clipped from {streamerName} • 📖 {bookTitle}</span>

            <div className="clip-share-row">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/clips?clip=${publishedClip.id}`}
                className="clip-url-input"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/clips?clip=${publishedClip.id}`);
                  alert('Clip link copied to clipboard!');
                }}
                className="btn-secondary"
              >
                <Share2 size={16} />
                <span>Copy Link</span>
              </button>
            </div>

            <button onClick={onClose} className="btn-primary" style={{ marginTop: '16px' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="clip-form">
            <div className="clip-preview-frame">
              <img src={bookCoverUrl} alt="Preview" className="clip-preview-thumb" />
              <div className="clip-trim-indicator">
                <Film size={16} />
                <span>Selected: Last {clipDuration} Seconds</span>
              </div>
            </div>

            <div className="clip-trim-slider-group">
              <div className="slider-label-row">
                <label>Clip Duration:</label>
                <span className="slider-val">{clipDuration}s</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={clipDuration}
                onChange={(e) => setClipDuration(parseInt(e.target.value, 10))}
                className="clip-slider"
              />
              <div className="slider-ticks">
                <span>10s</span>
                <span>30s</span>
                <span>60s</span>
              </div>
            </div>

            <div className="clip-title-group">
              <label>Clip Title <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input
                type="text"
                placeholder="e.g. Shocking chapter twist reaction! 😱"
                value={clipTitle}
                onChange={(e) => setClipTitle(e.target.value)}
                className="clip-title-input"
                maxLength={100}
                required
                autoFocus
              />
            </div>

            <div className="clip-tag-group">
              <label>Category Tag:</label>
              <div className="tag-pills">
                {['PlotTwist', 'VoiceActing', 'FunnyFail', 'EmotionalTears', 'HypeMoments', 'LoreBreakdown'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-pill-btn ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isPublishing || !clipTitle.trim()} className="btn-primary">
                <Sparkles size={16} />
                <span>{isPublishing ? 'Publishing...' : 'Publish Clip'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
