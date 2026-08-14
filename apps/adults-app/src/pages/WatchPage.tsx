import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getVideoBlob } from '../lib/recordingsDb';
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Volume2, Video, ArrowLeft, BookOpen, User } from 'lucide-react';
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
  
  // Video and simulation states
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasLocalVideo, setHasLocalVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isSynced, setIsSynced] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const simTimerRef = useRef<any>(null);

  // 1. Fetch recording metadata from Firestore
  useEffect(() => {
    if (!recordingId) return;

    const docRef = doc(db, 'recordings', recordingId);
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as RecordingData;
        setRecording(data);
        
        // 2. Check IndexedDB for local recording file
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
      console.error("Error fetching recording:", error);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [recordingId]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // 3. Page turning synchronization logic
  useEffect(() => {
    if (!recording || !recording.pageFlips || recording.pageFlips.length === 0 || !isSynced) return;

    // Find the page flip that is active at the current time
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

  // 4. Simulated Playback Timer (when no local video file exists)
  useEffect(() => {
    if (hasLocalVideo) {
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
        simTimerRef.current = null;
      }
      return;
    }

    if (isPlaying) {
      const intervalSpeed = 100; // tick every 100ms
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

  // Local Video events
  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setCurrentTime(recording?.duration || 0);
  };

  // Controller Actions
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
        // restart if ended
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volVal = parseFloat(e.target.value);
    setVolume(volVal);
    if (videoRef.current) {
      videoRef.current.volume = volVal;
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
    // force immediate sync
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
      <div className="stream-loading-screen">
        <div className="spinner"></div>
        <p>Loading recorded storytime session...</p>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="offline-container">
        <h1>Recording Not Found</h1>
        <p>We couldn't find the recording session you are looking for. It may have been deleted.</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', marginTop: '16px' }}>
          Back to Browse
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
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" className="btn-back-browse" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-main)', textDecoration: 'none', gap: '8px' }}>
            <ArrowLeft size={18} />
            <span className="hide-mobile">Back</span>
          </Link>
          <span className="header-logo" style={{ fontSize: '1.2rem' }}>
            ReadaBook <span>Archive</span>
          </span>
        </div>
        <div className="stream-header-info">
          <div className="stream-pill" style={{ background: 'var(--accent-secondary)' }}>
            <Video size={14} />
            <span>RECORDED STORY</span>
          </div>
          <span className="header-stream-title">{recording.title}</span>
        </div>
      </header>

      {/* Main Playback Area */}
      <main className="main-content">
        
        {/* Left: Book Panel */}
        <section className="reader-section">
          <div className="book-display">
            <div className="book-display-header">
               <img src={recording.bookCoverUrl} alt="Book Cover" className="book-cover-img" />
               <div className="book-display-details">
                  <h1>{recording.bookTitle}</h1>
                  <h3>By {recording.bookAuthor}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <span className="chapter-indicator">Page {currentPage + 1} of {recording.bookPages.length}</span>
                    {!isSynced && (
                      <button 
                        onClick={handleSyncBack} 
                        className="btn-primary" 
                        style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--accent-secondary)' }}
                      >
                        <RefreshCw size={10} />
                        <span>Sync to Reader</span>
                      </button>
                    )}
                  </div>
               </div>
            </div>
            
            <div className="book-text-content">
              <p>
                {recording.bookPages[currentPage] || "End of Story."}
              </p>
            </div>

            {/* Manual navigation arrows */}
            <div className="studio-page-nav" style={{ justifyContent: 'center', margin: '16px 0', gap: '20px' }}>
              <button 
                onClick={() => handleManualPageChange(currentPage - 1)} 
                disabled={currentPage === 0}
                className="studio-nav-btn"
                title="Manually turn page back"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => handleManualPageChange(currentPage + 1)} 
                disabled={currentPage === recording.bookPages.length - 1}
                className="studio-nav-btn"
                title="Manually turn page forward"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Media Player Feed Overlay */}
          <div className="video-overlay">
            <div className="live-camera-feed-sim" style={{ border: '2px solid var(--accent-secondary)' }}>
              
              {hasLocalVideo && videoUrl ? (
                /* Actual webcam file from IndexedDB */
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
                /* Simulated video display for other users */
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img src="/assets/streamer_feed.jpg" alt="Simulated Reader Feed" style={{ filter: isPlaying ? 'none' : 'grayscale(40%)' }} />
                  {isPlaying ? (
                    <div className="mic-muted-badge flex-center" style={{ background: 'transparent' }}>
                      <div className="pulse-circle"></div>
                    </div>
                  ) : (
                    <div className="mic-muted-badge flex-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                      <Pause size={24} color="#fff" />
                    </div>
                  )}
                  <div className="simulated-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--accent-secondary)' }}>
                    ☁️ Cloud Simulation Mode
                  </div>
                </div>
              )}
              
              <div className="feed-watermark">
                <span>{recording.readerName}</span>
                <span className={`rec-dot ${isPlaying ? 'red-pulse' : ''}`} style={{ backgroundColor: isPlaying ? 'var(--accent-secondary)' : '#666' }}></span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Playback Details & Sync Controller */}
        <aside className="chat-sidebar" style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', color: 'var(--text-main)' }}>Playback Room</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              <User size={14} />
              <span>Reader: <strong>{recording.readerName}</strong></span>
            </div>

            <div className="glass-panel" style={{ padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} />
                <span>Story Metadata</span>
              </h4>
              <p style={{ margin: '4px 0' }}>Genre: <strong>{recording.genre}</strong></p>
              <p style={{ margin: '4px 0' }}>Pages: <strong>{recording.bookPages.length}</strong></p>
              <p style={{ margin: '4px 0' }}>Page Transitions: <strong>{recording.pageFlips?.length || 0}</strong></p>
            </div>

            {!hasLocalVideo && (
              <div style={{ background: 'rgba(255, 140, 0, 0.1)', border: '1px solid orange', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: 'orange', lineHeight: '1.4' }}>
                <strong>Note:</strong> The reader's webcam file was saved in their browser's local database. You are watching a synchronized text playback with cloud metadata simulation.
              </div>
            )}
          </div>

          {/* Custom Media Controller Dock */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            
            {/* Timeline Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', minWidth: '35px' }}>{formattedCurrentTime}</span>
              <input 
                type="range" 
                min={0} 
                max={recording.duration || 1} 
                step={0.1}
                value={currentTime} 
                onChange={handleSeek}
                style={{ flex: 1, accentColor: 'var(--accent-secondary)', height: '4px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', minWidth: '35px' }}>{formattedTotalTime}</span>
            </div>

            {/* Play/Pause & Volume controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button 
                onClick={togglePlay} 
                className="btn-primary" 
                style={{ 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: isPlaying ? 'var(--bg-hover)' : 'var(--accent-secondary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100px' }}>
                <Volume2 size={16} color="var(--text-muted)" />
                <input 
                  type="range" 
                  min={0} 
                  max={1} 
                  step={0.05} 
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{ width: '100%', accentColor: 'var(--accent-secondary)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '4px', fontSize: '0.75rem', color: isSynced ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                <span className={`rec-dot ${isSynced ? 'red-pulse' : ''}`} style={{ backgroundColor: isSynced ? 'var(--accent-success)' : '#555', width: '6px', height: '6px' }}></span>
                <span>{isSynced ? 'Synced' : 'Manual'}</span>
              </div>
            </div>
          </div>

        </aside>

      </main>
    </div>
  );
};
