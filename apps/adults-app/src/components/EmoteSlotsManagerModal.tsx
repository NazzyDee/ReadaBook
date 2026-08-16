import React, { useState } from 'react';
import { X, Smile, Sparkles, CheckCircle2, Upload, Lock, Trash2 } from 'lucide-react';
import { MOCK_EMOTE_SLOTS, type EmoteSlotItem } from '../lib/emoteSlotsData';
import { soundFX } from '../lib/soundFx';

interface EmoteSlotsManagerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const EmoteSlotsManagerModal: React.FC<EmoteSlotsManagerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [emotes, setEmotes] = useState<EmoteSlotItem[]>(MOCK_EMOTE_SLOTS);
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [newEmoteCode, setNewEmoteCode] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredEmotes = selectedTier === 'ALL'
    ? emotes
    : emotes.filter(e => e.tier === selectedTier);

  const handleUploadEmote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmoteCode.trim()) return;

    soundFX.playChestClaim();
    const newEmote: EmoteSlotItem = {
      id: `em_${Date.now()}`,
      code: newEmoteCode.trim(),
      tier: 'TIER_1',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=64&auto=format&fit=crop&q=80',
      subPointsRequired: 20,
      isUnlocked: true,
      status: 'ACTIVE'
    };

    setEmotes(prev => [newEmote, ...prev]);
    setNewEmoteCode('');
    setToastMsg(`🎨 Uploaded new emote ":${newEmote.code}:"! Auto-resized to 112px, 56px, 28px.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDeleteEmote = (id: string) => {
    soundFX.playPop();
    setEmotes(prev => prev.filter(e => e.id !== id));
    setToastMsg('🗑️ Emote removed from slot.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="emote-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="emote-modal-header">
          <div className="emote-title-group">
            <div className="emote-badge">
              <Smile size={16} />
              <span>CUSTOM EMOTE SLOTS & SUBSCRIBER REWARDS MATRIX</span>
            </div>
            <h3>@{streamerName}'s Subscriber Emote Dashboard</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Sub Points Progress Banner */}
        <div className="sub-points-banner">
          <div className="sub-pts-info">
            <h4>42 / 50 Subscriber Points</h4>
            <p>8 more subscriber points to unlock next Tier 3 custom emote slot!</p>
          </div>
          <div className="sub-pts-bar-bg">
            <div className="sub-pts-bar-fill" style={{ width: '84%' }}></div>
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="emote-filter-tabs">
          {['ALL', 'TIER_1', 'TIER_2', 'TIER_3', 'ANIMATED'].map(t => (
            <button
              key={t}
              type="button"
              className={`emote-tab-btn ${selectedTier === t ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedTier(t);
              }}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Emote Upload Bar */}
        <form onSubmit={handleUploadEmote} className="upload-emote-form">
          <div className="upload-input-group">
            <input
              type="text"
              value={newEmoteCode}
              onChange={e => setNewEmoteCode(e.target.value)}
              placeholder="Enter emote code (e.g. readHype)..."
            />
            <button type="submit" className="btn-primary btn-upload-emote">
              <Upload size={14} />
              <span>Upload Emote (Auto-Resize)</span>
            </button>
          </div>
        </form>

        {/* Emote Slots Grid */}
        <div className="emote-slots-grid">
          {filteredEmotes.map(em => (
            <div key={em.id} className={`emote-slot-card ${em.isUnlocked ? 'unlocked' : 'locked'}`}>
              {em.isUnlocked ? (
                <>
                  <img src={em.imageUrl} alt={em.code} className="emote-img-preview" />
                  <strong className="emote-code-tag">:{em.code}:</strong>
                  <span className="emote-tier-pill">{em.tier.replace('_', ' ')}</span>
                  <button
                    type="button"
                    className="btn-del-emote"
                    onClick={() => handleDeleteEmote(em.id)}
                    title="Remove emote"
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              ) : (
                <div className="locked-slot-box">
                  <Lock size={20} color="var(--text-muted)" />
                  <span>Requires {em.subPointsRequired} Sub Points</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="emote-modal-footer">
          <span className="emote-resizer-note">
            Auto-Export Specs: 112x112, 56x56, 28x28 WebP • Transparent Background
          </span>
          <button
            type="button"
            className="btn-secondary btn-close-emote"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
