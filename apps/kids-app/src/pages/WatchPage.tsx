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

  const videoRef = useRef<HTMLVideoElement>(null);
  const simTimerRef = useRef<any>(null);

  const renderHighlightedText = () => {
    const pageText = (recording && recording.bookPages && recording.bookPages[currentPage]) || "The End! Thank you for reading along! 🧸";
    if (!recording || !isReadAlongEnabled || !recording.pageFlips || recording.pageFlips.length === 0) {
      return <p>{pageText}</p>;
    }
    
    // Find current page start and end times
    const flips = [...recording.pageFlips].sort((a, b) => a.time - b.time);
    const currentFlip = flips.find(f => f.pageIndex === currentPage);
    if (!currentFlip) return <p>{pageText}</p>;
    
    const nextFlip = flips.find(f => f.time > currentFlip.time);
    const startTime = currentFlip.time;
    const endTime = nextFlip ? nextFlip.time : recording.duration || 120;
    const duration = endTime - startTime;
    
    if (duration <= 0) return <p>{pageText}</p>;
    
    const elapsed = currentTime - startTime;
    const words = pageText.split(/\s+/);
    const activeWordIndex = Math.min(
      words.length - 1,
      Math.max(0, Math.floor((elapsed / duration) * words.length))
    );
    
    return (
      <p style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', rowGap: '12px', margin: 0 }}>
        {words.map((word, idx) => {
          const isActive = idx === activeWordIndex && isPlaying;
          return (
            <span 
              key={idx}
              style={{
                background: isActive ? 'rgba(255, 183, 3, 0.25)' : 'transparent',
                borderBottom: isActive ? '3px solid #ffb703' : 'none',
                color: isActive ? '#d81159' : 'inherit',
                fontWeight: isActive ? 'bold' : 'normal',
                padding: '2px 4px',
                borderRadius: '4px',
                transition: 'background-color 0.15s, color 0.15s, border-bottom 0.15s',
                display: 'inline-block'
              }}
            >
              {word}
            </span>
          );
        })}
      </p>
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
    <div className="app-container" style={{ background: '#fffae6', color: '#333' }}>
      {/* Header */}
      <header className="header" style={{ background: '#fffae6', borderBottom: '3px solid rgba(0,0,0,0.05)', color: '#333' }}>
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
          <span className="header-stream-title" style={{ color: '#333', fontSize: '1.2rem', fontWeight: 'bold' }}>{recording.title}</span>
        </div>
      </header>

      {/* Main Playback Area */}
      <main className="main-content">
        
        {/* Left: Book Panel */}
        <section className="reader-section">
          <div className="book-display" style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', border: '4px solid #ffde6a' }}>
            <div className="book-display-header" style={{ borderBottom: '2px solid #fffae6', paddingBottom: '16px' }}>
               <img src={recording.bookCoverUrl} alt="Book Cover" className="book-cover-img" style={{ borderRadius: '12px', border: '3px solid #00b4d8', width: '70px', height: '90px' }} />
               <div className="book-display-details">
                  <h1 style={{ color: '#00b4d8', fontSize: '1.6rem', fontWeight: 'bold' }}>{recording.bookTitle}</h1>
                  <h3 style={{ color: '#666', fontSize: '1.1rem' }}>By {recording.bookAuthor}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    <span className="chapter-indicator" style={{ background: '#ff477e', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>Page {currentPage + 1} of {recording.bookPages.length}</span>
                    <button 
                      onClick={() => setIsReadAlongEnabled(!isReadAlongEnabled)} 
                      className="btn-primary" 
                      style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', background: isReadAlongEnabled ? '#ffb703' : 'rgba(0,0,0,0.15)', color: isReadAlongEnabled ? '#fff' : 'var(--text-muted)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      <BookOpen size={12} />
                      <span>{isReadAlongEnabled ? "Highlights: On 📖" : "Highlights: Off 📓"}</span>
                    </button>
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
            
            <div className="book-text-content" style={{ fontFamily: 'var(--font-kids, "Comic Sans MS", cursive, sans-serif)', fontSize: '1.45rem', color: '#2b2d42', lineHeight: '1.8', minHeight: '240px', display: 'flex', alignItems: 'center' }}>
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
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img src="/assets/streamer_feed.jpg" alt="Reader" style={{ filter: isPlaying ? 'none' : 'grayscale(30%)' }} />
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
        </section>

        {/* Right Sidebar: Kids Playback Panel */}
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

      </main>
    </div>
  );
};
