import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getVideoBlob } from '../lib/recordingsDb';
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Video, ArrowLeft, BookOpen, Star } from 'lucide-react';
import '../App.css';

interface PageFlip {
  pageIndex: number;
  time: number;
}

interface RecordingData {
  id: string;
  title: string;
  genre: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  bookPages: string[];
  pageFlips: PageFlip[];
  duration: number;
  readerId: string;
  readerName: string;
  videoUrl?: string;
  createdAt: any;
}

export const WatchPage: React.FC = () => {
  const { recordingId } = useParams<{ recordingId: string }>();
  const [recording, setRecording] = useState<RecordingData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasLocalVideo, setHasLocalVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSynced, setIsSynced] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReadAlongEnabled, setIsReadAlongEnabled] = useState(true);
  const [textAnimationMode, setTextAnimationMode] = useState<'static' | 'word' | 'kinetic'>('kinetic');
  const [typographyMode, setTypographyMode] = useState<'outfit' | 'rounded' | 'dyslexic'>('outfit');
  const [calmMode, setCalmMode] = useState(false);
  // StoryGraph Curation & Feedback States
  const [kidMoodFeedback, setKidMoodFeedback] = useState<string | null>(null);
  const [moodStats, setMoodStats] = useState<Record<string, number>>({ excited: 45, cozy: 30, adventurous: 15, sleepy: 10 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const simTimerRef = useRef<any>(null);

  const renderHighlightedText = () => {
    const pageText = (recording && recording.bookPages && recording.bookPages[currentPage]) || "The End! Thank you for reading along! 🧸";
    if (!recording || !isReadAlongEnabled || !recording.pageFlips || recording.pageFlips.length === 0) {
      // Split by paragraphs
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          {pageText.split('\n\n').map((para, idx) => (
            <p key={idx} style={{ marginBottom: '16px', textIndent: '16px' }}>{para}</p>
          ))}
        </div>
      );
    }
    
    // Find current page start and end times
    const flips = [...recording.pageFlips].sort((a, b) => a.time - b.time);
    const currentFlip = flips.find(f => f.pageIndex === currentPage);
    if (!currentFlip) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          {pageText.split('\n\n').map((para, idx) => (
            <p key={idx} style={{ marginBottom: '16px', textIndent: '16px' }}>{para}</p>
          ))}
        </div>
      );
    }
    
    const nextFlip = flips.find(f => f.time > currentFlip.time);
    const startTime = currentFlip.time;
    const endTime = nextFlip ? nextFlip.time : recording.duration || 120;
    const duration = endTime - startTime;
    
    if (duration <= 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          {pageText.split('\n\n').map((para, idx) => (
            <p key={idx} style={{ marginBottom: '16px', textIndent: '16px' }}>{para}</p>
          ))}
        </div>
      );
    }
    
    const elapsed = currentTime - startTime;
    
    // Split the page into paragraphs
    const paragraphs = pageText.split('\n\n');
    
    // Pre-calculate the total words and start indices for each paragraph to maintain global word counting
    let totalWordsCount = 0;
    const parsedParagraphs = paragraphs.map(p => {
      const pWords = p.trim().split(/\s+/).filter(w => w.length > 0);
      const startIdx = totalWordsCount;
      totalWordsCount += pWords.length;
      return { words: pWords, startIdx };
    });
    
    const activeWordIndex = Math.min(
      totalWordsCount - 1,
      Math.max(0, Math.floor((elapsed / duration) * totalWordsCount))
    );
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        {parsedParagraphs.map((pInfo, pIdx) => (
          <p 
            key={pIdx} 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '6px', 
              rowGap: '12px', 
              margin: 0, 
              textIndent: pIdx > 0 ? '16px' : '0px'
            }}
          >
            {pInfo.words.map((word, wIdx) => {
              const globalIdx = pInfo.startIdx + wIdx;
              const isActive = globalIdx === activeWordIndex && isPlaying;
              
              let wordClass = "word-animate-active";
              if (textAnimationMode === 'kinetic') {
                if (isActive) {
                  wordClass += " word-highlighted-kinetic";
                } else {
                  // Apply static kinetic wiggles for punctuation and formatting to stimulate interest
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
              } else if (textAnimationMode === 'word' && isActive) {
                wordClass += " word-highlighted-basic";
              }

              return (
                <span 
                  key={wIdx}
                  className={wordClass}
                >
                  {word}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (!recordingId) return;

    const docRef = doc(db, 'recordings', recordingId);
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as RecordingData;
        setRecording(data);
        
        const blob = await getVideoBlob(recordingId);
        if (blob) {
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
          setHasLocalVideo(true);
        } else if (data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setHasLocalVideo(true);
        } else {
          setHasLocalVideo(false);
        }
      } else {
        setRecording(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching kids recording:", error);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [recordingId]);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Page turning synchronization
  useEffect(() => {
    if (!recording || !recording.pageFlips || recording.pageFlips.length === 0 || !isSynced) return;

    let activePageIndex = 0;
    const flips = [...recording.pageFlips].sort((a, b) => a.time - b.time);
    
    for (let i = 0; i < flips.length; i++) {
      if (currentTime >= flips[i].time) {
        activePageIndex = flips[i].pageIndex;
      } else {
        break;
      }
    }

    if (activePageIndex !== currentPage) {
      setCurrentPage(activePageIndex);
    }
  }, [currentTime, recording, isSynced, currentPage]);

  // Timer Simulation
  useEffect(() => {
    if (hasLocalVideo) {
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
        simTimerRef.current = null;
      }
      return;
    }

    if (isPlaying) {
      const intervalSpeed = 100;
      simTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (recording && next >= recording.duration) {
            setIsPlaying(false);
            clearInterval(simTimerRef.current);
            return recording.duration;
          }
          return next;
        });
      }, intervalSpeed);
    } else {
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
        simTimerRef.current = null;
      }
    }

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [isPlaying, hasLocalVideo, recording]);

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  const handleVideoEnded = () => {
    setIsPlaying(false);
    setCurrentTime(recording?.duration || 0);
  };

  const togglePlay = () => {
    if (hasLocalVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
      }
    } else {
      setIsPlaying(!isPlaying);
      if (!isPlaying && recording && currentTime >= recording.duration) {
        setCurrentTime(0);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeVal = parseFloat(e.target.value);
    setCurrentTime(timeVal);
    if (hasLocalVideo && videoRef.current) {
      videoRef.current.currentTime = timeVal;
    }
  };

  const handleManualPageChange = (newIndex: number) => {
    if (!recording) return;
    if (newIndex < 0 || newIndex >= recording.bookPages.length) return;
    setIsSynced(false);
    setCurrentPage(newIndex);
  };

  const handleSyncBack = () => {
    setIsSynced(true);
    if (recording && recording.pageFlips) {
      let activePageIndex = 0;
      const flips = [...recording.pageFlips].sort((a, b) => a.time - b.time);
      for (let i = 0; i < flips.length; i++) {
        if (currentTime >= flips[i].time) {
          activePageIndex = flips[i].pageIndex;
        } else {
          break;
        }
      }
      setCurrentPage(activePageIndex);
    }
  };

  if (loading) {
    return (
      <div className="stream-loading-screen" style={{ background: '#fffae6', color: '#ff477e' }}>
        <div className="spinner" style={{ borderColor: '#00b4d8', borderTopColor: '#ff477e' }}></div>
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Opening your storybook room...</p>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="offline-container" style={{ background: '#fffae6', padding: '40px' }}>
        <h1>Storybook Room Not Found 🧸</h1>
        <p>This recorded story room seems to have gone on an adventure! Head back to find another story.</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', marginTop: '16px', background: '#ff477e' }}>
          Go Back to Browse
        </Link>
      </div>
    );
  }

  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  const formattedCurrentTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const totalMin = Math.floor(recording.duration / 60);
  const totalSec = Math.floor(recording.duration % 60);
  const formattedTotalTime = `${totalMin}:${totalSec.toString().padStart(2, '0')}`;

  return (
    <div className={`app-container ${calmMode ? 'calm-mode-active' : ''}`} style={calmMode ? {} : { background: '#fffae6', color: '#333' }}>
      {/* Header */}
      <header className="header" style={calmMode ? { borderBottom: '2px solid #efebe9' } : { background: '#fffae6', borderBottom: '3px solid rgba(0,0,0,0.05)', color: '#333' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" className="btn-back-browse" style={{ display: 'flex', alignItems: 'center', color: '#ff477e', textDecoration: 'none', gap: '8px', fontWeight: 'bold' }}>
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </Link>
          <span className="header-logo" style={{ fontSize: '1.4rem', color: '#ff477e' }}>
            🧸 ReadaBook <span>Kids Play</span>
          </span>
        </div>
        <div className="stream-header-info">
          <div className="stream-pill" style={{ background: '#00b4d8', borderRadius: '20px', padding: '6px 14px' }}>
            <Video size={14} color="#fff" />
            <span style={{ color: '#fff', fontWeight: 'bold' }}>STORYTIME PLAYBACK</span>
          </div>
          <span className="header-stream-title" style={{ color: calmMode ? '#3e2723' : '#333', fontSize: '1.2rem', fontWeight: 'bold' }}>{recording.title}</span>
        </div>
      </header>

      {/* Main Playback Area */}
      <main className="main-content">
        
        {/* Left: Book Panel */}
        <section className="reader-section" style={calmMode ? { backgroundColor: '#fdfaf3' } : {}}>
          <div className="book-display" style={calmMode ? { padding: '32px' } : { background: '#fff', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', border: '4px solid #ffde6a' }}>
            <div className="book-display-header" style={{ borderBottom: '2px solid #fffae6', paddingBottom: '16px' }}>
               <img src={recording.bookCoverUrl} alt="Book Cover" className="book-cover-img" style={{ borderRadius: '12px', border: '3px solid #00b4d8', width: '70px', height: '90px' }} />
               <div className="book-display-details">
                  <h1 style={{ color: '#00b4d8', fontSize: '1.6rem', fontWeight: 'bold' }}>{recording.bookTitle}</h1>
                  <h3 style={{ color: '#666', fontSize: '1.1rem' }}>By {recording.bookAuthor}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    <span className="chapter-indicator" style={{ background: '#ff477e', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>Page {currentPage + 1} of {recording.bookPages.length}</span>
                    {!isSynced && (
                      <button 
                        onClick={handleSyncBack} 
                        className="btn-primary" 
                        style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', background: '#00b4d8', border: 'none', borderRadius: '12px', color: '#fff', cursor: 'pointer' }}
                      >
                        <RefreshCw size={12} />
                        <span>Follow Storyteller</span>
                      </button>
                    )}
                  </div>
               </div>
            </div>

            {/* Reading Environment Settings Panel */}
            <div className="reading-settings-bar">
              <div className="setting-item">
                <span style={{ fontWeight: 'bold', marginRight: '4px' }}>🎬 Text Style:</span>
                <select 
                  value={textAnimationMode} 
                  onChange={(e) => {
                    const val = e.target.value as 'static' | 'word' | 'kinetic';
                    setTextAnimationMode(val);
                    if (val === 'static') setIsReadAlongEnabled(false);
                    else setIsReadAlongEnabled(true);
                  }}
                >
                  <option value="static">Plain Text (Static)</option>
                  <option value="word">Word Highlight</option>
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
            
            <div className={`book-text-content font-${typographyMode}`} style={{ minHeight: '240px', display: 'flex', alignItems: 'center', fontSize: '1.5rem', color: calmMode ? '#3e2723' : '#2b2d42' }}>
              {renderHighlightedText()}
            </div>

            {/* Large Kids Page Nav */}
            <div className="studio-page-nav" style={{ justifyContent: 'center', margin: '24px 0', gap: '30px' }}>
              <button 
                onClick={() => handleManualPageChange(currentPage - 1)} 
                disabled={currentPage === 0}
                className="studio-nav-btn"
                style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ffb703', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255, 183, 3, 0.4)' }}
                title="Previous Page"
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                onClick={() => handleManualPageChange(currentPage + 1)} 
                disabled={currentPage === recording.bookPages.length - 1}
                className="studio-nav-btn"
                style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ffb703', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255, 183, 3, 0.4)' }}
                title="Next Page"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>

          {/* Video Overlay Container */}
          {calmMode ? (
            <div className="calm-mode-video-placeholder" style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 10, padding: '16px', background: '#fff', borderRadius: '24px', border: '3px solid #efebe9', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', width: '220px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', margin: '0 0 10px 0', color: '#8d6e63', fontWeight: 'bold' }}>🧸 Video Feed Hidden</p>
              <button 
                className="btn-primary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#00b4d8', border: 'none', borderRadius: '12px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }} 
                onClick={() => setCalmMode(false)}
              >
                Show Reader Camera
              </button>
            </div>
          ) : (
            <div className="video-overlay">
              <div className="live-camera-feed-sim" style={{ border: '4px solid #ff477e', borderRadius: '24px', overflow: 'hidden' }}>
                {hasLocalVideo && videoUrl ? (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onTimeUpdate={handleVideoTimeUpdate}
                    onEnded={handleVideoEnded}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ position: 'relative', width: '100%', height: '100%', background: 'linear-gradient(135deg, #0b011d 0%, #00b4d8 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'var(--accent-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      color: '#fff',
                      marginBottom: '8px',
                      boxShadow: '0 0 16px rgba(0, 180, 216, 0.4)'
                    }}>
                      {recording.readerName ? recording.readerName.substring(0, 2).toUpperCase() : 'RE'}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#fff', opacity: 0.9 }}>Simulated Video Active</span>
                    {isPlaying ? (
                      <div className="mic-muted-badge flex-center" style={{ background: 'transparent' }}>
                        <div className="pulse-circle" style={{ borderColor: '#ff477e' }}></div>
                      </div>
                    ) : (
                      <div className="mic-muted-badge flex-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <Pause size={32} color="#fff" />
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff477e', color: '#fff', fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                      🌟 Playing Back Story
                    </div>
                  </div>
                )}
                
                <div className="feed-watermark" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '12px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}>Reader: {recording.readerName}</span>
                  <span className={`rec-dot ${isPlaying ? 'red-pulse' : ''}`} style={{ backgroundColor: isPlaying ? '#ff477e' : '#888', width: '10px', height: '10px' }}></span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Sidebar: Kids Playback Panel */}
        {!calmMode && (
          <aside className="chat-sidebar" style={{ display: 'flex', flexDirection: 'column', padding: '20px', background: '#fff', borderRadius: '24px', margin: '0 0 0 20px', border: '3px solid #ffde6a', boxShadow: '0 8px 24px rgba(0,0,0,0.03)', width: '280px', flexShrink: 0 }}>
            
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ background: '#fffae6', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
                <Star size={36} color="#ffb703" fill="#ffb703" style={{ margin: '0 auto 8px auto' }} />
                <h2 style={{ fontSize: '1.2rem', margin: '0 0 6px 0', color: '#00b4d8', fontWeight: 'bold' }}>Story Listener Room</h2>
                <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>
                  Listen to reader <strong>{recording.readerName}</strong> guide you through the storybook!
                </p>
              </div>

              <div style={{ background: '#f0fbfd', padding: '16px', borderRadius: '16px', fontSize: '0.9rem', color: '#0077b6' }}>
                <BookOpen size={24} style={{ margin: '0 auto 6px auto' }} />
                <p style={{ margin: '2px 0' }}>Genre: <strong>{recording.genre}</strong></p>
                <p style={{ margin: '2px 0' }}>Pages: <strong>{recording.bookPages.length} Pages</strong></p>
              </div>

              {/* StoryGraph Analytics Panel */}
              <div style={{ background: '#f5f0ff', padding: '16px', borderRadius: '16px', fontSize: '0.85rem', color: '#6200ee', marginTop: '16px', textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <span>📊 Story Analytics (StoryGraph)</span>
                </div>
                
                {/* Mood distribution */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span>🥳 Excited / Happy</span>
                      <span>{moodStats.excited}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(98, 0, 238, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${moodStats.excited}%`, height: '100%', background: '#9d4edd' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span>☕ Cozy / Silent</span>
                      <span>{moodStats.cozy}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(98, 0, 238, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${moodStats.cozy}%`, height: '100%', background: '#ff70a6' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span>⚔️ Adventurous</span>
                      <span>{moodStats.adventurous}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(98, 0, 238, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${moodStats.adventurous}%`, height: '100%', background: '#00b4d8' }}></div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(98,0,238,0.1)', paddingTop: '6px', marginTop: '4px', fontSize: '0.75rem' }}>
                    📖 Pacing: <span style={{ fontWeight: 'bold', background: 'rgba(98,0,238,0.15)', padding: '1px 6px', borderRadius: '4px' }}>🐢 Slow-Paced</span>
                  </div>
                </div>
              </div>

              {/* Emoji Mood Feedback Selector */}
              <div style={{ background: '#fff9db', padding: '16px', borderRadius: '16px', fontSize: '0.85rem', color: '#ff922b', marginTop: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>How did this story make you feel?</div>
                {kidMoodFeedback ? (
                  <div style={{ color: '#ff922b', fontWeight: 'bold', textAlign: 'center' }}>
                    Thank you! You voted: {kidMoodFeedback} ❤️
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-around', gap: '6px' }}>
                    {[
                      { emoji: '🥳', type: 'excited' },
                      { emoji: '☕', type: 'cozy' },
                      { emoji: '⚔️', type: 'adventurous' },
                      { emoji: '😴', type: 'sleepy' }
                    ].map(item => (
                      <button
                        key={item.emoji}
                        type="button"
                        onClick={() => {
                          setKidMoodFeedback(item.emoji);
                          setMoodStats(prev => ({
                            ...prev,
                            [item.type]: prev[item.type] + 5
                          }));
                        }}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', transition: 'transform 0.15s' }}
                      >
                        {item.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Kids Controls Container */}
            <div style={{ background: '#fffae6', padding: '16px', borderRadius: '20px', border: '2px dashed #ffb703' }}>
              
              {/* Timeline Progress Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{formattedCurrentTime}</span>
                <input 
                  type="range" 
                  min={0} 
                  max={recording.duration || 1} 
                  step={0.1}
                  value={currentTime} 
                  onChange={handleSeek}
                  style={{ flex: 1, accentColor: '#ff477e', height: '6px', cursor: 'pointer', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{formattedTotalTime}</span>
              </div>

              {/* Play/Pause Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <button 
                  onClick={togglePlay} 
                  className="btn-primary" 
                  style={{ 
                    borderRadius: '50%', 
                    width: '60px', 
                    height: '60px', 
                    padding: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: isPlaying ? '#ff477e' : '#00b4d8',
                    border: '3px solid #fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                >
                  {isPlaying ? <Pause size={24} color="#fff" /> : <Play size={24} color="#fff" style={{ marginLeft: '4px' }} />}
                </button>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: isSynced ? '#00b4d8' : '#888', marginTop: '12px', fontWeight: 'bold' }}>
                <span className={`rec-dot ${isSynced ? 'red-pulse' : ''}`} style={{ backgroundColor: isSynced ? '#00b4d8' : '#888', width: '8px', height: '8px' }}></span>
                <span>{isSynced ? 'Synced to Reader' : 'Manual Turning'}</span>
              </div>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
};
