import React, { useState } from 'react';
import { X, MessageCircle, CheckCircle2, ShieldCheck, Sparkles, Radio } from 'lucide-react';
import { MOCK_DISCORD_CONFIG, type DiscordServerConfig } from '../lib/discordSyncData';
import { soundFX } from '../lib/soundFx';

interface DiscordRoleSyncModalProps {
  streamerName: string;
  onClose: () => void;
}

export const DiscordRoleSyncModal: React.FC<DiscordRoleSyncModalProps> = ({
  streamerName,
  onClose
}) => {
  const [config, setConfig] = useState<DiscordServerConfig>(MOCK_DISCORD_CONFIG);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleConnectDiscord = () => {
    soundFX.playChestClaim();
    soundFX.playApplause();

    setConfig(prev => ({
      ...prev,
      isConnected: true,
      linkedDiscordUsername: 'ReaderScholar#4821',
      syncedRoles: prev.syncedRoles.map(r => ({ ...r, isGranted: true }))
    }));

    setSyncToast('🎉 Discord linked! Granted @Verified Subscriber, @Lore Master, and @Buddy Reader roles!');
    setTimeout(() => setSyncToast(null), 4000);
  };

  const handleDisconnectDiscord = () => {
    soundFX.playPop();
    setConfig(prev => ({
      ...prev,
      isConnected: false,
      linkedDiscordUsername: null,
      syncedRoles: prev.syncedRoles.map(r => ({ ...r, isGranted: false }))
    }));
    setSyncToast('Discord unlinked.');
    setTimeout(() => setSyncToast(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="discord-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="discord-modal-header">
          <div className="discord-title-group">
            <div className="discord-badge">
              <MessageCircle size={16} />
              <span>COMMUNITY DISCORD & SUBSCRIBER SYNC</span>
            </div>
            <h3>@{streamerName}'s Discord Book Club Guild</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {syncToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{syncToast}</span>
          </div>
        )}

        <p className="discord-intro-text">
          Link your Discord account to automatically synchronize subscriber roles, gain access to secret spoiler channels, and join private 24/7 audio co-reading lounges.
        </p>

        {/* Discord Server Card */}
        <div className="discord-server-banner">
          <div className="server-banner-left">
            <img src={config.serverIconUrl} alt={config.serverName} className="discord-server-icon" />
            <div className="discord-server-text">
              <h4>{config.serverName}</h4>
              <span>{config.totalMembers.toLocaleString()} Discord Members • Verified Book Guild</span>
            </div>
          </div>

          {config.isConnected ? (
            <div className="linked-status-group">
              <span className="linked-tag">
                <CheckCircle2 size={13} />
                <span>Linked: {config.linkedDiscordUsername}</span>
              </span>
              <button
                type="button"
                className="btn-unlink-discord"
                onClick={handleDisconnectDiscord}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-connect-discord"
              onClick={handleConnectDiscord}
            >
              <MessageCircle size={18} />
              <span>Connect with Discord</span>
            </button>
          )}
        </div>

        {/* Synced Roles List */}
        <div className="discord-roles-section">
          <h4>
            <ShieldCheck size={16} color="var(--accent-secondary)" />
            <span>Automated Discord Role Perks</span>
          </h4>

          <div className="discord-roles-grid">
            {config.syncedRoles.map((role, idx) => (
              <div key={idx} className={`discord-role-card ${role.isGranted ? 'granted' : ''}`}>
                <div className="role-top-row">
                  <span className="role-pill" style={{ borderColor: role.color, color: role.color }}>
                    {role.name}
                  </span>
                  <span className="role-status-text">
                    {role.isGranted ? '✅ Active' : '🔒 Requires Sub'}
                  </span>
                </div>
                <p className="role-desc">{role.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="discord-channels-preview">
          <div className="channel-preview-item">
            <Radio size={14} color="#00ff88" />
            <span>🔊 <strong>#moria-silent-co-reading</strong> (24/7 Lo-Fi Ambient Voice Stage)</span>
          </div>
          <div className="channel-preview-item">
            <MessageCircle size={14} color="#ffd700" />
            <span>💬 <strong>#chapter-spoiler-theories</strong> (Verified Sub-Only Discussion)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
