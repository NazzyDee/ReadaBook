import React, { useState } from 'react';
import { X, Shield, Plus, Trash2, CheckCircle2, Sparkles, UserPlus } from 'lucide-react';
import { MOCK_CHANNEL_ROLES, type ChannelUserRole } from '../lib/channelRolesData';
import { soundFX } from '../lib/soundFx';

interface ChannelRolesModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ChannelRolesModal: React.FC<ChannelRolesModalProps> = ({
  streamerName,
  onClose
}) => {
  const [roles, setRoles] = useState<ChannelUserRole[]>(MOCK_CHANNEL_ROLES);
  const [newUsername, setNewUsername] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState<ChannelUserRole['role']>('vip');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    soundFX.playChestClaim();

    const roleBadgeMap: Record<ChannelUserRole['role'], { icon: string; label: string }> = {
      moderator: { icon: '⚔️', label: 'Channel Moderator' },
      vip: { icon: '📜', label: 'Scribe VIP' },
      verified_author: { icon: '✍️', label: 'Verified Author' },
      lore_master: { icon: '🧙', label: 'Lore Master' },
      founder: { icon: '👑', label: 'Founding Patron' }
    };

    const newRole: ChannelUserRole = {
      id: `role_${Date.now()}`,
      username: newUsername.trim().replace(/^@/, ''),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: selectedRoleType,
      badgeIcon: roleBadgeMap[selectedRoleType].icon,
      badgeLabel: roleBadgeMap[selectedRoleType].label,
      assignedDate: 'Just Now',
      permissions: {
        canPurgeChat: selectedRoleType === 'moderator',
        canManageShield: selectedRoleType === 'moderator',
        canManageCast: selectedRoleType === 'moderator' || selectedRoleType === 'vip',
        canTriggerSoundboard: true
      }
    };

    setRoles(prev => [newRole, ...prev]);
    setNewUsername('');
    setToastMessage(`🛡️ Assigned ${roleBadgeMap[selectedRoleType].label} badge to @${newRole.username}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRemoveRole = (roleId: string, username: string) => {
    soundFX.playPop();
    setRoles(prev => prev.filter(r => r.id !== roleId));
    setToastMessage(`Revoked role from @${username}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="roles-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="roles-modal-header">
          <div className="roles-title-group">
            <div className="roles-badge">
              <Shield size={16} />
              <span>CHANNEL ROLES & BADGE MANAGEMENT</span>
            </div>
            <h3>@{streamerName}'s VIP & Moderator Roster</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMessage}</span>
          </div>
        )}

        <p className="roles-intro-text">
          Grant special channel badges and permissions to trusted readers, lore experts, and verified authors who help moderate your book stream.
        </p>

        {/* Add Role Form */}
        <form onSubmit={handleAddRole} className="add-role-form">
          <div className="input-group">
            <UserPlus size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Username (e.g. Brandon_Sanderson)..."
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              className="role-username-input"
            />
          </div>

          <select
            value={selectedRoleType}
            onChange={e => setSelectedRoleType(e.target.value as any)}
            className="role-type-select"
          >
            <option value="vip">📜 Scribe VIP</option>
            <option value="moderator">⚔️ Channel Moderator</option>
            <option value="lore_master">🧙 Lore Master</option>
            <option value="verified_author">✍️ Verified Author</option>
            <option value="founder">👑 Founding Patron</option>
          </select>

          <button type="submit" className="btn-primary btn-assign-role">
            <Plus size={16} />
            <span>Assign Role</span>
          </button>
        </form>

        {/* Roles Table */}
        <div className="roles-list-table">
          {roles.map(r => (
            <div key={r.id} className="role-table-row">
              <div className="role-user-meta">
                <img src={r.avatarUrl} alt={r.username} className="role-user-avatar" />
                <div className="role-user-text">
                  <div className="user-badge-row">
                    <span className="role-custom-badge">{r.badgeIcon}</span>
                    <strong>@{r.username}</strong>
                  </div>
                  <span className="role-label-sub">{r.badgeLabel} • Added {r.assignedDate}</span>
                </div>
              </div>

              {/* Permissions Chips */}
              <div className="role-perms-summary">
                {r.permissions.canPurgeChat && <span className="perm-chip">Purge Chat</span>}
                {r.permissions.canManageShield && <span className="perm-chip">Shield</span>}
                {r.permissions.canManageCast && <span className="perm-chip">Cast HUD</span>}
                <span className="perm-chip active"><CheckCircle2 size={11} /> Soundboard</span>
              </div>

              {/* Action */}
              <button
                type="button"
                className="btn-revoke-role"
                onClick={() => handleRemoveRole(r.id, r.username)}
                title="Revoke Role & Badges"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
