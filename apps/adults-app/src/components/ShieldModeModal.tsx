import React, { useState } from 'react';
import { X, ShieldAlert, ShieldCheck, Lock, Trash2, Ban, EyeOff, Radio } from 'lucide-react';
import { DEFAULT_SHIELD_SETTINGS, type ShieldModeSettings } from '../lib/shieldModeData';
import { soundFX } from '../lib/soundFx';

interface ShieldModeModalProps {
  streamerName?: string;
  isOpen?: boolean;
  isShieldActive?: boolean;
  onToggleShield?: (active: boolean) => void;
  onShieldStatusChange?: (isActive: boolean) => void;
  onClose: () => void;
}

export const ShieldModeModal: React.FC<ShieldModeModalProps> = ({
  streamerName: _streamerName,
  isOpen = true,
  isShieldActive: initialShieldActive = false,
  onToggleShield,
  onShieldStatusChange,
  onClose
}) => {
  const [settings, setSettings] = useState<ShieldModeSettings>({
    ...DEFAULT_SHIELD_SETTINGS,
    isShieldActive: initialShieldActive || DEFAULT_SHIELD_SETTINGS.isShieldActive
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleShield = () => {
    const nextState = !settings.isShieldActive;
    if (nextState) {
      soundFX.playThunder();
    } else {
      soundFX.playPop();
    }

    setSettings(prev => ({
      ...prev,
      isShieldActive: nextState
    }));

    setToastMessage(nextState ? '🛡️ SHIELD MODE ACTIVATED: Chat locked to Subscribers & Spoilers Blocked!' : '🛡️ Shield Mode deactivated. Normal broadcast rules restored.');
    if (onToggleShield) {
      onToggleShield(nextState);
    }
    if (onShieldStatusChange) {
      onShieldStatusChange(nextState);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMassPurge = () => {
    soundFX.playPop();
    setSettings(prev => ({ ...prev, massPurgeTriggered: true }));
    setToastMessage('🧹 Purged all chat messages from the last 15 minutes.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="shield-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="shield-modal-header">
          <div className="shield-title-group">
            <div className={`shield-status-badge ${settings.isShieldActive ? 'active' : 'idle'}`}>
              {settings.isShieldActive ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
              <span>{settings.isShieldActive ? 'SHIELD MODE IS ACTIVE' : 'SHIELD MODE IS READY'}</span>
            </div>
            <h3>Streamer Emergency Shield Mode</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className={`sub-celebration-toast ${settings.isShieldActive ? 'danger-toast' : ''}`}>
            <span>{toastMessage}</span>
          </div>
        )}

        <p className="shield-intro-text">
          Instantly protect your live reading from hate raids, harassment, and plot spoilers with a single click. Pre-configured presets lock down chat, filter leaks, and block incoming raids immediately.
        </p>

        {/* Master Panic Button */}
        <div className="shield-panic-banner">
          <div className="panic-info">
            <h4>{settings.isShieldActive ? '🚨 Emergency Defense Active' : '🛡️ Activate Shield Mode'}</h4>
            <p>
              {settings.isShieldActive
                ? 'Your broadcast is currently safeguarded against spoilers and unauthorized raids.'
                : 'Click to immediately apply all defensive restrictions below.'}
            </p>
          </div>

          <button
            type="button"
            className={`btn-master-shield ${settings.isShieldActive ? 'active' : ''}`}
            onClick={toggleShield}
          >
            {settings.isShieldActive ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
            <span>{settings.isShieldActive ? 'DEACTIVATE SHIELD' : 'ACTIVATE SHIELD MODE'}</span>
          </button>
        </div>

        {/* Shield Rules Configuration */}
        <div className="shield-settings-grid">
          <div className="shield-setting-card">
            <div className="setting-header">
              <Lock size={16} color="var(--accent-primary)" />
              <strong>Chat Restriction Mode</strong>
            </div>
            <p>Set who is allowed to send messages during active shield.</p>

            <div className="shield-options-row">
              {(['sub_only', 'verified_only', 'emote_only', 'normal'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  className={`shield-chip-btn ${settings.chatMode === mode ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setSettings({ ...settings, chatMode: mode });
                  }}
                >
                  {mode.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="shield-setting-card">
            <div className="setting-header">
              <EyeOff size={16} color="var(--accent-secondary)" />
              <strong>Aggressive Spoiler Censor</strong>
            </div>
            <p>Automatically detects and redacts character deaths, twist endings, and future book plot lines.</p>
            <label className="shield-toggle-label">
              <input
                type="checkbox"
                checked={settings.aggressiveSpoilerCensor}
                onChange={e => setSettings({ ...settings, aggressiveSpoilerCensor: e.target.checked })}
              />
              <span>Block future page spoilers ({settings.blockedPhrasesCount} filters active)</span>
            </label>
          </div>

          <div className="shield-setting-card">
            <div className="setting-header">
              <Ban size={16} color="var(--accent-danger)" />
              <strong>Incoming Raids</strong>
            </div>
            <p>Prevent rogue or unauthorized channel raids from hijacking the broadcast.</p>
            <label className="shield-toggle-label">
              <input
                type="checkbox"
                checked={settings.blockIncomingRaids}
                onChange={e => setSettings({ ...settings, blockIncomingRaids: e.target.checked })}
              />
              <span>Reject all incoming raids while shield is active</span>
            </label>
          </div>

          <div className="shield-setting-card">
            <div className="setting-header">
              <Trash2 size={16} color="#ffd700" />
              <strong>Mass Chat Purge</strong>
            </div>
            <p>Clear all messages from the live chat feed instantly if spam occurred.</p>
            <button
              type="button"
              className="btn-secondary btn-mass-purge"
              onClick={handleMassPurge}
            >
              <Radio size={14} />
              <span>Purge Last 15m of Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
