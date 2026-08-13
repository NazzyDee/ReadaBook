import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Star, Compass, Radio, Users, BookOpen, Search } from 'lucide-react';
import { books, type Book } from '../lib/booksData';

interface ActiveStream {
  id: string;
  streamerName: string;
  title: string;
  bookId: string;
  genre: string;
  viewerCount: number;
  isLive: boolean;
}

export const BrowsePage: React.FC = () => {
  const [liveStreams, setLiveStreams] = useState<ActiveStream[]>([]);
  const [customBooks, setCustomBooks] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Simulated kids channels
  const mockStreams = [
    {
      id: "mock-kids-1",
      streamerName: "StoryTimeRabbit",
      title: "🐰 Let's Read Peter Pan Together! (Bubbly Voice)",
      bookId: "peter-pan",
      genre: "Adventure",
      viewerCount: 245,
      isLive: true
    },
    {
      id: "mock-kids-2",
      streamerName: "NurseryTales",
      title: "🧸 The Secret Garden | Relaxing Voice before bedtime",
      bookId: "secret-garden",
      genre: "Nature / Friendship",
      viewerCount: 189,
      isLive: true
    },
    {
      id: "mock-kids-3",
      streamerName: "MagicVelveteen",
      title: "✨ Story of a Real Rabbit! Reading The Velveteen Rabbit",
      bookId: "velveteen-rabbit",
      genre: "Classics",
      viewerCount: 92,
      isLive: true
    }
  ];

  const genres = [
    { name: "Adventure", count: "1.2k listening", color: "#ff477e" },
    { name: "Nature / Friendship", count: "890 listening", color: "#00b4d8" },
    { name: "Classics", count: "2.1k listening", color: "#ffb703" }
  ];

  // 1. Listen for live kids streams in Firestore
  useEffect(() => {
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

  // 2. Listen for custom books in Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'books_kids'), (snapshot) => {
      const list: Book[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Book);
      });
      setCustomBooks(list);
    });

    return () => unsubscribe();
  }, []);

  const allLiveStreams = [
    ...liveStreams,
    ...mockStreams.filter(m => !liveStreams.some(r => r.id === m.id))
  ];

  const allBooks = [...books, ...customBooks];

  // Filter streams
  const filteredStreams = allLiveStreams.filter((s) => {
    const matchesGenre = selectedGenre 
      ? s.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      : true;

    const activeBook = allBooks.find(b => b.id === s.bookId);
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? s.title.toLowerCase().includes(searchLower) ||
        s.streamerName.toLowerCase().includes(searchLower) ||
        s.genre.toLowerCase().includes(searchLower) ||
        (activeBook?.title.toLowerCase().includes(searchLower) || false) ||
        (activeBook?.author.toLowerCase().includes(searchLower) || false)
      : true;

    return matchesGenre && matchesSearch;
  });

  const featuredStream = allLiveStreams[0];
  const featuredBook = featuredStream ? allBooks.find(b => b.id === featuredStream.bookId) : null;

  return (
    <div className="browse-container">
      {/* Search Header Banner */}
      {searchQuery && (
        <div className="search-results-header">
          <h2>
            <Search size={20} style={{ marginRight: '8px' }} />
            Results for "{searchQuery}"
          </h2>
          <p className="search-results-subtext">Found {filteredStreams.length} stories active</p>
        </div>
      )}

      {/* Featured Kids Banner */}
      {!searchQuery && featuredStream && (
        <div className="featured-banner">
          <div className="banner-content">
            <div className="live-pill">
              <Radio size={14} />
              <span>🌈 STORYTIME CAROUSEL</span>
            </div>
            <h1 className="banner-title">{featuredStream.title}</h1>
            <p className="banner-streamer">Host: 🌟 <strong>{featuredStream.streamerName}</strong></p>
            <p className="banner-description">
              Join us in reading 📖 <strong>{featuredBook?.title}</strong> by {featuredBook?.author}. 
              React with cute emojis and listen to the storyteller!
            </p>
            <Link to={`/stream/${featuredStream.id}`} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '16px' }}>
              Listen Now! 🎉
            </Link>
          </div>
          <div className="banner-preview-video">
            <img src="/assets/streamer_feed.jpg" alt="Featured Stream" />
            <div className="banner-overlay-badge">
              <Users size={14} />
              <span>{featuredStream.viewerCount} Kids Listening</span>
            </div>
          </div>
        </div>
      )}

      {/* Genres / Categories */}
      <section className="browse-section">
        <h2 className="section-title" style={{ borderLeftColor: 'var(--accent-secondary)' }}>
          <Compass size={22} color="var(--accent-secondary)" />
          <span>Story Categories</span>
        </h2>
        <div className="genres-grid">
          <div 
            onClick={() => setSelectedGenre(null)} 
            className={`genre-card ${!selectedGenre ? 'active' : ''}`}
            style={{ 
              background: 'linear-gradient(135deg, #e0f0ff 0%, #ffffff 100%)', 
              border: !selectedGenre ? '3px solid var(--accent-secondary)' : '2px solid var(--border-color)',
              cursor: 'pointer' 
            }}
          >
            <h3>All Stories</h3>
            <span>{allLiveStreams.length} streams</span>
          </div>
          {genres.map((g) => (
            <div 
              key={g.name}
              onClick={() => setSelectedGenre(g.name)}
              className={`genre-card ${selectedGenre === g.name ? 'active' : ''}`}
              style={{ 
                background: `linear-gradient(135deg, ${g.color}15 0%, #ffffff 100%)`,
                border: selectedGenre === g.name ? `3px solid ${g.color}` : '2px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <h3 style={{ color: g.color }}>{g.name}</h3>
              <span>{g.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Live Channels Grid */}
      <section className="browse-section">
        <h2 className="section-title" style={{ borderLeftColor: 'var(--accent-primary)' }}>
          <Star size={22} color="var(--accent-primary)" fill="var(--accent-primary)" />
          <span>Popular Storytellers</span>
        </h2>
        
        {filteredStreams.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} color="var(--text-muted)" />
            <p>No storytellers online right now. Parents can go live to tell a story!</p>
            <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', marginTop: '12px' }}>
              Parent Room
            </Link>
          </div>
        ) : (
          <div className="streams-grid">
            {filteredStreams.map((stream) => {
              const activeBook = allBooks.find(b => b.id === stream.bookId);
              return (
                <Link key={stream.id} to={`/stream/${stream.id}`} className="stream-card-link">
                  <div className="stream-card">
                    <div className="stream-thumbnail-container">
                      <img src="/assets/streamer_feed.jpg" alt={stream.title} className="stream-thumbnail" />
                      <div className="live-indicator">LIVE 🎈</div>
                      <div className="viewer-count" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        <Users size={12} />
                        <span>{stream.viewerCount}</span>
                      </div>
                      
                      <div className="mini-book-badge">
                        <img src={activeBook?.coverUrl} alt="Cover" />
                      </div>
                    </div>
                    
                    <div className="stream-card-info">
                      <div className="stream-avatar" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                        <div className="avatar-placeholder">{stream.streamerName.substring(0,2).toUpperCase()}</div>
                      </div>
                      <div className="stream-metadata">
                        <h4 className="stream-card-title">{stream.title}</h4>
                        <p className="stream-card-host">Host: 🌟 {stream.streamerName}</p>
                        <p className="stream-card-book">📖 {activeBook?.title}</p>
                        <span className="stream-card-tag" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent-primary)' }}>{stream.genre}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
