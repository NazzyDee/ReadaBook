import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { doc, setDoc, updateDoc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books } from '../lib/booksData';
import { ChevronLeft, ChevronRight, Play, Square, Users, MessageSquare } from 'lucide-react';
import '../App.css';

interface ChatMessage {
  id: string;
  text: string;
  username: string;
  createdAt: any;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [streamTitle, setStreamTitle] = useState('My Live Reading Stream');
  const [streamGenre, setStreamGenre] = useState('Fantasy');
  const [selectedBookId, setSelectedBookId] = useState(books[0].id);
  const [isLive, setIsLive] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const selectedBook = books.find(b => b.id === selectedBookId) || books[0];

  // Subscribe to streamer's own stream document when live
  useEffect(() => {
    if (!user || !isLive) return;

    const streamDocRef = doc(db, 'streams', user.uid);
    const unsubscribe = onSnapshot(streamDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentPageIndex(data.currentPage || 0);
        setViewerCount(data.viewerCount || 0);
      }
    });

    return () => unsubscribe();
  }, [user, isLive]);

  // Subscribe to chat messages for this streamer's channel
  useEffect(() => {
    if (!user || !isLive) return;

    const q = query(
      collection(db, 'messages'),
      where('streamId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setChatMessages(msgs.reverse());
    });

    return () => unsubscribe();
  }, [user, isLive]);

  // Handle camera permission and display
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable: ", err);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleGoLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const initialPageIndex = 0;
    const randomViewers = Math.floor(Math.random() * 80) + 12;

    try {
      await setDoc(doc(db, 'streams', user.uid), {
        streamerId: user.uid,
        streamerName: user.email ? user.email.split('@')[0] : 'Streamer',
        title: streamTitle,
        genre: streamGenre,
        bookId: selectedBookId,
        currentPage: initialPageIndex,
        isLive: true,
        viewerCount: randomViewers,
        updatedAt: new Date()
      });

      setIsLive(true);
      setViewerCount(randomViewers);
      setCurrentPageIndex(initialPageIndex);
      await startCamera();
    } catch (err) {
      console.error("Error going live: ", err);
    }
  };

  const handleEndStream = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        isLive: false,
        updatedAt: new Date()
      });

      setIsLive(false);
      stopCamera();
    } catch (err) {
      console.error("Error ending stream: ", err);
    }
  };

  const handlePageChange = async (newIndex: number) => {
    if (!user || !isLive) return;
    if (newIndex < 0 || newIndex >= selectedBook.pages.length) return;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        currentPage: newIndex,
        updatedAt: new Date()
      });
      setCurrentPageIndex(newIndex);
    } catch (err) {
      console.error("Error changing page: ", err);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <h1 className="dashboard-title">Streamer Control Panel</h1>
        
        {!isLive ? (
          /* Stream Setup Form */
          <div className="dashboard-card glass-panel">
            <h2>Stream Setup</h2>
            <form onSubmit={handleGoLive} className="dashboard-form">
              <div className="form-group">
                <label>Stream Title</label>
                <input 
                  type="text" 
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="e.g., Chill Sunday Classics Reading"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Genre / Category</label>
                  <select 
                    value={streamGenre} 
                    onChange={(e) => setStreamGenre(e.target.value)}
                    style={{ background: 'var(--bg-dark)', color: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Classics">Classics</option>
                    <option value="Mystery">Mystery</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 2 }}>
                  <label>Select Book to Read</label>
                  <select 
                    value={selectedBookId} 
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    style={{ background: 'var(--bg-dark)', color: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}>
                <Play size={18} />
                <span>Go Live Now</span>
              </button>
            </form>
          </div>
        ) : (
          /* Live Stream Control Center */
          <div className="live-controls-grid">
            
            {/* Left Column: Webcam & Reading controls */}
            <div className="control-left-column">
              <div className="stream-preview-box glass-panel">
                <div className="preview-video-container">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="webcam-preview" 
                  />
                  <div className="live-overlay-indicator">
                    <span className="dot"></span>
                    <span>LIVE</span>
                  </div>
                  <div className="viewer-indicator">
                    <Users size={14} />
                    <span>{viewerCount} watching</span>
                  </div>
                </div>
                <div className="preview-details">
                  <h3>{streamTitle}</h3>
                  <p>Category: <strong>{streamGenre}</strong> | Book: <strong>{selectedBook.title}</strong></p>
                  <button onClick={handleEndStream} className="btn-danger" style={{ marginTop: '12px' }}>
                    <Square size={14} />
                    <span>End Stream</span>
                  </button>
                </div>
              </div>

              {/* Reader Controls */}
              <div className="streamer-reader-box glass-panel">
                <div className="reader-header">
                  <div className="book-meta-row">
                    <img src={selectedBook.coverUrl} alt="Cover" className="mini-cover" />
                    <div>
                      <h3>{selectedBook.title}</h3>
                      <p>Page {currentPageIndex + 1} of {selectedBook.pages.length}</p>
                    </div>
                  </div>
                  <div className="page-nav-controls">
                    <button 
                      onClick={() => handlePageChange(currentPageIndex - 1)} 
                      disabled={currentPageIndex === 0}
                      className="nav-page-btn"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => handlePageChange(currentPageIndex + 1)} 
                      disabled={currentPageIndex === selectedBook.pages.length - 1}
                      className="nav-page-btn"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="page-content-display">
                  <p>{selectedBook.pages[currentPageIndex]}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Chat Feed */}
            <div className="control-right-column">
              <div className="streamer-chat-box glass-panel">
                <div className="chat-box-header">
                  <MessageSquare size={18} />
                  <span>Live Stream Chat</span>
                </div>
                <div className="chat-box-messages">
                  {chatMessages.length === 0 ? (
                    <p className="no-messages">No messages yet. Say hi to your viewers!</p>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className="chat-msg-item">
                        <span className="msg-user">{msg.username}:</span>
                        <span className="msg-text">{msg.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
