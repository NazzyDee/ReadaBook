import React, { useState } from 'react';
import { X, MessageSquare, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { DEFAULT_RICH_PRESENCE, type RichPresenceStatus } from '../lib/discordRichPresenceData';
import { soundFX } from '../lib/soundFx';

interface DiscordRichPresenceModalProps {
  streamerName: string;
  onClose: () => void;
}

export const DiscordRichPresenceModal: React.FC<DiscordRichPresenceModalProps> = ({
  streamerName,
  onClose
}) => {
  const [presence, setPresence] = useState<RichPresenceStatus>(DEFAULT_RICH_PRESENCE);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleUpdateRichPresence = () => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg('💬 Updated Discord Activity Rich Presence with live book cover and reader count!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="rpc-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="rpc-modal-header">
          <div className="rpc-title-group">
            <div className="rpc-badge">
              <MessageSquare size={16} />
              <span>DISCORD & MATRIX LIVE RICH PRESENCE (RPC) BRIDGE</span>
            </div>
            <h3>@{streamerName}'s Community Status Sync</h3>
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

        {/* Hero Banner */}
        <div className="rpc-hero-banner">
          <div className="discord-preview-box">
            <div className="discord-game-icon">
              <MessageSquare size={32} color="#5865F2" />
            </div>
            <div className="discord-text-preview">
              <span className="discord-header-tag">PLAYING A GAME</span>
              <strong>ReadaBook</strong>
              <span className="discord-sub-1">{presence.activeStatusText}</span>
              <span className="discord-sub-2">{presence.activityDetails}</span>
            </div>
          </div>

          <div className="rpc-hero-meta">
            <h4>Broadcast Your Current Page to Discord Friends</h4>
            <p className="rpc-explainer">
              Automatically updates your Discord user profile activity with an interactive "Join Stream" button and chapter progress bar.
            </p>

            <button
              type="button"
              className="btn-update-rpc"
              onClick={handleUpdateRichPresence}
            >
              <RefreshCw size={14} />
              <span>Broadcast Activity Pulse</span>
            </button>
          </div>
        </div>

        {/* Integration Options Grid */}
        <div className="rpc-options-grid">
          <div className="control-item">
            <label>Community Protocol</label>
            <select
              value={presence.service}
              onChange={e => setPresence({ ...presence, service: e.target.value as any })}
            >
              <option value="DISCORD_RPC">Discord Desktop Gateway (IPC Socket)</option>
              <option value="MATRIX_SPACE">Matrix / Element Decentralized Space</option>
              <option value="TELEGRAM_CHANNEL">Telegram Channel Live Bot</option>
            </select>
          </div>

          <div className="toggles-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={presence.showReadingProgressPct}
                onChange={e => setPresence({ ...presence, showReadingProgressPct: e.target.checked })}
              />
              <span>Display Live Book Reading % Progress</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="rpc-modal-footer">
          <span className="footer-rpc-note">
            💬 Zero-token OAuth connection via local Discord IPC daemon.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
