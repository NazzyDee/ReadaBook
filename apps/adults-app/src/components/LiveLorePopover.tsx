import React, { useState } from 'react';
import {
  X,
  Volume2,
  ShieldCheck,
  MapPin,
  User,
  Sparkles,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { type LoreEntity } from '../lib/loreData';
import { soundFX } from '../lib/soundFx';

interface LiveLorePopoverProps {
  entity: LoreEntity;
  onAskChat?: (prompt: string) => void;
  onClose: () => void;
}

export const LiveLorePopover: React.FC<LiveLorePopoverProps> = ({
  entity,
  onAskChat,
  onClose
}) => {
  const [showTrivia, setShowTrivia] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handlePronounce = () => {
    soundFX.playPop();
    if ('speechSynthesis' in window) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(entity.name);
      utterance.rate = 0.85;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAskInChat = () => {
    soundFX.playPop();
    if (onAskChat) {
      onAskChat(`What does everyone think of ${entity.name} so far?`);
    }
    onClose();
  };

  return (
    <div className="live-lore-popover-card">
      {/* Header */}
      <div className="lore-card-header">
        <div className="lore-type-badge">
          {entity.type === 'character' ? (
            <User size={13} color="#00e5ff" />
          ) : entity.type === 'location' ? (
            <MapPin size={13} color="#00ff88" />
          ) : (
            <Sparkles size={13} color="#ffd700" />
          )}
          <span>{entity.type.toUpperCase()} DOSSIER</span>
        </div>

        <button onClick={onClose} className="lore-card-close-btn" title="Close Lore">
          <X size={15} />
        </button>
      </div>

      {/* Profile Section */}
      <div className="lore-profile-row">
        <img src={entity.avatarUrl} alt={entity.name} className="lore-entity-avatar" />
        <div className="lore-profile-meta">
          <h3>{entity.name}</h3>
          <span className="lore-entity-title">{entity.title}</span>
          <div className="lore-pronounce-row">
            <button
              type="button"
              onClick={handlePronounce}
              className={`btn-pronounce-audio ${speaking ? 'speaking' : ''}`}
              title="Listen to pronunciation"
            >
              <Volume2 size={13} />
              <span>{entity.pronunciation}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spoiler Guardrail Status */}
      <div className="lore-spoiler-status-pill">
        <ShieldCheck size={14} color="#00ff88" />
        <span>Spoiler-Free: Safe for Chapter {entity.spoilerSafeChapter}+</span>
      </div>

      {/* Summary */}
      <div className="lore-summary-section">
        <p>{entity.summary}</p>
      </div>

      {/* Key Quote */}
      {entity.keyQuote && (
        <blockquote className="lore-key-quote">
          {entity.keyQuote}
        </blockquote>
      )}

      {/* Alliances & Realm Grid */}
      <div className="lore-relations-grid">
        <div className="relations-card">
          <span className="rel-label">Faction / Realm:</span>
          <strong>{entity.factionOrRealm}</strong>
        </div>

        {entity.allies.length > 0 && (
          <div className="relations-card">
            <span className="rel-label">Key Allies:</span>
            <div className="allies-pills">
              {entity.allies.map(a => (
                <span key={a} className="ally-pill">{a}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expandable Trivia Accordion */}
      {entity.trivia && entity.trivia.length > 0 && (
        <div className="lore-trivia-accordion">
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setShowTrivia(!showTrivia);
            }}
            className="btn-toggle-trivia"
          >
            <HelpCircle size={14} color="#ffd700" />
            <span>Lore Trivia & Hidden Secrets ({entity.trivia.length})</span>
          </button>
          {showTrivia && (
            <ul className="trivia-list">
              {entity.trivia.map((t, idx) => (
                <li key={idx} className="trivia-item">• {t}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="lore-actions-bar">
        <button
          type="button"
          onClick={handleAskInChat}
          className="btn-lore-ask-chat"
        >
          <MessageSquare size={13} />
          <span>Ask Chat About {entity.name.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  );
};
