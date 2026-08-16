import React, { useState } from 'react';
import { X, Library, Palette, Plus, Sparkles, Award, ShieldCheck } from 'lucide-react';
import { SHELF_WOOD_THEMES, DEFAULT_SHELF_BOOKS, type ShelfBookItem } from '../lib/bookshelfData';
import { soundFX } from '../lib/soundFx';

interface BookshelfCustomizerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BookshelfCustomizerModal: React.FC<BookshelfCustomizerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState('ancient_oak');
  const [books, setBooks] = useState<ShelfBookItem[]>(DEFAULT_SHELF_BOOKS);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const currentTheme = SHELF_WOOD_THEMES.find(t => t.id === selectedThemeId) || SHELF_WOOD_THEMES[0];

  const handleAddCustomBook = () => {
    soundFX.playPop();
    const newBook: ShelfBookItem = {
      id: `bk_${Date.now()}`,
      title: 'A Memory of Light',
      author: 'Robert Jordan & Brandon Sanderson',
      spineColor: '#7c2d12',
      isSignedEdition: true,
      trophyBadge: '👑 Series Finale'
    };
    setBooks(prev => [...prev, newBook]);
  };

  const handleSaveShelf = () => {
    soundFX.playChestClaim();
    setSaveToast(`✨ Bookshelf theme "${currentTheme.name}" updated on stream overlay!`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="shelf-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="shelf-modal-header">
          <div className="shelf-title-group">
            <div className="shelf-badge">
              <Library size={16} />
              <span>3D STREAM OVERLAY BOOKSHELF & TROPHY STUDIO</span>
            </div>
            <h3>@{streamerName}'s Virtual Bookshelf Showcase</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {saveToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* 3D Visual Bookshelf Stage */}
        <div
          className="shelf-stage-container"
          style={{
            background: currentTheme.colorHex,
            borderColor: currentTheme.borderStyle
          }}
        >
          <div className="shelf-stage-overlay-tag">
            <span>LIVE STREAM OVERLAY PREVIEW</span>
          </div>

          <div className="books-row-rack">
            {books.map(book => (
              <div
                key={book.id}
                className="book-spine-card"
                style={{ backgroundColor: book.spineColor }}
                title={`${book.title} by ${book.author}`}
              >
                {book.isSignedEdition && <span className="signed-stamp">✍️ Signed</span>}
                <div className="spine-title-vertical">
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                </div>
                {book.trophyBadge && (
                  <div className="spine-trophy-badge">
                    <Award size={10} color="#ffd700" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="shelf-wooden-plank" style={{ borderColor: currentTheme.borderStyle }} />
        </div>

        {/* Controls: Themes & Add Book */}
        <div className="shelf-controls-grid">
          {/* Wood Finish Options */}
          <div className="shelf-option-panel">
            <h4>
              <Palette size={16} color="var(--accent-primary)" />
              <span>Bookshelf Wood & Finish</span>
            </h4>

            <div className="wood-options-list">
              {SHELF_WOOD_THEMES.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  className={`wood-theme-select-btn ${selectedThemeId === theme.id ? 'active' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedThemeId(theme.id);
                  }}
                >
                  <span className="theme-color-dot" style={{ backgroundColor: theme.colorHex, borderColor: theme.borderStyle }} />
                  <div className="theme-text-info">
                    <strong>{theme.name}</strong>
                    <span>{theme.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shelf Spines Management */}
          <div className="shelf-option-panel">
            <div className="panel-header-with-btn">
              <h4>
                <ShieldCheck size={16} color="var(--accent-secondary)" />
                <span>Showcase Spines ({books.length})</span>
              </h4>

              <button
                type="button"
                className="btn-secondary btn-add-spine"
                onClick={handleAddCustomBook}
              >
                <Plus size={13} />
                <span>Add Book</span>
              </button>
            </div>

            <div className="books-list-compact">
              {books.map(b => (
                <div key={b.id} className="book-compact-row">
                  <span className="color-swatch-sm" style={{ backgroundColor: b.spineColor }} />
                  <div className="book-compact-text">
                    <strong>{b.title}</strong>
                    <span>{b.author} {b.isSignedEdition ? '• ✍️ Signed' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shelf-modal-footer">
          <button
            type="button"
            className="btn-primary btn-save-shelf"
            onClick={handleSaveShelf}
          >
            <Sparkles size={16} />
            <span>Apply Bookshelf to Stream</span>
          </button>
        </div>
      </div>
    </div>
  );
};
