import React, { useState } from 'react';
import { Shield, Diamond, Edit, Palette, UserPlus, X, Check, Search } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface ChannelRoleUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  role: 'mod' | 'vip' | 'editor' | 'artist';
  assignedDate: string;
}

export const ChannelRolesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'mod' | 'vip' | 'editor' | 'artist'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<'mod' | 'vip' | 'editor' | 'artist'>('mod');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [roleUsers, setRoleUsers] = useState<ChannelRoleUser[]>([
    {
      id: 'u1',
      username: 'PageTurner',
      displayName: 'PageTurner',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'mod',
      assignedDate: 'June 12, 2026'
    },
    {
      id: 'u2',
      username: 'AuraReader',
      displayName: 'AuraReader',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'vip',
      assignedDate: 'July 04, 2026'
    },
    {
      id: 'u3',
      username: 'BookishEditor',
      displayName: 'BookishEditor',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'editor',
      assignedDate: 'May 20, 2026'
    },
    {
      id: 'u4',
      username: 'LoreIllustrator',
      displayName: 'LoreIllustrator',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'artist',
      assignedDate: 'August 01, 2026'
    }
  ]);

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    soundFX.playChestClaim();
    const newUser: ChannelRoleUser = {
      id: `u_${Date.now()}`,
      username: newUsername.trim(),
      displayName: newUsername.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: selectedRole,
      assignedDate: 'Today'
    };

    setRoleUsers(prev => [newUser, ...prev]);
    setShowAddModal(false);
    setNewUsername('');
    setToastMsg(`Added ${newUser.displayName} as a ${selectedRole.toUpperCase()}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRemoveRole = (id: string, name: string) => {
    soundFX.playPop();
    setRoleUsers(prev => prev.filter(u => u.id !== id));
    setToastMsg(`Removed role from ${name}.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredUsers = roleUsers.filter(u => {
    const matchTab = activeTab === 'all' || u.role === activeTab;
    const matchSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="roles-page-container">
      {/* Hero Header */}
      <div className="roles-hero-header">
        <div className="roles-title-col">
          <div className="roles-badge">
            <Shield size={15} />
            <span>COMMUNITY MANAGEMENT</span>
          </div>
          <h1>Channel Roles & Permissions</h1>
          <p>Assign and manage Moderators, VIP badges, Editors, and Channel Artists for your stream.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary btn-add-role-trigger"
        >
          <UserPlus size={16} />
          <span>Add Channel Role</span>
        </button>
      </div>

      {toastMsg && (
        <div className="roles-toast">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Role Tabs + Search Bar */}
      <div className="roles-filter-bar">
        <div className="roles-tabs-row">
          <button
            className={`btn-role-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Roles ({roleUsers.length})
          </button>
          <button
            className={`btn-role-tab ${activeTab === 'mod' ? 'active' : ''}`}
            onClick={() => setActiveTab('mod')}
          >
            <Shield size={14} color="#00ff88" />
            <span>Moderators</span>
          </button>
          <button
            className={`btn-role-tab ${activeTab === 'vip' ? 'active' : ''}`}
            onClick={() => setActiveTab('vip')}
          >
            <Diamond size={14} color="#e040fb" />
            <span>VIPs</span>
          </button>
          <button
            className={`btn-role-tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <Edit size={14} color="#00e5ff" />
            <span>Editors</span>
          </button>
          <button
            className={`btn-role-tab ${activeTab === 'artist' ? 'active' : ''}`}
            onClick={() => setActiveTab('artist')}
          >
            <Palette size={14} color="#ffd700" />
            <span>Artists</span>
          </button>
        </div>

        <div className="roles-search-wrapper">
          <Search size={15} className="roles-search-icon" />
          <input
            type="text"
            placeholder="Search role members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="roles-search-input"
          />
        </div>
      </div>

      {/* Roles Cards Grid */}
      <div className="roles-users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="role-user-card">
            <img src={user.avatarUrl} alt="" className="role-user-avatar" />

            <div className="role-user-details">
              <div className="role-user-name-row">
                <h4>{user.displayName}</h4>
                {user.role === 'mod' && <span className="role-pill mod-pill">⚔️ Mod</span>}
                {user.role === 'vip' && <span className="role-pill vip-pill">💎 VIP</span>}
                {user.role === 'editor' && <span className="role-pill editor-pill">📝 Editor</span>}
                {user.role === 'artist' && <span className="role-pill artist-pill">🎨 Artist</span>}
              </div>

              <span className="role-assigned-date">Assigned: {user.assignedDate}</span>
            </div>

            <button
              onClick={() => handleRemoveRole(user.id, user.displayName)}
              className="btn-remove-role"
              title="Remove Role"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="add-role-modal-card">
            <div className="modal-header">
              <div className="modal-title-row">
                <UserPlus size={20} color="var(--accent-secondary)" />
                <h3>Assign Channel Role</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRole} className="add-role-form">
              <div className="form-group">
                <label>User Handle / Username:</label>
                <input
                  type="text"
                  placeholder="e.g. LoreLover99"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="settings-text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Role:</label>
                <div className="role-choices-grid">
                  <div
                    className={`role-choice-card ${selectedRole === 'mod' ? 'active' : ''}`}
                    onClick={() => setSelectedRole('mod')}
                  >
                    <Shield size={20} color="#00ff88" />
                    <strong>Moderator</strong>
                    <p>Manage chat, timeout trolls, start polls & raids.</p>
                  </div>

                  <div
                    className={`role-choice-card ${selectedRole === 'vip' ? 'active' : ''}`}
                    onClick={() => setSelectedRole('vip')}
                  >
                    <Diamond size={20} color="#e040fb" />
                    <strong>VIP</strong>
                    <p>Chat during slow mode & emote-only mode with diamond crest.</p>
                  </div>

                  <div
                    className={`role-choice-card ${selectedRole === 'editor' ? 'active' : ''}`}
                    onClick={() => setSelectedRole('editor')}
                  >
                    <Edit size={20} color="#00e5ff" />
                    <strong>Editor</strong>
                    <p>Edit stream titles, tags, and manage VOD highlights.</p>
                  </div>

                  <div
                    className={`role-choice-card ${selectedRole === 'artist' ? 'active' : ''}`}
                    onClick={() => setSelectedRole('artist')}
                  >
                    <Palette size={20} color="#ffd700" />
                    <strong>Channel Artist</strong>
                    <p>Upload emotes and channel badges.</p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <UserPlus size={16} />
                  <span>Assign Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
