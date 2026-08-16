import React, { useState } from 'react';
import { X, Bookmark, Sparkles, CheckCircle2, Heart, Star, Pin } from 'lucide-react';
import { DEFAULT_MARGIN_STAMPS, type MarginStamp } from '../lib/chapterBookmarkStampData';
import { soundFX } from '../lib/soundFx';

interface ChapterBookmarkStampModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ChapterBookmarkStampModal: React.FC<ChapterBookmarkStampModalProps> = ({
  streamerName,
  onClose
}) => {
  const [stamps, setStamps] = useState<MarginStamp[]>(DEFAULT_MARGIN_STAMPS);
  const [newQuote, setNewQuote] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggleFeature = (id: string) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setStamps(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.isFeaturedOnStream;
        setToastMsg(nextState ? `📌 Featured @${s.readerUsername}'s quote stamp on live stream overlay!` : 'Unpinned quote stamp.');
        return { ...s, isFeaturedOnStream: nextState };
      }
      return s;
    }));
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLikeStamp = (id: string) => {
    soundFX.playPop();
    setStamps(prev => prev.map(s => s.id === id ? { ...s, likesCount: s.likesCount + 1 } : s));
  };

  const handleAddStamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.trim()) return;

    soundFX.playChestClaim();
    const newStamp: MarginStamp = {
      id: `stamp_${Date.now()}`,
      readerUsername: 'You',
      readerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80',
      quoteSnippet: `"${newQuote.trim()}"`,
      sealColor: '#ffd700',
      pageNumber: 215,
      likesCount: 1,
      isFeaturedOnStream: false
    };

    setStamps(prev => [newStamp, ...prev]);
    setNewQuote('');
    setToastMsg('📜 Stamped your wax seal quote onto the community chapter margins!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bookmark-stamp-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bookmark-stamp-modal-header">
          <div className="bookmark-stamp-title-group">
            <div className="bookmark-stamp-badge">
              <Bookmark size={16} />
              <span>CHAPTER BOOKMARK STAMPS & COMMUNITY MARGINS WALL</span>
            </div>
            <h3>@{streamerName}'s Community Marginalia</h3>
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

        {/* Add Stamp Input Bar */}
        <form onSubmit={handleAddStamp} className="add-stamp-form">
          <div className="stamp-input-row">
            <input
              type="text"
              value={newQuote}
              onChange={e => setNewQuote(e.target.value)}
              placeholder="Stamp a favorite sentence from this chapter onto the community margins..."
            />
            <button type="submit" className="btn-primary btn-add-stamp">
              <Pin size={14} />
              <span>Stamp Wax Seal</span>
            </button>
          </div>
        </form>

        {/* Marginalia Stamps Grid */}
        <div className="marginalia-stamps-grid">
          {stamps.map(stamp => (
            <div
              key={stamp.id}
              className={`stamp-card ${stamp.isFeaturedOnStream ? 'featured-on-stream' : ''}`}
            >
              <div className="stamp-card-top">
                <div className="stamp-user-row">
                  <img src={stamp.readerAvatar} alt={stamp.readerUsername} />
                  <div>
                    <strong>@{stamp.readerUsername}</strong>
                    <span className="page-tag">Page {stamp.pageNumber}</span>
                  </div>
                </div>

                <div className="seal-wax-circle" style={{ backgroundColor: stamp.sealColor }}>
                  <Star size={12} color="#000" />
                </div>
              </div>

              <p className="stamp-quote-body">{stamp.quoteSnippet}</p>

              <div className="stamp-card-footer">
                <button
                  type="button"
                  className="btn-like-stamp"
                  onClick={() => handleLikeStamp(stamp.id)}
                >
                  <Heart size={14} color="#ff3b3b" />
                  <span>{stamp.likesCount}</span>
                </button>

                <button
                  type="button"
                  className={`btn-feature-stamp ${stamp.isFeaturedOnStream ? 'active' : ''}`}
                  onClick={() => handleToggleFeature(stamp.id)}
                >
                  <Pin size={12} />
                  <span>{stamp.isFeaturedOnStream ? 'Featured on Stream' : 'Pin to Overlay'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bookmark-stamp-modal-footer">
          <span className="stamp-rules-sub">
            ✨ Pinned quote stamps render directly inside the broadcaster's video margins overlay.
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
