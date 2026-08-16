import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ onClose }) => {
  const shortcuts = [
    { key: 'Space / K', desc: 'Play / Pause stream video' },
    { key: 'M', desc: 'Mute / Unmute audio' },
    { key: 'F', desc: 'Toggle Fullscreen mode' },
    { key: 'Alt + T', desc: 'Toggle Theater mode' },
    { key: 'Alt + X', desc: 'Open Clip Studio (Quick Clip)' },
    { key: 'Up / Down Arrow', desc: 'Increase / Decrease volume' },
    { key: 'Left / Right Arrow', desc: 'Previous / Next Book page' },
    { key: '?', desc: 'Open this Keyboard Shortcuts cheat sheet' }
  ];

  return (
    <div className="modal-backdrop">
      <div className="shortcuts-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Command size={18} color="var(--accent-secondary)" />
            <h3>Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="shortcuts-list">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="shortcut-row">
              <span className="shortcut-desc">{sc.desc}</span>
              <kbd className="shortcut-kbd">{sc.key}</kbd>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
