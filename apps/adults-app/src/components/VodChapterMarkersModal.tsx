import React, { useState } from 'react';
import { X, BookOpen, Play, Clock, Search, Sparkles, Mic } from 'lucide-react';
import { MOCK_CHAPTER_MARKERS, type ChapterMarker } from '../lib/vodMarkersData';
import { soundFX } from '../lib/soundFx';

interface VodChapterMarkersModalProps {
  streamerName: string;
  bookTitle?: string;
  onClose: () => void;
  onSeekToTimestamp?: (sec: number) => void;
}

export const VodChapterMarkersModal: React.FC<VodChapterMarkersModalProps> = ({
  streamerName,
  bookTitle = 'The Fellowship of the Ring',
  onClose,
  onSeekToTimestamp
}) => {
  const [markers] = useState<ChapterMarker[]>(MOCK_CHAPTER_MARKERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [jumpToast, setJumpToast] = useState<string | null>(null);

  const filteredMarkers = markers.filter(
    m =>
      m.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.quoteSnippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSeek = (marker: ChapterMarker) => {
    soundFX.playPageRustle();
    soundFX.playPop();

    if (onSeekToTimestamp) {
      onSeekToTimestamp(marker.timestampSec);
    }

    setJumpToast(`⏩ Jumped to Chapter ${marker.chapterNumber}: "${marker.chapterTitle}" (${marker.timestampFormatted})`);
    setTimeout(() => setJumpToast(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="markers-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="markers-modal-header">
          <div className="markers-title-group">
            <div className="markers-badge">
              <BookOpen size={16} />
              <span>TIMESTAMPED CHAPTER INDEX & STORY TIMELINE</span>
            </div>
            <h3>@{streamerName}'s Chapter Index • {bookTitle}</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {jumpToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{jumpToast}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="markers-search-bar">
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search chapters, quotes, or story events..."
          />
        </div>

        {/* Markers Timeline List */}
        <div className="markers-timeline-list">
          {filteredMarkers.map(marker => (
            <div key={marker.id} className="chapter-marker-item">
              <div className="marker-timestamp-badge">
                <Clock size={13} />
                <span>{marker.timestampFormatted}</span>
              </div>

              <div className="marker-content-body">
                <div className="marker-title-row">
                  <h4>Chapter {marker.chapterNumber}: {marker.chapterTitle}</h4>
                  <span className="page-range-pill">{marker.pageRange}</span>
                </div>

                <p className="marker-quote-text">{marker.quoteSnippet}</p>

                <div className="marker-narrator-note">
                  <Mic size={12} color="var(--accent-secondary)" />
                  <span><strong>Narrator Note:</strong> {marker.narratorVoiceNote}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary btn-jump-marker"
                onClick={() => handleSeek(marker)}
                title="Jump to Timestamp"
              >
                <Play size={13} fill="#fff" />
                <span>Jump</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
