import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

interface ChatRulesModalProps {
  streamerName: string;
  onAccept: () => void;
}

export const ChatRulesModal: React.FC<ChatRulesModalProps> = ({ streamerName, onAccept }) => {
  return (
    <div className="modal-backdrop">
      <div className="chat-rules-modal-card">
        <div className="rules-icon-badge">
          <ShieldCheck size={32} color="var(--accent-primary)" />
        </div>

        <h3>Welcome to {streamerName}'s Reading Room!</h3>
        <p className="rules-subtitle">
          Please review and follow the community rules before chatting:
        </p>

        <div className="rules-list">
          <div className="rule-item">
            <span className="rule-num">1</span>
            <p><strong>No Unmarked Spoilers:</strong> Please do not reveal plot twists, future chapter deaths, or ending reveals unless the streamer asks for lore discussion.</p>
          </div>
          <div className="rule-item">
            <span className="rule-num">2</span>
            <p><strong>Be Respectful to Fellow Readers:</strong> Harassment, hate speech, and derogatory remarks will result in an immediate timeout or permanent ban.</p>
          </div>
          <div className="rule-item">
            <span className="rule-num">3</span>
            <p><strong>No Self-Promotion or Spam:</strong> Keep chat on-topic regarding the current novel, literature questions, and cozy reading vibes.</p>
          </div>
        </div>

        <button onClick={onAccept} className="btn-primary btn-accept-rules">
          <Check size={16} />
          <span>I Understand & Agree to the Rules</span>
        </button>
      </div>
    </div>
  );
};
