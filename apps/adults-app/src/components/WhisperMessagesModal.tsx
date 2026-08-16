import React, { useState } from 'react';
import { X, MessageSquare, Send, Quote } from 'lucide-react';
import {
  MOCK_WHISPER_CONTACTS,
  INITIAL_WHISPER_THREAD,
  type WhisperContact,
  type WhisperMessage
} from '../lib/whisperMessagesData';
import { soundFX } from '../lib/soundFx';

interface WhisperMessagesModalProps {
  onClose: () => void;
}

export const WhisperMessagesModal: React.FC<WhisperMessagesModalProps> = ({ onClose }) => {
  const [contacts] = useState<WhisperContact[]>(MOCK_WHISPER_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<WhisperContact>(MOCK_WHISPER_CONTACTS[0]);
  const [messages, setMessages] = useState<WhisperMessage[]>(INITIAL_WHISPER_THREAD);
  const [inputVal, setInputVal] = useState('');
  const [attachQuote, setAttachQuote] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    soundFX.playPop();

    const newMsg: WhisperMessage = {
      id: `wm_${Date.now()}`,
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text: inputVal.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      attachedQuote: attachQuote ? '“All that is gold does not glitter, not all those who wander are lost.”' : undefined
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal('');
    setAttachQuote(false);

    // Simulate auto-reply from contact after 1.5s
    setTimeout(() => {
      soundFX.playPageRustle();
      const replyMsg: WhisperMessage = {
        id: `wm_reply_${Date.now()}`,
        senderName: selectedContact.username,
        senderAvatar: selectedContact.avatarUrl,
        text: 'Totally agree! Excited for next chapter!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="whispers-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="whispers-modal-header">
          <div className="whispers-title-group">
            <div className="whispers-badge">
              <MessageSquare size={16} />
              <span>QUIET LIBRARY WHISPERS & CO-READER DMS</span>
            </div>
            <h3>Direct Messages & Reading Buddy Chat</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Whispers Body 2-Column */}
        <div className="whispers-body-layout">
          {/* Contacts Sidebar */}
          <div className="whispers-contacts-sidebar">
            <div className="sidebar-header-title">
              <span>ACTIVE CO-READERS</span>
            </div>

            <div className="contacts-list">
              {contacts.map(c => (
                <button
                  key={c.username}
                  type="button"
                  className={`whisper-contact-card ${selectedContact.username === c.username ? 'active' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedContact(c);
                  }}
                >
                  <div className="contact-avatar-wrap">
                    <img src={c.avatarUrl} alt={c.username} className="contact-avatar" />
                    {c.isOnline && <span className="online-pip"></span>}
                  </div>

                  <div className="contact-info">
                    <div className="contact-top">
                      <strong>@{c.username}</strong>
                    </div>
                    <span className="contact-book-tag">📖 {c.currentBookReading}</span>
                    <p className="contact-last-msg">{c.lastMessageSnippet}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          <div className="whispers-chat-pane">
            <div className="chat-pane-header">
              <div className="active-user-meta">
                <img src={selectedContact.avatarUrl} alt={selectedContact.username} className="header-avatar" />
                <div>
                  <strong>@{selectedContact.username}</strong>
                  <span className="user-status-text">{selectedContact.isOnline ? 'Active in Stream' : 'Offline'}</span>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="whispers-messages-scroll">
              {messages.map(msg => (
                <div key={msg.id} className={`whisper-bubble-row ${msg.isSelf ? 'self' : 'other'}`}>
                  {!msg.isSelf && <img src={msg.senderAvatar} alt={msg.senderName} className="msg-avatar-sm" />}

                  <div className="whisper-bubble-card">
                    <div className="msg-author-time">
                      <span className="msg-author">{msg.senderName}</span>
                      <span className="msg-time">{msg.timestamp}</span>
                    </div>

                    <p className="msg-text-content">{msg.text}</p>

                    {msg.attachedQuote && (
                      <div className="msg-attached-quote-box">
                        <Quote size={12} color="#ffd700" />
                        <span>{msg.attachedQuote}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Composer Form */}
            <form className="whisper-input-form" onSubmit={handleSendMessage}>
              <div className="input-options-bar">
                <button
                  type="button"
                  className={`btn-quote-toggle ${attachQuote ? 'active' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setAttachQuote(!attachQuote);
                  }}
                >
                  <Quote size={12} />
                  <span>Attach Current Quote</span>
                </button>
              </div>

              <div className="input-send-row">
                <input
                  type="text"
                  required
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder={`Whisper to @${selectedContact.username}...`}
                />
                <button type="submit" className="btn-primary btn-send-whisper">
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
