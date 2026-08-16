import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import {
  Tv,
  ChevronLeft,
  ChevronRight,
  User,
  Flame,
  Heart,
  Users,
  Video,
  Sparkles,
  Compass
} from 'lucide-react';
import { books } from '../lib/booksData';
import { STREAMERS } from '../lib/streamersData';

interface ActiveStream {
  id: string;
  streamerName: string;
  title: string;
  bookId: string;
  viewerCount: number;
  isLive: boolean;
  avatarUrl?: string;
}

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [liveStreams, setLiveStreams] = useState<ActiveStream[]>([]);
  const [followedStreams, setFollowedStreams] = useState<ActiveStream[]>([]);
  const { user } = useAuth();
  const location = useLocation();

  // 1. Listen for ALL live streams in Firestore (for recommendations)
  useEffect(() => {
    const q = query(collection(db, 'streams'), where('isLive', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const active: ActiveStream[] = [];
      snapshot.forEach((doc) => {
        active.push({ id: doc.id, ...doc.data() } as ActiveStream);
      });

      const mockStreams: ActiveStream[] = [
        {
          id: 'mock_lillyreads',
          streamerName: 'LillyReads',
          title: 'Cozy Bedtime Storytelling & Soft Rain Lofi 🌧️',
          bookId: 'the-lion-the-witch-and-the-wardrobe',
          viewerCount: 1420,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 'mock_bookishbard',
          streamerName: 'BookishBard',
          title: 'Adventure Quest! Epic Reading & Voice Acting 🐉',
          bookId: 'the-hobbit',
          viewerCount: 3500,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 'mock_sorcererspells',
          streamerName: 'SorcererSpells',
          title: 'Magical Reading & Soundscape Synthesizers ✨',
          bookId: 'harry-potter-and-the-sorcerer-s-stone',
          viewerCount: 5600,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 'mock_westeroswatcher',
          streamerName: 'WesterosWatcher',
          title: 'Epic Fantasy Study Night - Join Co-Writing Sprinters!',
          bookId: 'a-game-of-thrones',
          viewerCount: 2800,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 'mock_elvenlibrarian',
          streamerName: 'ElvenLibrarian',
          title: 'Rivendell Study Room: Cozy Fireplace & Silent Reading',
          bookId: 'the-fellowship-of-the-ring',
          viewerCount: 1850,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        }
      ];

      const merged = [...active];
      for (const m of mockStreams) {
        if (!merged.some(x => x.id === m.id)) {
          merged.push(m);
        }
      }

      setLiveStreams(merged);
    });

    return () => unsubscribe();
  }, []);

  // 2. Listen for followed channels dynamically
  useEffect(() => {
    if (!user) {
      setFollowedStreams([]);
      return;
    }

    const checkFollows = () => {
      const mockFollows: string[] = JSON.parse(localStorage.getItem('mockFollows') || '[]');
      if (mockFollows.length > 0) {
        const followed = liveStreams.filter(s => mockFollows.includes(s.id));
        setFollowedStreams(followed);
      }
    };

    checkFollows();
    window.addEventListener('storage', checkFollows);

    const followsRef = collection(db, 'users', user.uid, 'follows');
    const unsubscribeFollows = onSnapshot(followsRef, (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach((doc) => {
        ids.push(doc.id);
      });

      if (ids.length === 0) {
        return;
      }

      const streamsQuery = query(collection(db, 'streams'), where('streamerId', 'in', ids));
      const unsubscribeStreams = onSnapshot(streamsQuery, (streamsSnap) => {
        const streams: ActiveStream[] = [];
        streamsSnap.forEach((doc) => {
          streams.push({ id: doc.id, ...doc.data() } as ActiveStream);
        });
        setFollowedStreams(streams);
      });

      return () => unsubscribeStreams();
    });

    return () => {
      window.removeEventListener('storage', checkFollows);
      unsubscribeFollows();
    };
  }, [user, liveStreams]);

  const recommendedStreams = liveStreams.filter(s => !followedStreams.some(f => f.id === s.id));

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle-container">
        {!collapsed && <span className="sidebar-heading">Navigation</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="sidebar-toggle-btn" title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <Link to="/" className={`sidebar-nav-item ${location.pathname === '/' ? 'active' : ''}`} title="Browse">
          <Compass size={18} />
          {!collapsed && <span>Browse</span>}
        </Link>
        <Link to="/clips" className={`sidebar-nav-item ${location.pathname === '/clips' ? 'active' : ''}`} title="Clips">
          <Video size={18} />
          {!collapsed && <span>Clips</span>}
        </Link>
        <Link to="/squads" className={`sidebar-nav-item ${location.pathname === '/squads' ? 'active' : ''}`} title="Squad Streams">
          <Users size={18} />
          {!collapsed && <span>Squad Streams</span>}
        </Link>
        <Link to="/clubs" className={`sidebar-nav-item ${location.pathname === '/clubs' ? 'active' : ''}`} title="Book Clubs">
          <Sparkles size={18} />
          {!collapsed && <span>Book Clubs</span>}
        </Link>
        <Link to="/dashboard" className={`sidebar-nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`} title="Go Live">
          <Tv size={18} />
          {!collapsed && <span>Creator Studio</span>}
        </Link>
      </nav>

      <hr className="sidebar-divider" />

      {/* Followed Channels */}
      {user && followedStreams.length > 0 && (
        <div className="sidebar-channels-section" style={{ flex: 'none', maxHeight: '220px' }}>
          {!collapsed && (
            <div className="sidebar-section-header">
              <Heart size={14} color="var(--accent-primary)" fill="var(--accent-primary)" />
              <span>Followed Channels</span>
            </div>
          )}
          <div className="sidebar-channels-list">
            {followedStreams.map((stream) => {
              const activeBook = books.find(b => b.id === stream.bookId);
              const avatar = stream.avatarUrl || STREAMERS[stream.id]?.avatarUrl;

              return (
                <Link 
                  key={stream.id} 
                  to={`/stream/${stream.id}`} 
                  className={`sidebar-channel-item ${location.pathname === `/stream/${stream.id}` ? 'active' : ''}`}
                >
                  <div className="channel-avatar">
                    {avatar ? (
                      <img src={avatar} alt="" className="sidebar-avatar-img" />
                    ) : (
                      <User size={18} />
                    )}
                    {stream.isLive && <div className="live-badge-dot"></div>}
                  </div>
                  
                  {!collapsed && (
                    <div className="channel-info">
                      <div className="channel-name-row">
                        <span className="channel-name">{stream.streamerName}</span>
                        {stream.isLive ? (
                          <span className="channel-viewers">{(stream.viewerCount / 1000).toFixed(1)}k</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Offline</span>
                        )}
                      </div>
                      <span className="channel-book">
                        📖 {activeBook?.title || 'Reading...'}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          <hr className="sidebar-divider" />
        </div>
      )}

      {/* Recommended Live Channels */}
      <div className="sidebar-channels-section">
        {!collapsed && (
          <div className="sidebar-section-header">
            <Flame size={15} color="var(--accent-secondary)" />
            <span>Recommended Storytellers</span>
          </div>
        )}
        
        <div className="sidebar-channels-list">
          {recommendedStreams.map((stream) => {
            const activeBook = books.find(b => b.id === stream.bookId);
            const avatar = stream.avatarUrl || STREAMERS[stream.id]?.avatarUrl;

            return (
              <Link 
                key={stream.id} 
                to={`/stream/${stream.id}`} 
                className={`sidebar-channel-item ${location.pathname === `/stream/${stream.id}` ? 'active' : ''}`}
              >
                <div className="channel-avatar">
                  {avatar ? (
                    <img src={avatar} alt="" className="sidebar-avatar-img" />
                  ) : (
                    <User size={18} />
                  )}
                  <div className="live-badge-dot"></div>
                </div>
                
                {!collapsed && (
                  <div className="channel-info">
                    <div className="channel-name-row">
                      <span className="channel-name">{stream.streamerName}</span>
                      <span className="channel-viewers">
                        {(stream.viewerCount / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <span className="channel-book">
                      📖 {activeBook?.title || 'Reading...'}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
