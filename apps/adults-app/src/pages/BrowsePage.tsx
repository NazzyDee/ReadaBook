import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { STREAMERS } from '../lib/streamersData';
import { getLocalClips } from '../lib/clipsData';
import { SQUAD_STREAMS } from '../lib/squadsData';
import { books, type Book } from '../lib/booksData';
import {
  Compass,
  Radio,
  Users,
  BookOpen,
  Search,
  Video,
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
  Filter,
  Globe
} from 'lucide-react';

interface ActiveStream {
  id: string;
  streamerName: string;
  title: string;
  bookId: string;
  genre: string;
  viewerCount: number;
  isLive: boolean;
  avatarUrl?: string;
  tags?: string[];
  language?: string;
}

export const BrowsePage: React.FC = () => {
  const [liveStreams, setLiveStreams] = useState<ActiveStream[]>([]);
  const [customBooks, setCustomBooks] = useState<Book[]>([]);
  const [activeBrowseTab, setActiveBrowseTab] = useState<'channels' | 'categories' | 'clips' | 'squads'>('channels');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'viewers' | 'newest' | 'recommended'>('viewers');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselMuted, setCarouselMuted] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // 1. Listen for live streams in Firestore + fallback mock streams
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
          genre: 'Fantasy',
          viewerCount: 1420,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          tags: ['CozyVibes', 'VoiceActing', 'Fantasy', 'LofiStudy'],
          language: 'English'
        },
        {
          id: 'mock_bookishbard',
          streamerName: 'BookishBard',
          title: 'Adventure Quest! Epic Reading & Voice Acting 🐉',
          bookId: 'the-hobbit',
          genre: 'Fantasy',
          viewerCount: 3500,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
          tags: ['EpicFantasy', 'VoiceActing', 'Tolkien', 'Interactive'],
          language: 'English'
        },
        {
          id: 'mock_sorcererspells',
          streamerName: 'SorcererSpells',
          title: 'Magical Reading & Soundscape Synthesizers ✨',
          bookId: 'harry-potter-and-the-sorcerer-s-stone',
          genre: 'Fantasy',
          viewerCount: 5600,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
          tags: ['Magic', 'Soundscapes', 'CozyLofi', 'Audiobook'],
          language: 'English'
        },
        {
          id: 'mock_westeroswatcher',
          streamerName: 'WesterosWatcher',
          title: 'Epic Fantasy Study Night - Join Co-Writing Sprinters!',
          bookId: 'a-game-of-thrones',
          genre: 'Fantasy',
          viewerCount: 2800,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
          tags: ['DarkFantasy', 'Discussion', 'StudySprint', 'Pomodoro'],
          language: 'English'
        },
        {
          id: 'mock_elvenlibrarian',
          streamerName: 'ElvenLibrarian',
          title: 'Rivendell Study Room: Cozy Fireplace & Silent Reading',
          bookId: 'the-fellowship-of-the-ring',
          genre: 'Fantasy',
          viewerCount: 1850,
          isLive: true,
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
          tags: ['SilentStudy', 'LofiHarp', 'CozyVibes', 'Poetry'],
          language: 'English'
        }
      ];

      // Merge avoiding duplicates
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

  // Carousel auto-advance
  useEffect(() => {
    if (liveStreams.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % Math.min(5, liveStreams.length));
    }, 8000);
    return () => clearInterval(interval);
  }, [liveStreams]);

  const allBooks = [...books, ...customBooks];
  const allClips = getLocalClips();

  const categories = [
    { name: 'Fantasy', count: 18, banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', viewers: '14.2k' },
    { name: 'Sci-Fi', count: 12, banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', viewers: '8.9k' },
    { name: 'Classics', count: 24, banner: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80', viewers: '11.5k' },
    { name: 'Mystery & Thriller', count: 15, banner: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?auto=format&fit=crop&w=600&q=80', viewers: '6.4k' },
    { name: 'Silent Study & Lofi', count: 9, banner: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80', viewers: '19.8k' },
    { name: 'Young Adult', count: 14, banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80', viewers: '7.1k' }
  ];

  // Filtering
  const filteredStreams = liveStreams.filter(s => {
    const activeBook = allBooks.find(b => b.id === s.bookId);
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch = searchQuery
      ? s.title.toLowerCase().includes(searchLower) ||
        s.streamerName.toLowerCase().includes(searchLower) ||
        s.genre.toLowerCase().includes(searchLower) ||
        (activeBook?.title.toLowerCase().includes(searchLower) || false) ||
        (activeBook?.author.toLowerCase().includes(searchLower) || false)
      : true;

    const matchesGenre = selectedGenre
      ? s.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      : true;

    const matchesTag = selectedTag
      ? s.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase())
      : true;

    const matchesLang = selectedLanguage === 'all' || !s.language
      ? true
      : s.language.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesGenre && matchesTag && matchesLang;
  });

  // Sorting
  filteredStreams.sort((a, b) => {
    if (sortBy === 'viewers') return b.viewerCount - a.viewerCount;
    return 0;
  });

  const featuredStream = liveStreams[carouselIndex] || liveStreams[0];
  const featuredBook = featuredStream ? allBooks.find(b => b.id === featuredStream.bookId) : null;
  const featuredStreamerProfile = featuredStream ? STREAMERS[featuredStream.id] : null;

  return (
    <div className="twitch-browse-page">
      {/* Search Header (if search active) */}
      {searchQuery && (
        <div className="search-results-banner">
          <h2>
            <Search size={22} />
            <span>Search results for "{searchQuery}"</span>
          </h2>
          <p>Showing {filteredStreams.length} matching live streams & books</p>
        </div>
      )}

      {/* Twitch Carousel (Show when not searching) */}
      {!searchQuery && featuredStream && (
        <div className="twitch-hero-carousel">
          <div className="carousel-video-canvas">
            <img
              src={featuredStreamerProfile?.bannerUrl || featuredBook?.coverUrl || ''}
              alt=""
              className="carousel-bg-blur"
            />
            <div className="carousel-video-overlay" />

            <div className="carousel-content-grid">
              <div className="carousel-stream-info">
                <div className="carousel-live-pill">
                  <span className="rec-dot-animated"></span>
                  <span>FEATURED LIVE STREAM</span>
                </div>

                <h1 className="carousel-stream-title">{featuredStream.title}</h1>
                <p className="carousel-streamer-author">
                  Storyteller <strong>{featuredStream.streamerName}</strong> • Reading 📖 <em>{featuredBook?.title}</em>
                </p>

                <p className="carousel-bio-text">
                  {featuredStreamerProfile?.bio || 'Join hundreds of fellow readers enjoying the live synchronized e-book, voice acting, and interactive community chat.'}
                </p>

                <div className="carousel-action-row">
                  <Link
                    to={`/stream/${featuredStream.id}`}
                    className="btn-primary btn-carousel-watch"
                  >
                    <Play size={16} fill="white" />
                    <span>Watch Stream</span>
                  </Link>

                  <button
                    onClick={() => setCarouselMuted(!carouselMuted)}
                    className="btn-secondary btn-carousel-mute"
                    title={carouselMuted ? 'Unmute Audio Preview' : 'Mute'}
                  >
                    {carouselMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
              </div>

              <div className="carousel-preview-card">
                <img
                  src={featuredBook?.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                  alt={featuredBook?.title || 'Featured Book'}
                  className="carousel-book-cover"
                />
                <div className="carousel-viewer-badge">
                  <Users size={13} />
                  <span>{(featuredStream.viewerCount).toLocaleString()} Watching</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Pagination Controls */}
          <div className="carousel-nav-arrows">
            <button
              onClick={() => setCarouselIndex(prev => (prev - 1 + Math.min(5, liveStreams.length)) % Math.min(5, liveStreams.length))}
              className="carousel-arrow-btn"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCarouselIndex(prev => (prev + 1) % Math.min(5, liveStreams.length))}
              className="carousel-arrow-btn"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="carousel-dots-row">
            {liveStreams.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${carouselIndex === idx ? 'active' : ''}`}
                onClick={() => setCarouselIndex(idx)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Twitch Directory Navigation Tab Bar */}
      <div className="directory-nav-tabs">
        <button
          className={`directory-tab ${activeBrowseTab === 'channels' ? 'active' : ''}`}
          onClick={() => setActiveBrowseTab('channels')}
        >
          <Radio size={16} />
          <span>Live Channels</span>
        </button>
        <button
          className={`directory-tab ${activeBrowseTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveBrowseTab('categories')}
        >
          <Compass size={16} />
          <span>Categories & Genres</span>
        </button>
        <button
          className={`directory-tab ${activeBrowseTab === 'clips' ? 'active' : ''}`}
          onClick={() => setActiveBrowseTab('clips')}
        >
          <Video size={16} />
          <span>Trending Clips</span>
        </button>
        <button
          className={`directory-tab ${activeBrowseTab === 'squads' ? 'active' : ''}`}
          onClick={() => setActiveBrowseTab('squads')}
        >
          <Users size={16} />
          <span>Squad Streams</span>
        </button>
      </div>

      {/* Filter & Tags Bar */}
      <div className="filter-tags-toolbar">
        <div className="tags-scroll-row">
          <button
            className={`filter-tag-pill ${!selectedTag && !selectedGenre ? 'active' : ''}`}
            onClick={() => {
              setSelectedTag(null);
              setSelectedGenre(null);
            }}
          >
            All Streams
          </button>
          {['VoiceActing', 'EpicFantasy', 'SilentStudy', 'LofiStudy', 'Pomodoro', 'TableRead', 'Magic', 'Classics'].map(tag => (
            <button
              key={tag}
              className={`filter-tag-pill ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="toolbar-controls-right">
          {/* Language Selector */}
          <div className="lang-filter-wrapper">
            <Globe size={14} />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="browse-sort-select"
            >
              <option value="all">All Languages</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="sort-dropdown-wrapper">
            <Filter size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="browse-sort-select"
            >
              <option value="viewers">Viewers (High to Low)</option>
              <option value="recommended">Recommended For You</option>
              <option value="newest">Recently Started</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE CHANNELS GRID */}
      {activeBrowseTab === 'channels' && (
        <section className="twitch-channels-section">
          {filteredStreams.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} color="var(--text-muted)" />
              <h3>No active reading streams found</h3>
              <p>Try selecting a different filter or be the first to broadcast from your Creator Studio!</p>
              <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', marginTop: '16px' }}>
                Go Live Now
              </Link>
            </div>
          ) : (
            <div className="twitch-stream-cards-grid">
              {filteredStreams.map(stream => {
                const activeBook = allBooks.find(b => b.id === stream.bookId);
                const avatar = stream.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

                return (
                  <Link key={stream.id} to={`/stream/${stream.id}`} className="twitch-stream-card-link">
                    <div className="twitch-stream-card">
                      {/* Video Thumbnail Canvas */}
                      <div className="twitch-thumb-container">
                        <img
                          src={activeBook?.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                          alt={stream.title}
                          className="twitch-card-thumb"
                          loading="lazy"
                        />
                        <div className="twitch-card-badge-live">LIVE</div>
                        <div className="twitch-card-badge-viewers">
                          <Users size={11} />
                          <span>{(stream.viewerCount).toLocaleString()}</span>
                        </div>
                        <div className="twitch-thumb-hover-overlay">
                          <Play size={32} fill="white" />
                        </div>
                      </div>

                      {/* Info Row */}
                      <div className="twitch-card-info-row">
                        <img src={avatar} alt={stream.streamerName} className="twitch-card-avatar" />

                        <div className="twitch-card-meta">
                          <h4 className="twitch-card-stream-title">{stream.title}</h4>
                          <span className="twitch-card-streamer-name">{stream.streamerName}</span>
                          <span className="twitch-card-book-subtitle">📖 {activeBook?.title || 'Story'}</span>

                          <div className="twitch-card-tags">
                            <span className="twitch-category-chip">{stream.genre}</span>
                            {stream.tags?.slice(0, 2).map(t => (
                              <span key={t} className="twitch-tag-chip">#{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: CATEGORIES & GENRES GRID */}
      {activeBrowseTab === 'categories' && (
        <section className="twitch-categories-section">
          <div className="categories-mosaic-grid">
            {categories.map(cat => (
              <div
                key={cat.name}
                className="category-mosaic-card"
                onClick={() => {
                  setSelectedGenre(cat.name);
                  setActiveBrowseTab('channels');
                }}
              >
                <img src={cat.banner} alt={cat.name} className="category-mosaic-img" />
                <div className="category-mosaic-overlay" />
                <div className="category-mosaic-info">
                  <h3>{cat.name}</h3>
                  <div className="category-mosaic-stats">
                    <span>{cat.viewers} Live Viewers</span>
                    <span className="dot-separator">•</span>
                    <span>{cat.count} Active Titles</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: CLIPS PREVIEW */}
      {activeBrowseTab === 'clips' && (
        <section className="twitch-clips-section">
          <div className="clips-section-header">
            <h3>Trending Community Clips</h3>
            <Link to="/clips" className="btn-link-viewall">
              View all clips →
            </Link>
          </div>

          <div className="clips-grid">
            {allClips.slice(0, 6).map(clip => (
              <Link key={clip.id} to={`/clips?clip=${clip.id}`} className="clip-card-link">
                <div className="clip-card">
                  <div className="clip-thumb-wrapper">
                    <img src={clip.thumbnailUrl} alt={clip.title} className="clip-thumbnail" />
                    <div className="clip-duration-badge">{clip.duration}s</div>
                  </div>
                  <div className="clip-card-info">
                    <h4 className="clip-title">{clip.title}</h4>
                    <span className="clip-creator-meta">{clip.streamerName} • 📖 {clip.bookTitle}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: SQUAD STREAMS SPOTLIGHT */}
      {activeBrowseTab === 'squads' && (
        <section className="twitch-squads-section">
          <div className="squads-list-grid">
            {SQUAD_STREAMS.map(squad => (
              <Link key={squad.id} to="/squads" className="squad-card-link">
                <div className="squad-spotlight-card">
                  <div className="squad-avatars-cluster">
                    {squad.members.map(m => (
                      <img key={m.streamerId} src={m.avatarUrl} alt={m.streamerName} className="squad-cluster-avatar" />
                    ))}
                  </div>

                  <div className="squad-spotlight-details">
                    <div className="squad-live-badge-sm">SQUAD LIVE</div>
                    <h4>{squad.title}</h4>
                    <p className="squad-book-sub">📖 {squad.bookTitle} by {squad.bookAuthor}</p>
                    <span className="squad-viewers-count">{(squad.totalViewers).toLocaleString()} Watching</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
