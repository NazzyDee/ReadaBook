import React, { useState } from 'react';
import { EMOTES } from '../lib/emotesData';
import { Search, X } from 'lucide-react';

interface EmotePickerProps {
  onSelectEmote: (emoteCode: string) => void;
  onClose: () => void;
}

export const EmotePicker: React.FC<EmotePickerProps> = ({ onSelectEmote, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bookish' | 'twitch'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmotes = EMOTES.filter(emote => {
    const matchesTab = activeTab === 'all' || emote.category === activeTab;
    const matchesSearch = searchQuery
      ? emote.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emote.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesTab && matchesSearch;
  });

  return (
    <div className="emote-picker-popover">
      <div className="emote-picker-header">
        <span className="emote-picker-title">Emotes</span>
        <button onClick={onClose} className="emote-picker-close-btn" title="Close">
          <X size={16} />
        </button>
      </div>

      <div className="emote-picker-search-container">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Search emotes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="emote-search-input"
          autoFocus
        />
      </div>

      <div className="emote-picker-tabs">
        <button
          className={`emote-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`emote-tab-btn ${activeTab === 'bookish' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookish')}
        >
          📖 Bookish
        </button>
        <button
          className={`emote-tab-btn ${activeTab === 'twitch' ? 'active' : ''}`}
          onClick={() => setActiveTab('twitch')}
        >
          👾 Twitch
        </button>
      </div>

      <div className="emote-grid">
        {filteredEmotes.length === 0 ? (
          <div className="emote-empty">No emotes found</div>
        ) : (
          filteredEmotes.map(emote => (
            <button
              key={emote.code}
              className="emote-item-btn"
              onClick={() => onSelectEmote(emote.code)}
              title={`${emote.code} - ${emote.description}`}
            >
              <span className="emote-symbol">{emote.emojiOrUrl}</span>
              <span className="emote-label">{emote.code}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
