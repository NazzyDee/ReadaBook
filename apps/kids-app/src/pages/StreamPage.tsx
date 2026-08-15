import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { collection, addDoc, query, onSnapshot, serverTimestamp, doc, where } from 'firebase/firestore';
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
  bookTitle?: string;
  bookAuthor?: string;
  bookCoverUrl?: string;
  genre: string;
  currentPage: number;
  currentParagraph?: number;
  isLive: boolean;
  viewerCount: number;
  slowMode?: boolean;
  subscribersOnly?: boolean;
  pomodoroActive?: boolean;
  pomodoroType?: 'work' | 'break';
  pomodoroStartMs?: number;
  pomodoroDuration?: number;
  creatorWritingText?: string;
}

export const StreamPage: React.FC = () => {
  const { streamerId } = useParams<{ streamerId: string }>();
  const { user, logout } = useAuth();
  const [stream, setStream] = useState<StreamData | null>(null);
  const [activeBook, setActiveBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState<ChatReaction[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [textAnimationMode, setTextAnimationMode] = useState<'static' | 'word' | 'kinetic'>('kinetic');
  const [typographyMode, setTypographyMode] = useState<'outfit' | 'rounded' | 'dyslexic'>('outfit');
  const [calmMode, setCalmMode] = useState(false);
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState(1500);
  const [soundscape, setSoundscape] = useState<'none' | 'rain' | 'fireplace' | 'lofi'>('none');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<AudioNode | null>(null);
  const beatOscRef = useRef<OscillatorNode[]>([]);
  const beatGainRef = useRef<GainNode | null>(null);

  let stopSoundscape = () => {
    if (soundNodeRef.current) {
      try { (soundNodeRef.current as any).stop(); } catch(e) {}
      try { (soundNodeRef.current as any).disconnect(); } catch(e) {}
      soundNodeRef.current = null;
    }
    beatOscRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
      try { osc.disconnect(); } catch(e) {}
    });
    beatOscRef.current = [];
    if (beatGainRef.current) {
      try { beatGainRef.current.disconnect(); } catch(e) {}
      beatGainRef.current = null;
    }
  };

  const startSynthesizedSoundscape = (type: 'none' | 'rain' | 'fireplace' | 'lofi') => {
    stopSoundscape();
    setSoundscape(type);
    if (type === 'none') return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.08, ctx.currentTime);
      mainGain.connect(ctx.destination);
      soundNodeRef.current = mainGain;

      // Helper to generate a noise buffer
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      if (type === 'rain') {
        // Rain: filtered noise
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(mainGain);
        whiteNoise.start();
        soundNodeRef.current = whiteNoise;
      } else if (type === 'fireplace') {
        // Fireplace: Crackling noise
        const fireSource = ctx.createBufferSource();
        fireSource.buffer = noiseBuffer;
        fireSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        // Crackle generator (periodic random impulse pops)
        const scriptNode = ctx.createScriptProcessor(4096, 0, 1);
        scriptNode.onaudioprocess = (e) => {
          const out = e.outputBuffer.getChannelData(0);
          for (let i = 0; i < out.length; i++) {
            out[i] = Math.random() > 0.9992 ? (Math.random() * 2 - 1) * 0.35 : 0;
          }
        };

        fireSource.connect(filter);
        filter.connect(mainGain);
        scriptNode.connect(mainGain);
        
        fireSource.start();
        soundNodeRef.current = fireSource;
      } else if (type === 'lofi') {
        // Cozy Lo-Fi chord loop synthesizer using oscillators
        const playChord = () => {
          if (!audioCtxRef.current) return;
          const chords = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [293.66, 349.23, 440.00, 523.25], // Dmin7
            [329.63, 392.00, 493.88, 587.33], // Emin7
            [349.23, 440.00, 523.25, 659.25]  // Fmaj7
          ];
          const chord = chords[Math.floor(Math.random() * chords.length)];
          const oscs = chord.map(freq => {
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(0, ctx.currentTime);
            oscGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 1.5);
            oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.5);
            
            osc.connect(oscGain);
            oscGain.connect(mainGain);
            osc.start();
            osc.stop(ctx.currentTime + 6);
            return osc;
          });
          beatOscRef.current = oscs;
        };

        playChord();
        const interval = setInterval(playChord, 6000);
        
        // Create dummy source node to clear on stop
        const dummyNode = ctx.createBufferSource();
        soundNodeRef.current = dummyNode;
        
        // Override stopSoundscape call to clear interval
        const originalStop = stopSoundscape;
        stopSoundscape = () => {
          originalStop();
          clearInterval(interval);
        };
      }
    } catch(err) {
      console.error("Web Audio API not supported or blocked: ", err);
    }
  };
  
  const [lastReactionSentTime, setLastReactionSentTime] = useState<number>(0);
  const [connectedAdults, setConnectedAdults] = useState<string[]>([]);
  const [parentUid, setParentUid] = useState<string | null>(null);

  // Listen to user details to verify subscriber connection
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConnectedAdults(data.connectedAdults || []);
        setParentUid(data.parentUid || null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // 1.5 Calculate and tick down Pomodoro timer locally synced to parent start time
  useEffect(() => {
    if (!stream || !stream.pomodoroActive || !stream.pomodoroStartMs) {
      setPomodoroSecondsLeft(1500);
      return;
    }

    const duration = stream.pomodoroDuration || 1500;
    const calculateTimeLeft = () => {
      const elapsedMs = Date.now() - stream.pomodoroStartMs!;
      const elapsedSec = Math.floor(elapsedMs / 1000);
      const remaining = Math.max(0, duration - elapsedSec);
      setPomodoroSecondsLeft(remaining);
      
      // Play a gentle achievement sound chime if it reaches 0
      if (remaining === 0) {
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
          osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
          osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.45); // C6
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.0);
        } catch(e) {}
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [stream?.pomodoroActive, stream?.pomodoroStartMs, stream?.pomodoroDuration]);

  // Pre-approved safe kids reactions
  const safeEmojis = ['👍', '❤️', '😂', '🎉', '😮', '📖', '🧸', '🎈', '🌟'];
  const safePhrases = ['Amazing!', 'I love this!', 'Super fun!', 'Hello! 👋', 'Thank you! 💖', 'Fun characters!'];

  // 1. Fetch and subscribe to Stream Document
  useEffect(() => {
    if (!streamerId) return;

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

    if (stream.bookId === 'physical-read') {
      setActiveBook({
        id: 'physical-read',
        title: stream.bookTitle || 'Physical Book',
        author: stream.bookAuthor || 'Unknown',
        coverUrl: stream.bookCoverUrl || '',
        genre: stream.genre || '',
        pages: ['Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥']
      });
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
      where('streamId', '==', streamerId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatReaction[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatReaction);
      });
      // Sort client-side by createdAt ascending, then limit to 50
      msgs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds || 0);
        return timeA - timeB;
      });
      setReactions(msgs.slice(-50));
    });

    return () => unsubscribe();
  }, [streamerId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reactions]);

  const handleSendReaction = async (reactionText: string) => {
    if (!user || !streamerId) return;

    // Subscribers-only validation
    if (stream?.subscribersOnly) {
      const isConnected = streamerId === parentUid || connectedAdults.includes(streamerId);
      if (!isConnected) {
        alert("🔒 Chat is in Subscribers-Only mode. Ask a parent to connect to this storyteller first!");
        return;
      }
    }

    // Slow mode validation
    if (stream?.slowMode) {
      const timeSinceLast = Date.now() - lastReactionSentTime;
      if (timeSinceLast < 5000) {
        alert(`⏱️ Slow Mode is active. Please wait ${Math.ceil((5000 - timeSinceLast) / 1000)}s before reacting again!`);
        return;
      }
      setLastReactionSentTime(Date.now());
    }

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
    <div className={`app-container ${calmMode ? 'calm-mode-active' : ''}`}>
      {/* Header */}
      <header className="header" style={calmMode ? { borderBottom: '2px solid #efebe9' } : {}}>
        <Link to="/" className="header-logo">
          🧸 ReadaBook <span>Kids</span>
        </Link>
        <div className="stream-header-info">
          <div className="stream-pill" style={{ background: 'var(--accent-primary)' }}>
            <Radio size={14} className="pulse" />
            <span>STORY LIVE</span>
          </div>
          <span className="header-stream-title" style={calmMode ? { color: '#3e2723' } : {}}>{stream.title}</span>
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
        <section className="reader-section" style={calmMode ? { backgroundColor: '#fdfaf3' } : {}}>
          
          {activeBook ? (
            <div className="book-display" style={calmMode ? { padding: '32px' } : {}}>
              <div className="book-display-header">
                 <img src={activeBook.coverUrl} alt="Book Cover" className="book-cover-img" />
                 <div className="book-display-details">
                    <h1>{activeBook.title}</h1>
                    <h3>By {activeBook.author}</h3>
                    {stream.bookId === 'physical-read' ? (
                      <span className="chapter-indicator" style={{ background: '#ff477e', color: '#fff' }}>Physical Copy Read 🎥</span>
                    ) : (
                      <span className="chapter-indicator">Page {stream.currentPage + 1} of {activeBook.pages.length}</span>
                    )}
                 </div>
              </div>

              {/* Reading Environment Settings Panel */}
              <div className="reading-settings-bar">
                <div className="setting-item">
                  <span style={{ fontWeight: 'bold', marginRight: '4px' }}>🎬 Text Style:</span>
                  <select 
                    value={textAnimationMode} 
                    onChange={(e) => setTextAnimationMode(e.target.value as 'static' | 'word' | 'kinetic')}
                  >
                    <option value="static">Plain Text (Static)</option>
                    <option value="word">Standard Highlight</option>
                    <option value="kinetic">Fluid Prosody 🌟</option>
                  </select>
                </div>

                <div className="setting-item">
                  <span style={{ fontWeight: 'bold', marginRight: '4px' }}>🔤 Font Style:</span>
                  <select 
                    value={typographyMode} 
                    onChange={(e) => setTypographyMode(e.target.value as 'outfit' | 'rounded' | 'dyslexic')}
                  >
                    <option value="outfit">Default (Outfit)</option>
                    <option value="rounded">Rounded (Comic Neue)</option>
                    <option value="dyslexic">Dyslexic Friendly (Bottom-Weighted)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <span style={{ fontWeight: 'bold', marginRight: '4px' }}>🎵 Soundscape:</span>
                  <select 
                    value={soundscape} 
                    onChange={(e) => startSynthesizedSoundscape(e.target.value as any)}
                    style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px' }}
                  >
                    <option value="none">No Background Sound</option>
                    <option value="rain">Cozy Gentle Rain 🌧️</option>
                    <option value="fireplace">Crackling Fireplace 🔥</option>
                    <option value="lofi">Lofi Storytime Chords 🎵</option>
                  </select>
                </div>

                <div className="setting-item" style={{ marginLeft: 'auto' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold', color: calmMode ? '#8d6e63' : '#ff477e' }}>
                    <input 
                      type="checkbox" 
                      checked={calmMode} 
                      onChange={(e) => setCalmMode(e.target.checked)} 
                      style={{ width: '16px', height: '16px', accentColor: '#ff477e', cursor: 'pointer' }}
                    />
                    <span>Calm Mode 🧸</span>
                  </label>
                </div>
              </div>
              
              <div className={`book-text-content font-${typographyMode}`} style={{ minHeight: '240px', fontSize: '1.5rem', color: calmMode ? '#3e2723' : '#2b2d42' }}>
                {stream.bookId === 'physical-read' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '220px', textAlign: 'center', background: 'rgba(255, 183, 3, 0.04)', border: '2px dashed rgba(255, 183, 3, 0.25)', borderRadius: '16px', padding: '24px' }}>
                    <span style={{ fontSize: '3rem', marginBottom: '12px' }}>📖</span>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--accent-secondary)' }}>Physical Book Read-Aloud</h3>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '500px' }}>
                      The storyteller is reading their physical print copy of <strong>{activeBook.title}</strong> on camera! 🎥 Gather your own copy or sit back, relax, and listen to the story.
                    </p>
                  </div>
                ) : activeBook.pages[stream.currentPage] ? (
                  activeBook.pages[stream.currentPage].split('\n\n').map((para: string, idx: number) => {
                    const isActive = stream.currentParagraph !== undefined ? idx === stream.currentParagraph : false;
                    
                    if (isActive && textAnimationMode !== 'static') {
                      const words = para.trim().split(/\s+/).filter(w => w.length > 0);
                      return (
                        <p 
                          key={idx} 
                          className={`word-animate-active ${textAnimationMode === 'kinetic' ? 'word-highlighted-kinetic' : 'word-highlighted-basic'}`}
                          style={{ 
                            marginBottom: '16px', 
                            textIndent: '16px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            rowGap: '12px',
                            lineHeight: '1.8'
                          }}
                        >
                          {words.map((word, wIdx) => {
                            let wordClass = "word-animate-active";
                            if (textAnimationMode === 'kinetic') {
                              const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                              const hasExclamation = word.includes('!');
                              const hasQuestion = word.includes('?');
                              const isAllCaps = cleanWord.length > 1 && cleanWord === cleanWord.toUpperCase() && !/^\d+$/.test(cleanWord);
                              
                              if (hasExclamation) {
                                wordClass += " word-emphasis-exclamation";
                              } else if (hasQuestion) {
                                wordClass += " word-emphasis-question";
                              } else if (isAllCaps) {
                                wordClass += " word-emphasis-loud";
                              }
                            }
                            return (
                              <span key={wIdx} className={wordClass}>
                                {word}
                              </span>
                            );
                          })}
                        </p>
                      );
                    }

                    return (
                      <p 
                        key={idx} 
                        style={{ 
                          marginBottom: '16px', 
                          lineHeight: '1.6', 
                          fontSize: '1.25rem', 
                          textIndent: '16px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: isActive ? 'rgba(255, 183, 3, 0.15)' : 'transparent',
                          borderLeft: isActive ? '3px solid var(--accent-tertiary)' : '3px solid transparent',
                          transition: 'all 0.15s'
                        }}
                      >
                        {para}
                      </p>
                    );
                  })
                ) : (
                  <p>Loading story page...</p>
                )}
              </div>
              
              {/* Co-Writing Live Board */}
              {stream.creatorWritingText && (
                <div style={{
                  marginTop: '20px',
                  background: calmMode ? '#efebe9' : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>✍️</span>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: calmMode ? '#3e2723' : '#fff' }}>
                      {stream.streamerName}'s Live Co-Writing Board
                    </span>
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: calmMode ? '#3e2723' : '#fff',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    background: calmMode ? '#fdfaf3' : 'rgba(0,0,0,0.15)',
                    padding: '12px',
                    borderRadius: '8px',
                    maxHeight: '120px',
                    overflowY: 'auto'
                  }}>
                    {stream.creatorWritingText}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="book-display" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div className="spinner"></div>
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Opening the magic book...</p>
            </div>
          )}

          {/* Video Feed */}
          {calmMode ? (
            <div className="calm-mode-video-placeholder" style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 10, padding: '16px', background: '#fff', borderRadius: '24px', border: '3px solid #efebe9', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', width: '220px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', margin: '0 0 10px 0', color: '#8d6e63', fontWeight: 'bold' }}>🧸 Video Feed Hidden</p>
              <button 
                className="btn-primary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#00b4d8', border: 'none', borderRadius: '12px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }} 
                onClick={() => setCalmMode(false)}
              >
                Show Camera
              </button>
            </div>
          ) : (
            <div className="video-overlay" style={{ border: '3px solid var(--accent-secondary)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
              <div className="live-camera-feed-sim" style={{ background: '#11032a', position: 'relative' }}>
                {stream.pomodoroActive && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(11, 1, 29, 0.85)',
                    border: '2px solid var(--accent-primary)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent-primary)', letterSpacing: '0.5px' }}>
                      ⏳ STUDY SPRINT: {stream.pomodoroType === 'work' ? 'FOCUS 📚' : 'BREAK 🧸'}
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'monospace', marginTop: '2px' }}>
                      {Math.floor(pomodoroSecondsLeft / 60).toString().padStart(2, '0')}:{(pomodoroSecondsLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #0b011d 0%, #00b4d8 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--accent-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    marginBottom: '8px',
                    boxShadow: '0 0 16px rgba(0, 180, 216, 0.4)'
                  }}>
                    {stream.streamerName.substring(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Camera Active 🎥</span>
                </div>
                <div className="feed-watermark" style={{ background: 'rgba(0, 180, 216, 0.7)' }}>
                  <span>📖 Storyteller: {stream.streamerName}</span>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* Right: Safe Chat Sidebar */}
        {!calmMode && (
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
        )}

      </main>
    </div>
  );
};
