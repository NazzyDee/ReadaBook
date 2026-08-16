import React, { useState } from 'react';
import { Smile, Award, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface ChannelEmote {
  id: string;
  name: string;
  tier: 'tier1' | 'tier2' | 'tier3' | 'follower';
  icon: string;
  animated: boolean;
}

interface LoyaltyBadge {
  months: number;
  label: string;
  icon: string;
}

interface BitBadge {
  bits: number;
  label: string;
  icon: string;
}

export const EmoteStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emotes' | 'badges' | 'sparks'>('emotes');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmoteName, setNewEmoteName] = useState('');
  const [newEmoteIcon, setNewEmoteIcon] = useState('🍵');
  const [newEmoteTier, setNewEmoteTier] = useState<'tier1' | 'tier2' | 'tier3' | 'follower'>('tier1');
  const [newEmoteAnimated, setNewEmoteAnimated] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [emotes, setEmotes] = useState<ChannelEmote[]>([
    { id: 'e1', name: 'lillyTea', tier: 'tier1', icon: '🍵', animated: true },
    { id: 'e2', name: 'lillyHype', tier: 'tier1', icon: '📖', animated: false },
    { id: 'e3', name: 'lillyDragon', tier: 'tier2', icon: '🐉', animated: true },
    { id: 'e4', name: 'lillyCrown', tier: 'tier3', icon: '👑', animated: true },
    { id: 'e5', name: 'lillyCozy', tier: 'follower', icon: '🕯️', animated: false }
  ]);

  const loyaltyBadges: LoyaltyBadge[] = [
    { months: 1, label: '1 Month Subscriber', icon: '📗' },
    { months: 3, label: '3 Months Subscriber', icon: '📘' },
    { months: 6, label: '6 Months Subscriber', icon: '📕' },
    { months: 12, label: '1 Year Veteran Reader', icon: '👑' },
    { months: 24, label: '2 Years Grand Master', icon: '🌟' }
  ];

  const bitBadges: BitBadge[] = [
    { bits: 100, label: '100 Sparks Cheerer', icon: '✨' },
    { bits: 1000, label: '1,000 Sparks Cheerer', icon: '💎' },
    { bits: 5000, label: '5,000 Sparks Cheerer', icon: '🏆' },
    { bits: 10000, label: '10,000 Sparks Cheerer', icon: '👑' },
    { bits: 50000, label: '50,000 Sparks Titan', icon: '⚡' },
    { bits: 100000, label: '100,000 Sparks Legend', icon: '🌌' }
  ];

  const handleAddEmote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmoteName.trim()) return;

    soundFX.playChestClaim();
    const newEmote: ChannelEmote = {
      id: `emote_${Date.now()}`,
      name: newEmoteName.trim().replace(/[^a-zA-Z0-9]/g, ''),
      tier: newEmoteTier,
      icon: newEmoteIcon,
      animated: newEmoteAnimated
    };

    setEmotes(prev => [newEmote, ...prev]);
    setShowAddModal(false);
    setNewEmoteName('');
    setToastMsg(`Emote :${newEmote.name}: uploaded and active!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDeleteEmote = (id: string, name: string) => {
    soundFX.playPop();
    setEmotes(prev => prev.filter(e => e.id !== id));
    setToastMsg(`Deleted emote :${name}:.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="emote-studio-container">
      {/* Hero Header */}
      <div className="emote-hero-header">
        <div className="emote-title-col">
          <div className="emote-badge">
            <Smile size={15} />
            <span>TWITCH CREATOR STUDIO</span>
          </div>
          <h1>Custom Emotes & Subscriber Badges</h1>
          <p>Reward your community with custom subscriber emotes, loyalty crests, and cheer badges.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary btn-add-emote-trigger"
        >
          <Plus size={16} />
          <span>Upload Custom Emote</span>
        </button>
      </div>

      {toastMsg && (
        <div className="emote-toast">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="emote-nav-tabs">
        <button
          className={`btn-emote-tab ${activeTab === 'emotes' ? 'active' : ''}`}
          onClick={() => setActiveTab('emotes')}
        >
          <Smile size={15} />
          <span>Subscriber Emotes ({emotes.length})</span>
        </button>
        <button
          className={`btn-emote-tab ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          <Award size={15} />
          <span>Loyalty Badges</span>
        </button>
        <button
          className={`btn-emote-tab ${activeTab === 'sparks' ? 'active' : ''}`}
          onClick={() => setActiveTab('sparks')}
        >
          <Sparkles size={15} />
          <span>Sparks Cheer Badges</span>
        </button>
      </div>

      {/* TAB 1: EMOTES */}
      {activeTab === 'emotes' && (
        <div className="emotes-content-section">
          <div className="emotes-slots-grid">
            {emotes.map(emote => (
              <div key={emote.id} className="emote-slot-card">
                <div className="emote-icon-preview">
                  <span className={`emote-icon-large ${emote.animated ? 'pulse' : ''}`}>
                    {emote.icon}
                  </span>
                  {emote.animated && <span className="animated-tag">GIF</span>}
                </div>

                <div className="emote-meta">
                  <span className="emote-code">:{emote.name}:</span>
                  <span className="emote-tier-tag">
                    {emote.tier === 'tier1' && 'Tier 1 Sub'}
                    {emote.tier === 'tier2' && 'Tier 2 Sub'}
                    {emote.tier === 'tier3' && 'Tier 3 Sub'}
                    {emote.tier === 'follower' && 'Follower'}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteEmote(emote.id, emote.name)}
                  className="btn-delete-emote"
                  title="Delete Emote"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LOYALTY BADGES */}
      {activeTab === 'badges' && (
        <div className="loyalty-badges-section">
          <div className="badges-list-grid">
            {loyaltyBadges.map(b => (
              <div key={b.months} className="loyalty-badge-card">
                <div className="badge-crest-disc">
                  <span>{b.icon}</span>
                </div>
                <div className="badge-info">
                  <h4>{b.label}</h4>
                  <span className="badge-months-sub">Unlocked at {b.months} month(s) subscribed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SPARKS CHEER BADGES */}
      {activeTab === 'sparks' && (
        <div className="bit-badges-section">
          <div className="badges-list-grid">
            {bitBadges.map(b => (
              <div key={b.bits} className="loyalty-badge-card">
                <div className="badge-crest-disc sparks-crest">
                  <span>{b.icon}</span>
                </div>
                <div className="badge-info">
                  <h4>{b.label}</h4>
                  <span className="badge-months-sub">Unlocked after cheering {b.bits.toLocaleString()} Sparks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Emote Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="add-emote-modal-card">
            <div className="modal-header">
              <div className="modal-title-row">
                <Smile size={20} color="var(--accent-secondary)" />
                <h3>Upload Custom Channel Emote</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmote} className="add-emote-form">
              <div className="form-group">
                <label>Emote Code / Suffix (e.g. TeaTime):</label>
                <input
                  type="text"
                  placeholder="e.g. CozyRain"
                  value={newEmoteName}
                  onChange={(e) => setNewEmoteName(e.target.value)}
                  className="settings-text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Choose Emote Icon / Emoji:</label>
                <div className="icons-selector-grid">
                  {['🍵', '📖', '🎭', '🔥', '✨', '👑', '📜', '🐉', '🎙️', '🕯️', '🪄', '☕'].map(ic => (
                    <button
                      type="button"
                      key={ic}
                      className={`btn-icon-choice ${newEmoteIcon === ic ? 'active' : ''}`}
                      onClick={() => setNewEmoteIcon(ic)}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Subscriber Tier Requirement:</label>
                <select
                  value={newEmoteTier}
                  onChange={(e) => setNewEmoteTier(e.target.value as any)}
                  className="settings-select-input"
                >
                  <option value="follower">Followers (Free)</option>
                  <option value="tier1">Tier 1 Subscribers ($4.99)</option>
                  <option value="tier2">Tier 2 Subscribers ($9.99)</option>
                  <option value="tier3">Tier 3 Subscribers ($24.99)</option>
                </select>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <span className="setting-name">Animated Emote (GIF / WebP)</span>
                  <p className="setting-desc">Enable animated floating / glowing effect in chat</p>
                </div>
                <input
                  type="checkbox"
                  checked={newEmoteAnimated}
                  onChange={(e) => setNewEmoteAnimated(e.target.checked)}
                  className="toggle-checkbox"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  <span>Publish Emote</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
