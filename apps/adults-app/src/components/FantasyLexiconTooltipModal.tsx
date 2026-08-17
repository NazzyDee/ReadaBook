import React, { useState } from 'react';
import { X, Search, Sparkles, CheckCircle2, Volume2, BookA } from 'lucide-react';
import { DEFAULT_LEXICON_ENTRIES, type FantasyLexiconEntry } from '../lib/fantasyLexiconData';
import { soundFX } from '../lib/soundFx';

interface FantasyLexiconTooltipModalProps {
  streamerName: string;
  onClose: () => void;
}

export const FantasyLexiconTooltipModal: React.FC<FantasyLexiconTooltipModalProps> = ({
  streamerName,
  onClose
}) => {
  const [entries] = useState<FantasyLexiconEntry[]>(DEFAULT_LEXICON_ENTRIES);
  const [selectedTermId, setSelectedTermId] = useState<string>('lex_aiglos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePlayPronunciation = (entry: FantasyLexiconEntry) => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg(`🗣️ Phonetic Audio: "${entry.phoneticSpelling}" (${entry.languageOrLoreOrigin})`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = entries.filter(e =>
    e.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentEntry = entries.find(e => e.id === selectedTermId) || entries[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="lexicon-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="lexicon-modal-header">
          <div className="lexicon-title-group">
            <div className="lexicon-badge">
              <BookA size={16} />
              <span>REAL-TIME PRONUNCIATION GUIDE & FANTASY LEXICON</span>
            </div>
            <h3>@{streamerName}'s Lore Dictionary & Pronunciations</h3>
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

        {/* Hero Lexicon Spotlight */}
        <div className="lexicon-hero-banner">
          <div className="phonetic-visual-box">
            <span className="term-title-big">{currentEntry.term}</span>
            <span className="phonetic-sub">/{currentEntry.phoneticSpelling}/</span>
          </div>

          <div className="lexicon-hero-meta">
            <span className="origin-pill">📜 {currentEntry.languageOrLoreOrigin}</span>
            <h4>Definition & Lore Context:</h4>
            <p className="lexicon-definition-text">{currentEntry.definition}</p>

            <button
              type="button"
              className="btn-play-pronunciation"
              onClick={() => handlePlayPronunciation(currentEntry)}
            >
              <Volume2 size={14} />
              <span>Listen to Canonical Author Pronunciation</span>
            </button>
          </div>
        </div>

        {/* Search & List */}
        <div className="lexicon-search-bar">
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search fantasy terms, Elvish dialects, mythical creatures..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="lexicon-grid">
          {filtered.map(entry => (
            <div
              key={entry.id}
              className={`lexicon-tile ${entry.id === selectedTermId ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedTermId(entry.id);
              }}
            >
              <div className="lexicon-tile-top">
                <strong>{entry.term}</strong>
                <span className="phonetic-sm">/{entry.phoneticSpelling}/</span>
              </div>
              <span className="origin-sm">{entry.languageOrLoreOrigin}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="lexicon-modal-footer">
          <span className="footer-lexicon-note">
            🔍 Hovering over rare nouns in the live chat or reader highlights this canonical glossary.
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
