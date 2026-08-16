import React, { useState } from 'react';
import {
  X,
  Users,
  LayoutGrid,
  Columns,
  Maximize2,
  BookOpen,
  Volume2,
  Mic,
  MicOff,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';
import { type GuestLayoutMode, type GuestParticipant } from './GuestStarStage';
import { soundFX } from '../lib/soundFx';

interface GuestStarModalProps {
  isOpen: boolean;
  isActiveOnStream: boolean;
  onToggleActiveOnStream: (active: boolean) => void;
  layout: GuestLayoutMode;
  onChangeLayout: (l: GuestLayoutMode) => void;
  participants: GuestParticipant[];
  onUpdateParticipants: (p: GuestParticipant[]) => void;
  onClose: () => void;
}

export const GuestStarModal: React.FC<GuestStarModalProps> = ({
  isActiveOnStream,
  onToggleActiveOnStream,
  layout,
  onChangeLayout,
  participants,
  onUpdateParticipants,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestRole, setNewGuestRole] = useState('Guest Reader');

  const handleCopyInvite = () => {
    soundFX.playPop();
    navigator.clipboard.writeText(`https://readabook.tv/guest-star/join?room=tolkien-fellowship-442`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || participants.length >= 4) return;
    soundFX.playPop();

    const newGuest: GuestParticipant = {
      id: `guest_${Date.now()}`,
      name: newGuestName.trim(),
      role: newGuestRole.trim(),
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + participants.length * 1000}?auto=format&fit=crop&w=300&q=80`,
      isMuted: false,
      isVideoOff: false,
      audioLevel: 45,
      isSpeaking: false,
      volume: 85
    };

    onUpdateParticipants([...participants, newGuest]);
    setNewGuestName('');
  };

  const handleRemoveGuest = (guestId: string) => {
    soundFX.playPop();
    onUpdateParticipants(participants.filter(p => p.id !== guestId));
  };

  const handleToggleMute = (guestId: string) => {
    soundFX.playPop();
    onUpdateParticipants(
      participants.map(p => (p.id === guestId ? { ...p, isMuted: !p.isMuted } : p))
    );
  };

  const handleChangeVolume = (guestId: string, volume: number) => {
    onUpdateParticipants(
      participants.map(p => (p.id === guestId ? { ...p, volume } : p))
    );
  };

  const handleChangeRole = (guestId: string, role: string) => {
    onUpdateParticipants(
      participants.map(p => (p.id === guestId ? { ...p, role } : p))
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="guest-star-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Users size={18} color="var(--accent-secondary)" />
            <h3>Guest Star (Multi-Reader Stage)</h3>
            <span className="guest-count-badge">{participants.length}/4 Slots Filled</span>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Broadcast Canvas Toggle */}
        <div className="guest-stage-broadcast-banner">
          <div className="banner-left">
            <Sparkles size={16} color="var(--accent-primary)" />
            <div>
              <strong>Stream Canvas Status</strong>
              <p>{isActiveOnStream ? 'Guest Star stage is LIVE on video canvas' : 'Guest Star is currently in back-room green room'}</p>
            </div>
          </div>
          <button
            type="button"
            className={`btn-toggle-stage ${isActiveOnStream ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              onToggleActiveOnStream(!isActiveOnStream);
            }}
          >
            {isActiveOnStream ? 'Push to Off-Air' : 'Send to Live Stream'}
          </button>
        </div>

        {/* Layout Selector */}
        <div className="guest-modal-section">
          <label className="section-label">Broadcast Layout:</label>
          <div className="guest-layouts-grid">
            <button
              type="button"
              className={`btn-layout-card ${layout === 'side-by-side' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                onChangeLayout('side-by-side');
              }}
            >
              <Columns size={18} />
              <span>Side-by-Side (2)</span>
            </button>

            <button
              type="button"
              className={`btn-layout-card ${layout === 'grid' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                onChangeLayout('grid');
              }}
            >
              <LayoutGrid size={18} />
              <span>2x2 Grid (4)</span>
            </button>

            <button
              type="button"
              className={`btn-layout-card ${layout === 'spotlight' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                onChangeLayout('spotlight');
              }}
            >
              <Maximize2 size={18} />
              <span>Spotlight</span>
            </button>

            <button
              type="button"
              className={`btn-layout-card ${layout === 'drama' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                onChangeLayout('drama');
              }}
            >
              <BookOpen size={18} />
              <span>Drama Dialogue</span>
            </button>
          </div>
        </div>

        {/* Invite Link Generator */}
        <div className="guest-modal-section">
          <label className="section-label">Guest Invite Link:</label>
          <div className="invite-link-row">
            <input
              type="text"
              readOnly
              value="https://readabook.tv/guest-star/join?room=tolkien-fellowship-442"
              className="invite-link-input"
            />
            <button
              type="button"
              onClick={handleCopyInvite}
              className={`btn-copy-invite ${copiedLink ? 'copied' : ''}`}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Manage Current Guests */}
        <div className="guest-modal-section">
          <label className="section-label">Active Readers & Audio Mixer:</label>
          <div className="guest-participants-list">
            {participants.map((p) => (
              <div key={p.id} className="guest-participant-row">
                <img src={p.avatarUrl} alt={p.name} className="participant-thumb" />
                <div className="participant-info">
                  <div className="participant-name-row">
                    <strong>{p.name}</strong>
                    {p.isHost && <span className="host-badge">HOST</span>}
                  </div>
                  <input
                    type="text"
                    value={p.role}
                    onChange={(e) => handleChangeRole(p.id, e.target.value)}
                    placeholder="Role (e.g. Gandalf, Host)"
                    className="participant-role-input"
                  />
                </div>

                {/* Audio Gain & Mute */}
                <div className="participant-audio-controls">
                  <div className="vol-slider-wrapper">
                    <Volume2 size={13} color="var(--text-muted)" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={p.volume}
                      onChange={(e) => handleChangeVolume(p.id, parseInt(e.target.value, 10))}
                      className="vol-slider"
                    />
                    <span className="vol-val">{p.volume}%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleMute(p.id)}
                    className={`btn-mic-mute ${p.isMuted ? 'muted' : ''}`}
                    title={p.isMuted ? 'Unmute Guest' : 'Mute Guest'}
                  >
                    {p.isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>

                  {!p.isHost && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGuest(p.id)}
                      className="btn-kick-guest"
                      title="Remove from Stage"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Guest Form (if slots open) */}
        {participants.length < 4 && (
          <form onSubmit={handleAddGuest} className="add-guest-form">
            <div className="form-group-flex">
              <input
                type="text"
                placeholder="Guest username..."
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                className="add-guest-input"
              />
              <select
                value={newGuestRole}
                onChange={(e) => setNewGuestRole(e.target.value)}
                className="add-guest-role-select"
              >
                <option value="Guest Reader">Guest Reader</option>
                <option value="Voice Actor: Gandalf">Voice Actor: Gandalf</option>
                <option value="Voice Actor: Frodo">Voice Actor: Frodo</option>
                <option value="Voice Actor: Smaug">Voice Actor: Smaug</option>
                <option value="Co-Host / Lore Analyst">Co-Host / Lore Analyst</option>
              </select>
              <button
                type="submit"
                disabled={!newGuestName.trim()}
                className="btn-primary btn-add-guest"
              >
                <Plus size={14} />
                <span>Add Slot</span>
              </button>
            </div>
          </form>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
