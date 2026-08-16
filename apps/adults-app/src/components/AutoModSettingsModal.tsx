import React, { useState } from 'react';
import { ShieldAlert, X, Plus, Trash2, Check, Save } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface AutoModSettingsModalProps {
  onClose: () => void;
}

export const AutoModSettingsModal: React.FC<AutoModSettingsModalProps> = ({ onClose }) => {
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(2);
  const [blockLinks, setBlockLinks] = useState(true);
  const [chatDelay, setChatDelay] = useState<number>(2);
  const [blockedWords, setBlockedWords] = useState<string[]>([
    'spoiler', 'ending leaked', 'character death', 'free tokens hack'
  ]);
  const [newWord, setNewWord] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    soundFX.playPop();
    setBlockedWords(prev => [...prev, newWord.trim().toLowerCase()]);
    setNewWord('');
  };

  const handleRemoveWord = (word: string) => {
    soundFX.playPop();
    setBlockedWords(prev => prev.filter(w => w !== word));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playChestClaim();
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop">
      <div className="automod-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <ShieldAlert size={20} color="var(--accent-primary)" />
            <h3>AutoMod & Safety Settings</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {saved ? (
          <div className="automod-saved-toast">
            <Check size={16} />
            <span>AutoMod rules and blocked terms saved!</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="automod-form">
            {/* AutoMod Sensitivity Level */}
            <div className="form-group">
              <label>AutoMod Sensitivity Level:</label>
              <div className="automod-level-slider-grid">
                {[
                  { lvl: 1, title: 'Level 1', desc: 'Minimal filtering' },
                  { lvl: 2, title: 'Level 2 (Recommended)', desc: 'Blocks hostile remarks & slurs' },
                  { lvl: 3, title: 'Level 3', desc: 'Strict anti-harassment & spam filter' },
                  { lvl: 4, title: 'Level 4', desc: 'Maximum hold for moderator review' }
                ].map(item => (
                  <div
                    key={item.lvl}
                    className={`automod-level-card ${level === item.lvl ? 'active' : ''}`}
                    onClick={() => setLevel(item.lvl as any)}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blocked Words & Spoiler Phrases */}
            <div className="form-group">
              <label>Custom Blocked Words & Spoiler Phrases:</label>
              <div className="blocked-words-list">
                {blockedWords.map(w => (
                  <span key={w} className="blocked-word-chip">
                    <span>{w}</span>
                    <button type="button" onClick={() => handleRemoveWord(w)}>
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="add-word-inline-row">
                <input
                  type="text"
                  placeholder="Add phrase to block (e.g. plot spoiler)..."
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="add-word-input"
                />
                <button type="button" onClick={handleAddWord} className="btn-primary btn-add-word">
                  <Plus size={14} />
                  <span>Add Word</span>
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="setting-toggle-row">
              <div>
                <span className="setting-name">Block Non-Moderator Hyperlinks</span>
                <p className="setting-desc">Prevent unauthorized links and spam URLs in chat</p>
              </div>
              <input
                type="checkbox"
                checked={blockLinks}
                onChange={(e) => setBlockLinks(e.target.checked)}
                className="toggle-checkbox"
              />
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <label>Chat Message Delay (Non-Moderators):</label>
              <select
                value={chatDelay}
                onChange={(e) => setChatDelay(Number(e.target.value))}
                className="settings-select-input"
              >
                <option value={0}>No Delay (Instant)</option>
                <option value={2}>2 Seconds (Allows AutoMod review)</option>
                <option value={4}>4 Seconds</option>
                <option value={6}>6 Seconds</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save size={16} />
                <span>Save AutoMod Rules</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
