import React, { useState } from 'react';
import { X, Film, Sparkles, CheckCircle2, Search, Play, Bookmark, Eye } from 'lucide-react';
import { DEFAULT_ARCHIVED_VODS, type ArchivedVod } from '../lib/interactiveVodArchivesData';
import { soundFX } from '../lib/soundFx';

interface InteractiveVodArchivesModalProps {
  streamerName: string;
  onClose: () => void;
}

export const InteractiveVodArchivesModal: React.FC<InteractiveVodArchivesModalProps> = ({
  streamerName,
  onClose
}) => {
  const [vods] = useState<ArchivedVod[]>(DEFAULT_ARCHIVED_VODS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleLaunchVod = (vod: ArchivedVod) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg(`📜 Launching Interactive VOD Player for "${vod.streamTitle}" with Synced Transcripts!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredVods = vods.filter(v =>
    v.streamTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="vods-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="vods-modal-header">
          <div className="vods-title-group">
            <div className="vods-badge">
              <Film size={16} />
              <span>INTERACTIVE VOD ARCHIVES & CHAPTER SCRIBE TRANSCRIPTS</span>
            </div>
            <h3>@{streamerName}'s Broadcast Past Replays & VODs</h3>
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

        {/* Search & Scribe Filter Input */}
        <div className="vods-search-box">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search full-text spoken word transcripts or chapter titles..."
          />
        </div>

        {/* VODs Grid */}
        <div className="vods-items-grid">
          {filteredVods.map(vod => (
            <div key={vod.id} className="vod-archive-card">
              <div className="vod-thumb-wrapper">
                <img src={vod.thumbnailUrl} alt={vod.streamTitle} />
                <span className="duration-tag">{vod.durationFormatted}</span>
                <button
                  type="button"
                  className="btn-overlay-play"
                  onClick={() => handleLaunchVod(vod)}
                >
                  <Play size={20} />
                </button>
              </div>

              <div className="vod-card-body">
                <span className="broadcast-date-pill">{vod.broadcastDate}</span>
                <strong>{vod.streamTitle}</strong>
                <span className="vod-book-title">{vod.bookTitle}</span>

                <div className="vod-metadata-row">
                  <div className="meta-item">
                    <Bookmark size={12} color="var(--accent-teal)" />
                    <span>{vod.chapterTimestampsCount} Chapters</span>
                  </div>
                  <div className="meta-item">
                    <Eye size={12} color="var(--accent-secondary)" />
                    <span>{vod.viewCount} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="vods-modal-footer">
          <span className="vods-scribe-note">
            ✨ Every broadcast is converted into an AI-indexed full text audiobook with synced synchronized sentence highlighting.
          </span>
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
