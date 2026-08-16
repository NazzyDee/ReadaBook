import React, { useState } from 'react';
import {
  X,
  Shield,
  Ban,
  Trash2,
  Calendar,
  Heart,
  Star,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface UserChatCardProps {
  username: string;
  badges?: string[];
  isModOrBroadcaster?: boolean;
  onTimeoutUser?: (username: string, durationSecs: number) => void;
  onBanUser?: (username: string) => void;
  onDeleteUserMessages?: (username: string) => void;
  onClose: () => void;
}

export const UserChatCardModal: React.FC<UserChatCardProps> = ({
  username,
  badges = ['sub1'],
  isModOrBroadcaster = true,
  onTimeoutUser,
  onBanUser,
  onDeleteUserMessages,
  onClose
}) => {
  const [modNote, setModNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([
    'First joined during Chapter 2 reading session',
    'Followed for 4 months'
  ]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modNote.trim()) return;
    soundFX.playPop();
    setSavedNotes([...savedNotes, modNote.trim()]);
    setModNote('');
  };

  const handleTimeout = (secs: number, label: string) => {
    soundFX.playPop();
    if (onTimeoutUser) onTimeoutUser(username, secs);
    setActionNotice(`Timed out ${username} for ${label}.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleBan = () => {
    soundFX.playPop();
    if (onBanUser) onBanUser(username);
    setActionNotice(`Permanently banned ${username}.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleDeleteAll = () => {
    soundFX.playPop();
    if (onDeleteUserMessages) onDeleteUserMessages(username);
    setActionNotice(`Purged all messages from ${username}.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="modal-backdrop">
      <div className="user-chat-card-modal">
        {/* Header */}
        <div className="user-card-header">
          <div className="user-card-profile-row">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${username}`}
              alt={username}
              className="user-card-avatar"
            />
            <div className="user-card-identity">
              <div className="user-card-name-line">
                <h3>{username}</h3>
                <div className="badges-row">
                  {badges.map((b, i) => (
                    <span key={i} className="user-card-badge-pill">
                      {b === 'broadcaster' ? '🎥 Broadcaster' : b === 'mod' ? '⚔️ Mod' : b === 'vip' ? '💎 VIP' : '📗 3-Mo Sub'}
                    </span>
                  ))}
                </div>
              </div>
              <span className="user-account-id">ID: usr_89412_{username.toLowerCase()}</span>
            </div>
          </div>

          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className="user-card-action-toast">
            <CheckCircle2 size={15} color="#00ff88" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Viewer Stats Grid */}
        <div className="user-stats-grid">
          <div className="user-stat-card">
            <Calendar size={15} color="var(--accent-secondary)" />
            <div>
              <span className="stat-label">Account Age</span>
              <strong>1 Year, 3 Months</strong>
            </div>
          </div>

          <div className="user-stat-card">
            <Heart size={15} color="var(--accent-danger)" />
            <div>
              <span className="stat-label">Following Channel</span>
              <strong>8 Months</strong>
            </div>
          </div>

          <div className="user-stat-card">
            <Star size={15} color="#ffd700" />
            <div>
              <span className="stat-label">Sub Tenure</span>
              <strong>Tier 1 (Month 3)</strong>
            </div>
          </div>

          <div className="user-stat-card">
            <Shield size={15} color="#00ff88" />
            <div>
              <span className="stat-label">Safety Status</span>
              <strong style={{ color: '#00ff88' }}>Good Standing</strong>
            </div>
          </div>
        </div>

        {/* Mod Actions (If User is Broadcaster / Mod) */}
        {isModOrBroadcaster && (
          <div className="user-mod-actions-section">
            <label className="section-label">Moderator Quick Tools:</label>
            <div className="mod-timeout-row">
              <span className="timeout-label">Timeout:</span>
              {[
                { s: 10, l: '10s' },
                { s: 60, l: '1m' },
                { s: 600, l: '10m' },
                { s: 3600, l: '1h' },
                { s: 86400, l: '24h' }
              ].map(t => (
                <button
                  key={t.s}
                  type="button"
                  onClick={() => handleTimeout(t.s, t.l)}
                  className="btn-mod-timeout"
                >
                  {t.l}
                </button>
              ))}
            </div>

            <div className="mod-danger-row">
              <button type="button" onClick={handleDeleteAll} className="btn-mod-danger secondary">
                <Trash2 size={14} />
                <span>Purge Messages</span>
              </button>

              <button type="button" onClick={handleBan} className="btn-mod-danger">
                <Ban size={14} />
                <span>Ban User</span>
              </button>
            </div>

            {/* Mod Notes Drawer */}
            <div className="mod-notes-drawer">
              <div className="drawer-header">
                <FileText size={14} color="var(--text-muted)" />
                <span>Moderation Notes ({savedNotes.length})</span>
              </div>
              <ul className="notes-list">
                {savedNotes.map((n, idx) => (
                  <li key={idx} className="note-item">• {n}</li>
                ))}
              </ul>
              <form onSubmit={handleAddNote} className="add-note-form">
                <input
                  type="text"
                  placeholder="Add private mod note..."
                  value={modNote}
                  onChange={(e) => setModNote(e.target.value)}
                  className="add-note-input"
                />
                <button type="submit" disabled={!modNote.trim()} className="btn-add-note">
                  Save
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
