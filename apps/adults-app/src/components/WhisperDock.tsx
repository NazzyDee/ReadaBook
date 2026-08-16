import React, { useState } from 'react';
import { MessageSquare, Send, Minus, Search, Plus } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { soundFX } from '../lib/soundFx';

interface WhisperMessage {
  sender: string;
  text: string;
  time: string;
}

interface WhisperThread {
  userId: string;
  username: string;
  avatar: string;
  online: boolean;
  messages: WhisperMessage[];
  unread: boolean;
}

export const WhisperDock: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [threads, setThreads] = useState<WhisperThread[]>([
    {
      userId: 'user_cozyreader',
      username: 'CozyReader99',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      online: true,
      unread: true,
      messages: [
        { sender: 'CozyReader99', text: 'Hey! Are you watching Lilly\'s Narnia stream right now?', time: '8:42 PM' },
        { sender: 'CozyReader99', text: 'Her Aslan voice was so good!', time: '8:43 PM' }
      ]
    },
    {
      userId: 'user_mirkwood',
      username: 'MirkwoodWatcher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      online: true,
      unread: false,
      messages: [
        { sender: 'MirkwoodWatcher', text: 'Did you see the new book club meeting scheduled for Friday?', time: '7:15 PM' }
      ]
    }
  ]);

  if (!user) return null;

  const totalUnread = threads.filter(t => t.unread).length;
  const activeThread = threads.find(t => t.userId === activeThreadId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;

    soundFX.playPop();
    const newMsg: WhisperMessage = {
      sender: user.email?.split('@')[0] || 'You',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreads(prev =>
      prev.map(t => {
        if (t.userId === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );

    setReplyText('');
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setThreads(prev =>
      prev.map(t => (t.userId === threadId ? { ...t, unread: false } : t))
    );
  };

  const handleStartNewWhisper = (username: string) => {
    if (!username.trim()) return;
    const existing = threads.find(t => t.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      setActiveThreadId(existing.userId);
      setShowSearch(false);
      setUserSearchQuery('');
      return;
    }

    const newThread: WhisperThread = {
      userId: `u_${Date.now()}`,
      username: username.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      online: true,
      messages: [],
      unread: false
    };

    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.userId);
    setShowSearch(false);
    setUserSearchQuery('');
  };

  return (
    <div className="whisper-dock-container">
      {isOpen ? (
        <div className="whisper-window">
          <div className="whisper-window-header">
            <div className="whisper-header-left">
              <MessageSquare size={16} />
              <span>Whispers</span>
            </div>
            <div className="whisper-header-right">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="btn-whisper-icon"
                title="New Whisper"
              >
                <Plus size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="btn-whisper-icon" title="Minimize">
                <Minus size={16} />
              </button>
            </div>
          </div>

          {/* User Search Bar */}
          {showSearch && (
            <div className="whisper-search-row">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search reader username..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartNewWhisper(userSearchQuery);
                }}
                className="whisper-search-input"
                autoFocus
              />
            </div>
          )}

          <div className="whisper-window-body">
            {activeThread ? (
              <div className="whisper-chat-view">
                <div className="whisper-chat-top">
                  <button onClick={() => setActiveThreadId(null)} className="btn-whisper-back">
                    ←
                  </button>
                  <img src={activeThread.avatar} alt="Avatar" className="whisper-user-avatar" />
                  <span className="whisper-user-name">{activeThread.username}</span>
                  {activeThread.online && <span className="online-dot"></span>}
                </div>

                <div className="whisper-messages-scroll">
                  {activeThread.messages.length === 0 ? (
                    <div className="whisper-empty-thread">
                      <p>Start a conversation with <strong>{activeThread.username}</strong> 📖</p>
                    </div>
                  ) : (
                    activeThread.messages.map((m, idx) => {
                      const isMe = m.sender === (user.email?.split('@')[0] || 'You');
                      return (
                        <div key={idx} className={`whisper-bubble-row ${isMe ? 'is-me' : 'is-them'}`}>
                          <div className="whisper-bubble">
                            <p>{m.text}</p>
                            <span className="whisper-time">{m.time}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendReply} className="whisper-reply-form">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Send a whisper..."
                    className="whisper-input"
                    autoFocus
                  />
                  <button type="submit" className="btn-whisper-send">
                    <Send size={14} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="whisper-threads-list">
                {threads.map(t => (
                  <div
                    key={t.userId}
                    className={`whisper-thread-item ${t.unread ? 'unread' : ''}`}
                    onClick={() => handleSelectThread(t.userId)}
                  >
                    <div className="whisper-avatar-wrapper">
                      <img src={t.avatar} alt="Avatar" className="whisper-thread-avatar" />
                      {t.online && <span className="online-dot-badge"></span>}
                    </div>
                    <div className="whisper-thread-info">
                      <span className="whisper-thread-name">{t.username}</span>
                      <p className="whisper-thread-preview">
                        {t.messages[t.messages.length - 1]?.text || 'Start chatting...'}
                      </p>
                    </div>
                    {t.unread && <span className="whisper-unread-dot"></span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="whisper-dock-pill">
          <MessageSquare size={16} />
          <span>Whispers</span>
          {totalUnread > 0 && <span className="whisper-unread-count">{totalUnread}</span>}
        </button>
      )}
    </div>
  );
};
