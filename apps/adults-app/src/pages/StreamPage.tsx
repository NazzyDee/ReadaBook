import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books, type Book } from '../lib/booksData';
import { STREAMERS, type StreamerProfile } from '../lib/streamersData';
import { VideoPlayer } from '../components/VideoPlayer';
import { SyncedReader } from '../components/SyncedReader';
import { LiveChat, type ChatMsg } from '../components/LiveChat';
import { PredictionsOverlay } from '../components/PredictionsOverlay';
import { StreamExtensions } from '../components/StreamExtensions';
import { CommunityGoalWidget } from '../components/CommunityGoalWidget';
import { StreamMarkerModal } from '../components/StreamMarkerModal';
import { ClipCreator } from '../components/ClipCreator';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { StoryBranchHUD } from '../components/StoryBranchHUD';
import { CharityMarathonWidget } from '../components/CharityMarathonWidget';
import { ReaderMomentsModal } from '../components/ReaderMomentsModal';
import { ViewerSoundboardModal } from '../components/ViewerSoundboardModal';
import { VodTranscriptViewer } from '../components/VodTranscriptViewer';
import { SquadMultiviewPlayer } from '../components/SquadMultiviewPlayer';
import { LoreGlossaryOverlay } from '../components/LoreGlossaryOverlay';
import { WatchPartyRoomModal } from '../components/WatchPartyRoomModal';
import { StreamInfoModal } from '../components/StreamInfoModal';
import { RaidBanner } from '../components/RaidBanner';
import { MiniPlayer } from '../components/MiniPlayer';
import { GuestStarModal } from '../components/GuestStarModal';
import { type GuestParticipant, type GuestLayoutMode } from '../components/GuestStarStage';
import { ReadingSprintHUD } from '../components/ReadingSprintHUD';
import { AmbientSoundMixer } from '../components/AmbientSoundMixer';
import { SprintSummaryModal } from '../components/SprintSummaryModal';
import { BookCommercePanel } from '../components/BookCommercePanel';
import { soundFX } from '../lib/soundFx';
import {
  Heart,
  Star,
  Scissors,
  Share2,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Minimize2,
  Bookmark,
  Users,
  GitBranch,
  HeartHandshake,
  Flame,
  BellRing,
  FileText,
  Grid,
  BookOpen
} from 'lucide-react';

interface StreamData {
  streamerId: string;
  streamerName: string;
  title: string;
  bookId: string;
  genre: string;
  currentPage: number;
  currentParagraph?: number;
  isLive: boolean;
  viewerCount: number;
  emoteOnly?: boolean;
  pinnedMessage?: string | null;
  broadcastSource?: 'webcam' | 'obs';
  isObsConnected?: boolean;
  slowModeSeconds?: number;
  tags?: string[];
}

