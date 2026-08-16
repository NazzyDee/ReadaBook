import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

export interface WhisperToastItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  previewText: string;
}

interface WhisperToastProps {
  toast: WhisperToastItem;
  onReply: (senderName: string) => void;
  onDismiss: (id: string) => void;
}

export const WhisperToast: React.FC<WhisperToastProps> = ({
  toast,
  onReply,
  onDismiss
}) => {
  const handleReply = () => {
    soundFX.playPop();
    onReply(toast.senderName);
    onDismiss(toast.id);
  };

  return (
    <div className="whisper-toast-card">
      <img src={toast.senderAvatar} alt={toast.senderName} className="whisper-toast-avatar" />

      <div className="whisper-toast-content" onClick={handleReply}>
        <div className="whisper-toast-header">
          <MessageSquare size={13} color="var(--accent-secondary)" />
          <strong>{toast.senderName}</strong>
          <span className="whisper-tag">Whisper</span>
        </div>
        <p className="whisper-toast-text">{toast.previewText}</p>
      </div>

      <div className="whisper-toast-actions">
        <button onClick={handleReply} className="btn-whisper-toast-reply">
          Reply
        </button>
        <button onClick={() => onDismiss(toast.id)} className="btn-whisper-toast-close">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
