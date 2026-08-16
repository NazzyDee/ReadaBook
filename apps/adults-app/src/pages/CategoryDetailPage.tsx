import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { STREAMERS } from '../lib/streamersData';
import { books } from '../lib/booksData';
import { getLocalClips } from '../lib/clipsData';
import { Heart, Users, Play, Radio, Video, Check } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

export const CategoryDetailPage: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const [activeTab, setActiveTab] = useState<'live' | 'clips'>('live');
  const [isFollowingCategory, setIsFollowingCategory] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categoryName = genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : 'Fantasy';

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('followed_categories') || '[]');
    setIsFollowingCategory(saved.includes(genre?.toLowerCase() || 'fantasy'));
  }, [genre]);

  const handleToggleFollowCategory = () => {
    soundFX.playPop();
    const current = JSON.parse(localStorage.getItem('followed_categories') || '[]');
    const catId = genre?.toLowerCase() || 'fantasy';
    let updated: string[];

    if (isFollowingCategory) {
      updated = current.filter((c: string) => c !== catId);
      setIsFollowingCategory(false);
      setToastMsg(`Unfollowed category ${categoryName}.`);
    } else {
      updated = [...current, catId];
      setIsFollowingCategory(true);
      setToastMsg(`Now following ${categoryName}! You will see live channels in your Following feed.`);
    }

    localStorage.setItem('followed_categories', JSON.stringify(updated));
    setTimeout(() => setToastMsg(null), 3000);
  };

  const categoryBanners: Record<string, string> = {
    fantasy: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'sci-fi': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
    classics: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    'mystery-&-thriller': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    'silent-study-&-lofi': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    'young-adult': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
  };

  const bannerImg = categoryBanners[genre?.toLowerCase() || 'fantasy'] || categoryBanners.fantasy;

  // Filter streamers matching this genre
  const matchingStreamers = Object.values(STREAMERS).filter(s => s.isLive);
  const matchingClips = getLocalClips();

  return (
    <div className="category-detail-page">
      {/* Category Hero Header */}
      <div className="category-header-banner">
        <img src={bannerImg} alt="" className="category-banner-bg" />
        <div className="category-banner-gradient" />

        <div className="category-header-content">
          <div className="category-box-art-wrapper">
            <img src={bannerImg} alt={categoryName} className="category-box-art" />
          </div>

          <div className="category-header-details">
            <div className="category-title-row">
              <h1>{categoryName}</h1>
            </div>

            <div className="category-stats-row">
              <span className="cat-stat-pill">
                <Users size={14} />
                <strong>14.2K</strong> Viewers
              </span>
              <span className="cat-stat-sep">•</span>
              <span className="cat-stat-pill">
                <strong>84.5K</strong> Followers
              </span>
              <span className="cat-stat-sep">•</span>
              <span className="cat-genre-chip">Literature Category</span>
            </div>

            <div className="category-action-row">
              <button
                onClick={handleToggleFollowCategory}
                className={`btn-follow-category ${isFollowingCategory ? 'following' : ''}`}
              >
                <Heart size={16} fill={isFollowingCategory ? 'currentColor' : 'none'} />
                <span>{isFollowingCategory ? 'Following' : 'Follow Category'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="category-toast" style={{ margin: '16px 20px 0 20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 229, 255, 0.15)', border: '1px solid var(--accent-secondary)', color: '#fff', padding: '10px 16px', borderRadius: '8px' }}>
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="category-sub-tabs">
        <button
          className={`cat-tab ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          <Radio size={16} />
          <span>Live Channels ({matchingStreamers.length})</span>
        </button>
        <button
          className={`cat-tab ${activeTab === 'clips' ? 'active' : ''}`}
          onClick={() => setActiveTab('clips')}
        >
          <Video size={16} />
          <span>Clips ({matchingClips.length})</span>
        </button>
      </div>

      {/* Content */}
      <div className="category-content-body">
        {activeTab === 'live' && (
          <div className="twitch-stream-cards-grid">
            {matchingStreamers.map(streamer => {
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

        {activeTab === 'clips' && (
          <div className="clips-grid">
            {matchingClips.map(clip => (
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
        )}
      </div>
    </div>
  );
};
