import React, { useState } from 'react';
import { X, Key, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { DEFAULT_CHAPTER_DROPS, type EarlyAccessChapterDrop } from '../lib/chapterEarlyAccessData';
import { soundFX } from '../lib/soundFx';

interface ChapterEarlyAccessModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ChapterEarlyAccessModal: React.FC<ChapterEarlyAccessModalProps> = ({
  streamerName,
  onClose
}) => {
  const [drops, setDrops] = useState<EarlyAccessChapterDrop[]>(DEFAULT_CHAPTER_DROPS);
  const [selectedDropId, setSelectedDropId] = useState<string>('drop_ch_25');
  const [customSparks, setCustomSparks] = useState<number>(250);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleClaimEarlyAccess = (drop: EarlyAccessChapterDrop) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setDrops(prev => prev.map(d => d.id === drop.id ? { ...d, totalKeysClaimed: d.totalKeysClaimed + 1 } : d));
    setToastMsg(`💎 Claimed Early Access Key for Chapter ${drop.chapterNumber} for ${customSparks} Sparks!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentDrop = drops.find(d => d.id === selectedDropId) || drops[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="pwyw-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="pwyw-modal-header">
          <div className="pwyw-title-group">
            <div className="pwyw-badge">
              <Key size={16} />
              <span>PAY-WHAT-YOU-WANT CHAPTER DROPS & EARLY ACCESS KEYS</span>
            </div>
            <h3>@{streamerName}'s Secret Chapter Vault</h3>
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

        {/* Hero Drop Banner */}
        <div className="pwyw-hero-banner">
          <div className="pwyw-key-stage">
            <div className="golden-key-circle">
              <Key size={32} color="#ffd700" />
            </div>
            <span className="keys-claimed-sub">🔑 {currentDrop.totalKeysClaimed} Keys Unlocked</span>
          </div>

          <div className="pwyw-hero-meta">
            <div className="early-tag-row">
              <span className="chapter-pill">CHAPTER {currentDrop.chapterNumber}</span>
              <span className="public-date-pill">
                <Clock size={12} />
                <span>Public Release: {currentDrop.publicReleaseDateFormatted}</span>
              </span>
            </div>

            <h4>{currentDrop.chapterTitle}</h4>
            <p className="chapter-author-note">"{currentDrop.authorNote}"</p>
            <span className="word-count-tag">📝 {currentDrop.wordCount.toLocaleString()} Words • Director's Cut Draft</span>

            <div className="pwyw-slider-box">
              <div className="pwyw-slider-header">
                <span>Pay What You Want (Min {currentDrop.minSparksPwyw} Sparks)</span>
                <strong>{customSparks} Sparks ⚡</strong>
              </div>
              <input
                type="range"
                min={currentDrop.minSparksPwyw}
                max={1000}
                step={25}
                value={customSparks}
                onChange={e => setCustomSparks(Number(e.target.value))}
                className="pwyw-slider"
              />
            </div>

            <button
              type="button"
              className="btn-unlock-key"
              onClick={() => handleClaimEarlyAccess(currentDrop)}
            >
              <Key size={16} />
              <span>Unlock Instant Early Access ({customSparks} Sparks)</span>
            </button>
          </div>
        </div>

        {/* Drops List Grid */}
        <div className="pwyw-drops-grid">
          {drops.map(d => (
            <div
              key={d.id}
              className={`pwyw-drop-tile ${d.id === selectedDropId ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedDropId(d.id);
                setCustomSparks(d.suggestedSparks);
              }}
            >
              <div className="drop-tile-top">
                <strong>Ch. {d.chapterNumber}: {d.chapterTitle}</strong>
                <span className="drop-keys-badge">🔑 {d.totalKeysClaimed}</span>
              </div>
              <span className="drop-date-sub">Public in {d.publicReleaseDateFormatted}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pwyw-modal-footer">
          <span className="footer-pwyw-note">
            💎 Early Access chapters unlock immediate live read-along reader sync on your browser.
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
