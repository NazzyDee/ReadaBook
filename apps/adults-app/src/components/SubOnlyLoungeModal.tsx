import React, { useState } from 'react';
import { X, MessageSquare, Sparkles, CheckCircle2, Crown, Send, Shield } from 'lucide-react';
import { DEFAULT_LOUNGE_MESSAGES, type LoungeMessage } from '../lib/subOnlyLoungeData';
import { soundFX } from '../lib/soundFx';

interface SubOnlyLoungeModalProps {
  streamerName: string;
  onClose: () => void;
}

export const SubOnlyLoungeModal: React.FC<SubOnlyLoungeModalProps> = ({
  streamerName,
  onClose
}) => {
  const [messages, setMessages] = useState<LoungeMessage[]>(DEFAULT_LOUNGE_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    soundFX.playPop();
    const newMsg: LoungeMessage = {
      id: `lounge_${Date.now()}`,
      senderName: 'You (Tier 3 Sub)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80',
      subTier: 'TIER_3',
      messageText: inputMsg.trim(),
      timestamp: 'Just now',
      isHost: false
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
    setToastMsg('💬 Sent message to Subscriber-Only Backstage Salon!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="lounge-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="lounge-modal-header">
          <div className="lounge-title-group">
            <div className="lounge-badge">
              <Crown size={16} />
              <span>SUBSCRIBER-ONLY PRIVATE BOOK CLUB SALON</span>
            </div>
            <h3>@{streamerName}'s VIP Member Salon</h3>
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

        {/* VIP Lounge Banner */}
        <div className="lounge-hero-banner">
          <Shield size={22} color="#ffd700" />
          <div className="lounge-hero-meta">
            <h4>Private VIP Reader Sanctum</h4>
            <p>Exclusive spoiler discussions, early chapter manuscript previews, and monthly direct Q&A with the author and narrator.</p>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="lounge-messages-feed">
          {messages.map(msg => (
            <div key={msg.id} className={`lounge-msg-row ${msg.isHost ? 'host' : ''}`}>
              <img src={msg.senderAvatar} alt={msg.senderName} className="lounge-avatar" />
              <div className="lounge-msg-bubble">
                <div className="lounge-msg-meta">
                  <strong>{msg.senderName}</strong>
                  <span className="lounge-tier-pill">{msg.subTier}</span>
                  <span className="lounge-time">{msg.timestamp}</span>
                </div>
                <p>{msg.messageText}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Send Input Bar */}
        <form onSubmit={handleSendMessage} className="lounge-input-form">
          <div className="lounge-input-row">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder="Send a private message to the subscriber book club salon..."
            />
            <button type="submit" className="btn-primary btn-send-lounge">
              <Send size={14} />
              <span>Send</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="lounge-modal-footer">
          <div className="footer-salon-note">
            <MessageSquare size={14} color="var(--accent-secondary)" />
            <span>Encrypted private chat. Only active Tier 1, 2 & 3 subscribers can view and participate.</span>
          </div>
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
