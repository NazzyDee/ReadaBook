import React, { useState } from 'react';
import { X, MessageSquare, Palette, Type, Eye, Sparkles, Check } from 'lucide-react';
import { CHAT_NAME_COLORS, DEFAULT_CHAT_PREFS, type ChatPreferences } from '../lib/chatCustomizerData';
import { soundFX } from '../lib/soundFx';

interface ChatSettingsStudioModalProps {
  onClose: () => void;
  onSavePrefs?: (prefs: ChatPreferences) => void;
}

export const ChatSettingsStudioModal: React.FC<ChatSettingsStudioModalProps> = ({
  onClose,
  onSavePrefs
}) => {
  const [prefs, setPrefs] = useState<ChatPreferences>(DEFAULT_CHAT_PREFS);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const selectedColor = CHAT_NAME_COLORS.find(c => c.id === prefs.nameColorId) || CHAT_NAME_COLORS[0];

  const handleSave = () => {
    soundFX.playChestClaim();
    if (onSavePrefs) {
      onSavePrefs(prefs);
    }
    setSavedToast('✨ Chat appearance preferences saved successfully!');
    setTimeout(() => setSavedToast(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="chat-studio-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-studio-header">
          <div className="chat-studio-title-group">
            <div className="chat-studio-badge">
              <MessageSquare size={16} />
              <span>LITERARY CHAT APPEARANCE & IDENTITY STUDIO</span>
            </div>
            <h3>Chat Customizer & Name Glow</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {savedToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{savedToast}</span>
          </div>
        )}

        {/* Live Message Preview Deck */}
        <div className="chat-preview-box">
          <span className="preview-heading">YOUR LIVE CHAT APPEARANCE:</span>
          <div className={`chat-preview-bubble font-${prefs.fontSize} ${prefs.zenReadingMode ? 'zen-mode' : ''}`}>
            {prefs.showTimestamps && <span className="preview-timestamp">12:45</span>}
            <span className="preview-badges">
              {prefs.selectedBadges.map((b, i) => (
                <span key={i} className="mini-badge-pill">{b}</span>
              ))}
            </span>
            <strong
              className="preview-username"
              style={{ color: selectedColor.hex, textShadow: `0 0 10px ${selectedColor.glow}` }}
            >
              Reader_Champion:
            </strong>
            <span className="preview-body">
              This chapter in Moria is giving me absolute chills! 📖✨
            </span>
          </div>
        </div>

        {/* Customization Options Grid */}
        <div className="chat-custom-grid">
          {/* Color Palette Picker */}
          <div className="custom-section-card">
            <h4>
              <Palette size={16} color="var(--accent-primary)" />
              <span>Username Glow Color</span>
            </h4>

            <div className="color-swatches-row">
              {CHAT_NAME_COLORS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`color-swatch-btn ${prefs.nameColorId === c.id ? 'active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => {
                    soundFX.playPop();
                    setPrefs({ ...prefs, nameColorId: c.id });
                  }}
                  title={c.name}
                >
                  {prefs.nameColorId === c.id && <Check size={14} color="#000" />}
                </button>
              ))}
            </div>
          </div>

          {/* Typography Sizing */}
          <div className="custom-section-card">
            <h4>
              <Type size={16} color="var(--accent-secondary)" />
              <span>Chat Font Size</span>
            </h4>

            <div className="font-size-options">
              {(['small', 'medium', 'large'] as const).map(sz => (
                <button
                  key={sz}
                  type="button"
                  className={`size-chip-btn ${prefs.fontSize === sz ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setPrefs({ ...prefs, fontSize: sz });
                  }}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Zen & Toggles */}
          <div className="custom-section-card full-width">
            <h4>
              <Eye size={16} color="var(--accent-success)" />
              <span>Reading Mode & Overlays</span>
            </h4>

            <div className="toggles-grid">
              <label className="chat-toggle-label">
                <input
                  type="checkbox"
                  checked={prefs.zenReadingMode}
                  onChange={e => setPrefs({ ...prefs, zenReadingMode: e.target.checked })}
                />
                <span>Zen Mode (Muted background, distraction-free reading focus)</span>
              </label>

              <label className="chat-toggle-label">
                <input
                  type="checkbox"
                  checked={prefs.showTimestamps}
                  onChange={e => setPrefs({ ...prefs, showTimestamps: e.target.checked })}
                />
                <span>Display message timestamps</span>
              </label>

              <label className="chat-toggle-label">
                <input
                  type="checkbox"
                  checked={prefs.highlightAuthorMessages}
                  onChange={e => setPrefs({ ...prefs, highlightAuthorMessages: e.target.checked })}
                />
                <span>Gold highlight for Verified Author & Narrator comments</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="chat-studio-footer">
          <button type="button" className="btn-primary btn-save-chat-prefs" onClick={handleSave}>
            <span>Save & Apply Chat Identity</span>
          </button>
        </div>
      </div>
    </div>
  );
};
