import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import '../App.css'; 

interface ChatMessage {
  id: string;
  text: string;
  username: string;
  createdAt: any;
}

export const StreamPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen to real-time chat messages
    const q = query(
      collection(db, 'messages'), 
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
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const username = user.email ? user.email.split('@')[0] : 'Anonymous';
    const msgText = newMessage;
    setNewMessage(''); // optimistic clear

    try {
      await addDoc(collection(db, 'messages'), {
        text: msgText,
        username,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending message: ", err);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <Link to="/" className="header-logo">
          ReadaBook <span>Live</span>
        </Link>
        <div className="user-profile">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontWeight: 600 }}>{user.email?.split('@')[0]}</span>
              <button className="btn-primary" onClick={logout} style={{ background: 'var(--bg-hover)', color: 'var(--text-main)', boxShadow: 'none', border: '1px solid var(--border-color)' }}>
                Sign Out
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
          
          {/* The E-Book Text */}
          <div className="book-display">
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
               <img src="/assets/book_cover.jpg" alt="Book Cover" style={{ width: '150px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
               <div>
                  <h1>Chapter 1: The Beginning</h1>
                  <h3 style={{ color: '#555', marginTop: '8px' }}>By Evelyn Rae Vance</h3>
               </div>
            </div>
            
            <p>
              It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity...
            </p>
            <br />
            <p>
              (This is where the synchronized text of the novel will appear while the streamer reads it aloud. Users can follow along here.)
            </p>
          </div>

          {/* The Live Video Feed overlay */}
          <div className="video-overlay" style={{ padding: 0, border: '2px solid var(--accent-primary)', overflow: 'hidden' }}>
            <img src="/assets/streamer_feed.jpg" alt="Live Stream" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

        </section>

        {/* Right: Live Chat Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-header">
            Stream Chat
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
              <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }} disabled={!user}>Send</button>
            </form>
          </div>
        </aside>

      </main>
    </div>
  );
};
