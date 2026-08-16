import React, { useState } from 'react';
import { X, FileText, AlertTriangle, Users, MapPin, Clock } from 'lucide-react';
import { MOCK_CHAPTER_RECAP, type ChapterRecapData } from '../lib/chapterRecapData';
import { soundFX } from '../lib/soundFx';

interface LiveChapterRecapModalProps {
  streamerName: string;
  onClose: () => void;
}

export const LiveChapterRecapModal: React.FC<LiveChapterRecapModalProps> = ({
  streamerName,
  onClose
}) => {
  const [recap] = useState<ChapterRecapData>(MOCK_CHAPTER_RECAP);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="recap-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="recap-modal-header">
          <div className="recap-title-group">
            <div className="recap-badge">
              <FileText size={16} />
              <span>LIVE CHAPTER SUMMARY & CATCH-UP RECAP</span>
            </div>
            <h3>@{streamerName}'s Live Story Recap</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Current Book Info Banner */}
        <div className="recap-book-banner">
          <div className="recap-book-left">
            <h4>{recap.bookTitle}</h4>
            <span className="recap-sync-meta">
              <Clock size={12} /> {recap.lastUpdatedTime}
            </span>
          </div>
          <span className="live-catchup-pill">30-SEC CATCH UP</span>
        </div>

        {/* Cliffhanger Warning Banner */}
        {recap.cliffhangerWarning && (
          <div className="recap-cliffhanger-box">
            <AlertTriangle size={18} color="#ffd700" />
            <span>{recap.cliffhangerWarning}</span>
          </div>
        )}

        {/* Bulleted Story Recap */}
        <div className="recap-bullets-section">
          <span className="sec-label">PREVIOUSLY IN THIS BROADCAST:</span>
          <div className="recap-bullets-list">
            {recap.recapBullets.map((bullet, idx) => (
              <div key={idx} className="recap-bullet-item">
                <span className="bullet-num">{idx + 1}</span>
                <p>{bullet}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Character Status Radar */}
        <div className="character-status-section">
          <div className="character-status-header">
            <Users size={15} color="var(--accent-teal)" />
            <h4>Active Character Status Radar</h4>
          </div>

          <div className="character-status-grid">
            {recap.keyCharacterStatuses.map(char => (
              <div key={char.name} className="char-status-card">
                <div className="char-card-top">
                  <strong>{char.name}</strong>
                  <span
                    className="char-status-pill"
                    style={{
                      color: char.statusColor,
                      borderColor: char.statusColor,
                      backgroundColor: `${char.statusColor}18`
                    }}
                  >
                    {char.status}
                  </span>
                </div>

                <div className="char-location-row">
                  <MapPin size={12} color="var(--text-muted)" />
                  <span>{char.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="recap-modal-footer">
          <button
            type="button"
            className="btn-primary btn-close-recap"
            onClick={() => {
              soundFX.playPop();
              onClose();
            }}
          >
            <span>Resume Live Stream</span>
          </button>
        </div>
      </div>
    </div>
  );
};
