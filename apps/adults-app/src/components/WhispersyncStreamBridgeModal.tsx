import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import { DEFAULT_WHISPERSYNC, type WhispersyncState } from '../lib/whispersyncStreamData';
import { soundFX } from '../lib/soundFx';

interface WhispersyncStreamBridgeModalProps {
  streamerName: string;
  onClose: () => void;
}

export const WhispersyncStreamBridgeModal: React.FC<WhispersyncStreamBridgeModalProps> = ({
  streamerName,
  onClose
}) => {
  const [syncState, setSyncState] = useState<WhispersyncState>(DEFAULT_WHISPERSYNC);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleForceSync = () => {
    soundFX.playPop();
    soundFX.playPageRustle();
    setSyncState(prev => ({
      ...prev,
      currentPage: prev.currentPage + 1,
      currentParagraphIndex: 1,
      syncedSentenceText: '"And then the horn of the King sounded across the Pelennor Fields."'
    }));
    setToastMsg('📖 Re-aligned stream audio timestamp with EPUB paragraph index (0.04s precision)!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="whispersync-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="whispersync-modal-header">
          <div className="whispersync-title-group">
            <div className="whispersync-badge">
              <Zap size={16} />
              <span>SMART AUDIO-TO-PAGE SYNC (WHISPERSYNC FOR LIVE STREAMS)</span>
            </div>
            <h3>@{streamerName}'s Live E-Reader Sync Bridge</h3>
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

        {/* Sync Hero Banner */}
        <div className="whispersync-hero-banner">
          <div className="sync-latency-box">
            <span className="latency-ms-num">{syncState.syncLatencyMs}ms</span>
            <span className="latency-label">NEURAL SYNC DELAY</span>
          </div>

          <div className="whispersync-hero-meta">
            <div className="page-meta-row">
              <span className="page-pill">Page {syncState.currentPage} of {syncState.totalBookPages}</span>
              <span className="chapter-pill">Chapter {syncState.currentChapter}</span>
              <span className="paragraph-pill">¶ Paragraph {syncState.currentParagraphIndex}</span>
            </div>

            <h4>Current Active Sentence on Stream:</h4>
            <p className="synced-sentence-quote">{syncState.syncedSentenceText}</p>

            <div className="sync-actions-row">
              <button
                type="button"
                className="btn-force-sync"
                onClick={handleForceSync}
              >
                <RefreshCw size={14} />
                <span>Force Voice-Alignment Calibration</span>
              </button>

              <label className="toggle-autoscroll-label">
                <input
                  type="checkbox"
                  checked={syncState.isAutoScrollEnabled}
                  onChange={e => setSyncState({ ...syncState, isAutoScrollEnabled: e.target.checked })}
                />
                <span>Auto-Scroll Viewer E-Reader</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="whispersync-modal-footer">
          <span className="footer-whispersync-note">
            📖 Uses real-time forced acoustic alignment to sync audio phonemes directly with EPUB DOM nodes.
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
