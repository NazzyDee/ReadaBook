import React, { useState } from 'react';
import {
  Shield,
  X,
  Trash2,
  Ban,
  Clock,
  Check,
  AlertTriangle,
  UserX,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';
import { type ChatMsg } from './LiveChat';
import { soundFX } from '../lib/soundFx';

interface ModViewModalProps {
  streamerName: string;
  messages: ChatMsg[];
  onDeleteMessage: (id: string) => void;
  onClearChat: () => void;
  onTimeoutUser: (username: string, durationSecs: number) => void;
  onBanUser: (username: string) => void;
  onClose: () => void;
}

interface SuspiciousUser {
  id: string;
  username: string;
  confidence: 'High' | 'Medium' | 'Low';
  reason: string;
  status: 'monitoring' | 'restricted' | 'banned';
}

export const ModViewModal: React.FC<ModViewModalProps> = ({
  streamerName,
  messages,
  onDeleteMessage,
  onClearChat,
  onTimeoutUser,
  onBanUser,
  onClose
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [modSuccessMsg, setModSuccessMsg] = useState<string | null>(null);
  const [selectedMsgIds, setSelectedMsgIds] = useState<string[]>([]);

  // AutoMod suspicious queue simulation
  const [autoModQueue, setAutoModQueue] = useState<{ id: string; user: string; text: string; reason: string }[]>([
    { id: 'am1', user: 'SuspiciousReader', text: 'Spoiler: In chapter 10 the mentor dies horribly', reason: 'Spoiler Detection' },
    { id: 'am2', user: 'SpamBot99', text: 'Check out free books at scamwebsite.xyz', reason: 'Suspicious URL' }
  ]);

  // Suspicious Users & Ban Evasion Queue
  const [suspiciousUsers, setSuspiciousUsers] = useState<SuspiciousUser[]>([
    {
      id: 'sus1',
      username: 'AltOf_BannedTroll',
      confidence: 'High',
      reason: 'Shared IP with permanently banned user "TrollAccount1"',
      status: 'monitoring'
    },
    {
      id: 'sus2',
      username: 'FastAccount_882',
      confidence: 'Medium',
      reason: 'Account created 12 minutes ago • Rapid messaging',
      status: 'monitoring'
    }
  ]);

  const handleApproveAutoMod = (id: string) => {
    soundFX.playPop();
    setAutoModQueue(prev => prev.filter(item => item.id !== id));
    setModSuccessMsg('Message approved and posted to chat.');
    setTimeout(() => setModSuccessMsg(null), 2000);
  };

  const handleDenyAutoMod = (id: string, user: string) => {
    soundFX.playPop();
    setAutoModQueue(prev => prev.filter(item => item.id !== id));
    onTimeoutUser(user, 600);
    setModSuccessMsg(`Denied message and timed out ${user} for 10m.`);
    setTimeout(() => setModSuccessMsg(null), 2000);
  };

  const handleUserTimeout = (user: string, secs: number) => {
    soundFX.playPop();
    onTimeoutUser(user, secs);
    setModSuccessMsg(`Timed out ${user} for ${secs >= 60 ? `${secs / 60}m` : `${secs}s`}.`);
    setTimeout(() => setModSuccessMsg(null), 2000);
  };

  const handleUserBan = (user: string) => {
    soundFX.playPop();
    onBanUser(user);
    setModSuccessMsg(`Permanently banned ${user} from ${streamerName}'s channel.`);
    setTimeout(() => setModSuccessMsg(null), 2000);
  };

  const handleToggleSelectMsg = (id: string) => {
    if (selectedMsgIds.includes(id)) {
      setSelectedMsgIds(selectedMsgIds.filter(m => m !== id));
    } else {
      setSelectedMsgIds([...selectedMsgIds, id]);
    }
  };

  const handleDeleteSelected = () => {
    soundFX.playPop();
    selectedMsgIds.forEach(id => onDeleteMessage(id));
    setModSuccessMsg(`Deleted ${selectedMsgIds.length} selected messages.`);
    setSelectedMsgIds([]);
    setTimeout(() => setModSuccessMsg(null), 2000);
  };

  const handleBanSuspicious = (user: SuspiciousUser) => {
    soundFX.playPop();
    onBanUser(user.username);
    setSuspiciousUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'banned' } : u));
    setModSuccessMsg(`Preemptively banned suspected ban-evader ${user.username}.`);
    setTimeout(() => setModSuccessMsg(null), 2500);
  };

  const handleRestrictSuspicious = (user: SuspiciousUser) => {
    soundFX.playPop();
    setSuspiciousUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'restricted' } : u));
    setModSuccessMsg(`Restricted ${user.username} to verified chat only.`);
    setTimeout(() => setModSuccessMsg(null), 2500);
  };

  return (
    <div className="modal-backdrop">
      <div className="mod-view-modal-card">
        {/* Header */}
        <div className="mod-view-header">
          <div className="mod-view-title-row">
            <Shield size={20} color="#00e5ff" />
            <h3>Twitch Mod View Workspace — {streamerName}'s Channel</h3>
            <span className="mod-live-chip">MOD DESK ACTIVE</span>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {modSuccessMsg && (
          <div className="mod-success-toast">
            <Check size={14} />
            <span>{modSuccessMsg}</span>
          </div>
        )}

        {/* Mod Grid */}
        <div className="mod-view-grid">
          {/* Dock 1: AutoMod Review Queue */}
          <div className="mod-dock auto-mod-dock">
            <div className="dock-header">
              <AlertTriangle size={15} color="#ffd700" />
              <span>AutoMod Review Queue ({autoModQueue.length})</span>
            </div>

            <div className="auto-mod-list">
              {autoModQueue.length === 0 ? (
                <div className="dock-empty">No flagged messages in queue! 🎉</div>
              ) : (
                autoModQueue.map(item => (
                  <div key={item.id} className="auto-mod-card">
                    <div className="auto-mod-meta">
                      <span className="auto-mod-user">{item.user}</span>
                      <span className="auto-mod-reason">{item.reason}</span>
                    </div>
                    <p className="auto-mod-text">"{item.text}"</p>
                    <div className="auto-mod-actions">
                      <button
                        onClick={() => handleApproveAutoMod(item.id)}
                        className="btn-mod-approve"
                      >
                        <Check size={13} />
                        <span>Allow</span>
                      </button>
                      <button
                        onClick={() => handleDenyAutoMod(item.id, item.user)}
                        className="btn-mod-deny"
                      >
                        <Trash2 size={13} />
                        <span>Deny & Timeout</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dock 2: Suspicious Users & Ban Evasion Detection */}
          <div className="mod-dock suspicious-users-dock">
            <div className="dock-header">
              <UserX size={15} color="#ff3b3b" />
              <span>Suspicious User & Ban Evasion Monitor ({suspiciousUsers.length})</span>
            </div>

            <div className="suspicious-users-list">
              {suspiciousUsers.map(sus => (
                <div key={sus.id} className="suspicious-user-card">
                  <div className="sus-user-top">
                    <strong>{sus.username}</strong>
                    <span className={`confidence-badge ${sus.confidence.toLowerCase()}`}>
                      {sus.confidence} Confidence Alt
                    </span>
                  </div>
                  <p className="sus-reason">{sus.reason}</p>
                  <div className="sus-status-row">
                    <span className={`sus-status-pill ${sus.status}`}>
                      Status: {sus.status.toUpperCase()}
                    </span>
                  </div>
                  {sus.status !== 'banned' && (
                    <div className="sus-actions-row">
                      <button
                        onClick={() => handleRestrictSuspicious(sus)}
                        className="btn-sus-restrict"
                        title="Restrict user"
                      >
                        <Eye size={12} />
                        <span>Restrict</span>
                      </button>
                      <button
                        onClick={() => handleBanSuspicious(sus)}
                        className="btn-sus-ban"
                        title="Preemptive Ban"
                      >
                        <Ban size={12} />
                        <span>Ban Alt</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dock 3: Live Chat Feed with Batch Selection */}
          <div className="mod-dock chat-feed-dock">
            <div className="dock-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Live Chat Feed</span>
                {selectedMsgIds.length > 0 && (
                  <button onClick={handleDeleteSelected} className="btn-batch-delete">
                    <Trash2 size={12} />
                    <span>Delete ({selectedMsgIds.length})</span>
                  </button>
                )}
              </div>
              <button onClick={onClearChat} className="btn-clear-chat-all">
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            </div>

            <div className="mod-messages-scroll">
              {messages.slice(-25).map(msg => {
                const isSelected = selectedMsgIds.includes(msg.id);
                return (
                  <div key={msg.id} className={`mod-msg-row ${isSelected ? 'selected' : ''}`}>
                    <button
                      type="button"
                      onClick={() => handleToggleSelectMsg(msg.id)}
                      className="btn-select-msg"
                    >
                      {isSelected ? <CheckSquare size={13} color="#00e5ff" /> : <Square size={13} color="var(--text-muted)" />}
                    </button>
                    <span
                      className="mod-msg-username"
                      onClick={() => setSelectedUser(msg.username)}
                    >
                      {msg.username}:
                    </span>
                    <span className="mod-msg-text">{msg.text}</span>
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="btn-delete-single-msg"
                      title="Delete message"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dock 4: User Inspector & Quick Actions */}
          <div className="mod-dock user-inspector-dock">
            <div className="dock-header">
              <span>User Moderation Actions</span>
            </div>

            <div className="inspector-content">
              {selectedUser ? (
                <div className="selected-user-card">
                  <h4>Moderating: <strong>{selectedUser}</strong></h4>

                  <div className="timeout-durations-grid">
                    <button onClick={() => handleUserTimeout(selectedUser, 60)} className="btn-timeout-opt">
                      <Clock size={12} /> Timeout 1m
                    </button>
                    <button onClick={() => handleUserTimeout(selectedUser, 600)} className="btn-timeout-opt">
                      <Clock size={12} /> Timeout 10m
                    </button>
                    <button onClick={() => handleUserTimeout(selectedUser, 3600)} className="btn-timeout-opt">
                      <Clock size={12} /> Timeout 1h
                    </button>
                    <button onClick={() => handleUserTimeout(selectedUser, 86400)} className="btn-timeout-opt">
                      <Clock size={12} /> Timeout 24h
                    </button>
                  </div>

                  <button
                    onClick={() => handleUserBan(selectedUser)}
                    className="btn-ban-user-danger"
                  >
                    <Ban size={15} />
                    <span>Permanently Ban {selectedUser}</span>
                  </button>
                </div>
              ) : (
                <div className="dock-empty">
                  <span>Click any username in chat to inspect and apply timeouts or bans.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
