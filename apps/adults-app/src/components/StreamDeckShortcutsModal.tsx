import React, { useState } from 'react';
import { X, Keyboard, Download, Sparkles, Sliders, Play } from 'lucide-react';
import { MOCK_STREAM_DECK_KEYS, type StreamDeckKeyMapping } from '../lib/streamDeckData';
import { soundFX } from '../lib/soundFx';

interface StreamDeckShortcutsModalProps {
  onClose: () => void;
}

export const StreamDeckShortcutsModal: React.FC<StreamDeckShortcutsModalProps> = ({
  onClose
}) => {
  const [keys] = useState<StreamDeckKeyMapping[]>(MOCK_STREAM_DECK_KEYS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTestKey = (keyAction: StreamDeckKeyMapping) => {
    if (keyAction.id === 'key_sound_harp') soundFX.playHarp();
    else if (keyAction.id === 'key_panic_shield') soundFX.playThunder();
    else if (keyAction.id === 'key_page_next' || keyAction.id === 'key_page_prev') soundFX.playPageRustle();
    else soundFX.playPop();

    setToastMessage(`⚡ Executed: [${keyAction.defaultKey}] ${keyAction.actionName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportProfile = () => {
    soundFX.playChestClaim();
    setToastMessage('💾 Exported "ReadaBook_StreamDeck_Profile.streamDeckProfile" JSON mapping!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="streamdeck-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="streamdeck-modal-header">
          <div className="streamdeck-title-group">
            <div className="streamdeck-badge">
              <Keyboard size={16} />
              <span>ELGATO STREAM DECK & BROADCASTER HOTKEYS</span>
            </div>
            <h3>Stream Deck Key Bindings & Shortcuts</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMessage}</span>
          </div>
        )}

        <p className="streamdeck-intro-text">
          Control your live book broadcast seamlessly with global keyboard shortcuts or 1-touch hardware keys on your Elgato Stream Deck.
        </p>

        {/* Shortcuts Grid */}
        <div className="streamdeck-grid">
          {keys.map(k => (
            <div key={k.id} className="streamdeck-key-card">
              <div className="key-card-top">
                <div className="key-icon-box">{k.icon}</div>
                <div className="key-meta-text">
                  <strong>{k.actionName}</strong>
                  <span className="key-cat-tag">{k.category}</span>
                </div>
              </div>

              <p className="key-desc">{k.description}</p>

              <div className="key-card-bottom">
                <span className="hotkey-badge">{k.defaultKey}</span>
                <button
                  type="button"
                  className="btn-test-key"
                  onClick={() => handleTestKey(k)}
                  title="Simulate Keypress"
                >
                  <Play size={12} />
                  <span>Test Key</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="streamdeck-footer">
          <div className="footer-left-meta">
            <Sliders size={15} color="var(--text-muted)" />
            <span>Compatible with Elgato Stream Deck MK.2, Stream Deck +, and Loupedeck.</span>
          </div>

          <button
            type="button"
            className="btn-primary btn-export-profile"
            onClick={handleExportProfile}
          >
            <Download size={16} />
            <span>Export Stream Deck Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
