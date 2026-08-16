import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getVideoBlob } from '../lib/recordingsDb';
import { parseMessageEmotes } from '../lib/emotesData';
import { soundFX } from '../lib/soundFx';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  Volume2,
  Video,
  ArrowLeft,
  MessageSquare,
  Gauge
} from 'lucide-react';
import '../App.css';

interface PageFlip {
  pageIndex: number;
  time: number;
}

interface VodChatReplayMsg {
  timeSec: number;
  username: string;
  badges: string[];
  text: string;
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
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSynced, setIsSynced] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const simTimerRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Simulated VOD Chat Timeline
  const [vodChatArchive] = useState<VodChatReplayMsg[]>([
    { timeSec: 2, username: 'BookWorm99', badges: ['vip', 'sub6'], text: 'Hello everyone! Grab some hot tea ☕ TeaTime CozyFire' },
    { timeSec: 8, username: 'AuraReader', badges: ['sub1'], text: 'The voice acting on this chapter is incredible! NovelHype PogChamp' },
    { timeSec: 15, username: 'PageTurner', badges: ['mod'], text: 'Did not expect that plot twist at all! PlotTwist MonkaS' },
    { timeSec: 24, username: 'Shelfishly', badges: ['sub3'], text: 'The vocabulary here is amazing! 5Head' },
    { timeSec: 35, username: 'LitCritique', badges: ['vip'], text: 'I love how the e-book highlights along with her voice! BookWorm' },
    { timeSec: 48, username: 'BardicLore', badges: ['founder'], text: 'Look at that foreshadowing! MindBlown' },
    { timeSec: 62, username: 'TeaAndTomes', badges: ['sub1'], text: 'Cozy study vibes are 10/10 tonight CozyFire' },
    { timeSec: 80, username: 'ElessarReader', badges: ['sparksTop'], text: 'Cheered 500 Sparks: "Best read of the year!" ✨' }
  ]);

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
        // Fallback default VOD
        setRecording({
          id: recordingId,
          title: 'The Hobbit: Riddles in the Dark (VOD Archive)',
          genre: 'Fantasy',
          bookId: 'the-hobbit',
          bookTitle: 'The Hobbit',
          bookAuthor: 'J.R.R. Tolkien',
          bookCoverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
          bookPages: [
            'Deep down here by the dark water lived old Gollum, a small slimy creature. I don\'t know where he came from, nor who or what he was. He was Gollum—as dark as darkness, except for two big round pale eyes in his thin face.',
            'He had a little boat that he rowed quite quietly on the lake; for a lake it was, wide and deep and deadly cold. He paddled it with his large feet dangling over the side, but never a ripple did he make.',
            'Not that there was anything to see in the dark, but Gollum was looking out of his pale lamp-like eyes for Bilbo. He had a sharp hunger on him, and he liked something nice and tasty.'
          ],
          pageFlips: [{ pageIndex: 0, time: 0 }, { pageIndex: 1, time: 25 }, { pageIndex: 2, time: 55 }],
          duration: 120,
          readerId: 'mock_lillyreads',
          readerName: 'LillyReads',
          createdAt: new Date()
        });
      }
      setLoading(false);
    }, () => {
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

  // Page synchronization logic
  useEffect(() => {
    if (!recording || !recording.pageFlips || recording.pageFlips.length === 0 || !isSynced) return;

    let activePageIndex = 0;
    const flips = [...recording.pageFlips].sort((a, b) => a.time - b.time);
    for (const flip of flips) {
      if (currentTime >= flip.time) {
        activePageIndex = flip.pageIndex;
      }
    }

    if (activePageIndex !== currentPage && activePageIndex < recording.bookPages.length) {
      setCurrentPage(activePageIndex);
    }
  }, [currentTime, recording, isSynced, currentPage]);

  // Auto-scroll VOD chat on new revealed messages
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentTime]);

  const togglePlay = () => {
    soundFX.playPop();
    if (hasLocalVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else {
      if (isPlaying) {
        clearInterval(simTimerRef.current);
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        simTimerRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            if (recording && prev >= recording.duration) {
              clearInterval(simTimerRef.current);
              setIsPlaying(false);
              return 0;
            }
            return prev + 0.5 * playbackRate;
          });
        }, 500);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (hasLocalVideo && videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSpeedChange = (rate: number) => {
    soundFX.playPop();
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const visibleChatMessages = vodChatArchive.filter(m => m.timeSec <= currentTime);

  if (loading) {
    return (
      <div className="stream-loading-screen">
        <div className="spinner"></div>
        <p>Loading ReadaBook VOD Recording...</p>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="offline-container">
        <h1>VOD Recording Not Found</h1>
        <Link to="/" className="btn-primary">Browse Active Streams</Link>
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
            ReadaBook <span>VOD Archive</span>
          </span>
        </div>
        <div className="stream-header-info">
          <div className="stream-pill" style={{ background: 'var(--accent-secondary)' }}>
            <Video size={14} />
            <span>PAST BROADCAST</span>
          </div>
          <span className="header-stream-title">{recording.title}</span>
        </div>
      </header>

      {/* Main Playback Area */}
      <main className="main-content" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', padding: '16px' }}>
        {/* Left Column: Book & Video Canvas */}
        <div className="vod-player-column">
          <div className="book-display" style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div className="book-display-header" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <img src={recording.bookCoverUrl} alt="Cover" style={{ width: '70px', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
              <div className="book-display-details">
                <h2 style={{ fontSize: '1.3rem', margin: '0 0 4px 0' }}>{recording.bookTitle}</h2>
                <h4 style={{ color: 'var(--text-muted)', margin: '0 0 8px 0' }}>by {recording.bookAuthor}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chapter-indicator">Page {currentPage + 1} of {recording.bookPages.length}</span>
                  {!isSynced && (
                    <button
                      onClick={() => setIsSynced(true)}
                      className="btn-primary"
                      style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <RefreshCw size={10} />
                      <span>Sync to Timeline</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="book-text-content" style={{ minHeight: '200px', lineHeight: '1.7', fontSize: '1.15rem' }}>
              {recording.bookPages[currentPage] ? (
                recording.bookPages[currentPage].split('\n\n').map((para, idx) => (
                  <p key={idx} style={{ marginBottom: '14px' }}>{para}</p>
                ))
              ) : (
                <p>End of VOD story chapter.</p>
              )}
            </div>

            <div className="studio-page-nav" style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '16px 0' }}>
              <button
                onClick={() => {
                  setIsSynced(false);
                  setCurrentPage(prev => Math.max(0, prev - 1));
                }}
                disabled={currentPage === 0}
                className="studio-nav-btn"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => {
                  setIsSynced(false);
                  setCurrentPage(prev => Math.min(recording.bookPages.length - 1, prev + 1));
                }}
                disabled={currentPage === recording.bookPages.length - 1}
                className="studio-nav-btn"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* VOD Timeline & Media Controller */}
          <div className="vod-timeline-bar" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
            {/* Range Scrubber */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{formattedCurrentTime}</span>
              <input
                type="range"
                min={0}
                max={recording.duration || 1}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                style={{ flex: 1, accentColor: 'var(--accent-secondary)', height: '6px', cursor: 'pointer' }}
              />
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{formattedTotalTime}</span>
            </div>

            {/* Controls Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={togglePlay}
                  className="btn-primary"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Volume2 size={16} color="var(--text-muted)" />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{ width: '80px', accentColor: 'var(--accent-secondary)' }}
                  />
                </div>
              </div>

              {/* Speed Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gauge size={15} color="var(--text-muted)" />
                {[0.75, 1, 1.25, 1.5, 2].map(r => (
                  <button
                    key={r}
                    onClick={() => handleSpeedChange(r)}
                    className={`btn-time-pill ${playbackRate === r ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Twitch Synchronized Chat Replay */}
        <aside className="vod-chat-column" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
          <div className="vod-chat-header" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
              <MessageSquare size={16} color="var(--accent-secondary)" />
              <span>CHAT REPLAY</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Synced to video</span>
          </div>

          <div className="vod-chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="chat-welcome-banner" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '8px' }}>
              Chat replay for broadcast: <strong>{recording.title}</strong>
            </div>

            {visibleChatMessages.map((msg, idx) => {
              const parsed = parseMessageEmotes(msg.text);
              const min = Math.floor(msg.timeSec / 60);
              const sec = Math.floor(msg.timeSec % 60);
              const timeStampStr = `${min}:${sec.toString().padStart(2, '0')}`;

              return (
                <div key={idx} className="twitch-chat-msg-row" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                  <span className="chat-timestamp" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '6px', fontFamily: 'monospace' }}>
                    {timeStampStr}
                  </span>

                  <span className="chat-author-name" style={{ fontWeight: 700, color: 'var(--accent-secondary)', marginRight: '4px' }}>
                    {msg.username}:
                  </span>

                  <span className="chat-msg-body">
                    {parsed.map((t, tidx) => (
                      typeof t === 'string' ? (
                        <span key={tidx}>{t}</span>
                      ) : (
                        <span key={tidx} className="chat-inline-emote" title={t.code}>
                          {t.emojiOrUrl}
                        </span>
                      )
                    ))}
                  </span>
                </div>
              );
            })}
            <div ref={chatScrollRef} />
          </div>

          <div className="vod-chat-footer" style={{ padding: '10px 14px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            <span>Messages appear as they were sent during the live broadcast</span>
          </div>
        </aside>
      </main>
    </div>
  );
};
