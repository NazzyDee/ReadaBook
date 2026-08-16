import React, { useState } from 'react';
import { X, Palette, Check } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

export interface UserChatIdentity {
  nameColor: string;
  activeBadges: ('broadcaster' | 'mod' | 'vip' | 'sub1' | 'founder' | 'sparksTop')[];
}

interface ChatIdentityModalProps {
  currentIdentity: UserChatIdentity;
  onSaveIdentity: (identity: UserChatIdentity) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  { name: 'Neon Blue', hex: '#00e5ff' },
  { name: 'Spring Green', hex: '#00ff88' },
  { name: 'Hot Pink', hex: '#ff477e' },
  { name: 'Electric Violet', hex: '#b5179e' },
  { name: 'Golden Sun', hex: '#ffd700' },
  { name: 'Tangerine', hex: '#ff7b00' },
  { name: 'Coral Red', hex: '#ff3b3b' },
  { name: 'Ice Cyan', hex: '#48cae4' },
  { name: 'Emerald', hex: '#06d6a0' },
  { name: 'Turbo Purple', hex: '#7209b7' }
];

const AVAILABLE_BADGES: { id: 'broadcaster' | 'mod' | 'vip' | 'sub1' | 'founder' | 'sparksTop'; label: string; icon: string }[] = [
  { id: 'sub1', label: 'Subscriber Crest', icon: '📗' },
  { id: 'founder', label: '1st 10 Founder', icon: '⭐' },
  { id: 'vip', label: 'Channel VIP', icon: '💎' },
  { id: 'sparksTop', label: 'Top Sparks Cheerer', icon: '🏆' },
  { id: 'mod', label: 'Moderator', icon: '⚔️' },
  { id: 'broadcaster', label: 'Broadcaster', icon: '🎥' }
];

export const ChatIdentityModal: React.FC<ChatIdentityModalProps> = ({
  currentIdentity,
  onSaveIdentity,
  onClose
}) => {
  const [selectedColor, setSelectedColor] = useState(currentIdentity.nameColor || '#00e5ff');
  const [customHex, setCustomHex] = useState(currentIdentity.nameColor || '#00e5ff');
  const [selectedBadges, setSelectedBadges] = useState(currentIdentity.activeBadges || ['sub1']);

  const handleToggleBadge = (badgeId: 'broadcaster' | 'mod' | 'vip' | 'sub1' | 'founder' | 'sparksTop') => {
    soundFX.playPop();
    if (selectedBadges.includes(badgeId)) {
      setSelectedBadges(selectedBadges.filter(b => b !== badgeId));
    } else {
      if (selectedBadges.length < 3) {
        setSelectedBadges([...selectedBadges, badgeId]);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPop();
    onSaveIdentity({
      nameColor: selectedColor,
      activeBadges: selectedBadges
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="chat-identity-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Palette size={18} color="var(--accent-secondary)" />
            <h3>Chat Identity Studio</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Live Chat Name Preview */}
        <div className="identity-preview-card">
          <span className="preview-label">LIVE CHAT PREVIEW</span>
          <div className="identity-preview-row">
            <div className="preview-badges-row">
              {selectedBadges.map(b => {
                const found = AVAILABLE_BADGES.find(ab => ab.id === b);
                return <span key={b} className="preview-badge-pill">{found?.icon}</span>;
              })}
            </div>
            <strong style={{ color: selectedColor }} className="preview-username">
              You
            </strong>
            <span className="preview-text">: Loving this chapter so much! 📖 PogChamp</span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Name Color Selection */}
          <div className="identity-section">
            <label className="section-label">Username Color:</label>
            <div className="colors-palette-grid">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedColor(c.hex);
                    setCustomHex(c.hex);
                  }}
                  className={`btn-color-swatch ${selectedColor === c.hex ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.hex && <Check size={14} color="#000" />}
                </button>
              ))}
            </div>

            <div className="custom-hex-row">
              <span className="hex-prefix">#</span>
              <input
                type="text"
                maxLength={7}
                value={customHex.replace('#', '')}
                onChange={(e) => {
                  const val = '#' + e.target.value.replace(/[^0-9A-Fa-f]/g, '');
                  setCustomHex(val);
                  if (val.length === 7) setSelectedColor(val);
                }}
                className="custom-hex-input"
                placeholder="Custom HEX..."
              />
              <div className="hex-preview-dot" style={{ backgroundColor: selectedColor }} />
            </div>
          </div>

          {/* Badge Priority Organizer (Up to 3) */}
          <div className="identity-section">
            <div className="section-title-between">
              <label className="section-label">Active Channel Badges (Choose up to 3):</label>
              <span className="badge-count-text">{selectedBadges.length}/3 Selected</span>
            </div>

            <div className="badges-selection-grid">
              {AVAILABLE_BADGES.map(b => {
                const isSelected = selectedBadges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => handleToggleBadge(b.id)}
                    className={`badge-select-box ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="badge-icon-lg">{b.icon}</span>
                    <span className="badge-label-txt">{b.label}</span>
                    {isSelected && <Check size={14} className="badge-check-icon" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Identity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