export const StreamPage: React.FC = () => {
  const { streamerId } = useParams<{ streamerId: string }>();
  const { user } = useAuth();

  const [stream, setStream] = useState<StreamData | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  // Guest Star Multi-Reader State
  const [showGuestStarModal, setShowGuestStarModal] = useState(false);
  const [guestStarActive, setGuestStarActive] = useState(false);
  const [guestLayout, setGuestLayout] = useState<GuestLayoutMode>('side-by-side');
  const [guestParticipants, setGuestParticipants] = useState<GuestParticipant[]>([
    {
      id: 'host_p1',
      name: 'LillyReads',
      role: 'Host & Narrator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isMuted: false,
      isVideoOff: false,
      audioLevel: 75,
      isSpeaking: true,
      volume: 100,
      isHost: true
    },
    {
      id: 'guest_p2',
      name: 'ElessarVoiceActor',
      role: 'Voice Actor: Aragorn',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isMuted: false,
      isVideoOff: false,
      audioLevel: 60,
      isSpeaking: false,
      volume: 90
    }
  ]);

  // Modals & Toolbars
  const [showClipModal, setShowClipModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [showAmbientMixer, setShowAmbientMixer] = useState(false);
  const [showBranchHUD, setShowBranchHUD] = useState(false);
  const [showCharityModal, setShowCharityModal] = useState(false);
  const [showMomentsModal, setShowMomentsModal] = useState(false);
  const [showSoundboardModal, setShowSoundboardModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showSquadMulti, setShowSquadMulti] = useState(false);
  const [showLoreWikiModal, setShowLoreWikiModal] = useState(false);
  const [showWatchPartyModal, setShowWatchPartyModal] = useState(false);
  const [sprintCompletedTarget, setSprintCompletedTarget] = useState<number | null>(null);
  const [activeCheerAnimation, setActiveCheerAnimation] = useState<any | null>(null);
  const [incomingRaid, setIncomingRaid] = useState<{ raiderName: string; raiderAvatar: string; readerCount: number } | null>(null);

  // 1. Fetch & Subscribe to Stream Document (with mock fallbacks)
  useEffect(() => {
    if (!streamerId) return;

    // Check if mock streamer
    const fallbackProfile = STREAMERS[streamerId];
    const defaultMockStream: StreamData = {
      streamerId: streamerId,
      streamerName: fallbackProfile?.username || 'Storyteller',
      title: fallbackProfile?.currentStreamTitle || 'Live Reading & Book Discussion ☕',
      bookId: fallbackProfile?.currentBookId || books[0].id,
      genre: 'Fantasy',
      currentPage: 0,
      currentParagraph: 0,
      isLive: true,
      viewerCount: fallbackProfile?.followersCount ? Math.round(fallbackProfile.followersCount / 20) : 1420,
      broadcastSource: 'webcam',
      tags: fallbackProfile?.tags || ['VoiceActing', 'Fantasy', 'CozyVibes']
    };

    const streamDocRef = doc(db, 'streams', streamerId);
    const unsubscribe = onSnapshot(
      streamDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setStream(docSnap.data() as StreamData);
        } else {
          setStream(defaultMockStream);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Using mock stream fallback:', err);
        setStream(defaultMockStream);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [streamerId]);

  // 2. Resolve active book (static or Firestore custom book)
  useEffect(() => {
    if (!stream) {
      setActiveBook(null);
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
        .catch(() => {
          setActiveBook(staticBook);
        });
    } else {
      const bookDocRef = doc(db, 'books', stream.bookId);
      const unsubscribe = onSnapshot(bookDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setActiveBook({ id: docSnap.id, ...docSnap.data() } as Book);
        }
      });
      return () => unsubscribe();
    }
  }, [stream]);

  // 3. Follow state
  useEffect(() => {
    if (!user || !streamerId) return;

    if (streamerId.startsWith('mock_') || streamerId.startsWith('mock-')) {
      const mockFollows = JSON.parse(localStorage.getItem('mockFollows') || '[]');
      setIsFollowing(mockFollows.includes(streamerId));
    } else {
      const followDocRef = doc(db, 'users', user.uid, 'following', streamerId);
      const unsubscribe = onSnapshot(followDocRef, (docSnap) => {
        setIsFollowing(docSnap.exists());
      });
      return () => unsubscribe();
    }
  }, [user, streamerId]);

  // 4. Keyboard Shortcuts: Alt+X (Clip), Alt+M (Marker), Alt+T (Theater)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.altKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        soundFX.playPop();
        setShowClipModal(true);
      } else if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        soundFX.playPop();
        setShowMarkerModal(true);
      } else if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setTheaterMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4. Live Chat messages simulation
  useEffect(() => {
    if (!streamerId) return;

    const initialMockMsgs: ChatMsg[] = [
      {
        id: 'm1',
        text: 'Hello everyone! Grab some hot tea ☕ TeaTime CozyFire',
        username: 'BookWorm99',
        createdAt: new Date(),
        badges: ['vip', 'sub6']
      },
      {
        id: 'm2',
        text: 'The voice acting on this chapter is incredible! NovelHype PogChamp',
        username: 'AuraReader',
        createdAt: new Date(),
        badges: ['sub1']
      },
      {
        id: 'm3',
        text: 'Did not expect that plot twist at all! PlotTwist MonkaS',
        username: 'PageTurner',
        createdAt: new Date(),
        badges: ['mod']
      }
    ];
    setMessages(initialMockMsgs);

    const mockChatUsers = ['Shelfishly', 'LitCritique', 'NovelEnthusiast', 'BardicLore', 'TeaAndTomes', 'MysticReader'];
    const mockChatPhrases = [
      'The vocabulary here is amazing! 5Head',
      'I love how the e-book highlights along with her voice! BookWorm',
      'Look at that foreshadowing! MindBlown',
      'Can we predict what happens to the ring next? VoteYea',
      'Cozy study vibes are 10/10 tonight CozyFire',
      'Speed reading sprint in the next chapter? SpeedReader',
      'Aslan voice gives me goosebumps every time! NovelHype PogChamp',
      'Cheering 100 sparks for this chapter! ✨'
    ];

    const interval = setInterval(() => {
      const randomUser = mockChatUsers[Math.floor(Math.random() * mockChatUsers.length)];
      const randomText = mockChatPhrases[Math.floor(Math.random() * mockChatPhrases.length)];
      const randomBadges: ('sub1' | 'vip' | 'founder')[] = Math.random() > 0.5 ? ['sub1'] : [];

      setMessages(prev => [
        ...prev.slice(-49),
        {
          id: `msg_${Math.random()}`,
          text: randomText,
          username: randomUser,
          createdAt: new Date(),
          badges: randomBadges
        }
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, [streamerId]);

  // 5. Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setTheaterMode(prev => !prev);
      } else if (e.altKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        setShowClipModal(true);
      } else if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setShowMarkerModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFollow = async () => {
    if (!user || !streamerId) return;
    soundFX.playPop();

    if (streamerId.startsWith('mock_') || streamerId.startsWith('mock-')) {
      const mockFollows = JSON.parse(localStorage.getItem('mockFollows') || '[]');
      let updated = [];
      if (isFollowing) {
        updated = mockFollows.filter((id: string) => id !== streamerId);
      } else {
        updated = [...mockFollows, streamerId];
      }
      localStorage.setItem('mockFollows', JSON.stringify(updated));
      setIsFollowing(!isFollowing);
      window.dispatchEvent(new Event('storage'));
      return;
    }

    const followDocRef = doc(db, 'users', user.uid, 'follows', streamerId);
    try {
      if (isFollowing) {
        await deleteDoc(followDocRef);
      } else {
        await setDoc(followDocRef, {
          streamerName: stream?.streamerName || 'Streamer',
          followedAt: new Date()
        });
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !user) return;
    const username = user.email ? user.email.split('@')[0] : 'You';

    const newMsg: ChatMsg = {
      id: `msg_user_${Date.now()}`,
      text: text.trim(),
      username,
      createdAt: new Date(),
      badges: ['sub1']
    };

    setMessages(prev => [...prev.slice(-49), newMsg]);
  };

  const handleSendCheer = (bits: number, message: string) => {
    const username = user?.email ? user.email.split('@')[0] : 'You';
    const cheerAnim = {
      id: `cheer_${Date.now()}`,
      bits,
      username,
      message,
      icon: bits >= 1000 ? '👑' : bits >= 500 ? '💎' : '✨'
    };

    setActiveCheerAnimation(cheerAnim);
    setTimeout(() => setActiveCheerAnimation(null), 5000);

    const cheerMsg: ChatMsg = {
      id: `cheer_msg_${Date.now()}`,
      text: `Cheered ${bits} Sparks: "${message}"`,
      username,
      createdAt: new Date(),
      type: 'cheer',
      bitsAmount: bits,
      badges: ['sparksTop', 'sub1'],
      isHighlighted: true
    };

    setMessages(prev => [...prev.slice(-49), cheerMsg]);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSaveStreamInfo = (title: string, genre: string, tags: string[]) => {
    if (stream) {
      setStream({
        ...stream,
        title,
        genre,
        tags
      });
    }
  };

  const handleInitiateRaid = (_target: StreamerProfile) => {
    setIncomingRaid({
      raiderName: stream?.streamerName || 'Broadcaster',
      raiderAvatar: streamerProfile?.avatarUrl || '',
      readerCount: 1420
    });
  };

  const handleAddStreamMarker = (desc: string, timestamp: string) => {
    handleSendMessage(`📌 Stream Marker dropped at ${timestamp}: "${desc}"`);
  };

  if (loading) {
    return (
      <div className="stream-loading-screen">
        <div className="spinner"></div>
        <p>Connecting to ReadaBook Live Stream...</p>
      </div>
    );
  }

  if (!stream || !stream.isLive) {
    return (
      <div className="offline-container">
        <AlertCircle size={64} color="var(--accent-primary)" />
        <h1>Stream Offline</h1>
        <p>This channel is not currently broadcasting. Head back to Browse to find active storytellers.</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', marginTop: '16px' }}>
          Back to Browse
        </Link>
      </div>
    );
  }

  const streamerProfile = STREAMERS[stream.streamerId] || null;

  return (
    <div className={`twitch-stream-page ${theaterMode ? 'theater-active' : ''}`}>
      {/* Main Left Watch Column */}
      <div className="twitch-watch-main-column">
        {/* Incoming Raid Banner Alert (if raided) */}
        {incomingRaid && (
          <RaidBanner
            raiderName={incomingRaid.raiderName}
            raiderAvatar={incomingRaid.raiderAvatar}
            readerCount={incomingRaid.readerCount}
            onShoutout={(name) => handleSendMessage(`🎉 Huge thanks to ${name} for the raid! Check out their channel! ✨`)}
            onDismiss={() => setIncomingRaid(null)}
          />
        )}

        {/* Top: Video Player Canvas */}
        <div className="stream-video-wrapper">
          <VideoPlayer
            streamerName={stream.streamerName}
            streamTitle={stream.title}
            viewerCount={stream.viewerCount}
            broadcastSource={stream.broadcastSource}
            isObsConnected={stream.isObsConnected}
            activeCheer={activeCheerAnimation}
            theaterMode={theaterMode}
            onToggleTheater={() => setTheaterMode(!theaterMode)}
            audioOnly={audioOnly}
            onToggleAudioOnly={() => setAudioOnly(!audioOnly)}
            guestStarActive={guestStarActive}
            guestLayout={guestLayout}
            guestParticipants={guestParticipants}
            onOpenGuestStarModal={() => setShowGuestStarModal(true)}
          />
        </div>

        {/* Middle: Streamer Metadata Bar & Action Buttons */}
        <div className="twitch-stream-meta-bar">
          <div className="stream-meta-left">
            <Link to={`/channel/${stream.streamerId}`} className="streamer-avatar-link">
              <img
                src={streamerProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={stream.streamerName}
                className="streamer-meta-avatar"
              />
              <span className="live-pill-dot"></span>
            </Link>

            <div className="stream-meta-text">
              <div className="stream-title-row">
                <h2>{stream.title}</h2>
                <button
                  onClick={() => setShowEditInfoModal(true)}
                  className="btn-edit-stream-title"
                  title="Edit Stream Info"
                >
                  <Edit3 size={14} />
                </button>
              </div>

              <div className="streamer-subline">
                <Link to={`/channel/${stream.streamerId}`} className="streamer-name-link">
                  {stream.streamerName}
                </Link>
                {streamerProfile?.isPartner && (
                  <span title="Verified Literature Partner">
                    <CheckCircle2 size={15} color="#00e5ff" />
                  </span>
                )}
                <span className="meta-sep">•</span>
                <Link to={`/directory/category/${stream.genre.toLowerCase()}`} className="meta-genre-link">
                  {stream.genre}
                </Link>
                <span className="meta-sep">•</span>
                <span className="meta-book-name">📖 {activeBook?.title || 'Book'} by {activeBook?.author}</span>
              </div>

              <div className="stream-tags-list">
                {stream.tags?.map(t => (
                  <span key={t} className="stream-tag-chip">#{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="stream-meta-right">
            {/* Follow Button */}
            <button
              onClick={handleToggleFollow}
              className={`btn-stream-follow ${isFollowing ? 'following' : ''}`}
            >
              <Heart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
              <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>

            {/* Subscribe Button */}
            <button
              onClick={() => setShowSubModal(true)}
              className="btn-primary btn-stream-sub"
            >
              <Star size={16} fill="currentColor" />
              <span>Subscribe</span>
            </button>

            {/* Moments Claim Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowMomentsModal(true);
              }}
              className="btn-secondary"
              title="Claim Live Broadcast Moments & Badges"
            >
              <Flame size={16} color="#ffd700" />
              <span className="hide-mobile">Moments</span>
            </button>

            {/* Sound Alerts Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSoundboardModal(true);
              }}
              className="btn-secondary"
              title="Viewer Channel Points Sound Alerts Board"
            >
              <BellRing size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Sound FX</span>
            </button>

            {/* Transcript Timeline Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowTranscriptModal(true);
              }}
              className="btn-secondary"
              title="Synchronized Reading Transcript & Chapters"
            >
              <FileText size={16} color="var(--text-muted)" />
              <span className="hide-mobile">Transcript</span>
            </button>

            {/* Squad Multiview Launcher */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSquadMulti(true);
              }}
              className="btn-secondary"
              title="Launch 4-Way Squad Co-Stream Multiview"
            >
              <Grid size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Multiview</span>
            </button>

            {/* Lore Codex Wiki Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowLoreWikiModal(true);
              }}
              className="btn-secondary"
              title="Open Spoiler-Shielded Lore & Character Codex"
            >
              <BookOpen size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Lore Codex</span>
            </button>

            {/* Watch Party Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowWatchPartyModal(true);
              }}
              className="btn-secondary"
              title="Join Community Synchronized Watch Party"
            >
              <Users size={16} color="#ffd700" />
              <span className="hide-mobile">Watch Party</span>
            </button>

            {/* CYOA Branching Vote Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowBranchHUD(true);
              }}
              className="btn-secondary"
              title="Open Choose Your Own Adventure Live Decision Vote"
            >
              <GitBranch size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">CYOA Vote</span>
            </button>

            {/* Charity Marathon Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowCharityModal(true);
              }}
              className="btn-secondary"
              title="Live Book Charity Marathon & Donation Drive"
            >
              <HeartHandshake size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">Charity Drive</span>
            </button>

            {/* Guest Star Stage Launcher */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowGuestStarModal(true);
              }}
              className={`btn-secondary ${guestStarActive ? 'btn-guest-active' : ''}`}
              title="Guest Star Multi-Reader Stage"
            >
              <Users size={16} />
              <span className="hide-mobile">{guestStarActive ? 'Guest Star (Live)' : 'Guest Star'}</span>
            </button>

            {/* Drop Marker Button */}
            <button
              onClick={() => setShowMarkerModal(true)}
              className="btn-secondary btn-icon-only"
              title="Drop Stream Marker (Alt+M)"
            >
              <Bookmark size={16} />
            </button>

            {/* Clip That Button */}
            <button
              onClick={() => setShowClipModal(true)}
              className="btn-secondary btn-clip-trigger"
              title="Create 30s Clip (Alt+X)"
            >
              <Scissors size={16} />
              <span className="hide-mobile">Clip</span>
            </button>

            {/* Picture-in-Picture Mini-Player */}
            <button
              onClick={() => setShowMiniPlayer(true)}
              className="btn-secondary btn-icon-only"
              title="Mini-Player (PiP)"
            >
              <Minimize2 size={16} />
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Stream link copied to clipboard!');
              }}
              className="btn-secondary btn-icon-only"
              title="Share Stream"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Synchronized Community Reading Sprint HUD (Pomodoro Focus) */}
        <ReadingSprintHUD
          isBroadcaster={user?.uid === stream.streamerId}
          onOpenAmbientMixer={() => setShowAmbientMixer(true)}
          onSprintCompleted={(target) => {
            setSprintCompletedTarget(target);
            handleSendMessage(`🎯 Completed a 25-minute reading sprint! (Target: ${target} pages)`);
          }}
        />

        {/* Live Community Sub / Follower Goal */}
        <CommunityGoalWidget />

        {/* Live Predictions Overlay */}
        <PredictionsOverlay />

        {/* Stream Extensions Toolbar & Overlays (Soundboard, Lore Map, Trivia Quiz) */}
        <StreamExtensions
          streamerName={stream.streamerName}
          bookTitle={activeBook?.title || 'Current Book'}
          onSendChatMessage={handleSendMessage}
        />

        {/* Bottom: Live Interactive Synced E-Reader */}
        {activeBook && (
          <div className="synced-reader-section">
            <SyncedReader
              activeBook={activeBook}
              currentPage={stream.currentPage}
              currentParagraph={stream.currentParagraph}
              streamerName={stream.streamerName}
            />
          </div>
        )}

        {/* In-Stream Book Purchases & Goodreads / StoryGraph Shelf Sync */}
        {activeBook && (
          <BookCommercePanel
            book={activeBook}
            streamerName={stream.streamerName}
            onSendChatMessage={handleSendMessage}
          />
        )}

        {/* Streamer Markdown Info Panels */}
        {streamerProfile && streamerProfile.panels && (
          <div className="stream-about-panels-section">
            <h3 className="section-heading">About {streamerProfile.displayName}</h3>
            <div className="twitch-panels-grid">
              {streamerProfile.panels.map(panel => (
                <div key={panel.id} className="twitch-markdown-panel">
                  <div className="panel-header">
                    <h4>{panel.title}</h4>
                  </div>
                  <div className="panel-body">
                    {panel.content.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Twitch Live Chat */}
      <div className="twitch-chat-column">
        <LiveChat
          streamerName={stream.streamerName}
          streamerId={stream.streamerId}
          messages={messages}
          onSendMessage={handleSendMessage}
          onSendCheer={handleSendCheer}
          onDeleteMessage={handleDeleteMessage}
          onClearChat={handleClearChat}
          onInitiateRaid={handleInitiateRaid}
          emoteOnly={stream.emoteOnly}
          pinnedMessage={stream.pinnedMessage}
          slowModeSeconds={stream.slowModeSeconds}
        />
      </div>

      {/* Guest Star Modal */}
      {showGuestStarModal && (
        <GuestStarModal
          isOpen={showGuestStarModal}
          isActiveOnStream={guestStarActive}
          onToggleActiveOnStream={setGuestStarActive}
          layout={guestLayout}
          onChangeLayout={setGuestLayout}
          participants={guestParticipants}
          onUpdateParticipants={setGuestParticipants}
          onClose={() => setShowGuestStarModal(false)}
        />
      )}

      {/* Clip Creation Modal */}
      {showClipModal && activeBook && (
        <ClipCreator
          streamerId={stream.streamerId}
          streamerName={stream.streamerName}
          streamerAvatar={streamerProfile?.avatarUrl}
          bookId={activeBook.id}
          bookTitle={activeBook.title}
          bookAuthor={activeBook.author}
          bookCoverUrl={activeBook.coverUrl}
          onClose={() => setShowClipModal(false)}
        />
      )}

      {/* Stream Marker Modal */}
      {showMarkerModal && (
        <StreamMarkerModal
          onAddMarker={handleAddStreamMarker}
          onClose={() => setShowMarkerModal(false)}
        />
      )}

      {/* Subscriptions & Gift Subs Modal */}
      {showSubModal && (
        <SubscriptionModal
          streamerName={stream.streamerName}
          streamerId={stream.streamerId}
          avatarUrl={streamerProfile?.avatarUrl}
          onSubscribed={(tierName) => {
            handleSendMessage(`⭐ Just subscribed with ${tierName}! Excited to read along!`);
          }}
          onGifted={(count, total) => {
            handleSendMessage(`🎁 Just gifted ${count} subscriptions ($${total}) to the reading community! 🎉`);
          }}
          onClose={() => setShowSubModal(false)}
        />
      )}

      {/* Choose Your Own Adventure Live Branching HUD */}
      {showBranchHUD && (
        <StoryBranchHUD
          onOptionSelected={(winningOption) => {
            handleSendMessage(`🗺️ Audience voted for: "${winningOption.label}"! Turning to page ${winningOption.targetPage}!`);
          }}
          onClose={() => setShowBranchHUD(false)}
        />
      )}

      {/* Charity Marathon Donation & Milestone Widget */}
      {showCharityModal && (
        <CharityMarathonWidget
          onDonationSubmitted={(amount, donorName, msg) => {
            handleSendMessage(`💖 ${donorName} donated $${amount.toFixed(2)} to charity! "${msg}"`);
          }}
          onClose={() => setShowCharityModal(false)}
        />
      )}

      {/* Broadcast Moments & Climax Badges Modal */}
      {showMomentsModal && (
        <ReaderMomentsModal
          isStreamer={user?.uid === stream.streamerId}
          streamerName={stream.streamerName}
          onMomentClaimed={(moment) => {
            handleSendMessage(`🏆 Claimed the "${moment.momentTitle}" ${moment.badgeRarity} Moment Badge!`);
          }}
          onClose={() => setShowMomentsModal(false)}
        />
      )}

      {/* Viewer Soundboard & Channel Points Sound Alerts */}
      {showSoundboardModal && (
        <ViewerSoundboardModal
          streamerName={stream.streamerName}
          onAlertTriggered={(alert) => {
            handleSendMessage(`🔊 Played Sound Alert: ${alert.icon} ${alert.name} (-${alert.pointsCost} pts)`);
          }}
          onClose={() => setShowSoundboardModal(false)}
        />
      )}

      {/* VOD Chapters & Interactive Transcript Timeline */}
      {showTranscriptModal && (
        <VodTranscriptViewer
          onJumpToTimestamp={(secs, page) => {
            handleSendMessage(`📖 Jumped transcript to ${Math.floor(secs / 60)}m (Page ${page})`);
          }}
          onClose={() => setShowTranscriptModal(false)}
        />
      )}

      {/* 4-Way Squad Co-Stream Multiview */}
      {showSquadMulti && (
        <SquadMultiviewPlayer
          onClose={() => setShowSquadMulti(false)}
        />
      )}

      {/* Spoiler-Shielded Lore & Character Codex */}
      {showLoreWikiModal && (
        <LoreGlossaryOverlay
          currentPage={stream.currentPage}
          bookTitle={activeBook?.title || 'Current Book'}
          onClose={() => setShowLoreWikiModal(false)}
        />
      )}

      {/* Community Co-Reading Watch Party Lounge */}
      {showWatchPartyModal && (
        <WatchPartyRoomModal
          onClose={() => setShowWatchPartyModal(false)}
        />
      )}

      {/* Edit Stream Info Modal */}
      {showEditInfoModal && (
        <StreamInfoModal
          initialTitle={stream.title}
          initialGenre={stream.genre}
          initialTags={stream.tags || []}
          onSave={handleSaveStreamInfo}
          onClose={() => setShowEditInfoModal(false)}
        />
      )}

      {/* Picture-in-Picture Mini-Player */}
      {showMiniPlayer && (
        <MiniPlayer
          streamerId={stream.streamerId}
          streamerName={stream.streamerName}
          streamTitle={stream.title}
          avatarUrl={streamerProfile?.avatarUrl || ''}
          viewerCount={stream.viewerCount}
          onClose={() => setShowMiniPlayer(false)}
        />
      )}

      {/* Lo-Fi Ambient Sound Mixer Drawer */}
      {showAmbientMixer && (
        <div className="ambient-mixer-floating-drawer">
          <AmbientSoundMixer onClose={() => setShowAmbientMixer(false)} />
        </div>
      )}

      {/* Reading Sprint Summary & Rewards Modal */}
      {sprintCompletedTarget !== null && (
        <SprintSummaryModal
          targetPages={sprintCompletedTarget}
          onClose={() => setSprintCompletedTarget(null)}
        />
      )}
    </div>
  );
};
