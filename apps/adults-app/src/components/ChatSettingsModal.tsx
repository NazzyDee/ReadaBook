import React from 'react';
import { X, Sliders, Eye, Shield, Type } from 'lucide-react';

export interface ChatPreferences {
  showTimestamps: boolean;
  fontSize: 'small' | 'medium' | 'large';
  readableColors: boolean;
  animatedEmotes: boolean;
  soundAlerts: boolean;
}

interface ChatSettingsModalProps {
  preferences: ChatPreferences;
  onChangePreferences: (prefs: ChatPreferences) => void;
  onOpenModView?: () => void;
  onClose: () => void;
}

export const ChatSettingsModal: React.FC<ChatSettingsModalProps> = ({
  preferences,
  onChangePreferences,
  onOpenModView,
  onClose
}) => {
  const updatePref = <K extends keyof ChatPreferences>(key: K, val: ChatPreferences[K]) => {
    onChangePreferences({
      ...preferences,
      [key]: val
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="chat-settings-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Sliders size={18} color="var(--accent-secondary)" />
            <h3>Chat Settings</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="chat-settings-body">
          {/* Chat Appearance */}
          <div className="settings-group">
            <div className="settings-group-title">
              <Eye size={15} />
              <span>Chat Appearance</span>
            </div>

            <div className="setting-toggle-row">
              <div>
                <span className="setting-name">Show Timestamps</span>
                <p className="setting-desc">Display time sent next to messages</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.showTimestamps}
                onChange={(e) => updatePref('showTimestamps', e.target.checked)}
                className="toggle-checkbox"
              />
            </div>

            <div className="setting-toggle-row">
              <div>
                <span className="setting-name">Readable High-Contrast Colors</span>
                <p className="setting-desc">Adjust dark usernames for readability</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.readableColors}
                onChange={(e) => updatePref('readableColors', e.target.checked)}
                className="toggle-checkbox"
              />
            </div>

            <div className="setting-toggle-row">
              <div>
                <span className="setting-name">Animated Emotes</span>
                <p className="setting-desc">Play animations on custom Book emotes</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.animatedEmotes}
                onChange={(e) => updatePref('animatedEmotes', e.target.checked)}
                className="toggle-checkbox"
              />
            </div>

            <div className="setting-toggle-row">
              <div>
                <span className="setting-name">Chat Sound Alerts</span>
                <p className="setting-desc">Play audio chimes for mentions & cheers</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.soundAlerts}
                onChange={(e) => updatePref('soundAlerts', e.target.checked)}
                className="toggle-checkbox"
              />
            </div>
          </div>

          {/* Font Size */}
          <div className="settings-group">
            <div className="settings-group-title">
              <Type size={15} />
              <span>Chat Text Size</span>
            </div>
            <div className="font-size-options-row">
              {(['small', 'medium', 'large'] as const).map(size => (
                <button
                  key={size}
                  type="button"
                  className={`btn-font-size-opt ${preferences.fontSize === size ? 'active' : ''}`}
                  onClick={() => updatePref('fontSize', size)}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Moderation shortcut */}
          {onOpenModView && (
            <div className="settings-group">
              <div className="settings-group-title">
                <Shield size={15} />
                <span>Moderation Tools</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenModView();
                }}
                className="btn-mod-view-trigger"
              >
                Open Twitch Mod View
              </button>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
