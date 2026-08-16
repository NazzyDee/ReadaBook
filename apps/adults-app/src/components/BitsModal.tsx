import React, { useState } from 'react';
import { CHEER_TIERS, type CheerTier } from '../lib/pointsData';
import { X, Sparkles } from 'lucide-react';

interface BitsModalProps {
  streamerName: string;
  onSendCheer: (bits: number, message: string) => void;
  onClose: () => void;
}

export const BitsModal: React.FC<BitsModalProps> = ({ streamerName, onSendCheer, onClose }) => {
  const [selectedTier, setSelectedTier] = useState<CheerTier>(CHEER_TIERS[1]); // default 100 sparks
  const [customBits, setCustomBits] = useState<number>(100);
  const [cheerMessage, setCheerMessage] = useState('Amazing reading voice! Keep up the great chapter! 📖✨');

  const handleSelectTier = (tier: CheerTier) => {
    setSelectedTier(tier);
    setCustomBits(tier.bits);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBits <= 0) return;
    onSendCheer(customBits, cheerMessage);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="bits-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Sparkles size={20} color="#ffd700" />
            <h3>Cheer with Book Sparks</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <p className="bits-modal-subtitle">
          Support <strong>{streamerName}</strong> and celebrate memorable chapter moments with animated on-screen Sparks!
        </p>

        {/* Tier Grid */}
        <div className="cheer-tiers-grid">
          {CHEER_TIERS.map(tier => {
            const isSelected = selectedTier.bits === tier.bits;
            return (
              <button
                key={tier.bits}
                type="button"
                className={`cheer-tier-card ${isSelected ? 'selected' : ''}`}
                style={{ borderColor: isSelected ? tier.color : undefined }}
                onClick={() => handleSelectTier(tier)}
              >
                <span className="tier-icon">{tier.icon}</span>
                <span className="tier-bits" style={{ color: tier.color }}>{tier.bits.toLocaleString()}</span>
                <span className="tier-badge-label">{tier.badgeLevel}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSend} className="cheer-form">
          <div className="cheer-amount-row">
            <label>Sparks Amount:</label>
            <input
              type="number"
              min="1"
              max="100000"
              value={customBits}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 0;
                setCustomBits(val);
              }}
              className="cheer-amount-input"
            />
          </div>

          <div className="cheer-message-group">
            <label>Cheer Message:</label>
            <textarea
              rows={3}
              value={cheerMessage}
              onChange={(e) => setCheerMessage(e.target.value)}
              placeholder="Write a supportive message to appear on stream..."
              className="cheer-textarea"
              maxLength={250}
            />
            <span className="char-count">{cheerMessage.length}/250</span>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-cheer-submit">
              <Sparkles size={16} />
              <span>Cheer {customBits.toLocaleString()} Sparks</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
