import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Home, Tv, ChevronLeft, ChevronRight, Smile, Star } from 'lucide-react';
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
  const location = useLocation();

  // Bubbly friendly kids channels
  const mockStreams = [
    {
      id: "mock-kids-1",
      streamerName: "StoryTimeRabbit",
      title: "🐰 Let's Read Peter Pan Together! (Bubbly Voice)",
      bookId: "peter-pan",
      viewerCount: 245,
      isLive: true
    },
    {
      id: "mock-kids-2",
      streamerName: "NurseryTales",
      title: "🧸 The Secret Garden | Relaxing Voice before bedtime",
      bookId: "secret-garden",
      viewerCount: 189,
      isLive: true
    },
    {
      id: "mock-kids-3",
      streamerName: "MagicVelveteen",
      title: "✨ Story of a Real Rabbit! Reading The Velveteen Rabbit",
      bookId: "velveteen-rabbit",
      viewerCount: 92,
      isLive: true
    }
  ];

  useEffect(() => {
    // Only fetch streams that are designated for kids if they went live from kids dashboard
    const q = query(collection(db, 'streams_kids'), where('isLive', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const active: ActiveStream[] = [];
      snapshot.forEach((doc) => {
        active.push({ id: doc.id, ...doc.data() } as ActiveStream);
      });
      setLiveStreams(active);
    });

    return () => unsubscribe();
  }, []);

  const recommendedStreams = [
    ...liveStreams,
    ...mockStreams.filter(m => !liveStreams.some(r => r.id === m.id))
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle-container">
        {!collapsed && <span className="sidebar-heading">🌈 Friendly Streams</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="sidebar-toggle-btn">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`sidebar-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          {!collapsed && <span>Home</span>}
        </Link>
        <Link to="/dashboard" className={`sidebar-nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <Tv size={20} />
          {!collapsed && <span>Parent Room</span>}
        </Link>
      </nav>

      <hr className="sidebar-divider" />

      <div className="sidebar-channels-section">
        {!collapsed && (
          <div className="sidebar-section-header">
            <Star size={16} color="var(--accent-tertiary)" fill="var(--accent-tertiary)" />
            <span>Active Readers</span>
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
                  <Smile size={18} />
                  <div className="live-badge-dot"></div>
                </div>
                
                {!collapsed && (
                  <div className="channel-info">
                    <div className="channel-name-row">
                      <span className="channel-name">{stream.streamerName}</span>
                      <span className="channel-viewers">
                        {stream.viewerCount} 🎈
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
