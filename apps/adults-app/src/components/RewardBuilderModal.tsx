import React, { useState } from 'react';
import { Sparkles, X, Plus, Check } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

export interface CustomReward {
  id: string;
  title: string;
  cost: number;
  icon: string;
  description: string;
  requiresInput: boolean;
  cooldownSeconds: number;
}

interface RewardBuilderModalProps {
  onAddReward: (reward: CustomReward) => void;
  onClose: () => void;
}

export const RewardBuilderModal: React.FC<RewardBuilderModalProps> = ({ onAddReward, onClose }) => {
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(250);
  const [icon, setIcon] = useState('🍵');
  const [description, setDescription] = useState('');
  const [requiresInput, setRequiresInput] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [saved, setSaved] = useState(false);

  const availableIcons = ['🍵', '📖', '🎭', '🔥', '✨', '👑', '📜', '🎙️', '🎶', '💡', '🏆', '⚔️'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundFX.playChestClaim();
    const newReward: CustomReward = {
      id: `custom_reward_${Date.now()}`,
      title: title.trim(),
      cost: Number(cost) || 100,
      icon,
      description: description.trim() || 'Custom Channel Point Reward',
      requiresInput,
      cooldownSeconds: Number(cooldownSeconds) || 0
    };

    onAddReward(newReward);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop">
      <div className="reward-builder-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Sparkles size={20} color="#ffd700" />
            <h3>Create Custom Channel Point Reward</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {saved ? (
          <div className="reward-saved-toast">
            <Check size={16} />
            <span>Reward "{title}" created and added to your channel store!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reward-form">
            <div className="form-group">
              <label>Reward Title:</label>
              <input
                type="text"
                placeholder="e.g. Sip of Warm Tea, Dramatic Voice Impersonation..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="settings-text-input"
                required
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label>Token Cost:</label>
                <input
                  type="number"
                  min={10}
                  max={50000}
                  step={50}
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="settings-text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Cooldown (seconds):</label>
                <input
                  type="number"
                  min={0}
                  max={3600}
                  step={10}
                  value={cooldownSeconds}
                  onChange={(e) => setCooldownSeconds(Number(e.target.value))}
                  className="settings-text-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reward Icon:</label>
              <div className="icons-selector-grid">
                {availableIcons.map(ic => (
                  <button
                    type="button"
                    key={ic}
                    className={`btn-icon-choice ${icon === ic ? 'active' : ''}`}
                    onClick={() => setIcon(ic)}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Reward Description (optional):</label>
              <textarea
                rows={2}
                placeholder="Tell viewers what happens when they redeem this reward..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="settings-textarea"
              />
            </div>

            <div className="setting-toggle-row" style={{ marginTop: '8px' }}>
              <div>
                <span className="setting-name">Require Viewer Text Input</span>
                <p className="setting-desc">Viewer must provide a message or prompt when redeeming</p>
              </div>
              <input
                type="checkbox"
                checked={requiresInput}
                onChange={(e) => setRequiresInput(e.target.checked)}
                className="toggle-checkbox"
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Plus size={16} />
                <span>Create Reward</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
