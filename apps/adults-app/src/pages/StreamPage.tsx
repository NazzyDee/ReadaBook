import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit, doc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books } from '../lib/booksData';
import { Users, Send, AlertCircle, Radio, LogOut } from 'lucide-react';
import '../App.css';

interface ChatMessage {
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
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock streams database for static viewing
  const mockStreams: Record<string, StreamData> = {
    "mock-stream-1": {
      streamerId: "mock-stream-1",
      streamerName: "LibraryLofi",
      title: "Cozy Lofi Reading Session ☕ | Frankenstein",
      bookId: "frankenstein",
      genre: "Sci-Fi / Classics",
      currentPage: 0,
      isLive: true,
      viewerCount: 1420
    },
    "mock-stream-2": {
      streamerId: "mock-stream-2",
      streamerName: "AliceInWonderReader",
      title: "Falling down the Rabbit Hole! ✨ Live Q&A",
      bookId: "alice-in-wonderland",
      genre: "Fantasy",
      currentPage: 2,
      isLive: true,
      viewerCount: 843
    },
    "mock-stream-3": {
      streamerId: "mock-stream-3",
      streamerName: "SherlockQuotes",
      title: "Solving cases live. Reading H.G. Wells tonight!",
      bookId: "the-time-machine",
      genre: "Sci-Fi",
      currentPage: 1,
      isLive: true,
      viewerCount: 312
    }
  };

  // 1. Fetch and subscribe to Stream Document
  useEffect(() => {
    if (!streamerId) return;

    // Check if it is a mock stream
    if (streamerId.startsWith('mock-')) {
      setStream(mockStreams[streamerId]);
      setLoading(false);

      // Simulate streamer slowly flipping pages in mock stream
      const interval = setInterval(() => {
        setStream(prev => {
          if (!prev) return null;
          const book = books.find(b => b.id === prev.bookId);
          if (!book) return prev;
          const nextPage = (prev.currentPage + 1) % book.pages.length;
          return { ...prev, currentPage: nextPage };
        });
      }, 30000); // turn page every 30 seconds

      return () => clearInterval(interval);
    }

    // Real Firestore stream subscription
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

  // 2. Fetch and subscribe to Chat Messages
  useEffect(() => {
    if (!streamerId) return;

    if (streamerId.startsWith('mock-')) {
      // Setup mock initial messages
      const initialMockMsgs = [
        { id: 'm1', text: 'I love this chapter so much!', username: 'ReaderPro', createdAt: new Date() },
        { id: 'm2', text: 'Lofi beats are perfect for this book.', username: 'ChillVibes', createdAt: new Date() },
        { id: 'm3', text: 'Where can I buy this edition?', username: 'NovelWorm', createdAt: new Date() }
      ];
      setMessages(initialMockMsgs);

      // Periodically append mock viewer chat messages to simulate active Twitch stream
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
      }, 7000); // new message every 7 seconds

      return () => clearInterval(interval);
    }

    // Real Firestore chat subscription (scoped by streamId)
    const q = query(
      collection(db, 'messages'),
      where('streamId', '==', streamerId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(msgs.reverse());
    });

    return () => unsubscribe();
  }, [streamerId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !streamerId) return;

    // Scoped message to this streamer's ID
    const username = user.email ? user.email.split('@')[0] : 'Anonymous';
    const msgText = newMessage;
    setNewMessage(''); // optimistic clear

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

  if (loading) {
    return (
      <div className="stream-loading-screen">
        <div className="spinner"></div>
        <p>Connecting to stream feed...</p>
      </div>
    );
  }

  // Handle stream offline state
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

  const activeBook = books.find(b => b.id === stream.bookId) || books[0];

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
        <section className="reader-section">
          
          {/* The E-Book Text (Dynamically synced) */}
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
                {activeBook.pages[stream.currentPage] || "Loading page text..."}
              </p>
            </div>
          </div>

          {/* The Live Video Feed overlay */}
          <div className="video-overlay">
            <div className="live-camera-feed-sim">
              <img src="/assets/streamer_feed.jpg" alt="Live Stream Feed" />
              <div className="feed-watermark">
                <span>{stream.streamerName}</span>
                <span className="rec-dot"></span>
              </div>
            </div>
          </div>

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
          
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className="chat-message">
                <span className="username">{msg.username}:</span>
                <span className="message-text">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
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
          </div>
        </aside>

      </main>
    </div>
  );
};
