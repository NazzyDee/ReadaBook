import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { doc, setDoc, updateDoc, onSnapshot, collection, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books } from '../lib/booksData';
import { ChevronLeft, ChevronRight, Play, Square, Users, BookOpen, Plus, Clipboard, Smile } from 'lucide-react';
import '../App.css';

interface ChatReaction {
  id: string;
  text: string;
  username: string;
  createdAt: any;
}

interface FirestoreBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  pages: string[];
  uploaderId: string;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [streamTitle, setStreamTitle] = useState('Bedtime Story Reading');
  const [streamGenre, setStreamGenre] = useState('Adventure');
  
  const [customBooks, setCustomBooks] = useState<FirestoreBook[]>([]);
  const [selectedBookId, setSelectedBookId] = useState(books[0].id);
  const [isLive, setIsLive] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatReactions, setChatReactions] = useState<ChatReaction[]>([]);

  const [showAddBook, setShowAddBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookGenre, setNewBookGenre] = useState('Adventure');
  const [newBookText, setNewBookText] = useState('');
  const [addBookError, setAddBookError] = useState('');
  const [addBookSuccess, setAddBookSuccess] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const allBooks = [...books, ...customBooks];
  const selectedBook = allBooks.find(b => b.id === selectedBookId) || books[0];

  // Fetch custom books
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'books_kids'), where('uploaderId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: FirestoreBook[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as FirestoreBook);
      });
      setCustomBooks(list);
    });

    return () => unsubscribe();
  }, [user]);

  // Subscribe to own stream document when live
  useEffect(() => {
    if (!user || !isLive) return;

    const streamDocRef = doc(db, 'streams_kids', user.uid);
    const unsubscribe = onSnapshot(streamDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentPageIndex(data.currentPage || 0);
        setViewerCount(data.viewerCount || 0);
      }
    });

    return () => unsubscribe();
  }, [user, isLive]);

  // Subscribe to kids reactions
  useEffect(() => {
    if (!user || !isLive) return;

    const q = query(
      collection(db, 'messages_kids'),
      where('streamId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatReaction[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatReaction);
      });
      setChatReactions(msgs.reverse());
    });

    return () => unsubscribe();
  }, [user, isLive]);

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
    const randomViewers = Math.floor(Math.random() * 25) + 3; // family viewing size

    try {
      await setDoc(doc(db, 'streams_kids', user.uid), {
        streamerId: user.uid,
        streamerName: user.email ? user.email.split('@')[0] : 'Storyteller',
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
      await updateDoc(doc(db, 'streams_kids', user.uid), {
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
      await updateDoc(doc(db, 'streams_kids', user.uid), {
        currentPage: newIndex,
        updatedAt: new Date()
      });
      setCurrentPageIndex(newIndex);
    } catch (err) {
      console.error("Error changing page: ", err);
    }
  };

  const handleAddBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddBookError('');
    setAddBookSuccess('');

    const pages = newBookText
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (pages.length === 0) {
      setAddBookError('Book text cannot be empty! Separate pages with empty lines.');
      return;
    }

    try {
      const bookRef = await addDoc(collection(db, 'books_kids'), {
        title: newBookTitle,
        author: newBookAuthor,
        genre: newBookGenre,
        pages,
        coverUrl: '/assets/book_cover.jpg',
        uploaderId: user.uid,
        createdAt: new Date()
      });

      setAddBookSuccess('Novel uploaded successfully! You can select it now.');
      setSelectedBookId(bookRef.id);
      setNewBookTitle('');
      setNewBookAuthor('');
      setNewBookText('');
      setTimeout(() => {
        setShowAddBook(false);
        setAddBookSuccess('');
      }, 2000);
    } catch (err: any) {
      setAddBookError(err.message || 'Failed to upload book.');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="dashboard-title">Storyteller Control Panel</h1>
          {!isLive && (
            <button 
              onClick={() => setShowAddBook(!showAddBook)} 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
            >
              <Plus size={16} />
              <span>{showAddBook ? 'Back to Setup' : 'Upload Story Book'}</span>
            </button>
          )}
        </div>
        
        {!isLive && showAddBook ? (
          /* Add Custom Book Form */
          <div className="dashboard-card glass-panel">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={20} color="var(--accent-secondary)" />
              <span>Upload Friendly Story</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Paste your child-friendly story below. Separate pages with **double newlines** (hit Enter twice).
            </p>

            {addBookError && <div className="login-error" style={{ marginBottom: '16px' }}>{addBookError}</div>}
            {addBookSuccess && <div className="login-success" style={{ marginBottom: '16px', color: 'var(--accent-secondary)' }}>{addBookSuccess}</div>}

            <form onSubmit={handleAddBookSubmit} className="dashboard-form">
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Story Title</label>
                  <input 
                    type="text" 
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    placeholder="e.g., The Brave Little Bear"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Author</label>
                  <input 
                    type="text" 
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    placeholder="e.g., Uncle John"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Genre / Category</label>
                  <select 
                    value={newBookGenre}
                    onChange={(e) => setNewBookGenre(e.target.value)}
                    style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="Adventure">Adventure</option>
                    <option value="Nature / Friendship">Nature / Friendship</option>
                    <option value="Classics">Classics</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Story Content (Paste paragraphs/pages separated by empty lines)</label>
                <textarea 
                  value={newBookText}
                  onChange={(e) => setNewBookText(e.target.value)}
                  placeholder={`Page 1\n\nOnce upon a time...`}
                  rows={10}
                  required
                  style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'serif', fontSize: '1.1rem', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}>
                <Clipboard size={18} />
                <span>Upload Story</span>
              </button>
            </form>
          </div>
        ) : !isLive ? (
          /* Stream Setup Form */
          <div className="dashboard-card glass-panel">
            <h2>Stream Setup</h2>
            <form onSubmit={handleGoLive} className="dashboard-form">
              <div className="form-group">
                <label>Story Room Title</label>
                <input 
                  type="text" 
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="e.g., Bedtime Stories with Auntie"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Genre / Category</label>
                  <select 
                    value={streamGenre} 
                    onChange={(e) => setStreamGenre(e.target.value)}
                    style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="Adventure">Adventure</option>
                    <option value="Nature / Friendship">Nature / Friendship</option>
                    <option value="Classics">Classics</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 2 }}>
                  <label>Select Book to Read</label>
                  <select 
                    value={selectedBookId} 
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  >
                    <optgroup label="Default Story Books">
                      {books.map((b) => (
                        <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                      ))}
                    </optgroup>
                    {customBooks.length > 0 && (
                      <optgroup label="My Uploaded Stories">
                        {customBooks.map((b) => (
                          <option key={b.id} value={b.id}>{b.title} (Custom)</option>
                        ))}
                      </optgroup>
                    )}
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
                <div className="preview-video-container" style={{ border: '2px solid var(--accent-secondary)' }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="webcam-preview" 
                  />
                  <div className="live-overlay-indicator" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                    <span className="dot"></span>
                    <span>LIVE STORY</span>
                  </div>
                  <div className="viewer-indicator">
                    <Users size={14} />
                    <span>{viewerCount} listening</span>
                  </div>
                </div>
                <div className="preview-details">
                  <h3>{streamTitle}</h3>
                  <p>Category: <strong>{streamGenre}</strong> | Book: <strong>{selectedBook.title}</strong></p>
                  <button onClick={handleEndStream} className="btn-danger" style={{ marginTop: '12px' }}>
                    <Square size={14} />
                    <span>End Story Room</span>
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
                  <Smile size={18} />
                  <span>Kids Reactions feed</span>
                </div>
                <div className="chat-box-messages">
                  {chatReactions.length === 0 ? (
                    <p className="no-messages">No reactions yet. Say hello to the kids!</p>
                  ) : (
                    chatReactions.map((msg) => (
                      <div key={msg.id} className="chat-msg-item">
                        <span className="msg-user">🌟 {msg.username}:</span>
                        <span className="msg-text" style={{ fontSize: '1.1rem', backgroundColor: 'var(--bg-hover)', padding: '2px 8px', borderRadius: '12px' }}>{msg.text}</span>
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
