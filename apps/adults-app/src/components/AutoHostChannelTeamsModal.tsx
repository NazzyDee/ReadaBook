import React, { useState } from 'react';
import { X, Users, Sparkles, CheckCircle2, Plus, ArrowUp, ArrowDown, Radio } from 'lucide-react';
import { AUTO_HOST_TEAM_MEMBERS, type AutoHostTeamMember } from '../lib/autoHostChannelTeamsData';
import { soundFX } from '../lib/soundFx';

interface AutoHostChannelTeamsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AutoHostChannelTeamsModal: React.FC<AutoHostChannelTeamsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [members, setMembers] = useState<AutoHostTeamMember[]>(AUTO_HOST_TEAM_MEMBERS);
  const [newHostUsername, setNewHostUsername] = useState('');
  const [isAutoHostEnabled, setIsAutoHostEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleMovePriority = (index: number, direction: 'UP' | 'DOWN') => {
    soundFX.playPop();
    const newMembers = [...members];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newMembers.length) return;

    const temp = newMembers[index];
    newMembers[index] = newMembers[targetIdx];
    newMembers[targetIdx] = temp;

    setMembers(newMembers);
  };

  const handleAddHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHostUsername.trim()) return;

    soundFX.playChestClaim();
    const newMember: AutoHostTeamMember = {
      id: `mem_${Date.now()}`,
      username: newHostUsername.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80',
      guildName: 'Independent Narrator Guild',
      currentBookReading: 'Currently Offline',
      isLiveNow: false,
      priorityOrder: members.length + 1
    };

    setMembers(prev => [...prev, newMember]);
    setNewHostUsername('');
    setToastMsg(`🌟 Added @${newMember.username} to your Auto-Host Priority List!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ Auto-Host priority list and offline raid fallback saved!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="autohost-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="autohost-modal-header">
          <div className="autohost-title-group">
            <div className="autohost-badge">
              <Users size={16} />
              <span>NARRATOR GUILDS & AUTO-HOST RAID MATRIX</span>
            </div>
            <h3>@{streamerName}'s Auto-Host Roster</h3>
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

        {/* Master Toggle Banner */}
        <div className="autohost-toggle-banner">
          <div className="banner-left">
            <Radio size={20} color={isAutoHostEnabled ? '#00ff88' : 'var(--text-muted)'} />
            <div>
              <h4>Automatic Offline Channel Hosting</h4>
              <p>When you go offline, your channel will automatically embed and host the highest priority live guild member.</p>
            </div>
          </div>

          <button
            type="button"
            className={`btn-toggle-switch ${isAutoHostEnabled ? 'on' : 'off'}`}
            onClick={() => {
              soundFX.playPop();
              setIsAutoHostEnabled(prev => !prev);
            }}
          >
            {isAutoHostEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        {/* Add Streamer Form */}
        <form onSubmit={handleAddHost} className="add-host-form">
          <div className="add-host-input-row">
            <input
              type="text"
              value={newHostUsername}
              onChange={e => setNewHostUsername(e.target.value)}
              placeholder="Add narrator username to auto-host list (e.g. BardicTales)..."
            />
            <button type="submit" className="btn-primary btn-add-host">
              <Plus size={14} />
              <span>Add Narrator</span>
            </button>
          </div>
        </form>

        {/* Members Priority List */}
        <div className="autohost-members-list">
          {members.map((mem, index) => (
            <div key={mem.id} className="autohost-member-row">
              <div className="priority-num-badge">
                <span>#{index + 1}</span>
              </div>

              <div className="member-avatar-wrap">
                <img src={mem.avatarUrl} alt={mem.username} />
                {mem.isLiveNow && <span className="live-dot-mini"></span>}
              </div>

              <div className="member-info-col">
                <div className="member-name-row">
                  <strong>@{mem.username}</strong>
                  <span className="guild-name-tag">{mem.guildName}</span>
                </div>
                <p className="reading-status-text">
                  {mem.isLiveNow ? `🔴 LIVE: Reading ${mem.currentBookReading}` : '⚪ Offline'}
                </p>
              </div>

              <div className="priority-actions">
                <button
                  type="button"
                  className="btn-prio-arrow"
                  disabled={index === 0}
                  onClick={() => handleMovePriority(index, 'UP')}
                  title="Move Priority Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  className="btn-prio-arrow"
                  disabled={index === members.length - 1}
                  onClick={() => handleMovePriority(index, 'DOWN')}
                  title="Move Priority Down"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="autohost-modal-footer">
          <button
            type="button"
            className="btn-primary btn-save-autohost"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Save Auto-Host Matrix</span>
          </button>
        </div>
      </div>
    </div>
  );
};
