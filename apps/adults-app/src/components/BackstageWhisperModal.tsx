import React, { useState } from 'react';
import { X, Mic, Sparkles, Send, Bell, Shield, Radio, Volume2 } from 'lucide-react';
import {
  MOCK_BACKSTAGE_MESSAGES,
  QUICK_BACKSTAGE_CUES,
  type BackstageMessage
} from '../lib/backstageWhisperData';
import { soundFX } from '../lib/soundFx';

interface BackstageWhisperModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BackstageWhisperModal: React.FC<BackstageWhisperModalProps> = ({
  streamerName,
  onClose
}) => {
  const [messages, setMessages] = useState<BackstageMessage[]>(MOCK_BACKSTAGE_MESSAGES);
  const [newMsg, setNewMsg] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || newMsg;
    if (!text.trim()) return;

    soundFX.playPop();
    const msg: BackstageMessage = {
      id: `bw_${Date.now()}`,
      sender: streamerName,
      role: 'BROADCASTER',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, msg]);
    if (!textToSend) setNewMsg('');
    setToastMsg('📡 Cue dispatched to backstage lounge!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTestMicChime = () => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg('🎙️ Mic & Walkie-Talkie Chime Test Sent to Cast!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="backstage-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="backstage-modal-header">
          <div className="backstage-title-group">
            <div className="backstage-badge">
              <Radio size={16} />
              <span>STAGE WHISPER & BACKSTAGE CO-HOST LOUNGE</span>
            </div>
            <h3>@{streamerName}'s Production Intercom</h3>
          </div>

          <div className="backstage-header-actions">
            <button
              type="button"
              className="btn-mic-test-chime"
              onClick={handleTestMicChime}
              title="Test push-to-talk chime"
            >
              <Volume2 size={15} color="var(--accent-teal)" />
              <span>Mic Chime</span>
            </button>
            <button onClick={onClose} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Quick Cues Row */}
        <div className="quick-cues-section">
          <label className="cues-label">INSTANT STAGE CUES (1-CLICK DISPATCH):</label>
          <div className="cues-chips-grid">
            {QUICK_BACKSTAGE_CUES.map(cue => (
              <button
                key={cue}
                type="button"
                className="btn-cue-chip"
                onClick={() => handleSend(cue)}
              >
                {cue}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="backstage-messages-list">
          {messages.map(m => (
            <div
              key={m.id}
              className={`backstage-msg-item ${m.sender === streamerName ? 'is-self' : ''} ${m.isUrgent ? 'is-urgent' : ''}`}
            >
              <div className="msg-header">
                <div className="sender-meta">
                  <strong>{m.sender}</strong>
                  <span className={`role-badge role-${m.role.toLowerCase()}`}>
                    {m.role === 'HEAD_MOD' ? <Shield size={10} /> : <Mic size={10} />}
                    {m.role.replace('_', ' ')}
                  </span>
                </div>
                <span className="timestamp">{m.timestamp}</span>
              </div>
              <p className="msg-content">{m.text}</p>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="backstage-input-form"
        >
          <div className="backstage-input-row">
            <input
              type="text"
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              placeholder="Whisper to moderators, co-readers, and sound tech..."
            />
            <button type="submit" className="btn-primary btn-send-whisper">
              <Send size={14} />
              <span>Send</span>
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="backstage-modal-footer">
          <span className="backstage-notice">
            🔒 Private Channel: Encrypted end-to-end between Broadcaster, Co-Hosts, and Head Mods.
          </span>
          <div className="active-cast-pill">
            <Bell size={12} color="#00ff88" />
            <span>3 Crew Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
