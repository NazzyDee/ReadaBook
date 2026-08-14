import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Flame, Compass, Radio, Users, BookOpen, Search, Video, Clock } from 'lucide-react';
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

interface Recording {
  id: string;
  title: string;
  genre: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  duration: number;
  readerId: string;
  readerName: string;
  createdAt: any;
}

export const BrowsePage: React.FC = () => {
  const [liveStreams, setLiveStreams] = useState<ActiveStream[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
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

  // 3. Listen for recordings in Firestore
  useEffect(() => {
    const q = query(collection(db, 'recordings'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Recording[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Recording);
      });
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds || 0);
        return timeB - timeA;
      });
      setRecordings(list);
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

      {/* Recorded Storytimes Grid */}
      <section className="browse-section" style={{ marginTop: '40px' }}>
        <h2 className="section-title" style={{ color: 'var(--accent-secondary)' }}>
          <Video size={22} color="var(--accent-secondary)" />
          <span>Recorded Storytimes (Watch Later)</span>
        </h2>

        {recordings.length === 0 ? (
          <div className="empty-state">
            <Video size={48} color="var(--text-muted)" />
            <p>No recorded sessions found. Go to the dashboard to record your first storytime reading!</p>
          </div>
        ) : (
          <div className="streams-grid">
            {recordings.map((rec) => {
              const minutes = Math.floor(rec.duration / 60);
              const seconds = rec.duration % 60;
              const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

              return (
                <Link key={rec.id} to={`/watch/${rec.id}`} className="stream-card-link">
                  <div className="stream-card" style={{ border: '1px solid rgba(138, 43, 226, 0.15)' }}>
                    <div className="stream-thumbnail-container">
                      <img src="/assets/streamer_feed.jpg" alt={rec.title} className="stream-thumbnail" style={{ filter: 'grayscale(30%)' }} />
                      <div className="live-indicator" style={{ background: 'var(--accent-secondary)' }}>RECORDED</div>
                      <div className="viewer-count" style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <Clock size={12} />
                        <span>{formattedDuration}</span>
                      </div>
                      <div className="mini-book-badge">
                        <img src={rec.bookCoverUrl} alt="Cover" />
                      </div>
                    </div>

                    <div className="stream-card-info">
                      <div className="stream-avatar" style={{ border: '2px solid var(--accent-secondary)' }}>
                        <div className="avatar-placeholder" style={{ background: 'var(--accent-secondary)' }}>
                          {rec.readerName.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="stream-metadata">
                        <h4 className="stream-card-title">{rec.title}</h4>
                        <p className="stream-card-host">Recorded by {rec.readerName}</p>
                        <p className="stream-card-book">📖 {rec.bookTitle}</p>
                        <span className="stream-card-tag" style={{ background: 'rgba(138, 43, 226, 0.1)', color: 'var(--accent-secondary)' }}>
                          {rec.genre}
                        </span>
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
