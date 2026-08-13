import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Flame, Compass, Radio, Users, BookOpen, Search } from 'lucide-react';
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

  // Simulated recommended channels
  const mockStreams = [
    {
      id: "mock-stream-1",
      streamerName: "LibraryLofi",
      title: "Cozy Lofi Reading Session ☕ | Frankenstein",
      bookId: "frankenstein",
      genre: "Sci-Fi / Classics",
      viewerCount: 1420,
      isLive: true
    },
    {
      id: "mock-stream-2",
      streamerName: "AliceInWonderReader",
      title: "Falling down the Rabbit Hole! ✨ Live Q&A",
      bookId: "alice-in-wonderland",
      genre: "Fantasy",
      viewerCount: 843,
      isLive: true
    },
    {
      id: "mock-stream-3",
      streamerName: "SherlockQuotes",
      title: "Solving cases live. Reading H.G. Wells tonight!",
      bookId: "the-time-machine",
      genre: "Sci-Fi",
      viewerCount: 312,
      isLive: true
    }
  ];

  const genres = [
    { name: "Fantasy", count: "1.2k readers", color: "from-purple-600 to-indigo-600" },
    { name: "Sci-Fi", count: "980 readers", color: "from-blue-600 to-cyan-500" },
    { name: "Classics", count: "2.4k readers", color: "from-amber-600 to-orange-500" },
    { name: "Mystery", count: "650 readers", color: "from-red-600 to-pink-600" }
  ];

  // 1. Listen for live streams in Firestore
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

  // 2. Listen for custom books in Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
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

  // Filter by genre AND search query
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
      {/* Search Header Banner (when searching) */}
      {searchQuery && (
        <div className="search-results-header">
          <h2>
            <Search size={20} style={{ marginRight: '8px' }} />
            Search Results for "{searchQuery}"
          </h2>
          <p className="search-results-subtext">Found {filteredStreams.length} active streams</p>
        </div>
      )}

      {/* Featured Stream Banner (Only show if not searching) */}
      {!searchQuery && featuredStream && (
        <div className="featured-banner">
          <div className="banner-content">
            <div className="live-pill">
              <Radio size={14} />
              <span>FEATURED LIVE STREAM</span>
            </div>
            <h1 className="banner-title">{featuredStream.title}</h1>
            <p className="banner-streamer">by <strong>{featuredStream.streamerName}</strong></p>
            <p className="banner-description">
              Currently reading 📖 <strong>{featuredBook?.title}</strong> by {featuredBook?.author}. 
              Join the live discussion, see the text update in real time, and chat with {(featuredStream.viewerCount / 1000).toFixed(1)}k other readers!
            </p>
            <Link to={`/stream/${featuredStream.id}`} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '16px' }}>
              Watch Live
            </Link>
          </div>
          <div className="banner-preview-video">
            <img src="/assets/streamer_feed.jpg" alt="Featured Stream" />
            <div className="banner-overlay-badge">
              <Users size={14} />
              <span>{(featuredStream.viewerCount).toLocaleString()} Watching</span>
            </div>
          </div>
        </div>
      )}

      {/* Genres / Categories */}
      <section className="browse-section">
        <h2 className="section-title">
          <Compass size={22} color="var(--accent-secondary)" />
          <span>Browse Book Genres</span>
        </h2>
        <div className="genres-grid">
          <div 
            onClick={() => setSelectedGenre(null)} 
            className={`genre-card bg-gradient-to-r from-gray-700 to-gray-900 ${!selectedGenre ? 'active' : ''}`}
            style={{ background: 'linear-gradient(135deg, #2a2438 0%, #15101f 100%)', cursor: 'pointer' }}
          >
            <h3>All Genres</h3>
            <span>{allLiveStreams.length} active streams</span>
          </div>
          {genres.map((g) => (
            <div 
              key={g.name}
              onClick={() => setSelectedGenre(g.name)}
              className={`genre-card ${selectedGenre === g.name ? 'active' : ''}`}
              style={{ 
                background: `linear-gradient(135deg, ${g.name === 'Fantasy' ? '#8a2be2' : g.name === 'Sci-Fi' ? '#00e5ff' : g.name === 'Classics' ? '#ff8c00' : '#ff3b3b'}33 0%, var(--bg-panel) 100%)`,
                border: selectedGenre === g.name ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <h3 style={{ color: selectedGenre === g.name ? 'var(--text-main)' : 'var(--text-muted)' }}>{g.name}</h3>
              <span>{g.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Live Channels Grid */}
      <section className="browse-section">
        <h2 className="section-title">
          <Flame size={22} color="var(--accent-danger)" />
          <span>{selectedGenre ? `${selectedGenre} Live Streams` : 'Popular Live Streams'}</span>
        </h2>
        
        {filteredStreams.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} color="var(--text-muted)" />
            <p>No active streams found. Try searching for something else or be the first to go live!</p>
            <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', marginTop: '12px' }}>
              Go Live
            </Link>
          </div>
        ) : (
          <div className="streams-grid">
            {filteredStreams.map((stream) => {
              const activeBook = allBooks.find(b => b.id === stream.bookId);
              return (
                <Link key={stream.id} to={`/stream/${stream.id}`} className="stream-card-link">
                  <div className="stream-card">
                    {/* Thumbnail */}
                    <div className="stream-thumbnail-container">
                      <img src="/assets/streamer_feed.jpg" alt={stream.title} className="stream-thumbnail" />
                      <div className="live-indicator">LIVE</div>
                      <div className="viewer-count">
                        <Users size={12} />
                        <span>{stream.viewerCount}</span>
                      </div>
                      
                      {/* Embedded Mini Book Cover overlay */}
                      <div className="mini-book-badge">
                        <img src={activeBook?.coverUrl} alt="Cover" />
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="stream-card-info">
                      <div className="stream-avatar">
                        <div className="avatar-placeholder">{stream.streamerName.substring(0,2).toUpperCase()}</div>
                      </div>
                      <div className="stream-metadata">
                        <h4 className="stream-card-title">{stream.title}</h4>
                        <p className="stream-card-host">{stream.streamerName}</p>
                        <p className="stream-card-book">📖 {activeBook?.title}</p>
                        <span className="stream-card-tag">{stream.genre}</span>
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
