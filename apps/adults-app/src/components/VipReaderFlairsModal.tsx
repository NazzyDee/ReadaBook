import React, { useState } from 'react';
import { X, Gem, Sparkles, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { MOCK_VIP_READERS, type VipReader } from '../lib/vipReaderData';
import { soundFX } from '../lib/soundFx';

interface VipReaderFlairsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const VipReaderFlairsModal: React.FC<VipReaderFlairsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [vips, setVips] = useState<VipReader[]>(MOCK_VIP_READERS);
  const [newUsername, setNewUsername] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<VipReader['badgeType']>('DIAMOND_VIP');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleGrantVip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    soundFX.playChestClaim();
    soundFX.playApplause();

    const badgeIconMap: Record<VipReader['badgeType'], string> = {
      DIAMOND_VIP: '💎',
      GRAND_SCRIBE: '📜',
      GUILD_PATRON: '👑',
      FOUNDER: '⚡'
    };

    const colorMap: Record<VipReader['badgeType'], string> = {
      DIAMOND_VIP: '#00ff88',
      GRAND_SCRIBE: '#ffd700',
      GUILD_PATRON: '#9d4edd',
      FOUNDER: '#ff0055'
    };

    const newVip: VipReader = {
      id: `vip_${Date.now()}`,
      username: newUsername.trim().replace('@', ''),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      badgeType: selectedBadge,
      badgeIcon: badgeIconMap[selectedBadge],
      customChatColor: colorMap[selectedBadge],
      grantedAt: 'Just now',
      hasSlowModeImmunity: true
    };

    setVips([newVip, ...vips]);
    setToastMsg(`💎 Granted ${badgeIconMap[selectedBadge]} ${selectedBadge} status to @${newVip.username}!`);
    setNewUsername('');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRevokeVip = (id: string, username: string) => {
    soundFX.playPop();
    setVips(prev => prev.filter(v => v.id !== id));
    setToastMsg(`Revoked VIP status from @${username}.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="vip-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="vip-modal-header">
          <div className="vip-title-group">
            <div className="vip-badge">
              <Gem size={16} />
              <span>ARCHIVIST VIP BADGES & CHAT FLAIRS</span>
            </div>
            <h3>@{streamerName}'s VIP & Scribe Roster</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Grant New VIP Form */}
        <form onSubmit={handleGrantVip} className="grant-vip-form">
          <div className="grant-inputs-row">
            <input
              type="text"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder="Enter reader username (e.g. LillysNumberOneFan)..."
              required
            />

            <select
              value={selectedBadge}
              onChange={e => setSelectedBadge(e.target.value as VipReader['badgeType'])}
            >
              <option value="DIAMOND_VIP">💎 Diamond VIP</option>
              <option value="GRAND_SCRIBE">📜 Grand Scribe</option>
              <option value="GUILD_PATRON">👑 Guild Patron</option>
              <option value="FOUNDER">⚡ Founder</option>
            </select>

            <button type="submit" className="btn-primary btn-grant-vip">
              <Plus size={15} />
              <span>Grant Badge</span>
            </button>
          </div>
        </form>

        {/* VIPs List */}
        <div className="vips-list-grid">
          {vips.map(v => (
            <div key={v.id} className="vip-member-card">
              <div className="vip-left-info">
                <img src={v.avatarUrl} alt={v.username} className="vip-avatar" />
                <div className="vip-name-details">
                  <div className="vip-badge-name-row">
                    <span className="vip-emoji-badge">{v.badgeIcon}</span>
                    <strong style={{ color: v.customChatColor }}>@{v.username}</strong>
                    <span className="vip-type-pill">{v.badgeType.replace('_', ' ')}</span>
                  </div>
                  <span className="vip-granted-meta">
                    Granted {v.grantedAt} • <ShieldCheck size={11} /> Slow Mode Immune
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-revoke-vip"
                onClick={() => handleRevokeVip(v.id, v.username)}
                title="Revoke VIP Status"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
