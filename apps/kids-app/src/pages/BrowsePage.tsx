import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Star, Compass, Radio, Users, BookOpen, Search, Video, Clock } from 'lucide-react';
import { books, type Book } from '../lib/booksData';

interface ActiveStream {
  id: string;
  streamerName: string;
  title: string;
  bookId: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCoverUrl?: string;
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
  const { user } = useAuth();
  const [connectedAdults, setConnectedAdults] = useState<string[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [connectSuccess, setConnectSuccess] = useState('');
  const [connectError, setConnectError] = useState('');

  const [liveStreams, setLiveStreams] = useState<ActiveStream[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [customBooks, setCustomBooks] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('all');
  const [selectedReadingLevel, setSelectedReadingLevel] = useState<string>('all');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Listen to connected family members (including co-parents sharing the familyCode)
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    let unsubscribeFamily: (() => void) | null = null;

    const unsubscribeUser = onSnapshot(userRef, async (userSnap) => {
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const pUid = userData.parentUid || (userData.connectedAdults && userData.connectedAdults[0]);
        if (pUid) {
          try {
            const parentSnap = await getDoc(doc(db, 'users', pUid));
            if (parentSnap.exists()) {
              const parentCode = parentSnap.data().familyCode;
              if (parentCode) {
                if (unsubscribeFamily) unsubscribeFamily();
                
                const q = query(
                  collection(db, 'users'), 
                  where('familyCode', '==', parentCode), 
                  where('role', '==', 'adult')
                );
                unsubscribeFamily = onSnapshot(q, (famSnap) => {
                  const uids: string[] = [];
                  famSnap.forEach((d) => {
                    uids.push(d.id);
                  });
                  setConnectedAdults(uids);
                });
              }
            }
          } catch (err) {
            console.error("Error updating connected family members:", err);
          }
        }
      }
    });

    return () => {
      unsubscribeUser();
      if (unsubscribeFamily) unsubscribeFamily();
    };
  }, [user]);

  const handleConnectInviteCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectError('');
    setConnectSuccess('');
    if (!inviteCode || inviteCode.trim().length !== 6) {
      setConnectError('Invite code must be exactly 6 characters.');
      return;
    }
    
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('familyCode', '==', inviteCode.trim().toUpperCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setConnectError('Invite code not found. Please double check with your parent.');
        return;
      }
      
      const adultDoc = querySnapshot.docs[0];
      const adultId = adultDoc.id;
      
      if (user) {
        const kidDocRef = doc(db, 'users', user.uid);
        await updateDoc(kidDocRef, {
          connectedAdults: arrayUnion(adultId)
        });
        
        const adultDocRef = doc(db, 'users', adultId);
        await updateDoc(adultDocRef, {
          connectedChildren: arrayUnion(user.uid)
        });
        
        setConnectSuccess(`Successfully connected with ${adultDoc.data().email?.split('@')[0] || 'Parent'}!`);
        setInviteCode('');
      }
    } catch (err: any) {
      console.error("Failed to connect family code:", err);
      setConnectError(err.message || 'Failed to connect. Please try again.');
    }
  };



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

  // 3. Listen for recordings in Firestore
  useEffect(() => {
    // Listen to shared recordings (adults recorded stories for kids!)
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

  const allBooks = [...books, ...customBooks];

  const allLiveStreams = liveStreams.filter(s => {
    return s.id.startsWith('mock_') || connectedAdults.includes(s.id);
  });

  const filteredRecordings = recordings.filter(rec => {
    const isFromConnectedAdult = rec.readerId.startsWith('mock_') || connectedAdults.includes(rec.readerId);
    if (!isFromConnectedAdult) return false;

    const matchesGenre = selectedGenre
      ? rec.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      : true;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? rec.title.toLowerCase().includes(searchLower) ||
        rec.readerName.toLowerCase().includes(searchLower) ||
        rec.bookTitle.toLowerCase().includes(searchLower) ||
        rec.bookAuthor.toLowerCase().includes(searchLower) ||
        rec.genre.toLowerCase().includes(searchLower)
      : true;

    const book = allBooks.find(b => b.id === rec.bookId);
    const matchesAge = selectedAgeRange === 'all'
      ? true
      : book?.ageRange === selectedAgeRange;

    const matchesReadingLevel = selectedReadingLevel === 'all'
      ? true
      : book?.readingLevel === selectedReadingLevel;

    return matchesGenre && matchesSearch && matchesAge && matchesReadingLevel;
  });

  const genres = [
    { 
      name: "Adventure", 
      count: `${allBooks.filter(b => b.genre.toLowerCase().includes('adventure')).length} book${allBooks.filter(b => b.genre.toLowerCase().includes('adventure')).length !== 1 ? 's' : ''}`, 
      color: "#ff477e" 
    },
    { 
      name: "Nature / Friendship", 
      count: `${allBooks.filter(b => b.genre.toLowerCase().includes('nature') || b.genre.toLowerCase().includes('friendship')).length} book${allBooks.filter(b => b.genre.toLowerCase().includes('nature') || b.genre.toLowerCase().includes('friendship')).length !== 1 ? 's' : ''}`, 
      color: "#00b4d8" 
    },
    { 
      name: "Classics", 
      count: `${allBooks.filter(b => b.genre.toLowerCase().includes('classics')).length} book${allBooks.filter(b => b.genre.toLowerCase().includes('classics')).length !== 1 ? 's' : ''}`, 
      color: "#ffb703" 
    }
  ];

  // Filter streams
  const filteredStreams = allLiveStreams.filter((s) => {
    const matchesGenre = selectedGenre 
      ? s.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      : true;

    const activeBook = allBooks.find(b => b.id === s.bookId);
    const bookTitle = s.bookTitle || activeBook?.title || '';
    const bookAuthor = s.bookAuthor || activeBook?.author || '';

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? s.title.toLowerCase().includes(searchLower) ||
        s.streamerName.toLowerCase().includes(searchLower) ||
        s.genre.toLowerCase().includes(searchLower) ||
        bookTitle.toLowerCase().includes(searchLower) ||
        bookAuthor.toLowerCase().includes(searchLower)
      : true;

    const matchesAge = selectedAgeRange === 'all'
      ? true
      : activeBook?.ageRange === selectedAgeRange;

    const matchesReadingLevel = selectedReadingLevel === 'all'
      ? true
      : activeBook?.readingLevel === selectedReadingLevel;

    return matchesGenre && matchesSearch && matchesAge && matchesReadingLevel;
  });

  const featuredStream = allLiveStreams[0];
  const featuredBook = featuredStream ? allBooks.find(b => b.id === featuredStream.bookId) : null;

  return (
    <div className="browse-container">
      {/* Family Connection Code Section */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', marginBottom: '24px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>🧸 Connect with Family</h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Enter your parent's 6-character Family Code to see their live readings and recorded storybooks.
        </p>
        
        {connectError && <div style={{ color: 'var(--accent-danger)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '12px' }}>⚠️ {connectError}</div>}
        {connectSuccess && <div style={{ color: 'var(--accent-success)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '12px' }}>🎉 {connectSuccess}</div>}
        
        <form onSubmit={handleConnectInviteCode} style={{ display: 'flex', gap: '12px', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Invite Code (e.g. FA123B)" 
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', textTransform: 'uppercase', fontWeight: 'bold', background: '#fff', outline: 'none' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 20px', cursor: 'pointer' }}>Connect</button>
        </form>
      </div>

      {/* Curation Filters (FarFaria Style) */}
      <div className="filter-bar-container" style={{ background: '#fff', padding: '16px 24px', borderRadius: '16px', border: '2px solid rgba(0, 180, 216, 0.15)', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#ff477e', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📖 Level Filters:
        </span>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#666' }}>Age Group:</span>
            <select 
              className="filter-select"
              value={selectedAgeRange}
              onChange={(e) => setSelectedAgeRange(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Ages</option>
              <option value="2-4">Toddler (Ages 2-4)</option>
              <option value="5-7">Early Reader (Ages 5-7)</option>
              <option value="8-10">Independent (Ages 8-10)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#666' }}>A-Z Reading Level:</span>
            <select 
              className="filter-select"
              value={selectedReadingLevel}
              onChange={(e) => setSelectedReadingLevel(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Levels</option>
              <option value="Level I">Level I (Ages 2-4)</option>
              <option value="Level M">Level M (Ages 5-7)</option>
              <option value="Level P">Level P (Ages 8-10)</option>
              <option value="Level R">Level R (Ages 8-10)</option>
              <option value="Level S">Level S (Ages 8-10)</option>
              <option value="Level T">Level T (Ages 8-10)</option>
            </select>
          </div>
        </div>
      </div>
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
              Join us in reading 📖 <strong>{featuredStream.bookTitle || featuredBook?.title}</strong> by {featuredStream.bookAuthor || featuredBook?.author}. 
              React with cute emojis and listen to the storyteller!
            </p>
            <Link to={`/stream/${featuredStream.id}`} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '16px' }}>
              Listen Now! 🎉
            </Link>
          </div>
          <div className="banner-preview-video">
            <img src={featuredStream.bookCoverUrl || featuredBook?.coverUrl || ''} alt="Featured Stream" />
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
                      <img src={stream.bookCoverUrl || activeBook?.coverUrl || ''} alt={stream.title} className="stream-thumbnail" />
                      <div className="live-indicator">LIVE 🎈</div>
                      <div className="viewer-count" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        <Users size={12} />
                        <span>{stream.viewerCount}</span>
                      </div>
                      
                      {/* Curation Badges */}
                      {stream.bookId === 'physical-read' ? (
                        <span className="badge-reading-level" style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 5, backgroundColor: '#ff477e' }}>
                          Physical Copy
                        </span>
                      ) : (
                        activeBook?.readingLevel && (
                          <span className="badge-reading-level" style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 5 }}>
                            {activeBook.readingLevel}
                          </span>
                        )
                      )}
                      {activeBook?.ageRange && (
                        <span className="badge-age-range" style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 5 }}>
                          Ages {activeBook.ageRange}
                        </span>
                      )}
                      
                      <div className="mini-book-badge">
                        <img src={stream.bookCoverUrl || activeBook?.coverUrl || ''} alt="Cover" />
                      </div>
                    </div>
                    
                    <div className="stream-card-info">
                      <div className="stream-avatar" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                        <div className="avatar-placeholder">{stream.streamerName.substring(0,2).toUpperCase()}</div>
                      </div>
                      <div className="stream-metadata">
                        <h4 className="stream-card-title">{stream.title}</h4>
                        <p className="stream-card-host">Host: 🌟 {stream.streamerName}</p>
                        <p className="stream-card-book">📖 {stream.bookTitle || activeBook?.title}</p>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                          <span className="stream-card-tag" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent-primary)', fontSize: '0.7rem' }}>{stream.genre}</span>
                          <span className="stream-card-tag" style={{ backgroundColor: 'rgba(157, 78, 221, 0.1)', color: '#9d4edd', fontSize: '0.7rem' }}>
                            {stream.genre === 'Fantasy' ? '🔮 Magical' : stream.genre === 'Adventure' ? '⚔️ Adventurous' : '☕ Cozy'}
                          </span>
                          <span className="stream-card-tag" style={{ backgroundColor: 'rgba(255, 183, 3, 0.1)', color: '#ffb703', fontSize: '0.7rem' }}>
                            {stream.genre === 'Fantasy' ? '🐢 Slow-paced' : stream.genre === 'Adventure' ? '⚡ Fast-paced' : '🚶 Medium-paced'}
                          </span>
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

      {/* Recorded Storybooks Grid */}
      <section className="browse-section" style={{ marginTop: '40px' }}>
        <h2 className="section-title" style={{ borderLeftColor: 'var(--accent-secondary)' }}>
          <Video size={22} color="var(--accent-secondary)" />
          <span>Recorded Storybooks (Watch Later)</span>
        </h2>

        {filteredRecordings.length === 0 ? (
          <div className="empty-state">
            <Video size={48} color="var(--text-muted)" />
            <p>No recorded storybooks found yet. Connect with your parents using their Family Code to see their recordings!</p>
          </div>
        ) : (
          <div className="streams-grid">
            {filteredRecordings.map((rec) => {
              const minutes = Math.floor(rec.duration / 60);
              const seconds = rec.duration % 60;
              const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
              const recBook = allBooks.find(b => b.id === rec.bookId);

              return (
                <Link key={rec.id} to={`/watch/${rec.id}`} className="stream-card-link">
                  <div className="stream-card" style={{ border: '2px solid rgba(0, 180, 216, 0.15)', borderRadius: '16px' }}>
                    <div className="stream-thumbnail-container" style={{ borderRadius: '14px 14px 0 0' }}>
                      <img src={rec.bookCoverUrl || ''} alt={rec.title} className="stream-thumbnail" style={{ filter: 'grayscale(20%)' }} />
                      <div className="live-indicator" style={{ background: 'var(--accent-secondary)' }}>RECORDED 🎥</div>
                      <div className="viewer-count" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <Clock size={12} />
                        <span>{formattedDuration}</span>
                      </div>

                      {/* Curation Badges */}
                      {recBook?.readingLevel && (
                        <span className="badge-reading-level" style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 5 }}>
                          {recBook.readingLevel}
                        </span>
                      )}
                      {recBook?.ageRange && (
                        <span className="badge-age-range" style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 5 }}>
                          Ages {recBook.ageRange}
                        </span>
                      )}

                      <div className="mini-book-badge">
                        <img src={rec.bookCoverUrl} alt="Cover" />
                      </div>
                    </div>

                    <div className="stream-card-info">
                      <div className="stream-avatar" style={{ border: '2px solid var(--accent-secondary)', backgroundColor: 'var(--accent-secondary)' }}>
                        <div className="avatar-placeholder">
                          {rec.readerName.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="stream-metadata">
                        <h4 className="stream-card-title">{rec.title}</h4>
                        <p className="stream-card-host">Told by: 🌟 {rec.readerName}</p>
                        <p className="stream-card-book">📖 {rec.bookTitle}</p>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                          <span className="stream-card-tag" style={{ background: 'rgba(0, 180, 216, 0.1)', color: 'var(--accent-secondary)', fontSize: '0.7rem' }}>
                            {rec.genre}
                          </span>
                          <span className="stream-card-tag" style={{ backgroundColor: 'rgba(157, 78, 221, 0.1)', color: '#9d4edd', fontSize: '0.7rem' }}>
                            {rec.genre === 'Fantasy' ? '🔮 Magical' : rec.genre === 'Adventure' ? '⚔️ Adventurous' : '☕ Cozy'}
                          </span>
                          <span className="stream-card-tag" style={{ backgroundColor: 'rgba(255, 183, 3, 0.1)', color: '#ffb703', fontSize: '0.7rem' }}>
                            {rec.genre === 'Fantasy' ? '🐢 Slow-paced' : rec.genre === 'Adventure' ? '⚡ Fast-paced' : '🚶 Medium-paced'}
                          </span>
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
    </div>
  );
};
