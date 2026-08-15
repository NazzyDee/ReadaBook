import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { collection, addDoc, query, onSnapshot, serverTimestamp, doc, where, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books, type Book } from '../lib/booksData';
import { Users, Send, AlertCircle, Radio, LogOut, Heart, Pin } from 'lucide-react';
import '../App.css';

interface ChatMessage {
  id: string;
  text: string;
  username: string;
  createdAt: any;
  type?: 'announcement' | 'normal';
}

interface StreamData {
  streamerId: string;
  streamerName: string;
  title: string;
  bookId: string;
  genre: string;
  currentPage: number;
  currentParagraph?: number;
  isLive: boolean;
  viewerCount: number;
  emoteOnly?: boolean;
  pinnedMessage?: string | null;
  broadcastSource?: 'webcam' | 'obs';
  isObsConnected?: boolean;
}


export const StreamPage: React.FC = () => {
  const { streamerId } = useParams<{ streamerId: string }>();
  const { user, logout } = useAuth();
  const [stream, setStream] = useState<StreamData | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch and subscribe to Stream Document
  useEffect(() => {
    if (!streamerId) return;

    const streamDocRef = doc(db, 'streams', streamerId);
    const unsubscribe = onSnapshot(streamDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setStream(docSnap.data() as StreamData);
      } else {
        setStream(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error reading stream document: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [streamerId]);

  // 2. Resolve active book (static or custom Firestore book)
  useEffect(() => {
    if (!stream) {
      setActiveBook(null);
      return;
    }

    const staticBook = books.find(b => b.id === stream.bookId);
    if (staticBook) {
      fetch(`/books/${stream.bookId}.json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.pages) {
            setActiveBook({ ...staticBook, pages: data.pages });
          } else {
            setActiveBook(staticBook);
          }
        })
        .catch(err => {
          console.error("Failed to load book pages:", err);
          setActiveBook(staticBook);
        });
    } else {
      // Listen to custom book dynamically in Firestore
      const bookDocRef = doc(db, 'books', stream.bookId);
      const unsubscribe = onSnapshot(bookDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setActiveBook({ id: docSnap.id, ...docSnap.data() } as Book);
        }
      });
      return () => unsubscribe();
    }
  }, [stream]);

  // 3. Subscribe to Follow status
  useEffect(() => {
    if (!user || !streamerId) return;

    if (streamerId.startsWith('mock-')) {
      const mockFollows = JSON.parse(localStorage.getItem('mockFollows') || '[]');
      setIsFollowing(mockFollows.includes(streamerId));
      return;
    }

    const followDocRef = doc(db, 'users', user.uid, 'follows', streamerId);
    const unsubscribe = onSnapshot(followDocRef, (docSnap) => {
      setIsFollowing(docSnap.exists());
    });

    return () => unsubscribe();
  }, [user, streamerId]);

  // 4. Fetch and subscribe to Chat Messages
  useEffect(() => {
    if (!streamerId) return;

    if (streamerId.startsWith('mock-')) {
      const initialMockMsgs = [
        { id: 'm1', text: 'I love this chapter so much!', username: 'ReaderPro', createdAt: new Date() },
        { id: 'm2', text: 'Lofi beats are perfect for this book.', username: 'ChillVibes', createdAt: new Date() },
        { id: 'm3', text: 'Where can I buy this edition?', username: 'NovelWorm', createdAt: new Date() }
      ];
      setMessages(initialMockMsgs);

      const mockChatUsers = ['AuraReader', 'BookWorm99', 'PageTurner', 'Shelfishly', 'LitCritique', 'NovelEnthusiast'];
      const mockChatPhrases = [
        'Oh wow, I did not expect that!',
        'Can you read that page again?',
        'The vocabulary here is amazing.',
        'This matches the title perfectly.',
        'Wait, is that a typo in the original print?',
        'Such an engaging voice! Thanks for streaming!',
        'Alice is my favorite character.',
        'What genre is this categorized under?'
      ];

      const interval = setInterval(() => {
        const randomUser = mockChatUsers[Math.floor(Math.random() * mockChatUsers.length)];
        const randomText = mockChatPhrases[Math.floor(Math.random() * mockChatPhrases.length)];
        
        setMessages(prev => [
          ...prev, 
          {
            id: `mock-msg-${Math.random()}`,
            text: randomText,
            username: randomUser,
            createdAt: new Date()
          }
        ]);
      }, 7000);

      return () => clearInterval(interval);
    }

    const q = query(
      collection(db, 'messages'),
      where('streamId', '==', streamerId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      // Sort client-side by createdAt ascending, then limit to 50
      msgs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds || 0);
        return timeA - timeB;
      });
      setMessages(msgs.slice(-50));
    });

    return () => unsubscribe();
  }, [streamerId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFollowToggle = async () => {
    if (!user || !streamerId) return;

    if (streamerId.startsWith('mock-')) {
      const mockFollows = JSON.parse(localStorage.getItem('mockFollows') || '[]');
      let updatedFollows = [];
      if (isFollowing) {
        updatedFollows = mockFollows.filter((id: string) => id !== streamerId);
      } else {
        updatedFollows = [...mockFollows, streamerId];
      }
      localStorage.setItem('mockFollows', JSON.stringify(updatedFollows));
      setIsFollowing(!isFollowing);
      window.dispatchEvent(new Event('storage'));
      return;
    }

    const followDocRef = doc(db, 'users', user.uid, 'follows', streamerId);
    try {
      if (isFollowing) {
        await deleteDoc(followDocRef);
      } else {
        await setDoc(followDocRef, {
          streamerName: stream?.streamerName || 'Streamer',
          followedAt: new Date()
        });
      }
    } catch (err) {
      console.error("Error toggling follow: ", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !streamerId) return;

    if (stream?.emoteOnly) {
      return;
    }

    const username = user.email ? user.email.split('@')[0] : 'Anonymous';
    const msgText = newMessage;
    setNewMessage('');

    try {
      await addDoc(collection(db, 'messages'), {
        text: msgText,
        username,
        streamId: streamerId,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending message: ", err);
    }
  };

  const handleSendEmoji = async (emoji: string) => {
    if (!user || !streamerId) return;
    const username = user.email ? user.email.split('@')[0] : 'Anonymous';

    try {
      await addDoc(collection(db, 'messages'), {
        text: emoji,
        username,
        streamId: streamerId,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending emoji: ", err);
    }
  };


  if (loading) {
    return (
      <div className="stream-loading-screen">
        <div className="spinner"></div>
        <p>Connecting to stream feed...</p>
      </div>
    );
  }

  if (!stream || !stream.isLive) {
    return (
      <div className="offline-container">
        <AlertCircle size={64} color="var(--accent-primary)" />
        <h1>Stream Offline</h1>
        <p>This channel is not currently broadcasting. Head back to Browse to find active reading streams.</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', marginTop: '16px' }}>
          Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <Link to="/" className="header-logo">
          ReadaBook <span>Live</span>
        </Link>
        <div className="stream-header-info">
          <div className="stream-pill">
            <Radio size={14} className="pulse" />
            <span>LIVE</span>
          </div>
          <span className="header-stream-title">{stream.title}</span>
          
          {user && user.uid !== streamerId && (
            <button 
              onClick={handleFollowToggle} 
              className={`btn-follow ${isFollowing ? 'following' : ''}`}
            >
              <Heart size={14} fill={isFollowing ? "currentColor" : "none"} />
              <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>
          )}
        </div>
        <div className="user-profile">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="profile-name">{user.email?.split('@')[0]}</span>
              <button className="btn-primary" onClick={logout} style={{ background: 'var(--bg-hover)', color: 'var(--text-main)', boxShadow: 'none', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Left: Reading and Video Section */}
        <section className="reader-section" style={{ position: 'relative', width: '100%', height: '100%', padding: 0, overflow: 'hidden', display: 'flex', justifyContent: 'stretch', alignItems: 'stretch' }}>
          
          {/* The Main Camera Feed (Creator stream takes 100% space as background canvas) */}
          <div className="live-camera-feed-sim" style={{ flex: 1, background: '#11032a', position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>
            {stream.broadcastSource === 'obs' ? (
              stream.isObsConnected ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #0b011d 0%, #240046 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.6rem',
                    marginBottom: '12px',
                    boxShadow: '0 0 24px rgba(157, 78, 221, 0.6)'
                  }}>
                    📡
                  </div>
                  <h2 style={{ fontSize: '1.3rem', color: '#fff', margin: '0 0 4px 0' }}>{stream.streamerName}'s OBS Broadcast</h2>
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>🟢 Ingestion Feed Connected (1080p)</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '8px' }}>Streaming from OBS Studio encoder-us-east-1</span>
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#11032a',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffde6a',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '2.5rem', animation: 'pulse 1.5s infinite', display: 'block', marginBottom: '12px' }}>📡</span>
                  <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 4px 0' }}>Awaiting OBS Signal...</h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>The stream has started but storyteller is still configuring OBS.</span>
                </div>
              )
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #15023a 0%, #6247aa 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'var(--accent-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  marginBottom: '12px',
                  boxShadow: '0 0 20px rgba(138, 43, 226, 0.6)'
                }}>
                  {stream.streamerName.substring(0, 2).toUpperCase()}
                </div>
                <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 4px 0' }}>{stream.streamerName} is Live!</h2>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Camera Feed Active</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '8px' }}>Storyteller is streaming live on camera! 🎥</span>
              </div>
            )}
            <div className="feed-watermark" style={{ top: '20px', left: '20px', fontSize: '1rem', background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: '4px' }}>
              <span>{stream.streamerName}</span>
              <span className="rec-dot"></span>
            </div>
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '6px', background: '#ff4d4d', color: '#fff', padding: '6px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px', zIndex: 5 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }}></span>
              <span>LIVE</span>
            </div>
          </div>

          {/* The E-Book Text Overlay (Beautiful Floating Glass Card) */}
          {activeBook ? (
            <div className="book-display" style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              bottom: '20px',
              width: '380px',
              maxHeight: 'calc(100% - 40px)',
              background: 'rgba(17, 3, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
              zIndex: 10,
              color: '#fff',
              overflow: 'hidden'
            }}>
              <div className="book-display-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '12px', display: 'flex', gap: '12px' }}>
                 <img src={activeBook.coverUrl} alt="Book Cover" className="book-cover-img" style={{ width: '50px', height: '70px', borderRadius: '4px', objectFit: 'cover' }} />
                 <div className="book-display-details">
                    <h2 style={{ fontSize: '1.1rem', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>{activeBook.title}</h2>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>By {activeBook.author}</h4>
                    <span className="chapter-indicator" style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>Page {stream.currentPage + 1} of {activeBook.pages.length}</span>
                 </div>
              </div>
              
              <div className="book-text-content" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', fontSize: '1rem', lineHeight: '1.5' }}>
                {activeBook.pages[stream.currentPage] ? (
                  activeBook.pages[stream.currentPage].split('\n\n').map((para: string, idx: number) => {
                    const isActive = stream.currentParagraph !== undefined ? idx === stream.currentParagraph : false;
                    return (
                      <p 
                        key={idx} 
                        style={{ 
                          marginBottom: '12px', 
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: isActive ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
                          borderLeft: isActive ? '3px solid var(--accent-secondary)' : '3px solid transparent',
                          transition: 'all 0.15s',
                          color: isActive ? '#fff' : 'rgba(255,255,255,0.85)'
                        }}
                      >
                        {para}
                      </p>
                    );
                  })
                ) : (
                  <p>Loading page text...</p>
                )}
              </div>
            </div>
          ) : (
            <div className="book-display" style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              bottom: '20px',
              width: '380px',
              background: 'rgba(17, 3, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
              zIndex: 10,
              color: '#fff'
            }}>
              <div className="spinner"></div>
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading novel content...</p>
            </div>
          )}

        </section>

        {/* Right: Live Chat Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-header">
            <span>Stream Chat</span>
            <div className="chat-viewer-count">
              <Users size={14} />
              <span>{stream.viewerCount}</span>
            </div>
          </div>

          {/* Pinned Message Banner */}
          {stream.pinnedMessage && (
            <div className="chat-pinned-message">
              <Pin size={12} fill="currentColor" style={{ marginRight: '6px', transform: 'rotate(45deg)', flexShrink: 0 }} />
              <span className="pinned-text">Pinned: "{stream.pinnedMessage}"</span>
            </div>
          )}
          
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.type === 'announcement' ? 'announcement-msg' : ''}`}>
                <span className="username">{msg.username}:</span>
                <span className="message-text">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            {stream.emoteOnly ? (
              <div className="emote-only-panel">
                <div className="emote-only-badge">Emote-Only Mode Active</div>
                <div className="quick-emojis-row">
                  {['👍', '❤️', '😂', '🎉', '😮', '📖'].map(emoji => (
                    <button 
                      key={emoji} 
                      onClick={() => handleSendEmoji(emoji)} 
                      disabled={!user}
                      className="chat-quick-emoji-btn"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%', gap: '8px' }}>
                <input 
                  type="text" 
                  className="chat-input" 
                  placeholder={user ? "Send a message..." : "Sign in to chat"} 
                  disabled={!user}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }} disabled={!user}>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </aside>

      </main>
    </div>
  );
};
