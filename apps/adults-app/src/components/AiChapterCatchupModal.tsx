import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Clock, FileText, Bookmark } from 'lucide-react';
import { DEFAULT_CATCHUP_SUMMARY, type ChapterCatchupSummary } from '../lib/aiChapterCatchupData';
import { soundFX } from '../lib/soundFx';

interface AiChapterCatchupModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AiChapterCatchupModal: React.FC<AiChapterCatchupModalProps> = ({
  streamerName,
  onClose
}) => {
  const [summary] = useState<ChapterCatchupSummary>(DEFAULT_CATCHUP_SUMMARY);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSaveToJournal = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg('📝 Chapter catch-up summary saved to your personal Reader Notebook!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="catchup-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="catchup-modal-header">
          <div className="catchup-title-group">
            <div className="catchup-badge">
              <FileText size={16} />
              <span>AI LIVE CHAPTER SUMMARIZER & "WHAT DID I MISS?" HUD</span>
            </div>
            <h3>@{streamerName}'s Live Story Recaps</h3>
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

        {/* Hero TLDR Banner */}
        <div className="catchup-hero-banner">
          <div className="stream-time-dial">
            <Clock size={32} color="#00ff88" />
            <span className="live-dur-text">{summary.streamStartTime}</span>
          </div>

          <div className="catchup-hero-meta">
            <span className="chapter-tag-pill">Ch. {summary.chapterNumber}: {summary.chapterTitle}</span>
            <h4>Executive Plot Summary:</h4>
            <p className="tldr-text">{summary.tldrParagraph}</p>

            <button
              type="button"
              className="btn-save-journal"
              onClick={handleSaveToJournal}
            >
              <Bookmark size={14} />
              <span>Save Recap to Reader Notebook</span>
            </button>
          </div>
        </div>

        {/* Timeline Key Events List */}
        <div className="catchup-events-timeline">
          <h4>Key Plot Milestones During This Stream</h4>
          {summary.keyEvents.map((evt, idx) => (
            <div key={idx} className="timeline-event-card">
              <div className="event-meta-top">
                <span className="time-ago-pill">⏱️ {evt.timestampMinutesAgo}m ago</span>
                <span className="character-pill">👤 {evt.characterInvolved}</span>
                <span className={`spoiler-pill ${evt.spoilerSeverity.toLowerCase()}`}>
                  {evt.spoilerSeverity.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="event-sentence-text">{evt.summarySentence}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="catchup-modal-footer">
          <span className="footer-catchup-note">
            📝 AI Summarizer continuously streams paragraph audio and updates every 3 minutes.
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
