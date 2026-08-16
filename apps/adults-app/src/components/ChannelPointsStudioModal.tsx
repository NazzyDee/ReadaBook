import React, { useState } from 'react';
import { X, Sparkles, Plus, Check, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { DEFAULT_CHANNEL_POINT_REWARDS, type CustomPointReward } from '../lib/channelPointsStudioData';
import { soundFX } from '../lib/soundFx';

interface ChannelPointsStudioModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ChannelPointsStudioModal: React.FC<ChannelPointsStudioModalProps> = ({
  streamerName,
  onClose
}) => {
  const [rewards, setRewards] = useState<CustomPointReward[]>(DEFAULT_CHANNEL_POINT_REWARDS);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(1000);
  const [newIcon, setNewIcon] = useState('📖');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState('#ffd700');
  const [newRequiresInput, setNewRequiresInput] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleToggleReward = (id: string) => {
    soundFX.playPop();
    setRewards(prev =>
      prev.map(r => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  const handleDeleteReward = (id: string) => {
    soundFX.playPop();
    setRewards(prev => prev.filter(r => r.id !== id));
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundFX.playChestClaim();
    const newReward: CustomPointReward = {
      id: `reward_${Date.now()}`,
      title: newTitle.trim(),
      cost: newCost,
      icon: newIcon || '📖',
      backgroundColor: newColor,
      description: newDesc.trim() || 'Custom community reading reward.',
      requiresUserInput: newRequiresInput,
      cooldownSeconds: 120,
      isEnabled: true
    };

    setRewards(prev => [newReward, ...prev]);
    setIsCreatingNew(false);
    setNewTitle('');
    setNewDesc('');
    setSaveToast(`✨ Created custom reward "${newReward.title}"!`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="point-studio-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="point-studio-header">
          <div className="point-studio-title-group">
            <div className="point-studio-badge">
              <Sparkles size={16} />
              <span>SPARKS & CHANNEL POINTS REWARD STUDIO</span>
            </div>
            <h3>@{streamerName}'s Custom Channel Point Rewards</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {saveToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{saveToast}</span>
          </div>
        )}

        <div className="point-studio-top-bar">
          <p className="point-studio-intro">
            Create interactive rewards that viewers can redeem using their earned stream reading Sparks.
          </p>

          <button
            type="button"
            className="btn-primary btn-new-reward"
            onClick={() => setIsCreatingNew(!isCreatingNew)}
          >
            {isCreatingNew ? <X size={14} /> : <Plus size={14} />}
            <span>{isCreatingNew ? 'Cancel' : 'Create Custom Reward'}</span>
          </button>
        </div>

        {/* Creation Form Modal/Panel */}
        {isCreatingNew && (
          <form className="new-reward-form" onSubmit={handleCreateReward}>
            <h4>Create New Custom Reward</h4>
            <div className="form-grid-2col">
              <div className="form-input-group">
                <label>Reward Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Do a Dramatic Villain Laugh"
                />
              </div>

              <div className="form-input-group">
                <label>Cost (Sparks):</label>
                <input
                  type="number"
                  required
                  min={50}
                  step={50}
                  value={newCost}
                  onChange={e => setNewCost(Number(e.target.value))}
                />
              </div>

              <div className="form-input-group">
                <label>Emoji Icon:</label>
                <input
                  type="text"
                  maxLength={4}
                  value={newIcon}
                  onChange={e => setNewIcon(e.target.value)}
                  placeholder="🎭"
                />
              </div>

              <div className="form-input-group">
                <label>Card Color:</label>
                <input
                  type="color"
                  value={newColor}
                  onChange={e => setNewColor(e.target.value)}
                />
              </div>

              <div className="form-input-group full-span">
                <label>Description:</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Explain what happens when a viewer redeems this reward..."
                />
              </div>

              <div className="form-checkbox-group full-span">
                <label>
                  <input
                    type="checkbox"
                    checked={newRequiresInput}
                    onChange={e => setNewRequiresInput(e.target.checked)}
                  />
                  <span>Require viewer to enter a text prompt when redeeming</span>
                </label>
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn-primary btn-save-reward">
                <Check size={14} />
                <span>Save & Activate Reward</span>
              </button>
            </div>
          </form>
        )}

        {/* Rewards List */}
        <div className="point-rewards-grid">
          {rewards.map(reward => (
            <div
              key={reward.id}
              className={`point-reward-card ${reward.isEnabled ? 'enabled' : 'disabled'}`}
              style={{ borderLeftColor: reward.backgroundColor }}
            >
              <div className="reward-card-top">
                <span className="reward-emoji-badge" style={{ backgroundColor: reward.backgroundColor }}>
                  {reward.icon}
                </span>

                <div className="reward-card-titles">
                  <strong>{reward.title}</strong>
                  <span className="reward-cost-tag">{reward.cost.toLocaleString()} Sparks</span>
                </div>

                <button
                  type="button"
                  className="btn-delete-reward"
                  onClick={() => handleDeleteReward(reward.id)}
                  title="Delete Reward"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <p className="reward-desc-text">{reward.description}</p>

              <div className="reward-card-footer">
                <div className="reward-meta-tags">
                  <span className="meta-tag">
                    <Clock size={11} /> {reward.cooldownSeconds}s Cooldown
                  </span>
                  {reward.requiresUserInput && (
                    <span className="meta-tag">
                      <MessageSquare size={11} /> Text Input Required
                    </span>
                  )}
                </div>

                <label className="reward-toggle-switch">
                  <input
                    type="checkbox"
                    checked={reward.isEnabled}
                    onChange={() => handleToggleReward(reward.id)}
                  />
                  <span>{reward.isEnabled ? 'Active' : 'Paused'}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
