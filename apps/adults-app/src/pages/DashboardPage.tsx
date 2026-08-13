import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { doc, setDoc, updateDoc, onSnapshot, collection, query, where, addDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books } from '../lib/booksData';
import { ChevronLeft, ChevronRight, Play, Square, Users, MessageSquare, BookOpen, Plus, Clipboard, Trash2, Pin, Volume2, Mic, MicOff, AlertTriangle, Radio, Shield, Activity, Star } from 'lucide-react';
import '../App.css';

interface ChatMessage {
  id: string;
  text: string;
  username: string;
  createdAt: any;
  type?: 'announcement' | 'normal';
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

interface ActivityEvent {
  id: string;
  timestamp: string;
  icon: string;
  text: string;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [streamTitle, setStreamTitle] = useState('Chill Sunday Classics Reading ☕');
  const [streamGenre, setStreamGenre] = useState('Fantasy');
  
  // Custom books state
  const [customBooks, setCustomBooks] = useState<FirestoreBook[]>([]);
  const [selectedBookId, setSelectedBookId] = useState(books[0].id);
  const [isLive, setIsLive] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Streamer Studio features
  const [liveUptime, setLiveUptime] = useState('00:00:00');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [emoteOnly, setEmoteOnly] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [showAnnouncementInput, setShowAnnouncementInput] = useState(false);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const [pinnedMessageText, setPinnedMessageText] = useState<string | null>(null);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [isTtsReading, setIsTtsReading] = useState(false);
  const [followerCount, setFollowerCount] = useState(148); // mock follower baseline

  // Add book form state
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookGenre, setNewBookGenre] = useState('Fantasy');
  const [newBookText, setNewBookText] = useState('');
  const [addBookError, setAddBookError] = useState('');
  const [addBookSuccess, setAddBookSuccess] = useState('');

  // Info modal state
  const [showEditInfo, setShowEditInfo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const ttsUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Merge static books and custom books
  const allBooks = [...books, ...customBooks];
  const selectedBook = allBooks.find(b => b.id === selectedBookId) || books[0];

  // Helper to add activity events
  const addEvent = (text: string, icon: string) => {
    const newEvent: ActivityEvent = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      icon,
      text
    };
    setActivityFeed(prev => [newEvent, ...prev].slice(0, 30));
  };

