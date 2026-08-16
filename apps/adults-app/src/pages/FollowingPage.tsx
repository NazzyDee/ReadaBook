import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STREAMERS, type StreamerProfile } from '../lib/streamersData';
import { books } from '../lib/booksData';
import { getLocalClips } from '../lib/clipsData';
import { Heart, Radio, Play, Compass, ArrowUpDown } from 'lucide-react';

export const FollowingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'live' | 'categories' | 'channels' | 'videos'>('overview');
  const [sortBy, setSortBy] = useState<'viewers' | 'recent' | 'alpha'>('viewers');
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mockFollows') || '[]');
    if (saved.length > 0) {
      setFollowedIds(saved);
    } else {
      const defaults = ['mock_lillyreads', 'mock_bookishbard'];
      setFollowedIds(defaults);
      localStorage.setItem('mockFollows', JSON.stringify(defaults));
    }
  }, []);

  const followedStreamers: StreamerProfile[] = followedIds
    .map(id => STREAMERS[id])
    .filter(Boolean);

  const liveFollowed = [...followedStreamers.filter(s => s.isLive)].sort((a, b) => {
    if (sortBy === 'viewers') {
      return (b.followersCount || 0) - (a.followersCount || 0);
    } else if (sortBy === 'alpha') {
      return a.displayName.localeCompare(b.displayName);
    }
    return 0;
  });

  const allClips = getLocalClips().filter(c => followedIds.includes(c.streamerId));

  const followedCategories = [
    { name: 'Fantasy', count: 18, banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', viewers: '14.2k' },
    { name: 'Classics', count: 24, banner: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', viewers: '11.5k' }
  ];

  return (
    <div className="following-page-container">
      {/* Header */}
      <div className="following-hero-header">
        <div className="following-hero-title">
          <Heart size={24} color="var(--accent-primary)" fill="var(--accent-primary)" />
          <h1>Following</h1>
        </div>

        {/* Following Sub Tabs */}
        <div className="following-sub-tabs">
          <button
            className={`f-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`f-tab ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            Live ({liveFollowed.length})
          </button>
          <button
            className={`f-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button
            className={`f-tab ${activeTab === 'channels' ? 'active' : ''}`}
            onClick={() => setActiveTab('channels')}
          >
            Channels ({followedStreamers.length})
          </button>
          <button
            className={`f-tab ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos & Clips
          </button>
        </div>
      </div>

      {/* TAB: OVERVIEW & LIVE */}
      {(activeTab === 'overview' || activeTab === 'live') && (
        <div className="following-content-section">
          {/* LIVE CHANNELS GRID */}
          <div className="section-block">
            <div className="section-title-row">
              <div className="title-left">
                <Radio size={16} color="var(--accent-danger)" className="pulse" />
                <h2>Live Channels</h2>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="live-count-badge">{liveFollowed.length} channels live</span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <ArrowUpDown size={13} color="var(--text-muted)" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.78rem', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="viewers">Viewers (High-to-Low)</option>
                    <option value="recent">Recently Started</option>
                    <option value="alpha">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {liveFollowed.length === 0 ? (
              <div className="empty-following-card">
                <Radio size={36} color="var(--text-muted)" />
                <p>None of the channels you follow are currently broadcasting.</p>
                <Link to="/" className="btn-secondary">
                  Browse Active Streams
                </Link>
              </div>
            ) : (
              <div className="twitch-stream-cards-grid">
                {liveFollowed.map(streamer => {
                  const book = books.find(b => b.id === streamer.currentBookId);

                  return (
                    <Link key={streamer.id} to={`/stream/${streamer.id}`} className="twitch-stream-card-link">
                      <div className="twitch-stream-card">
                        <div className="twitch-thumb-container">
                          <img src={book?.coverUrl || streamer.bannerUrl} alt="" className="twitch-card-thumb" />
                          <div className="twitch-card-badge-live">LIVE</div>
                          <div className="twitch-card-badge-viewers">
                            <span>{(streamer.followersCount / 20).toFixed(0)} viewers</span>
                          </div>
                          <div className="twitch-thumb-hover-overlay">
                            <Play size={32} fill="white" />
                          </div>
                        </div>

                        <div className="twitch-card-info-row">
                          <img src={streamer.avatarUrl} alt="" className="twitch-card-avatar" />
                          <div className="twitch-card-meta">
                            <h4 className="twitch-card-stream-title">{streamer.currentStreamTitle}</h4>
                            <span className="twitch-card-streamer-name">{streamer.displayName}</span>
                            <span className="twitch-card-book-subtitle">📖 {book?.title || 'Story'}</span>
                            <div className="twitch-card-tags">
                              {streamer.tags.slice(0, 2).map(t => (
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
          </div>

          {/* FOLLOWED CATEGORIES PREVIEW */}
          {activeTab === 'overview' && (
            <div className="section-block">
              <div className="section-title-row">
                <div className="title-left">
                  <Compass size={16} color="var(--accent-secondary)" />
                  <h2>Followed Categories</h2>
                </div>
              </div>

              <div className="categories-mosaic-grid">
                {followedCategories.map(cat => (
                  <Link key={cat.name} to={`/directory/category/${cat.name.toLowerCase()}`} className="category-mosaic-card">
                    <img src={cat.banner} alt={cat.name} className="category-mosaic-img" />
                    <div className="category-mosaic-overlay" />
                    <div className="category-mosaic-info">
                      <h3>{cat.name}</h3>
                      <div className="category-mosaic-stats">
                        <span>{cat.viewers} Live Viewers</span>
                        <span>• {cat.count} Active Channels</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="following-categories-tab">
          <div className="categories-mosaic-grid">
            {followedCategories.map(cat => (
              <Link key={cat.name} to={`/directory/category/${cat.name.toLowerCase()}`} className="category-mosaic-card">
                <img src={cat.banner} alt={cat.name} className="category-mosaic-img" />
                <div className="category-mosaic-overlay" />
                <div className="category-mosaic-info">
                  <h3>{cat.name}</h3>
                  <div className="category-mosaic-stats">
                    <span>{cat.viewers} Live Viewers</span>
                    <span>• {cat.count} Active Channels</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CHANNELS */}
      {activeTab === 'channels' && (
        <div className="following-channels-tab">
          <div className="channels-full-list">
            {followedStreamers.map(s => (
              <div key={s.id} className="followed-channel-row-card">
                <img src={s.avatarUrl} alt={s.displayName} className="channel-row-avatar" />
                <div className="channel-row-details">
                  <div className="channel-row-name-row">
                    <Link to={`/channel/${s.id}`} className="channel-row-name">
                      {s.displayName}
                    </Link>
                    {s.isLive ? (
                      <span className="live-pill-sm">🔴 LIVE</span>
                    ) : (
                      <span className="offline-pill-sm">Offline</span>
                    )}
                  </div>
                  <p className="channel-row-bio">{s.bio}</p>
                </div>
                <div className="channel-row-actions">
                  <Link to={`/channel/${s.id}`} className="btn-secondary">
                    View Channel
                  </Link>
                  {s.isLive && (
                    <Link to={`/stream/${s.id}`} className="btn-primary">
                      Watch Stream
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: VIDEOS & CLIPS */}
      {activeTab === 'videos' && (
        <div className="following-videos-tab">
          <div className="clips-section-header">
            <h3>Clips from Followed Channels</h3>
          </div>

          <div className="clips-grid">
            {allClips.map(clip => (
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
        </div>
      )}
    </div>
  );
};
