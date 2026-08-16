import React, { useState } from 'react';
import { X, Pin, Sparkles, Megaphone, Trash2 } from 'lucide-react';
import { DEFAULT_PINNED_ANNOUNCEMENT, type PinnedAnnouncement } from '../lib/pinnedMessageData';
import { soundFX } from '../lib/soundFx';

interface PinnedMessageStudioModalProps {
  streamerName: string;
  onClose: () => void;
  onUpdatePinnedMessage?: (pin: PinnedAnnouncement | null) => void;
}

export const PinnedMessageStudioModal: React.FC<PinnedMessageStudioModalProps> = ({
  streamerName,
  onClose,
  onUpdatePinnedMessage
}) => {
  const [pinned, setPinned] = useState<PinnedAnnouncement | null>(DEFAULT_PINNED_ANNOUNCEMENT);
  const [newText, setNewText] = useState(pinned?.text || '');
  const [newTheme, setNewTheme] = useState<'gold' | 'blue' | 'green' | 'purple'>(pinned?.themeColor || 'gold');
  const [newDuration, setNewDuration] = useState<number>(pinned?.durationMins || 30);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    soundFX.playChestClaim();
    const updatedPin: PinnedAnnouncement = {
      id: `pin_${Date.now()}`,
      author: streamerName,
      authorRole: 'Broadcaster',
      text: newText.trim(),
      themeColor: newTheme,
      pinnedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMins: newDuration,
      isPinned: true
    };

    setPinned(updatedPin);
    if (onUpdatePinnedMessage) {
      onUpdatePinnedMessage(updatedPin);
    }

    setSaveToast('📌 Announcement pinned to the top of live chat!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleUnpin = () => {
    soundFX.playPop();
    setPinned(null);
    if (onUpdatePinnedMessage) {
      onUpdatePinnedMessage(null);
    }
    setSaveToast('Unpinned announcement from chat.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="pinned-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="pinned-modal-header">
          <div className="pinned-title-group">
            <div className="pinned-badge">
              <Megaphone size={16} />
              <span>PINNED CHAT ANNOUNCEMENTS & MEGAPHONE STUDIO</span>
            </div>
            <h3>@{streamerName}'s Pinned Chat Banner</h3>
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

        {/* Live Preview Deck */}
        <div className="pinned-preview-section">
          <span className="preview-label">LIVE PINNED BANNER PREVIEW (TOP OF CHAT):</span>
          {pinned ? (
            <div className={`pinned-chat-banner theme-${pinned.themeColor}`}>
              <div className="banner-top-row">
                <div className="banner-author-tag">
                  <Pin size={13} />
                  <strong>Pinned by @{pinned.author} ({pinned.authorRole})</strong>
                </div>
                <span className="banner-time">{pinned.pinnedAt} {pinned.durationMins > 0 ? `• ${pinned.durationMins}m timer` : ''}</span>
              </div>
              <p className="banner-text-body">{pinned.text}</p>
            </div>
          ) : (
            <div className="pinned-chat-banner empty">
              <span>No active pinned message. Create one below to spotlight notes for viewers!</span>
            </div>
          )}
        </div>

        {/* Composer Form */}
        <form className="pinned-composer-form" onSubmit={handleSavePin}>
          <div className="form-input-group">
            <label>Announcement Message:</label>
            <textarea
              rows={3}
              required
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="e.g. Reading Chapter 5 (Pages 240-275)! Q&A afterwards!"
            />
          </div>

          <div className="composer-options-row">
            {/* Theme Picker */}
            <div className="theme-picker-group">
              <label>Banner Theme:</label>
              <div className="theme-buttons-row">
                {(['gold', 'blue', 'green', 'purple'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`theme-chip-btn theme-${t} ${newTheme === t ? 'active' : ''}`}
                    onClick={() => {
                      soundFX.playPop();
                      setNewTheme(t);
                    }}
                  >
                    <span>{t.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Picker */}
            <div className="duration-picker-group">
              <label>Pin Duration:</label>
              <select
                value={newDuration}
                onChange={e => setNewDuration(Number(e.target.value))}
              >
                <option value={5}>5 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={0}>Persistent (Until Unpinned)</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pinned-modal-footer">
            {pinned && (
              <button
                type="button"
                className="btn-secondary btn-unpin-action"
                onClick={handleUnpin}
              >
                <Trash2 size={14} />
                <span>Unpin Current Banner</span>
              </button>
            )}

            <button type="submit" className="btn-primary btn-pin-submit">
              <Pin size={15} />
              <span>{pinned ? 'Update Pinned Message' : 'Pin to Top of Chat'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
