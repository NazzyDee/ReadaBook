import React, { useState } from 'react';
import { X, Film, Sparkles, Check, Heart, Star, Calendar, Mic, BookOpen } from 'lucide-react';
import { DEFAULT_TRAILER_CONFIG, type ChannelTrailerConfig } from '../lib/trailerData';
import { soundFX } from '../lib/soundFx';

interface ChannelTrailerModalProps {
  streamerName: string;
  isOwner?: boolean;
  onClose: () => void;
  onSaveTrailer?: (config: ChannelTrailerConfig) => void;
}

export const ChannelTrailerModal: React.FC<ChannelTrailerModalProps> = ({
  streamerName,
  isOwner = true,
  onClose,
  onSaveTrailer
}) => {
  const [config, setConfig] = useState<ChannelTrailerConfig>({
    ...DEFAULT_TRAILER_CONFIG,
    streamerName: streamerName || DEFAULT_TRAILER_CONFIG.streamerName
  });
  const [isEditing, setIsEditing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playApplause();
    setIsEditing(false);
    setSuccessToast('🎬 Channel Trailer updated & live on your offline screen!');

    if (onSaveTrailer) {
      onSaveTrailer(config);
    }

    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="trailer-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="trailer-modal-header">
          <div className="trailer-title-group">
            <div className="trailer-badge">
              <Film size={16} />
              <span>OFFLINE CHANNEL TRAILER & SHOWCASE</span>
            </div>
            <h3>{streamerName}'s Channel Trailer</h3>
          </div>

          <div className="trailer-header-actions">
            {isOwner && (
              <button
                className={`btn-toggle-edit ${isEditing ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Trailer'}
              </button>
            )}

            <button onClick={onClose} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Video Player Showcase Section */}
        <div className="trailer-video-showcase">
          <div className="trailer-video-frame">
            <video
              src={config.videoUrl}
              autoPlay
              loop
              controls
              playsInline
              className="trailer-video-element"
            />

            {/* Video Watermark & Overlay Actions */}
            <div className="trailer-overlay-bar">
              <div className="trailer-streamer-meta">
                <span className="trailer-pill">60-SECOND HIGHLIGHT</span>
                <h4>{config.trailerTitle}</h4>
                <p>{config.tagline}</p>
              </div>

              <div className="trailer-cta-buttons">
                <button
                  className="btn-trailer-follow"
                  onClick={() => soundFX.playPop()}
                >
                  <Heart size={14} fill="currentColor" />
                  <span>Follow</span>
                </button>
                <button
                  className="btn-trailer-sub"
                  onClick={() => soundFX.playPop()}
                >
                  <Star size={14} fill="currentColor" />
                  <span>Subscribe ($4.99)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editing Form or Highlights Display */}
        {isEditing ? (
          <form onSubmit={handleSave} className="trailer-edit-form">
            <div className="form-group-trailer">
              <label>Trailer Title</label>
              <input
                type="text"
                value={config.trailerTitle}
                onChange={e => setConfig({ ...config, trailerTitle: e.target.value })}
                required
              />
            </div>

            <div className="form-group-trailer">
              <label>Tagline / Channel Mission</label>
              <input
                type="text"
                value={config.tagline}
                onChange={e => setConfig({ ...config, tagline: e.target.value })}
                required
              />
            </div>

            <div className="form-row-dual">
              <div className="form-group-trailer">
                <label>Narrator Voice Timbre</label>
                <input
                  type="text"
                  value={config.narratorVoiceType}
                  onChange={e => setConfig({ ...config, narratorVoiceType: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-trailer">
                <label>Broadcast Schedule Snippet</label>
                <input
                  type="text"
                  value={config.scheduleSnippet}
                  onChange={e => setConfig({ ...config, scheduleSnippet: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary btn-save-trailer">
              <Check size={18} />
              <span>Save & Publish Channel Trailer</span>
            </button>
          </form>
        ) : (
          <div className="trailer-info-grid">
            <div className="trailer-info-box">
              <span className="info-box-label">
                <Mic size={14} color="var(--accent-primary)" />
                <span>NARRATION STYLE</span>
              </span>
              <p>{config.narratorVoiceType}</p>
            </div>

            <div className="trailer-info-box">
              <span className="info-box-label">
                <Calendar size={14} color="var(--accent-secondary)" />
                <span>WEEKLY BROADCAST SCHEDULE</span>
              </span>
              <p>{config.scheduleSnippet}</p>
            </div>

            <div className="trailer-info-box">
              <span className="info-box-label">
                <BookOpen size={14} color="#ffd700" />
                <span>FEATURED GENRES</span>
              </span>
              <div className="trailer-genre-chips">
                {config.featuredGenres.map(g => (
                  <span key={g} className="trailer-genre-tag">{g}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
