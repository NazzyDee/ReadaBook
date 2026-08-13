import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Home, Tv, ChevronLeft, ChevronRight, User, Flame, Heart } from 'lucide-react';
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

  // Simulated recommended channels to make the site look like Twitch
  const mockStreams = [
    {
      id: "mock-stream-1",
      streamerName: "LibraryLofi",
      title: "Cozy Lofi Reading Session ☕ | Frankenstein",
      bookId: "frankenstein",
      viewerCount: 1420,
      isLive: true
    },
    {
      id: "mock-stream-2",
      streamerName: "AliceInWonderReader",
      title: "Falling down the Rabbit Hole! ✨ Live Q&A",
      bookId: "alice-in-wonderland",
      viewerCount: 843,
      isLive: true
    },
    {
      id: "mock-stream-3",
      streamerName: "SherlockQuotes",
      title: "Solving cases live. Reading H.G. Wells tonight!",
      bookId: "the-time-machine",
      viewerCount: 312,
      isLive: true
    }
  ];

  // 1. Listen for ALL live streams in Firestore (for recommendations)
  useEffect(() => {
    const q = query(collection(db, 'streams'), where('isLive', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const active: ActiveStream[] = [];
      snapshot.forEach((doc) => {
        active.push({ id: doc.id, ...doc.data() } as ActiveStream);
      });
      setLiveStreams(active);
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

  // Merge real live streams with mock ones (excluding duplication)
  const recommendedStreams = [
    ...liveStreams.filter(s => !followedStreams.some(f => f.id === s.id)),
    ...mockStreams.filter(m => !liveStreams.some(r => r.id === m.id) && !followedStreams.some(f => f.id === m.id))
  ];

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
