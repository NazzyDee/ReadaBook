import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { BOOK_SPOILER_RULES, type SpoilerRule } from '../lib/spoilerFilter';
import { soundFX } from '../lib/soundFx';

interface SpoilerFirewallModalProps {
  currentStreamChapter: number;
  userReadingLevel: number;
  isBroadcaster?: boolean;
  onUpdateUserLevel: (chapter: number) => void;
  onClose: () => void;
}

export const SpoilerFirewallModal: React.FC<SpoilerFirewallModalProps> = ({
  currentStreamChapter,
  userReadingLevel,
  isBroadcaster = false,
  onUpdateUserLevel,
  onClose
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(userReadingLevel);
  const [customKeyword, setCustomKeyword] = useState('');
  const [customChapter, setCustomChapter] = useState(currentStreamChapter + 2);
  const [customRules, setCustomRules] = useState<SpoilerRule[]>(BOOK_SPOILER_RULES['book_lotr'] || []);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSaveLevel = (level: number) => {
    soundFX.playPop();
    setSelectedLevel(level);
    onUpdateUserLevel(level);
    setToastMsg(`Updated reading progress: Chapter ${level === 999 ? 'Completed (All Unmasked)' : level}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleAddCustomRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKeyword.trim()) return;
    soundFX.playPop();
    const newRule: SpoilerRule = {
      keyword: customKeyword.trim(),
      chapter: customChapter,
      description: 'Custom Broadcaster Rule'
    };
    setCustomRules([...customRules, newRule]);
    setCustomKeyword('');
    setToastMsg(`Added spoiler filter: "${newRule.keyword}" (Chapter ${newRule.chapter}+)`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleDeleteRule = (kw: string) => {
    soundFX.playPop();
    setCustomRules(customRules.filter(r => r.keyword !== kw));
  };

  return (
    <div className="modal-backdrop">
      <div className="spoiler-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <ShieldAlert size={20} color="#00ff88" />
            <h3>Chapter-Gated Dynamic Spoiler Firewall</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {toastMsg && (
          <div className="spoiler-toast">
            <CheckCircle2 size={15} color="#00ff88" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Stream Reading Level Status */}
        <div className="spoiler-status-box">
          <div className="status-left">
            <BookOpen size={18} color="var(--accent-secondary)" />
            <div>
              <strong>Streamer Live Head: Chapter {currentStreamChapter}</strong>
              <p>Chat messages referencing events ahead of this chapter are automatically masked with click-to-reveal pills.</p>
            </div>
          </div>
        </div>

        {/* User Reading Progress Selector */}
        <div className="spoiler-section">
          <label className="section-label">Your Reading Progress (Controls what you see):</label>
          <div className="reading-levels-grid">
            <button
              type="button"
              onClick={() => handleSaveLevel(currentStreamChapter)}
              className={`btn-level-card ${selectedLevel === currentStreamChapter ? 'active' : ''}`}
            >
              <EyeOff size={16} />
              <div>
                <strong>Synced with Streamer</strong>
                <span>Chapter {currentStreamChapter} (Maximum Protection)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSaveLevel(5)}
              className={`btn-level-card ${selectedLevel === 5 ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <div>
                <strong>Finished Chapter 5</strong>
                <span>Mask events past Chapter 5</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSaveLevel(15)}
              className={`btn-level-card ${selectedLevel === 15 ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <div>
                <strong>Finished Chapter 15</strong>
                <span>Mask events past Chapter 15</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSaveLevel(999)}
              className={`btn-level-card ${selectedLevel === 999 ? 'active' : ''}`}
            >
              <Eye size={16} />
              <div>
                <strong>Completed Book</strong>
                <span>Unmask all messages (No Filter)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Broadcaster Rule Vault (If Broadcaster) */}
        {isBroadcaster && (
          <div className="spoiler-section broadcaster-rules">
            <label className="section-label">Broadcaster Spoiler Shield Keywords ({customRules.length}):</label>
            <div className="rules-tags-cloud">
              {customRules.map(rule => (
                <div key={rule.keyword} className="rule-tag-chip">
                  <span>"{rule.keyword}" (Ch. {rule.chapter}+)</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.keyword)}
                    className="btn-del-rule"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddCustomRule} className="add-rule-form">
              <input
                type="text"
                placeholder="Add spoiler phrase (e.g. Boromir death)..."
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                className="add-rule-input"
              />
              <input
                type="number"
                min="1"
                max="50"
                value={customChapter}
                onChange={(e) => setCustomChapter(parseInt(e.target.value, 10))}
                className="add-chapter-input"
                title="Chapter number"
              />
              <button type="submit" className="btn-add-rule">
                <Plus size={14} /> Add
              </button>
            </form>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
