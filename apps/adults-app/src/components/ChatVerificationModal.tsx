import React, { useState } from 'react';
import { X, Shield, Sparkles, CheckCircle2, ShieldCheck, Lock, UserCheck, BookOpen } from 'lucide-react';
import {
  DEFAULT_CHAT_VERIFICATION,
  type ChatVerificationGateSettings
} from '../lib/chatVerificationData';
import { soundFX } from '../lib/soundFx';

interface ChatVerificationModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ChatVerificationModal: React.FC<ChatVerificationModalProps> = ({
  streamerName,
  onClose
}) => {
  const [settings, setSettings] = useState<ChatVerificationGateSettings>(DEFAULT_CHAT_VERIFICATION);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleApplyPreset = (mode: 'RELAXED' | 'STANDARD' | 'IRONCLAD') => {
    soundFX.playPop();
    if (mode === 'RELAXED') {
      setSettings({
        mode: 'RELAXED',
        mustBeFollower: false,
        minFollowDurationMinutes: 0,
        mustHaveCompletedBook: false,
        mustBeSubscribed: false,
        mustHaveVerifiedEmail: true,
        mustHavePhoneVerified: false,
        minAccountAgeDays: 0,
        slowModeSeconds: 0
      });
    } else if (mode === 'STANDARD') {
      setSettings({
        mode: 'STANDARD',
        mustBeFollower: true,
        minFollowDurationMinutes: 10,
        mustHaveCompletedBook: true,
        mustBeSubscribed: false,
        mustHaveVerifiedEmail: true,
        mustHavePhoneVerified: false,
        minAccountAgeDays: 7,
        slowModeSeconds: 5
      });
    } else if (mode === 'IRONCLAD') {
      setSettings({
        mode: 'IRONCLAD',
        mustBeFollower: true,
        minFollowDurationMinutes: 30,
        mustHaveCompletedBook: true,
        mustBeSubscribed: true,
        mustHaveVerifiedEmail: true,
        mustHavePhoneVerified: true,
        minAccountAgeDays: 30,
        slowModeSeconds: 15
      });
    }
    setToastMsg(`🛡️ Applied [${mode}] Chat Protection Preset!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playChestClaim();
    setToastMsg('🏰 Arcane Scribe Gate updated! Live chat verification is active.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="verify-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="verify-modal-header">
          <div className="verify-title-group">
            <div className="verify-badge">
              <Shield size={16} />
              <span>ARCANE SCRIBE GATE & CHAT VERIFICATION CITADEL</span>
            </div>
            <h3>@{streamerName}'s Live Chat Security Gate</h3>
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

        <p className="verify-intro-text">
          Protect your live book club chat against spoiler raids, spambots, and bad actors. Configure entry criteria for who is permitted to send messages.
        </p>

        {/* Defense Presets */}
        <div className="verify-presets-grid">
          <div
            className={`preset-box ${settings.mode === 'RELAXED' ? 'active' : ''}`}
            onClick={() => handleApplyPreset('RELAXED')}
          >
            <ShieldCheck size={20} color="#00ff88" />
            <div className="preset-info">
              <h4>🟢 Relaxed Tavern</h4>
              <p>Open chat for all verified accounts. Zero wait time.</p>
            </div>
          </div>

          <div
            className={`preset-box ${settings.mode === 'STANDARD' ? 'active' : ''}`}
            onClick={() => handleApplyPreset('STANDARD')}
          >
            <UserCheck size={20} color="#00b4d8" />
            <div className="preset-info">
              <h4>🔵 Standard Guild Gate</h4>
              <p>Must follow for 10 mins and have finished at least 1 book.</p>
            </div>
          </div>

          <div
            className={`preset-box ${settings.mode === 'IRONCLAD' ? 'active' : ''}`}
            onClick={() => handleApplyPreset('IRONCLAD')}
          >
            <Lock size={20} color="#ffd700" />
            <div className="preset-info">
              <h4>👑 Ironclad Citadel</h4>
              <p>Subscribers & phone verified only. Maximum raid shield.</p>
            </div>
          </div>
        </div>

        {/* Verification Toggles Form */}
        <form onSubmit={handleSave} className="verify-form">
          <div className="verify-toggles-grid">
            <label className="toggle-label-row">
              <input
                type="checkbox"
                checked={settings.mustHaveCompletedBook}
                onChange={e => setSettings({ ...settings, mustHaveCompletedBook: e.target.checked })}
              />
              <div className="toggle-text">
                <strong><BookOpen size={14} /> Platform Reading History</strong>
                <span>Viewer must have finished at least 1 book chapter on ReadaBook.</span>
              </div>
            </label>

            <label className="toggle-label-row">
              <input
                type="checkbox"
                checked={settings.mustBeFollower}
                onChange={e => setSettings({ ...settings, mustBeFollower: e.target.checked })}
              />
              <div className="toggle-text">
                <strong>Follower-Only Chat ({settings.minFollowDurationMinutes}m wait)</strong>
                <span>Must be following your channel for at least 10 minutes.</span>
              </div>
            </label>

            <label className="toggle-label-row">
              <input
                type="checkbox"
                checked={settings.mustHaveVerifiedEmail}
                onChange={e => setSettings({ ...settings, mustHaveVerifiedEmail: e.target.checked })}
              />
              <div className="toggle-text">
                <strong>Verified Email Requirement</strong>
                <span>Disallows anonymous temporary email accounts.</span>
              </div>
            </label>

            <label className="toggle-label-row">
              <input
                type="checkbox"
                checked={settings.mustHavePhoneVerified}
                onChange={e => setSettings({ ...settings, mustHavePhoneVerified: e.target.checked })}
              />
              <div className="toggle-text">
                <strong>Verified Mobile Phone (2FA)</strong>
                <span>Requires SMS code verification on viewer account.</span>
              </div>
            </label>
          </div>

          {/* Slow Mode Slider */}
          <div className="slow-mode-slider-box">
            <div className="slow-mode-top">
              <label>Chat Slow Mode Rate Limit:</label>
              <strong>{settings.slowModeSeconds === 0 ? 'Disabled (Instant)' : `${settings.slowModeSeconds} seconds between messages`}</strong>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={settings.slowModeSeconds}
              onChange={e => setSettings({ ...settings, slowModeSeconds: Number(e.target.value) })}
            />
          </div>

          {/* Footer */}
          <div className="verify-modal-footer">
            <button type="submit" className="btn-primary btn-save-verify">
              <CheckCircle2 size={16} />
              <span>Apply Gate Security Rules</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
