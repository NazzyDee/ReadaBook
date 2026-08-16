import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { X, User, Bell, Shield, Link as LinkIcon, Check, Save } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface UserSettingsModalProps {
  onClose: () => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ onClose }) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'connections' | 'security'>('profile');
  const [displayName, setDisplayName] = useState(user?.email ? user.email.split('@')[0] : 'Reader');
  const [bio, setBio] = useState('Passionate fantasy & sci-fi reader. Currently journeying through Tolkien classics and cozy bedtime story streams! 📚✨');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
  const [goodreadsUrl, setGoodreadsUrl] = useState('https://goodreads.com/user/show/reader');
  const [discordTag, setDiscordTag] = useState('CozyReader#1337');
  const [notifyLive, setNotifyLive] = useState(true);
  const [notifyDrops, setNotifyDrops] = useState(true);
  const [whispersFrom, setWhispersFrom] = useState<'anyone' | 'followers' | 'none'>('anyone');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPop();
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop">
      <div className="user-settings-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <User size={20} color="var(--accent-secondary)" />
            <h3>Account & Channel Settings</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="settings-nav-tabs-row">
          <button
            className={`s-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={14} />
            <span>Profile</span>
          </button>
          <button
            className={`s-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={14} />
            <span>Notifications</span>
          </button>
          <button
            className={`s-tab ${activeTab === 'connections' ? 'active' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            <LinkIcon size={14} />
            <span>Connections</span>
          </button>
          <button
            className={`s-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={14} />
            <span>Security</span>
          </button>
        </div>

        {savedToast && (
          <div className="settings-saved-toast">
            <Check size={16} />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSave} className="settings-tab-form">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="settings-form-group">
              <div className="avatar-edit-preview-row">
                <img src={avatarUrl} alt="Avatar" className="avatar-preview-img" />
                <div className="avatar-edit-input-col">
                  <label>Profile Picture URL:</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="settings-text-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Display Name:</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="settings-text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>About Me / Bio:</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="settings-textarea"
                  maxLength={300}
                />
                <span className="char-count">{bio.length}/300</span>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="settings-form-group">
              <div className="setting-toggle-row">
                <div>
                  <span className="setting-name">Live Stream Broadcast Alerts</span>
                  <p className="setting-desc">Get notified immediately when followed storytellers go live</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyLive}
                  onChange={(e) => setNotifyLive(e.target.checked)}
                  className="toggle-checkbox"
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <span className="setting-name">Book Drops & Rewards Ready</span>
                  <p className="setting-desc">Alert when a watch-time reward is ready to be claimed</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDrops}
                  onChange={(e) => setNotifyDrops(e.target.checked)}
                  className="toggle-checkbox"
                />
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Receive Whispers / Direct Messages from:</label>
                <select
                  value={whispersFrom}
                  onChange={(e) => setWhispersFrom(e.target.value as any)}
                  className="settings-select-input"
                >
                  <option value="anyone">Anyone on ReadaBook</option>
                  <option value="followers">Followed Channels Only</option>
                  <option value="none">Block all Whispers</option>
                </select>
              </div>
            </div>
          )}

          {/* CONNECTIONS TAB */}
          {activeTab === 'connections' && (
            <div className="settings-form-group">
              <div className="form-group">
                <label>Goodreads Profile URL:</label>
                <input
                  type="text"
                  value={goodreadsUrl}
                  onChange={(e) => setGoodreadsUrl(e.target.value)}
                  className="settings-text-input"
                  placeholder="https://goodreads.com/user/..."
                />
              </div>

              <div className="form-group">
                <label>Discord Username / Server:</label>
                <input
                  type="text"
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  className="settings-text-input"
                  placeholder="Username#0000"
                />
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="settings-form-group">
              <div className="security-status-card">
                <Shield size={24} color="var(--accent-success)" />
                <div>
                  <h4>Account Security Status: Secure</h4>
                  <p>Two-Factor Authentication (2FA) is active. Broadcaster streaming privileges enabled.</p>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Email Address:</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="settings-text-input"
                  style={{ opacity: 0.6 }}
                />
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
