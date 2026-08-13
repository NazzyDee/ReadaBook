import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit, doc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books } from '../lib/booksData';
import { Smile, AlertCircle, Radio, LogOut } from 'lucide-react';
import '../App.css';

interface ChatReaction {
  id: string;
  text: string;
  username: string;
  createdAt: any;
}

interface StreamData {
  streamerId: string;
  streamerName: string;
  title: string;
  bookId: string;
  genre: string;
  currentPage: number;
  isLive: boolean;
  viewerCount: number;
}

export const StreamPage: React.FC = () => {
  const { streamerId } = useParams<{ streamerId: string }>();
  const { user, logout } = useAuth();
  const [stream, setStream] = useState<StreamData | null>(null);
  const [activeBook, setActiveBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState<ChatReaction[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pre-approved safe kids reactions
  const safeEmojis = ['👍', '❤️', '😂', '🎉', '😮', '📖', '🧸', '🎈', '🌟'];
  const safePhrases = ['Amazing!', 'I love this!', 'Super fun!', 'Hello! 👋', 'Thank you! 💖', 'Fun characters!'];

  // Mock streams database for static kids viewing
  const mockStreams: Record<string, StreamData> = {
    "mock-kids-1": {
      streamerId: "mock-kids-1",
      streamerName: "StoryTimeRabbit",
      title: "🐰 Let's Read Peter Pan Together! (Bubbly Voice)",
      bookId: "peter-pan",
      genre: "Adventure",
      currentPage: 0,
      isLive: true,
      viewerCount: 245
    },
    "mock-kids-2": {
      streamerId: "mock-kids-2",
      streamerName: "NurseryTales",
      title: "🧸 The Secret Garden | Relaxing Voice before bedtime",
      bookId: "secret-garden",
      genre: "Nature / Friendship",
      currentPage: 1,
      isLive: true,
      viewerCount: 189
    },
    "mock-kids-3": {
      streamerId: "mock-kids-3",
      streamerName: "MagicVelveteen",
      title: "✨ Story of a Real Rabbit! Reading The Velveteen Rabbit",
      bookId: "velveteen-rabbit",
      genre: "Classics",
      currentPage: 0,
      isLive: true,
      viewerCount: 92
    }
  };

  // 1. Fetch and subscribe to Stream Document
  useEffect(() => {
    if (!streamerId) return;

    if (streamerId.startsWith('mock-')) {
      setStream(mockStreams[streamerId]);
      setLoading(false);

      const interval = setInterval(() => {
        setStream(prev => {
          if (!prev) return null;
          const book = books.find(b => b.id === prev.bookId);
          if (!book) return prev;
          const nextPage = (prev.currentPage + 1) % book.pages.length;
          return { ...prev, currentPage: nextPage };
        });
      }, 30000);

      return () => clearInterval(interval);
    }

    const streamDocRef = doc(db, 'streams_kids', streamerId);
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
      setActiveBook(staticBook);
    } else {
      const bookDocRef = doc(db, 'books_kids', stream.bookId);
      const unsubscribe = onSnapshot(bookDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setActiveBook({ id: docSnap.id, ...docSnap.data() });
        }
      });
      return () => unsubscribe();
    }
  }, [stream]);

  // 3. Fetch and subscribe to reactions
  useEffect(() => {
    if (!streamerId) return;

    if (streamerId.startsWith('mock-')) {
      const initialMockMsgs = [
        { id: 'm1', text: '❤️', username: 'KidReader', createdAt: new Date() },
        { id: 'm2', text: 'Amazing!', username: 'FairyFan', createdAt: new Date() },
        { id: 'm3', text: '🧸', username: 'TeddyLover', createdAt: new Date() }
      ];
      setReactions(initialMockMsgs);

      const mockChatUsers = ['RabbitFan', 'BearClub', 'StarrySky', 'PixieDust', 'GardenGlow'];
      const mockReactions = [...safeEmojis, ...safePhrases];

      const interval = setInterval(() => {
        const randomUser = mockChatUsers[Math.floor(Math.random() * mockChatUsers.length)];
        const randomReact = mockReactions[Math.floor(Math.random() * mockReactions.length)];
        
        setReactions(prev => [
          ...prev, 
          {
            id: `mock-msg-${Math.random()}`,
            text: randomReact,
            username: randomUser,
            createdAt: new Date()
          }
        ]);
      }, 5000); // reaction every 5 seconds

      return () => clearInterval(interval);
    }

    const q = query(
      collection(db, 'messages_kids'),
      where('streamId', '==', streamerId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatReaction[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatReaction);
      });
      setReactions(msgs.reverse());
    });

    return () => unsubscribe();
  }, [streamerId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reactions]);

  const handleSendReaction = async (reactionText: string) => {
    if (!user || !streamerId) return;

    const username = user.email ? user.email.split('@')[0] : 'KidFriend';

    try {
      await addDoc(collection(db, 'messages_kids'), {
        text: reactionText,
        username,
        streamId: streamerId,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending reaction: ", err);
    }
  };

  if (loading) {
    return (
      <div className="stream-loading-screen">
        <div className="spinner"></div>
        <p>Connecting to Storyteller...</p>
      </div>
    );
  }

  if (!stream || !stream.isLive) {
    return (
      <div className="offline-container">
        <AlertCircle size={64} color="var(--accent-primary)" />
        <h1>Story Room is Closed 🧸</h1>
        <p>The storyteller is offline. Ask your parent to help you find another live story room!</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', marginTop: '16px' }}>
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <Link to="/" className="header-logo">
          🧸 ReadaBook <span>Kids</span>
        </Link>
        <div className="stream-header-info">
          <div className="stream-pill" style={{ background: 'var(--accent-primary)' }}>
            <Radio size={14} className="pulse" />
            <span>STORY LIVE</span>
          </div>
          <span className="header-stream-title">{stream.title}</span>
        </div>
        <div className="user-profile">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="profile-name">🌟 {user.email?.split('@')[0]}</span>
              <button className="btn-primary" onClick={logout} style={{ background: 'var(--bg-hover)', color: 'var(--text-main)', boxShadow: 'none', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogOut size={14} />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Left: Reading Display */}
        <section className="reader-section">
          
          {activeBook ? (
            <div className="book-display">
              <div className="book-display-header">
                 <img src={activeBook.coverUrl} alt="Book Cover" className="book-cover-img" />
                 <div className="book-display-details">
                    <h1>{activeBook.title}</h1>
                    <h3>By {activeBook.author}</h3>
                    <span className="chapter-indicator">Page {stream.currentPage + 1} of {activeBook.pages.length}</span>
                 </div>
              </div>
              
              <div className="book-text-content">
                <p>
                  {activeBook.pages[stream.currentPage] || "Loading story page..."}
                </p>
              </div>
            </div>
          ) : (
            <div className="book-display" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div className="spinner"></div>
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Opening the magic book...</p>
            </div>
          )}

          {/* Video Feed */}
          <div className="video-overlay" style={{ border: '3px solid var(--accent-secondary)', borderRadius: 'var(--border-radius)' }}>
            <div className="live-camera-feed-sim">
              <img src="/assets/streamer_feed.jpg" alt="Storyteller feed" />
              <div className="feed-watermark" style={{ background: 'rgba(0, 180, 216, 0.7)' }}>
                <span>📖 Storyteller: {stream.streamerName}</span>
              </div>
            </div>
          </div>

        </section>

        {/* Right: Safe Chat Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-header">
            <span>Happy Reactions 🎈</span>
          </div>
          
          <div className="chat-messages">
            {reactions.map((msg) => (
              <div key={msg.id} className="chat-message bubble-message">
                <span className="username">🌟 {msg.username}:</span>
                <span className="message-text reaction-bubble">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Emoji & Phrase Pad */}
          <div className="kids-reaction-board">
            {user ? (
              <div className="reaction-board-content">
                <p className="reaction-title">Tap an Emoji to React!</p>
                <div className="emoji-row">
                  {safeEmojis.map(emoji => (
                    <button 
                      key={emoji} 
                      onClick={() => handleSendReaction(emoji)}
                      className="reaction-emoji-btn"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                
                <p className="reaction-title" style={{ marginTop: '8px' }}>Send a Safe Message:</p>
                <div className="phrase-grid">
                  {safePhrases.map(phrase => (
                    <button 
                      key={phrase} 
                      onClick={() => handleSendReaction(phrase)}
                      className="reaction-phrase-btn"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="reaction-signin-alert">
                <Smile size={24} color="var(--accent-primary)" />
                <p>Ask a parent to log in so you can send reactions!</p>
              </div>
            )}
          </div>
        </aside>

      </main>
    </div>
  );
};