  // Uptime counter hook
  useEffect(() => {
    if (!isLive || !startTime) {
      setLiveUptime('00:00:00');
      return;
    }

    const interval = setInterval(() => {
      const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(secondsElapsed / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((secondsElapsed % 3600) / 60).toString().padStart(2, '0');
      const seconds = (secondsElapsed % 60).toString().padStart(2, '0');
      setLiveUptime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive, startTime]);

  // Fetch custom books uploaded by the user
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'books'), where('uploaderId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: FirestoreBook[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as FirestoreBook);
      });
      setCustomBooks(list);
    });

    return () => unsubscribe();
  }, [user]);

  // Subscribe to streamer's own stream document when live
  useEffect(() => {
    if (!user || !isLive) return;

    const streamDocRef = doc(db, 'streams', user.uid);
    const unsubscribe = onSnapshot(streamDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentPageIndex(data.currentPage || 0);
        setViewerCount(data.viewerCount || 0);
        setEmoteOnly(data.emoteOnly || false);
        setPinnedMessageText(data.pinnedMessage || null);
      }
    });

    return () => unsubscribe();
  }, [user, isLive]);

  // Subscribe to chat messages for this streamer's channel
  useEffect(() => {
    if (!user || !isLive) return;

    const q = query(
      collection(db, 'messages'),
      where('streamId', '==', user.uid)
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
      setChatMessages(msgs.slice(-50));
    });

    return () => unsubscribe();
  }, [user, isLive]);

  // Subscribe to followers count trigger
  useEffect(() => {
    if (!user || !isLive) return;
    // Since we nested follows as a subcollection in Firestore rules: `/users/{userId}/follows/{streamerId}`
    // Let's listen to the follows subcollection directly (requires collectionGroup) or trigger mock follow bumps when active
    const interval = setInterval(() => {
      // simulate followers changing slightly
      setFollowerCount(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 45000);

    return () => clearInterval(interval);
  }, [user, isLive]);

  // Handle camera permission and display
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      addEvent("Camera feed connected successfully.", "📷");
    } catch (err) {
      console.warn("Camera/Mic access denied: ", err);
      addEvent("Camera feed offline: permissions missing.", "⚠️");
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
    const now = Date.now();

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
        emoteOnly: false,
        pinnedMessage: null,
        updatedAt: new Date()
      });

      setStartTime(now);
      setIsLive(true);
      setViewerCount(randomViewers);
      setCurrentPageIndex(initialPageIndex);
      
      setActivityFeed([]); // reset activity feed
      addEvent(`Broadcast Started: ${streamTitle}`, "🔴");
      addEvent(`Active Book: ${selectedBook.title}`, "📖");

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
      setStartTime(null);
      stopCamera();
      
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsTtsReading(false);
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
      addEvent(`Flipped to Page ${newIndex + 1}`, "📖");
      
      // Stop speech synthesis if it was speaking and restart on the new page
      if (isTtsReading) {
        speakPageText(selectedBook.pages[newIndex]);
      }
    } catch (err) {
      console.error("Error changing page: ", err);
    }
  };

  // Text-To-Speech Reader Assistant
  const toggleTtsReading = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported on this browser!");
      return;
    }

    if (isTtsReading) {
      window.speechSynthesis.cancel();
      setIsTtsReading(false);
      addEvent("Text-to-speech reading paused.", "🔈");
    } else {
      setIsTtsReading(true);
      addEvent("Text-to-speech reading active.", "🔊");
      speakPageText(selectedBook.pages[currentPageIndex]);
    }
  };

  const speakPageText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // clear queue

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      // If we are still live and have more pages, flip page automatically!
      if (currentPageIndex < selectedBook.pages.length - 1) {
        handlePageChange(currentPageIndex + 1);
      } else {
        setIsTtsReading(false);
        addEvent("Reached the end of the story.", "🏁");
      }
    };

    utterance.onerror = (e) => {
      console.error("TTS utterance error: ", e);
      setIsTtsReading(false);
    };

    ttsUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Moderation: Clear Chat
  const handleClearChat = async () => {
    if (!user || !isLive) return;
    
    try {
      const q = query(collection(db, 'messages'), where('streamId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      addEvent("Chat messages cleared.", "⚠️");
      
      // Post system message
      await addDoc(collection(db, 'messages'), {
        text: "🚨 Chat was cleared by the streamer.",
        username: "System",
        streamId: user.uid,
        createdAt: new Date(),
        type: 'announcement'
      });
    } catch (err) {
      console.error("Error clearing chat: ", err);
    }
  };

  // Moderation: Toggle Emote Only Mode
  const handleToggleEmoteOnly = async () => {
    if (!user || !isLive) return;
    const nextState = !emoteOnly;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        emoteOnly: nextState
      });
      setEmoteOnly(nextState);
      addEvent(`Emote-only chat ${nextState ? 'enabled' : 'disabled'}.`, "💬");
      
      // Log notification message to viewers
      await addDoc(collection(db, 'messages'), {
        text: nextState ? "💬 Emote-Only mode has been enabled by the streamer." : "💬 Standard chat mode has been restored.",
        username: "System",
        streamId: user.uid,
        createdAt: new Date(),
        type: 'announcement'
      });
    } catch (err) {
      console.error("Error toggling emote mode: ", err);
    }
  };

  // Moderation: Toggle Streamer Microphone State
  const handleToggleMic = () => {
    if (!mediaStreamRef.current) return;
    
    const nextState = !micMuted;
    mediaStreamRef.current.getAudioTracks().forEach(track => {
      track.enabled = !nextState;
    });
    setMicMuted(nextState);
    addEvent(`Microphone ${nextState ? 'muted' : 'unmuted'}.`, nextState ? "🎙️❌" : "🎙️");
  };

  // Quick Action: Send Announcement Message
  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !announcementText.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: `📢 ANNOUNCEMENT: ${announcementText}`,
        username: user.email ? user.email.split('@')[0] : 'Broadcaster',
        streamId: user.uid,
        createdAt: new Date(),
        type: 'announcement'
      });
      addEvent(`Announcement posted: ${announcementText.substring(0, 20)}...`, "📢");
      setAnnouncementText('');
      setShowAnnouncementInput(false);
    } catch (err) {
      console.error("Error sending announcement: ", err);
    }
  };

  // Moderation: Delete Single Chat Message
  const handleDeleteMessage = async (msgId: string) => {
    try {
      await deleteDoc(doc(db, 'messages', msgId));
      addEvent("Removed an inappropriate message.", "🛡️");
    } catch (err) {
      console.error("Error deleting message: ", err);
    }
  };

  // Moderation: Pin Chat Message
  const handlePinMessage = async (msgText: string, msgId: string) => {
    if (!user) return;
    
    const nextPinText = pinnedMessageId === msgId ? null : msgText;
    const nextPinId = pinnedMessageId === msgId ? null : msgId;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        pinnedMessage: nextPinText
      });
      setPinnedMessageId(nextPinId);
      setPinnedMessageText(nextPinText);
      addEvent(nextPinText ? `Pinned message: "${msgText.substring(0,20)}..."` : "Unpinned message.", "📌");
    } catch (err) {
      console.error("Error pinning message: ", err);
    }
  };

  // Edit Stream Details Live
  const handleUpdateStreamDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        title: streamTitle,
        genre: streamGenre
      });
      addEvent(`Updated stream details: ${streamTitle}`, "⚙️");
      setShowEditInfo(false);
    } catch (err) {
      console.error("Error updating stream info: ", err);
    }
  };

  // Add new custom book to Firestore
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
      setAddBookError('Book text cannot be empty! Paste paragraphs separated by double newlines.');
      return;
    }

    try {
      const bookRef = await addDoc(collection(db, 'books'), {
        title: newBookTitle,
        author: newBookAuthor,
        genre: newBookGenre,
        pages,
        coverUrl: '/assets/book_cover.jpg',
        uploaderId: user.uid,
        createdAt: new Date()
      });

      setAddBookSuccess('Book uploaded successfully!');
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
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-main studio-main">
        
        {/* Studio Title Bar */}
        <div className="studio-header">
          <div>
            <h1 className="dashboard-title">Creator Studio</h1>
            <p className="studio-subtitle">Stream control room, dashboard analytics, and live page manager</p>
          </div>
          {!isLive && (
            <button 
              onClick={() => setShowAddBook(!showAddBook)} 
              className="btn-primary flex-center gap-sm"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
            >
              <Plus size={16} />
              <span>{showAddBook ? 'Back to Setup' : 'Upload Custom Book'}</span>
            </button>
          )}
        </div>

        {isLive && (
          /* Live Streamer Metrics Bar */
          <div className="studio-metrics-bar glass-panel">
            <div className="metric-item">
              <span className="metric-dot red-pulse"></span>
              <div className="metric-info">
                <span className="label">STATUS</span>
                <span className="value text-red font-bold">LIVE</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon"><Users size={16} color="var(--accent-secondary)" /></span>
              <div className="metric-info">
                <span className="label">VIEWERS</span>
                <span className="value">{viewerCount}</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon"><Star size={16} color="var(--accent-tertiary)" /></span>
              <div className="metric-info">
                <span className="label">FOLLOWERS</span>
                <span className="value">{followerCount}</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon"><Activity size={16} color="var(--accent-success)" /></span>
              <div className="metric-info">
                <span className="label">UPTIME</span>
                <span className="value font-mono">{liveUptime}</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon"><Shield size={16} color="var(--accent-success)" /></span>
              <div className="metric-info">
                <span className="label">HEALTH</span>
                <span className="value text-green">EXCELLENT</span>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard setup state panels */}
        {!isLive && showAddBook ? (
          /* Add Custom Book Form */
          <div className="dashboard-card glass-panel">
            <h2 className="flex-center gap-sm">
              <BookOpen size={20} color="var(--accent-secondary)" />
              <span>Upload Custom Book</span>
            </h2>
            <p className="card-instructions">
              Paste your book content below. Separate pages or chapters with <strong>double newlines</strong> (hit Enter twice).
            </p>

            {addBookError && <div className="login-error">{addBookError}</div>}
            {addBookSuccess && <div className="login-success">{addBookSuccess}</div>}

            <form onSubmit={handleAddBookSubmit} className="dashboard-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Book Title</label>
                  <input 
                    type="text" 
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    placeholder="e.g., My Original Novel"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Author</label>
                  <input 
                    type="text" 
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Genre</label>
                  <select 
                    value={newBookGenre}
                    onChange={(e) => setNewBookGenre(e.target.value)}
                  >
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Classics">Classics</option>
                    <option value="Mystery">Mystery</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Book Content (Paste paragraphs/pages separated by empty lines)</label>
                <textarea 
                  value={newBookText}
                  onChange={(e) => setNewBookText(e.target.value)}
                  placeholder={`Chapter 1\n\nThis is page 1 content...\n\nThis is page 2 content...`}
                  rows={10}
                  required
                />
              </div>

              <button type="submit" className="btn-primary flex-center gap-sm">
                <Clipboard size={18} />
                <span>Upload Novel</span>
              </button>
            </form>
          </div>
        ) : !isLive ? (
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

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Genre / Category</label>
                  <select 
                    value={streamGenre} 
                    onChange={(e) => setStreamGenre(e.target.value)}
                  >
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Classics">Classics</option>
                    <option value="Mystery">Mystery</option>
                  </select>
                </div>

                <div className="form-group flex-2">
                  <label>Select Book to Read</label>
                  <select 
                    value={selectedBookId} 
                    onChange={(e) => setSelectedBookId(e.target.value)}
                  >
                    <optgroup label="Default Public Domain Books">
                      {books.map((b) => (
                        <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                      ))}
                    </optgroup>
                    {customBooks.length > 0 && (
                      <optgroup label="My Uploaded Books">
                        {customBooks.map((b) => (
                          <option key={b.id} value={b.id}>{b.title} (Custom)</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary flex-center gap-sm">
                <Play size={18} />
                <span>Go Live Now</span>
              </button>
            </form>
          </div>
        ) : (
          /* Streamer Studio Grid (Twitch-like Creator Layout) */
          <div className="studio-grid">
            
            {/* Left Column: Stream Monitor & Quick Actions */}
            <div className="studio-left-column">
              
              {/* Stream Preview (Video Feed) */}
              <div className="studio-card glass-panel">
                <div className="studio-card-header">
                  <Radio size={16} color="var(--accent-primary)" />
                  <span>Broadcast Monitor</span>
                </div>
                <div className="preview-video-container border-glow">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="webcam-preview" 
                  />
                  {micMuted && (
                    <div className="mic-muted-badge flex-center">
                      <MicOff size={20} color="#fff" />
                    </div>
                  )}
                  <div className="live-overlay-indicator">
                    <span className="dot"></span>
                    <span>LIVE</span>
                  </div>
                </div>
                <div className="preview-info-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3>{streamTitle}</h3>
                      <p className="card-sub">Category: <strong>{streamGenre}</strong> | Book: <strong>{selectedBook.title}</strong></p>
                    </div>
                    <button onClick={() => setShowEditInfo(true)} className="btn-edit-info" title="Edit Stream Info">⚙️ Edit</button>
                  </div>
                  <button onClick={handleEndStream} className="btn-danger w-full flex-center gap-sm" style={{ marginTop: '12px' }}>
                    <Square size={14} />
                    <span>End Stream / Disconnect</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="studio-card glass-panel">
                <div className="studio-card-header">
                  <Shield size={16} color="var(--accent-secondary)" />
                  <span>Stream Quick Actions</span>
                </div>
                <div className="quick-actions-grid">
                  <button 
                    onClick={handleToggleMic} 
                    className={`action-tile ${micMuted ? 'active-red' : ''}`}
                  >
                    {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    <span>{micMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                  </button>
                  
                  <button 
                    onClick={handleToggleEmoteOnly} 
                    className={`action-tile ${emoteOnly ? 'active-purple' : ''}`}
                  >
                    <MessageSquare size={18} />
                    <span>{emoteOnly ? 'Text Allowed' : 'Emote-Only'}</span>
                  </button>

                  <button 
                    onClick={() => setShowAnnouncementInput(!showAnnouncementInput)} 
                    className="action-tile"
                  >
                    <span>📢</span>
                    <span>Announce</span>
                  </button>

                  <button 
                    onClick={handleClearChat} 
                    className="action-tile danger-tile"
                  >
                    <AlertTriangle size={18} />
                    <span>Clear Chat</span>
                  </button>
                </div>

                {/* Announcement overlay input */}
                {showAnnouncementInput && (
                  <form onSubmit={handleSendAnnouncement} className="announcement-inline-form">
                    <input 
                      type="text" 
                      placeholder="Type announcement message..." 
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      required
                      autoFocus
                    />
                    <button type="submit" className="btn-primary">Send</button>
                  </form>
                )}
              </div>
            </div>

            {/* Center Column: Interactive Reader & Activity Feed */}
            <div className="studio-center-column">
              
              {/* Synced Reader Page Control */}
              <div className="studio-card glass-panel streamer-reader-card">
                <div className="studio-card-header text-between">
                  <span className="flex-center gap-sm">
                    <BookOpen size={16} color="var(--accent-secondary)" />
                    <span>Active Reader</span>
                  </span>
                  <button 
                    onClick={toggleTtsReading} 
                    className={`btn-tts-speaker ${isTtsReading ? 'active' : ''}`}
                    title={isTtsReading ? "Pause Text-to-Speech" : "Activate Text-to-Speech Assistant"}
                  >
                    <Volume2 size={16} />
                    <span>{isTtsReading ? 'Mute AI' : 'Speech AI'}</span>
                  </button>
                </div>
                
                <div className="reader-meta-row">
                  <img src={selectedBook.coverUrl} alt="Cover" className="studio-mini-cover" />
                  <div>
                    <h3>{selectedBook.title}</h3>
                    <p>Page {currentPageIndex + 1} of {selectedBook.pages.length}</p>
                  </div>
                  <div className="studio-page-nav">
                    <button 
                      onClick={() => handlePageChange(currentPageIndex - 1)} 
                      disabled={currentPageIndex === 0}
                      className="studio-nav-btn"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={() => handlePageChange(currentPageIndex + 1)} 
                      disabled={currentPageIndex === selectedBook.pages.length - 1}
                      className="studio-nav-btn"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="studio-page-content scrollbar-paper">
                  <p>{selectedBook.pages[currentPageIndex] || "Opening story text..."}</p>
                </div>
              </div>

              {/* Activity Feed Widget */}
              <div className="studio-card glass-panel studio-activity-card">
                <div className="studio-card-header">
                  <Activity size={16} color="var(--accent-success)" />
                  <span>Studio Activity Feed</span>
                </div>
                <div className="activity-feed-list">
                  {activityFeed.length === 0 ? (
                    <p className="no-activity">Waiting for events...</p>
                  ) : (
                    activityFeed.map((event) => (
                      <div key={event.id} className="activity-event-item">
                        <span className="event-time font-mono">{event.timestamp}</span>
                        <span className="event-icon">{event.icon}</span>
                        <span className="event-text">{event.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Chat Manager */}
            <div className="studio-right-column">
              <div className="studio-card glass-panel studio-chat-card">
                <div className="studio-card-header text-between">
                  <span className="flex-center gap-sm">
                    <MessageSquare size={16} color="var(--accent-secondary)" />
                    <span>Live Chat Moderation</span>
                  </span>
                  {pinnedMessageText && (
                    <span className="pinned-indicator" title="A message is currently pinned to the stream">
                      <Pin size={12} fill="currentColor" /> Pinned
                    </span>
                  )}
                </div>

                {/* Pinned message preview at top of studio chat */}
                {pinnedMessageText && (
                  <div className="studio-pinned-preview flex-between">
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Pin size={14} fill="currentColor" color="var(--accent-secondary)" />
                      <span className="pinned-preview-text">"{pinnedMessageText.substring(0, 30)}..."</span>
                    </div>
                    <button onClick={() => handlePinMessage('', '')} className="btn-unpin" title="Clear Pin">✕</button>
                  </div>
                )}

                <div className="studio-chat-messages">
                  {chatMessages.length === 0 ? (
                    <p className="no-chat font-bold">Chat feed is silent.</p>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className={`studio-chat-msg ${msg.type === 'announcement' ? 'announcement-msg' : ''}`}>
                        <div className="msg-row-top">
                          <span className="msg-user">{msg.username}</span>
                          <div className="moderator-actions">
                            <button 
                              onClick={() => handlePinMessage(msg.text, msg.id)}
                              className={`btn-mod-action ${pinnedMessageId === msg.id ? 'pinned' : ''}`}
                              title="Pin Message to Stream"
                            >
                              <Pin size={12} fill={pinnedMessageId === msg.id ? "currentColor" : "none"} />
                            </button>
                            <button 
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="btn-mod-action delete-action"
                              title="Delete Message"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <span className="msg-body">{msg.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Edit Info Dialog Modal */}
      {showEditInfo && (
        <div className="studio-modal-overlay flex-center">
          <div className="studio-modal-card glass-panel">
            <h2>Edit Broadcast Information</h2>
            <form onSubmit={handleUpdateStreamDetails} className="dashboard-form">
              <div className="form-group">
                <label>Stream Title</label>
                <input 
                  type="text" 
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
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
              <div className="modal-buttons flex-center gap-md" style={{ marginTop: '16px' }}>
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" onClick={() => setShowEditInfo(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
