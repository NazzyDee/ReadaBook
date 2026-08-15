import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Home, Tv, ChevronLeft, ChevronRight, User, Flame, Heart, Users } from 'lucide-react';
import { books } from '../lib/booksData';

interface ActiveStream {
  id: string;
  streamerName: string;
  title: string;
  bookId: string;
  viewerCount: number;
  isLive: boolean;
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
          isLive: true
        },
        {
          id: 'mock_bookishbard',
          streamerName: 'BookishBard',
          title: 'Adventure Quest! Epic Reading & Voice Acting 🐉',
          bookId: 'the-hobbit',
          viewerCount: 3500,
          isLive: true
        },
        {
          id: 'mock_sorcererspells',
          streamerName: 'SorcererSpells',
          title: 'Magical Reading & Soundscape Synthesizers ✨',
          bookId: 'harry-potter-and-the-sorcerer-s-stone',
          viewerCount: 5600,
          isLive: true
        },
        {
          id: 'mock_westeroswatcher',
          streamerName: 'WesterosWatcher',
          title: 'Epic Fantasy Study Night - Join Co-Writing Sprinters!',
          bookId: 'a-game-of-thrones',
          viewerCount: 2800,
          isLive: true
        },
        {
          id: 'mock_elvenlibrarian',
          streamerName: 'ElvenLibrarian',
          title: 'Rivendell Study Room: Cozy Fireplace & Silent Reading',
          bookId: 'the-fellowship-of-the-ring',
          viewerCount: 1850,
          isLive: true
        }
      ];

      setLiveStreams([...mockStreams, ...active]);
    });

    return () => unsubscribe();
  }, []);

  // 2. Listen for followed channels dynamically
  useEffect(() => {
    if (!user) {
      setFollowedStreams([]);
      return;
    }

    // Subscribe to follows collection
    const followsRef = collection(db, 'users', user.uid, 'follows');
    const unsubscribeFollows = onSnapshot(followsRef, (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach((doc) => {
        ids.push(doc.id);
      });

      if (ids.length === 0) {
        setFollowedStreams([]);
        return;
      }

      // Query streams for those followed IDs
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

    return () => unsubscribeFollows();
  }, [user]);

  const recommendedStreams = liveStreams.filter(s => !followedStreams.some(f => f.id === s.id));

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle-container">
        {!collapsed && <span className="sidebar-heading">For You</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="sidebar-toggle-btn">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <Link to="/" className={`sidebar-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          {!collapsed && <span>Browse</span>}
        </Link>
        <Link to="/dashboard" className={`sidebar-nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <Tv size={20} />
          {!collapsed && <span>Go Live (Dashboard)</span>}
        </Link>
        <Link to="/clubs" className={`sidebar-nav-item ${location.pathname === '/clubs' ? 'active' : ''}`}>
          <Users size={20} />
          {!collapsed && <span>Book Clubs</span>}
        </Link>
      </nav>

      <hr className="sidebar-divider" />

      {/* Followed Channels */}
      {user && followedStreams.length > 0 && (
        <div className="sidebar-channels-section" style={{ flex: 'none', maxHeight: '200px' }}>
          {!collapsed && (
            <div className="sidebar-section-header">
              <Heart size={14} color="var(--accent-primary)" fill="var(--accent-primary)" />
              <span>Followed Channels</span>
            </div>
          )}
          <div className="sidebar-channels-list">
            {followedStreams.map((stream) => {
              const activeBook = books.find(b => b.id === stream.bookId);
              return (
                <Link 
                  key={stream.id} 
                  to={`/stream/${stream.id}`} 
                  className={`sidebar-channel-item ${location.pathname === `/stream/${stream.id}` ? 'active' : ''}`}
                >
                  <div className="channel-avatar">
                    <User size={18} />
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
                      <span className="channel-stream-title">{stream.isLive ? stream.title : 'Offline'}</span>
                      {stream.isLive && (
                        <span className="channel-book">
                          📖 {activeBook?.title || 'Reading...'}
                        </span>
                      )}
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
            <Flame size={16} color="var(--accent-secondary)" />
            <span>Recommended Channels</span>
          </div>
        )}
        
        <div className="sidebar-channels-list">
          {recommendedStreams.map((stream) => {
            const activeBook = books.find(b => b.id === stream.bookId);
            return (
              <Link 
                key={stream.id} 
                to={`/stream/${stream.id}`} 
                className={`sidebar-channel-item ${location.pathname === `/stream/${stream.id}` ? 'active' : ''}`}
              >
                <div className="channel-avatar">
                  <User size={18} />
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
                    <span className="channel-stream-title">{stream.title}</span>
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
