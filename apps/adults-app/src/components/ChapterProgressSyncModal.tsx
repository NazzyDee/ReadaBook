import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Clock, QrCode, ArrowRight, ArrowLeft } from 'lucide-react';
import { ACTIVE_BOOK_PROGRESS, type BookProgressData } from '../lib/chapterProgressSyncData';
import { soundFX } from '../lib/soundFx';

interface ChapterProgressSyncModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ChapterProgressSyncModal: React.FC<ChapterProgressSyncModalProps> = ({
  streamerName,
  onClose
}) => {
  const [progress, setProgress] = useState<BookProgressData>(ACTIVE_BOOK_PROGRESS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const pct = Math.round((progress.currentPage / progress.totalPages) * 100);

  const handlePageChange = (delta: number) => {
    soundFX.playPageRustle();
    setProgress(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(prev.totalPages, prev.currentPage + delta))
    }));
  };

  const handleCompleteChapter = () => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    setToastMsg(`🎉 CHAPTER ${progress.currentChapter} COMPLETED! Broadcast telemetry updated.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCopySyncCode = () => {
    soundFX.playPop();
    navigator.clipboard.writeText(progress.kindleSyncCode);
    setToastMsg(`📋 Copied E-Reader Sync Code "${progress.kindleSyncCode}" to clipboard!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="progress-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="progress-modal-header">
          <div className="progress-title-group">
            <div className="progress-badge">
              <BookOpen size={16} />
              <span>LIVE BOOK PROGRESS TRACKER & E-READER SYNC</span>
            </div>
            <h3>@{streamerName}'s Reading Checkpoint</h3>
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

        {/* Hero Progress Banner */}
        <div className="progress-hero-banner">
          <div className="book-meta-col">
            <h4>{progress.bookTitle}</h4>
            <p className="author-line">by {progress.author}</p>
            <span className="chapter-title-tag">
              Chapter {progress.currentChapter} of {progress.totalChapters}: {progress.chapterTitle}
            </span>
          </div>

          <div className="pct-circle-wrap">
            <div className="pct-circle">
              <span className="pct-num">{pct}%</span>
              <span className="pct-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Telemetry */}
        <div className="progress-track-section">
          <div className="progress-labels-row">
            <span>Page {progress.currentPage} of {progress.totalPages}</span>
            <span className="time-estimate">
              <Clock size={12} />
              ~{progress.minutesRemainingInChapter}m left in chapter • ~{progress.estimatedCompletionHours}h total
            </span>
          </div>

          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
          </div>
        </div>

        {/* Broadcaster Quick Page Adjuster */}
        <div className="page-adjuster-bar">
          <span className="adjuster-label">BROADCASTER PAGE CONTROLS:</span>
          <div className="adjuster-buttons">
            <button
              type="button"
              className="btn-page-step"
              onClick={() => handlePageChange(-5)}
            >
              <ArrowLeft size={14} />
              <span>-5 Pages</span>
            </button>
            <button
              type="button"
              className="btn-page-step"
              onClick={() => handlePageChange(-1)}
            >
              <span>-1</span>
            </button>
            <span className="current-page-display">P. {progress.currentPage}</span>
            <button
              type="button"
              className="btn-page-step"
              onClick={() => handlePageChange(1)}
            >
              <span>+1</span>
            </button>
            <button
              type="button"
              className="btn-page-step"
              onClick={() => handlePageChange(5)}
            >
              <span>+5 Pages</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* E-Reader Sync Box */}
        <div className="reader-sync-box">
          <div className="sync-qr-icon">
            <QrCode size={32} color="#ffd700" />
          </div>
          <div className="sync-info">
            <strong>Kindle & Kobo WhisperSync Token</strong>
            <p>Paste this token into your e-reader app to jump to the narrator's exact live position.</p>
            <span className="sync-token-pill" onClick={handleCopySyncCode}>
              {progress.kindleSyncCode} (Click to Copy)
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="progress-modal-footer">
          <button
            type="button"
            className="btn-complete-chapter"
            onClick={handleCompleteChapter}
          >
            <span>Celebrate Chapter Complete!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
