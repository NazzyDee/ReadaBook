import React, { useState } from 'react';
import { X, Lock, Sparkles, CheckCircle2, Trash2, Clock, Users, Smile, Shield } from 'lucide-react';
import { DEFAULT_CHAT_THROTTLE_SETTINGS, type ChatThrottleSettings } from '../lib/chatThrottleData';
import { soundFX } from '../lib/soundFx';

interface ChatPacingThrottleModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ChatPacingThrottleModal: React.FC<ChatPacingThrottleModalProps> = ({
  streamerName,
  onClose
}) => {
  const [settings, setSettings] = useState<ChatThrottleSettings>(DEFAULT_CHAT_THROTTLE_SETTINGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggle = (key: keyof ChatThrottleSettings) => {
    soundFX.playPop();
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearChat = () => {
    soundFX.playThunder();
    setToastMsg('⚡ EMERGENCY PURGE: Chat history cleared by broadcaster command.');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('🔒 Chat moderation flow parameters updated live across all viewer screens!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="throttle-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="throttle-modal-header">
          <div className="throttle-title-group">
            <div className="throttle-badge">
              <Lock size={16} />
              <span>CHAT FLOW PACER & SUB-ONLY MODERATION COCKPIT</span>
            </div>
            <h3>@{streamerName}'s Real-Time Chat Gate</h3>
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

        {/* Controls Grid */}
        <div className="throttle-controls-grid">
          {/* Sub-Only Chat */}
          <div className={`throttle-card ${settings.isSubOnly ? 'active' : ''}`}>
            <div className="throttle-card-left">
              <Lock size={20} color={settings.isSubOnly ? '#ffd700' : 'var(--text-muted)'} />
              <div>
                <h4>Subscriber-Only Chat</h4>
                <p>Only paid subscribers and tier-gifted patrons can send messages.</p>
              </div>
            </div>
            <button
              type="button"
              className={`btn-toggle-switch ${settings.isSubOnly ? 'on' : 'off'}`}
              onClick={() => handleToggle('isSubOnly')}
            >
              {settings.isSubOnly ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Follower-Only Chat */}
          <div className={`throttle-card ${settings.isFollowerOnly ? 'active' : ''}`}>
            <div className="throttle-card-left">
              <Users size={20} color={settings.isFollowerOnly ? '#00ff88' : 'var(--text-muted)'} />
              <div>
                <h4>Follower-Only Chat</h4>
                <p>Require readers to follow the channel before chatting.</p>
                {settings.isFollowerOnly && (
                  <div className="duration-chips">
                    {[0, 10, 60, 1440].map(mins => (
                      <button
                        key={mins}
                        type="button"
                        className={`chip-btn ${settings.followerDurationMins === mins ? 'selected' : ''}`}
                        onClick={() => {
                          soundFX.playPop();
                          setSettings(prev => ({ ...prev, followerDurationMins: mins }));
                        }}
                      >
                        {mins === 0 ? 'Any' : mins < 60 ? `${mins}m` : mins === 60 ? '1h' : '1d'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className={`btn-toggle-switch ${settings.isFollowerOnly ? 'on' : 'off'}`}
              onClick={() => handleToggle('isFollowerOnly')}
            >
              {settings.isFollowerOnly ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Slow Mode Throttle */}
          <div className={`throttle-card ${settings.isSlowMode ? 'active' : ''}`}>
            <div className="throttle-card-left">
              <Clock size={20} color={settings.isSlowMode ? 'var(--accent-teal)' : 'var(--text-muted)'} />
              <div>
                <h4>Slow Mode Throttle</h4>
                <p>Limit how frequently viewers can send consecutive messages.</p>
                {settings.isSlowMode && (
                  <div className="duration-chips">
                    {[3, 10, 30, 60, 120].map(sec => (
                      <button
                        key={sec}
                        type="button"
                        className={`chip-btn ${settings.slowModeSeconds === sec ? 'selected' : ''}`}
                        onClick={() => {
                          soundFX.playPop();
                          setSettings(prev => ({ ...prev, slowModeSeconds: sec }));
                        }}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className={`btn-toggle-switch ${settings.isSlowMode ? 'on' : 'off'}`}
              onClick={() => handleToggle('isSlowMode')}
            >
              {settings.isSlowMode ? `${settings.slowModeSeconds}s` : 'OFF'}
            </button>
          </div>

          {/* Emote-Only Mode */}
          <div className={`throttle-card ${settings.isEmoteOnly ? 'active' : ''}`}>
            <div className="throttle-card-left">
              <Smile size={20} color={settings.isEmoteOnly ? 'var(--accent-secondary)' : 'var(--text-muted)'} />
              <div>
                <h4>Emote-Only Mode</h4>
                <p>Only channel emotes and book glyphs can be posted in chat.</p>
              </div>
            </div>
            <button
              type="button"
              className={`btn-toggle-switch ${settings.isEmoteOnly ? 'on' : 'off'}`}
              onClick={() => handleToggle('isEmoteOnly')}
            >
              {settings.isEmoteOnly ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Emergency Clear Chat Bar */}
        <div className="emergency-purge-bar">
          <div className="purge-text">
            <Shield size={16} color="#ff3b3b" />
            <span>Emergency Moderation: Instant Chat History Wipe</span>
          </div>

          <button
            type="button"
            className="btn-purge-chat"
            onClick={handleClearChat}
          >
            <Trash2 size={14} />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Footer */}
        <div className="throttle-modal-footer">
          <button
            type="button"
            className="btn-primary btn-save-throttle"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Apply Chat Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
