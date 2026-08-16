import React, { useState } from 'react';
import { X, Search, ShieldAlert, Eye, EyeOff, BookOpen, Layers } from 'lucide-react';
import { MOCK_LORE_ENTRIES } from '../lib/loreWikiData';
import { soundFX } from '../lib/soundFx';

interface LoreGlossaryOverlayProps {
  currentPage?: number;
  bookTitle?: string;
  onClose: () => void;
}

export const LoreGlossaryOverlay: React.FC<LoreGlossaryOverlayProps> = ({
  currentPage = 140,
  bookTitle = 'The Fellowship of the Ring',
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Character' | 'Artifact' | 'Realm' | 'Faction'>('All');
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

  const toggleReveal = (entryId: string) => {
    soundFX.playPop();
    setRevealedSpoilers(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };

  const filteredEntries = MOCK_LORE_ENTRIES.filter(e => {
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.safeIntro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.affiliations.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="lore-wiki-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="lore-wiki-header">
          <div className="lore-wiki-title-group">
            <div className="lore-wiki-badge">
              <Layers size={16} />
              <span>SPOILER-SHIELDED LORE & CHARACTER ENCYCLOPEDIA</span>
            </div>
            <h3>{bookTitle} — Live Lore Codex</h3>
          </div>

          <div className="lore-header-right">
            <div className="stream-page-anchor">
              <BookOpen size={14} color="var(--accent-secondary)" />
              <span>Broadcast at <strong>Page {currentPage}</strong></span>
            </div>

            <button onClick={onClose} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="lore-wiki-controls">
          <div className="lore-search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search characters, artifacts, realms, factions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="lore-category-chips">
            {(['All', 'Character', 'Artifact', 'Realm', 'Faction'] as const).map(cat => (
              <button
                key={cat}
                className={`lore-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedCategory(cat);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Entries Grid */}
        <div className="lore-entries-grid">
          {filteredEntries.map(entry => {
            const isSpoilerSafe = currentPage >= entry.revealsAtPage;
            const isManuallyRevealed = !!revealedSpoilers[entry.id];
            const showSpoiler = isSpoilerSafe || isManuallyRevealed;

            return (
              <div key={entry.id} className="lore-entry-card">
                <div className="lore-entry-top">
                  <div className="lore-avatar-badge">
                    <span className="lore-avatar-emoji">{entry.avatarEmoji}</span>
                  </div>

                  <div className="lore-entry-heading">
                    <h4>{entry.name}</h4>
                    <span className="lore-category-pill">{entry.category}</span>
                  </div>

                  <div className="lore-page-anchor-tag">
                    <span>Lore unlocks p. {entry.revealsAtPage}</span>
                  </div>
                </div>

                <p className="lore-safe-intro">{entry.safeIntro}</p>

                {/* Affiliations Tags */}
                <div className="lore-affiliations-row">
                  {entry.affiliations.map(aff => (
                    <span key={aff} className="lore-aff-tag">#{aff}</span>
                  ))}
                </div>

                {/* Spoiler Shield Section */}
                <div className={`lore-spoiler-box ${showSpoiler ? 'unshielded' : 'shielded'}`}>
                  <div className="spoiler-box-header">
                    <span className="spoiler-label">
                      <ShieldAlert size={13} />
                      <span>{isSpoilerSafe ? 'LORE CANON (CURRENT CHAPTER)' : 'POTENTIAL FUTURE SPOILER'}</span>
                    </span>

                    {!isSpoilerSafe && (
                      <button
                        type="button"
                        className="btn-toggle-spoiler"
                        onClick={() => toggleReveal(entry.id)}
                      >
                        {isManuallyRevealed ? (
                          <>
                            <EyeOff size={13} />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye size={13} />
                            <span>Reveal (Page {entry.revealsAtPage}+)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <p className="spoiler-text-content">
                    {showSpoiler ? entry.spoilerContent : '•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••• (Hidden to protect your reading experience)'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
