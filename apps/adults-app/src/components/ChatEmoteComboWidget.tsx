import React, { useState } from 'react';
import { X, Flame, Sparkles, Zap } from 'lucide-react';
import { SAMPLE_EMOTE_COMBOS, type EmoteComboEvent } from '../lib/emoteComboData';
import { soundFX } from '../lib/soundFx';

interface ChatEmoteComboWidgetProps {
  onClose?: () => void;
}

export const ChatEmoteComboWidget: React.FC<ChatEmoteComboWidgetProps> = ({ onClose }) => {
  const [activeCombo, setActiveCombo] = useState<EmoteComboEvent>(SAMPLE_EMOTE_COMBOS[0]);
  const [comboCount, setComboCount] = useState<number>(activeCombo.count);

  const handleIncrementCombo = () => {
    soundFX.playPop();
    const newCount = comboCount + 1;
    setComboCount(newCount);

    if (newCount % 5 === 0) {
      soundFX.playDragonRoar();
    }
  };

  const handleSwitchEmote = (combo: EmoteComboEvent) => {
    soundFX.playChestClaim();
    setActiveCombo(combo);
    setComboCount(combo.count);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="combo-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="combo-modal-header">
          <div className="combo-title-group">
            <div className="combo-badge">
              <Flame size={16} />
              <span>LIVE CHAT EMOTE COMBO STREAK HUD</span>
            </div>
            <h3>Emote Hype Combos & Reading Multipliers</h3>
          </div>

          {onClose && (
            <button onClick={onClose} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Big Animated Combo Banner */}
        <div
          className="active-combo-banner-box"
          style={{ borderColor: activeCombo.glowColor, boxShadow: `0 0 30px ${activeCombo.glowColor}33` }}
        >
          <div className="combo-emoji-large bounce-anim">
            {activeCombo.emoji}
          </div>

          <div className="combo-counter-group">
            <div className="combo-number-display" style={{ color: activeCombo.glowColor }}>
              x{comboCount}
            </div>
            <strong className="combo-title-text">{activeCombo.multiplierText}</strong>
            <span className="combo-sub-text">Chatters are spamming {activeCombo.emoji} in sync!</span>
          </div>

          <button
            type="button"
            className="btn-primary btn-spam-emote"
            onClick={handleIncrementCombo}
          >
            <Zap size={15} />
            <span>Join Combo! +1 {activeCombo.emoji}</span>
          </button>
        </div>

        {/* Emote Presets Selection */}
        <div className="combo-presets-row">
          <label>Select Emote Hype Stream:</label>
          <div className="presets-buttons-grid">
            {SAMPLE_EMOTE_COMBOS.map(c => (
              <button
                key={c.emoteCode}
                type="button"
                className={`preset-combo-chip ${activeCombo.emoteCode === c.emoteCode ? 'active' : ''}`}
                style={{ borderColor: activeCombo.emoteCode === c.emoteCode ? c.glowColor : undefined }}
                onClick={() => handleSwitchEmote(c)}
              >
                <span className="preset-emoji">{c.emoji}</span>
                <span>{c.emoteCode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="combo-modal-footer">
          <div className="footer-hype-meta">
            <Sparkles size={14} color="#ffd700" />
            <span>Emote streaks multiply community reading Sparks for 60 seconds.</span>
          </div>

          {onClose && (
            <button
              type="button"
              className="btn-secondary btn-close-combo"
              onClick={onClose}
            >
              <span>Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
