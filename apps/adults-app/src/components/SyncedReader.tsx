import React, { useState, useEffect } from 'react';
import { type Book } from '../lib/booksData';
import { BookOpen, Type, Bookmark, MessageSquare, ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { findLoreEntity, type LoreEntity } from '../lib/loreData';
import { LiveLorePopover } from './LiveLorePopover';
import { smartFoley } from '../lib/smartFoleyEngine';
import { soundFX } from '../lib/soundFx';

interface SyncedReaderProps {
  activeBook: Book;
  currentPage: number;
  currentParagraph?: number;
  streamerName?: string;
  isStreamer?: boolean;
  onPageChange?: (pageIdx: number) => void;
}

export const SyncedReader: React.FC<SyncedReaderProps> = ({
  activeBook,
  currentPage,
  currentParagraph,
  isStreamer,
  onPageChange
}) => {
  // Reading mode customization
  const [followStreamer, setFollowStreamer] = useState(true);
  const [localPage, setLocalPage] = useState(currentPage);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'dyslexic'>('serif');
  const [fontSize, setFontSize] = useState<number>(18);
  const [readingTheme, setReadingTheme] = useState<'midnight' | 'sepia' | 'oled' | 'paper'>('midnight');
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'notes' | 'bookinfo'>('text');
  const [selectedLore, setSelectedLore] = useState<LoreEntity | null>(null);

  // Personal notes & bookmarks
  const [notes, setNotes] = useState<{ id: string; page: number; text: string; timestamp: string }[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const displayPage = followStreamer ? currentPage : localPage;
  const isBookmarked = bookmarks.includes(displayPage);

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(p => p !== displayPage));
    } else {
      setBookmarks(prev => [...prev, displayPage]);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setNotes(prev => [
      ...prev,
      {
        id: `note_${Date.now()}`,
        page: displayPage + 1,
        text: newNoteText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewNoteText('');
  };

  const pagesArray = activeBook.pages || [];
  const currentPageText = pagesArray[displayPage] || 'Page text loading...';
  const paragraphs = currentPageText.split('\n\n').filter(Boolean);

  // Auto-scan reading text for Smart Foley sound effect keywords
  useEffect(() => {
    if (paragraphs.length > 0) {
      const activeText = currentParagraph !== undefined && paragraphs[currentParagraph]
        ? paragraphs[currentParagraph]
        : currentPageText;
      smartFoley.scanTextAndTrigger(activeText, true);
    }
  }, [displayPage, currentParagraph, currentPageText]);

  const fontClass =
    fontFamily === 'dyslexic' ? 'font-dyslexic' : fontFamily === 'serif' ? 'font-serif' : 'font-sans';

  return (
    <div className={`synced-reader-container theme-${readingTheme}`}>
      {/* Top Bar */}
      <div className="reader-top-bar">
        <div className="reader-top-left">
          <img src={activeBook.coverUrl} alt="Cover" className="reader-mini-cover" />
          <div className="reader-meta">
            <h4 className="reader-book-title">{activeBook.title}</h4>
            <span className="reader-book-author">by {activeBook.author}</span>
          </div>
        </div>

        <div className="reader-top-actions">
          {/* Follow Streamer Sync Button */}
          {!isStreamer && (
            <button
              onClick={() => {
                setFollowStreamer(!followStreamer);
                if (!followStreamer) setLocalPage(currentPage);
              }}
              className={`btn-sync-toggle ${followStreamer ? 'synced' : 'desynced'}`}
              title={followStreamer ? 'Synced with Streamer' : 'Reading ahead independently'}
            >
              <span className={`sync-dot ${followStreamer ? 'pulse' : ''}`}></span>
              <span>{followStreamer ? 'Synced to Host' : 'Read Ahead'}</span>
            </button>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`btn-reader-icon ${isBookmarked ? 'active' : ''}`}
            title="Bookmark this page"
          >
            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          {/* Typography Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`btn-reader-icon ${showSettings ? 'active' : ''}`}
            title="Reading display settings"
          >
            <Type size={16} />
          </button>
        </div>
      </div>

      {/* Settings Popover Drawer */}
      {showSettings && (
        <div className="reader-settings-drawer">
          <div className="settings-row">
            <label>Font Typeface:</label>
            <div className="font-options-row">
              <button
                className={`btn-font-opt ${fontFamily === 'serif' ? 'active' : ''}`}
                onClick={() => setFontFamily('serif')}
              >
                Merriweather (Serif)
              </button>
              <button
                className={`btn-font-opt ${fontFamily === 'sans' ? 'active' : ''}`}
                onClick={() => setFontFamily('sans')}
              >
                Inter (Clean)
              </button>
              <button
                className={`btn-font-opt ${fontFamily === 'dyslexic' ? 'active' : ''}`}
                onClick={() => setFontFamily('dyslexic')}
              >
                OpenDyslexic
              </button>
            </div>
          </div>

          <div className="settings-row">
            <label>Font Size ({fontSize}px):</label>
            <div className="font-size-slider-row">
              <span style={{ fontSize: '12px' }}>A</span>
              <input
                type="range"
                min="14"
                max="30"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="font-slider"
              />
              <span style={{ fontSize: '22px' }}>A</span>
            </div>
          </div>

          <div className="settings-row">
            <label>Reading Palette:</label>
            <div className="palette-options-row">
              <button
                className={`btn-palette-opt pal-midnight ${readingTheme === 'midnight' ? 'active' : ''}`}
                onClick={() => setReadingTheme('midnight')}
              >
                Midnight Purple
              </button>
              <button
                className={`btn-palette-opt pal-oled ${readingTheme === 'oled' ? 'active' : ''}`}
                onClick={() => setReadingTheme('oled')}
              >
                OLED Pure Black
              </button>
              <button
                className={`btn-palette-opt pal-sepia ${readingTheme === 'sepia' ? 'active' : ''}`}
                onClick={() => setReadingTheme('sepia')}
              >
                Antique Sepia
              </button>
              <button
                className={`btn-palette-opt pal-paper ${readingTheme === 'paper' ? 'active' : ''}`}
                onClick={() => setReadingTheme('paper')}
              >
                Day Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reader Tabs */}
      <div className="reader-tabs-bar">
        <button
          className={`reader-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <BookOpen size={14} />
          <span>Story Text</span>
        </button>
        <button
          className={`reader-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <MessageSquare size={14} />
          <span>My Margin Notes ({notes.length})</span>
        </button>
        <button
          className={`reader-tab-btn ${activeTab === 'bookinfo' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookinfo')}
        >
          <Sparkles size={14} />
          <span>Book Lore & Buy</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="reader-content-body">
        {/* Floating Live Lore Popover Overlay */}
        {selectedLore && (
          <div className="lore-popover-overlay">
            <LiveLorePopover
              entity={selectedLore}
              onClose={() => setSelectedLore(null)}
            />
          </div>
        )}

        {activeTab === 'text' && (
          <div className={`reader-page-text ${fontClass}`} style={{ fontSize: `${fontSize}px` }}>
            {paragraphs.map((p, idx) => {
              const isCurrentPara = followStreamer && currentParagraph !== undefined && idx === currentParagraph;
              
              // Tokenize words and match with live lore
              const words = p.split(/(\s+)/);

              return (
                <p
                  key={idx}
                  className={`reader-paragraph ${isCurrentPara ? 'highlighted-teleprompter' : ''}`}
                >
                  {words.map((w, wIdx) => {
                    const cleanWord = w.replace(/[^a-zA-Z0-9]/g, '');
                    const loreMatch = cleanWord ? findLoreEntity(cleanWord, activeBook.id) : undefined;
                    if (loreMatch) {
                      return (
                        <span
                          key={wIdx}
                          className="interactive-lore-chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFX.playPop();
                            setSelectedLore(loreMatch);
                          }}
                          title={`Click for ${loreMatch.name} Lore (${loreMatch.type})`}
                        >
                          {w}
                          <span className="lore-dot-glow">✦</span>
                        </span>
                      );
                    }
                    return <span key={wIdx}>{w}</span>;
                  })}
                </p>
              );
            })}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="reader-notes-panel">
            <form onSubmit={handleAddNote} className="note-input-form">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder={`Add note for Page ${displayPage + 1}...`}
                className="note-text-input"
              />
              <button type="submit" className="btn-primary" style={{ padding: '6px 12px' }}>
                Save
              </button>
            </form>

            <div className="notes-list">
              {notes.length === 0 ? (
                <div className="notes-empty">
                  <span>No notes yet. Jot down reactions, character clues, or favorite lines!</span>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="reader-note-item">
                    <div className="note-item-header">
                      <span className="note-page-tag">Page {note.page}</span>
                      <span className="note-time">{note.timestamp}</span>
                    </div>
                    <p className="note-content">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookinfo' && (
          <div className="reader-bookinfo-panel">
            <div className="book-lore-header">
              <img src={activeBook.coverUrl} alt="Cover" className="book-lore-cover" />
              <div>
                <h3>{activeBook.title}</h3>
                <h4>Author: {activeBook.author}</h4>
                <span className="genre-badge">{activeBook.genre}</span>
                {activeBook.ageRange && <span className="age-badge">Ages: {activeBook.ageRange}</span>}
              </div>
            </div>

            <p className="book-description-text">
              {activeBook.description || 'Enjoy reading this literary classic live alongside the streamer and fellow literature fans in the chat!'}
            </p>

            <div className="book-support-box">
              <h5>Support the Author & Publisher</h5>
              <p>Purchase a physical or Kindle edition to read along at home.</p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(activeBook.title + ' ' + activeBook.author + ' book')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-buy-book"
              >
                <ExternalLink size={16} />
                <span>Buy Physical / E-Book Edition</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Reader Footer Controls */}
      <div className="reader-footer-bar">
        <button
          onClick={() => {
            const nextP = Math.max(0, displayPage - 1);
            if (isStreamer && onPageChange) onPageChange(nextP);
            else {
              setFollowStreamer(false);
              setLocalPage(nextP);
            }
          }}
          disabled={displayPage === 0}
          className="btn-page-nav"
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>

        <span className="page-indicator">
          Page {displayPage + 1} of {Math.max(1, pagesArray.length)}
        </span>

        <button
          onClick={() => {
            const nextP = Math.min(pagesArray.length - 1, displayPage + 1);
            if (isStreamer && onPageChange) onPageChange(nextP);
            else {
              setFollowStreamer(false);
              setLocalPage(nextP);
            }
          }}
          disabled={displayPage >= pagesArray.length - 1}
          className="btn-page-nav"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
