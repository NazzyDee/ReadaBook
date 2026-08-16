import React, { useState } from 'react';
import { X, Search, Bookmark, Clock, User, Sparkles, Play } from 'lucide-react';
import { MOCK_VOD_CHAPTERS, MOCK_TRANSCRIPT_LINES, type TranscriptLine, type VodChapter } from '../lib/vodTranscriptData';
import { soundFX } from '../lib/soundFx';

interface VodTranscriptViewerProps {
  onClose: () => void;
  onJumpToTimestamp?: (seconds: number, page: number) => void;
}

export const VodTranscriptViewer: React.FC<VodTranscriptViewerProps> = ({
  onClose,
  onJumpToTimestamp
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChapter, setActiveChapter] = useState<VodChapter>(MOCK_VOD_CHAPTERS[0]);
  const [activeLineId, setActiveLineId] = useState<string>(MOCK_TRANSCRIPT_LINES[0].id);

  const handleLineClick = (line: TranscriptLine) => {
    soundFX.playPop();
    setActiveLineId(line.id);
    if (onJumpToTimestamp) {
      onJumpToTimestamp(line.timestampSeconds, line.pageNumber);
    }
  };

  const handleChapterClick = (chapter: VodChapter) => {
    soundFX.playPop();
    setActiveChapter(chapter);
    if (onJumpToTimestamp) {
      onJumpToTimestamp(chapter.startSeconds, chapter.startPage);
    }
  };

  const filteredLines = MOCK_TRANSCRIPT_LINES.filter(l =>
    l.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="vod-transcript-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="vod-transcript-header">
          <div className="vod-title-group">
            <div className="vod-badge">
              <Bookmark size={15} />
              <span>VOD CHAPTERS & INTERACTIVE TRANSCRIPT TIMELINE</span>
            </div>
            <h3>Interactive Audiobook Reading Transcript</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Search & Chapters Navigation */}
        <div className="vod-transcript-controls">
          <div className="vod-search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search transcript, quotes, or character dialogue..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Chapters Horizontal Scroll */}
          <div className="vod-chapters-scroll-row">
            {MOCK_VOD_CHAPTERS.map(chap => {
              const isSelected = activeChapter.id === chap.id;

              return (
                <button
                  key={chap.id}
                  className={`vod-chapter-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => handleChapterClick(chap)}
                >
                  <Play size={12} />
                  <span>{chap.title}</span>
                  <small>({chap.durationFormatted})</small>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transcript Lines Feed */}
        <div className="vod-transcript-feed">
          {filteredLines.map(line => {
            const isCurrent = activeLineId === line.id;

            return (
              <div
                key={line.id}
                className={`transcript-line-card ${isCurrent ? 'current' : ''}`}
                onClick={() => handleLineClick(line)}
              >
                <div className="transcript-meta-row">
                  <div className="transcript-time-badge">
                    <Clock size={12} />
                    <span>{line.timestampFormatted}</span>
                  </div>

                  <div className="transcript-speaker-tag">
                    <User size={12} />
                    <strong>{line.speaker}</strong>
                    {line.characterVoice && (
                      <span className="character-voice-pill">{line.characterVoice}</span>
                    )}
                  </div>

                  <span className="transcript-page-badge">Turn to Page {line.pageNumber}</span>

                  {line.isClimax && (
                    <span className="climax-tag">
                      <Sparkles size={11} />
                      <span>PLOT CLIMAX</span>
                    </span>
                  )}
                </div>

                <p className="transcript-text-body">"{line.text}"</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
