import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Volume2, Search, Mic, MapPin } from 'lucide-react';
import {
  MOCK_PRONUNCIATIONS,
  MOCK_CHARACTER_VOICES,
  type PronunciationEntry
} from '../lib/narratorCheatSheetData';
import { soundFX } from '../lib/soundFx';

interface NarratorCheatSheetModalProps {
  streamerName: string;
  onClose: () => void;
}

export const NarratorCheatSheetModal: React.FC<NarratorCheatSheetModalProps> = ({
  streamerName,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredPronunciations = MOCK_PRONUNCIATIONS.filter(p => {
    const matchesSearch = p.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.phonetic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'ALL' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handlePlayPronunciation = (p: PronunciationEntry) => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg(`🗣️ Phonetic Guide: ${p.term} -> ${p.phonetic}`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="cheatsheet-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cheatsheet-modal-header">
          <div className="cheatsheet-title-group">
            <div className="cheatsheet-badge">
              <BookOpen size={16} />
              <span>NARRATOR PRONUNCIATION LEXICON & VOICE CHEAT SHEET</span>
            </div>
            <h3>@{streamerName}'s Second-Screen Teleprompter Notes</h3>
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

        {/* Search Bar */}
        <div className="lexicon-search-bar">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search character names, fantasy locations, spells..."
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="lexicon-filter-tabs">
          {['ALL', 'CHARACTER', 'LOCATION', 'SPELL_OR_ITEM'].map(cat => (
            <button
              key={cat}
              type="button"
              className={`lexicon-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setActiveCategory(cat);
              }}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Pronunciation Grid */}
        <div className="pronunciation-cards-grid">
          {filteredPronunciations.map(p => (
            <div key={p.term} className="pronunciation-card">
              <div className="pronounce-top">
                <div className="term-info">
                  <h4>{p.term}</h4>
                  <span className="lang-tag">{p.languageOrOrigin}</span>
                </div>
                <button
                  type="button"
                  className="btn-play-audio-sample"
                  onClick={() => handlePlayPronunciation(p)}
                  title="Play pronunciation chime"
                >
                  <Volume2 size={15} color="var(--accent-teal)" />
                </button>
              </div>

              <div className="phonetic-box">
                <span className="phonetic-text">{p.phonetic}</span>
              </div>

              <p className="sample-note">{p.audioSampleNote}</p>
            </div>
          ))}
        </div>

        {/* Character Voice Accents Quick Reference */}
        <div className="character-voices-section">
          <div className="voices-section-title">
            <Mic size={16} color="#ffd700" />
            <h4>Character Dialect & Accent Memory Triggers</h4>
          </div>

          <div className="character-voices-grid">
            {MOCK_CHARACTER_VOICES.map(cv => (
              <div key={cv.characterName} className="voice-memo-card">
                <div className="voice-card-top">
                  <strong>{cv.characterName}</strong>
                  <span className="pitch-tag">{cv.pitch}</span>
                </div>
                <div className="accent-line">
                  <MapPin size={12} color="var(--accent-secondary)" />
                  <span>{cv.accent}</span>
                </div>
                <p className="mannerisms-text">"{cv.mannerisms}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="cheatsheet-modal-footer">
          <button
            type="button"
            className="btn-primary btn-close-cheat"
            onClick={onClose}
          >
            <span>Close Teleprompter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
