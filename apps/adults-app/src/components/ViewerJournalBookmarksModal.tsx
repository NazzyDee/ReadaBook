import React, { useState } from 'react';
import { X, Bookmark, Sparkles, Download, Plus, BookOpen, Trash2 } from 'lucide-react';
import { MOCK_SAVED_QUOTES, type SavedQuoteEntry } from '../lib/viewerJournalData';
import { soundFX } from '../lib/soundFx';

interface ViewerJournalBookmarksModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ViewerJournalBookmarksModal: React.FC<ViewerJournalBookmarksModalProps> = ({
  streamerName,
  onClose
}) => {
  const [quotes, setQuotes] = useState<SavedQuoteEntry[]>(MOCK_SAVED_QUOTES);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newNote, setNewNote] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    soundFX.playChestClaim();
    const entry: SavedQuoteEntry = {
      id: `q_${Date.now()}`,
      quoteText: `“${newQuoteText.trim()}”`,
      bookTitle: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      chapter: 'Chapter 5: Riddles in the Dark',
      streamerName: streamerName,
      userNote: newNote.trim() || 'Saved during live stream.',
      timestamp: 'Just now',
      sparksAwarded: 25
    };

    setQuotes(prev => [entry, ...prev]);
    setNewQuoteText('');
    setNewNote('');
    setToastMsg('📖 Quotation & Margin Note clipped to your Personal Reading Journal! (+25 Sparks)');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDelete = (id: string) => {
    soundFX.playPop();
    setQuotes(prev => prev.filter(q => q.id !== id));
    setToastMsg('🗑️ Quote removed from journal.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExport = (format: 'MARKDOWN' | 'NOTION' | 'KINDLE') => {
    soundFX.playChestClaim();
    soundFX.playHarp();
    setToastMsg(`📥 Exported ${quotes.length} journal quotes in ${format} format!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="journal-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="journal-modal-header">
          <div className="journal-title-group">
            <div className="journal-badge">
              <Bookmark size={16} />
              <span>PERSONAL READING JOURNAL & MARGIN NOTES</span>
            </div>
            <h3>Your Live Stream Quotation Shelf</h3>
          </div>

          <div className="journal-header-actions">
            <button
              type="button"
              className="btn-export-journal"
              onClick={() => handleExport('MARKDOWN')}
              title="Export as Markdown (.md)"
            >
              <Download size={14} />
              <span>Export (.md)</span>
            </button>
            <button onClick={onClose} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Quick Clip Input Box */}
        <form onSubmit={handleAddQuote} className="clip-quote-form">
          <div className="form-title">
            <Plus size={14} color="var(--accent-teal)" />
            <strong>Clip Current Live Quote / Paragraph:</strong>
          </div>
          <textarea
            rows={2}
            value={newQuoteText}
            onChange={e => setNewQuoteText(e.target.value)}
            placeholder="Type or paste memorable quote from stream..."
          />
          <div className="form-bottom-row">
            <input
              type="text"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add your personal margin note (e.g. Loved narrator's voice acting here!)..."
            />
            <button type="submit" className="btn-primary btn-save-quote">
              <span>Save Quote</span>
            </button>
          </div>
        </form>

        {/* Saved Quotes List */}
        <div className="saved-quotes-list">
          {quotes.map(q => (
            <div key={q.id} className="quote-entry-card">
              <div className="quote-header">
                <div className="book-tag">
                  <BookOpen size={12} color="#ffd700" />
                  <strong>{q.bookTitle}</strong>
                  <span>by {q.author} • {q.chapter}</span>
                </div>
                <div className="quote-right-meta">
                  <span className="quote-time">{q.timestamp}</span>
                  <button
                    type="button"
                    className="btn-del-quote"
                    onClick={() => handleDelete(q.id)}
                    title="Delete quote"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <blockquote className="quote-body">
                {q.quoteText}
              </blockquote>

              {q.userNote && (
                <div className="user-margin-note">
                  <span className="note-label">📝 Margin Note:</span>
                  <p>{q.userNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="journal-modal-footer">
          <span className="sync-status">
            ✨ Auto-synced with your Reader Profile • Notion & Obsidian Compatible
          </span>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            <span>Close Journal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
