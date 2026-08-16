import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getLocalClips, type Clip } from '../lib/clipsData';
import { Video, Heart, Eye, Share2, Play, X, ExternalLink } from 'lucide-react';

export const ClipsPage: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>(getLocalClips());
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeModalClip, setActiveModalClip] = useState<Clip | null>(null);
  const [likedClips, setLikedClips] = useState<string[]>([]);
  const [searchParams] = useSearchParams();

  // Listen for storage events (e.g. newly published clips)
  useEffect(() => {
    const handleStorage = () => setClips(getLocalClips());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Check query params for direct clip open
  useEffect(() => {
    const clipId = searchParams.get('clip');
    if (clipId) {
      const found = clips.find(c => c.id === clipId);
      if (found) setActiveModalClip(found);
    }
  }, [searchParams, clips]);

  const handleToggleLike = (clipId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedClips.includes(clipId)) {
      setLikedClips(prev => prev.filter(id => id !== clipId));
    } else {
      setLikedClips(prev => [...prev, clipId]);
    }
  };

  const filteredClips = clips.filter(clip => {
    if (selectedTag && !clip.tags.includes(selectedTag)) return false;
    return true;
  });

  return (
    <div className="clips-page-container">
      {/* Header Banner */}
      <div className="clips-hero-header">
        <div className="clips-hero-content">
          <div className="clips-badge">
            <Video size={16} />
            <span>COMMUNITY CLIPS</span>
          </div>
          <h1>Trending Book Clips</h1>
          <p>The most shocking plot twists, hilarious character voice acting fails, and emotional chapter endings clipped by readers!</p>
        </div>

        {/* Time Filters */}
        <div className="clips-time-filters">
          <button
            className={`time-filter-btn ${timeFilter === '24h' ? 'active' : ''}`}
            onClick={() => setTimeFilter('24h')}
          >
            Last 24 Hours
          </button>
          <button
            className={`time-filter-btn ${timeFilter === '7d' ? 'active' : ''}`}
            onClick={() => setTimeFilter('7d')}
          >
            This Week
          </button>
          <button
            className={`time-filter-btn ${timeFilter === '30d' ? 'active' : ''}`}
            onClick={() => setTimeFilter('30d')}
          >
            This Month
          </button>
          <button
            className={`time-filter-btn ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFilter('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Category Tags */}
      <div className="clips-tags-row">
        <button
          className={`clips-tag-pill ${!selectedTag ? 'active' : ''}`}
          onClick={() => setSelectedTag(null)}
        >
          All Clips
        </button>
        {['PlotTwist', 'VoiceActing', 'Funny', 'Hype', 'Atmosphere', 'DarkFantasy', 'Relaxing'].map(t => (
          <button
            key={t}
            className={`clips-tag-pill ${selectedTag === t ? 'active' : ''}`}
            onClick={() => setSelectedTag(t)}
          >
            #{t}
          </button>
        ))}
      </div>

      {/* Clips Grid */}
      <div className="clips-grid">
        {filteredClips.map(clip => {
          const isLiked = likedClips.includes(clip.id);
          const likeCount = clip.likesCount + (isLiked ? 1 : 0);

          return (
            <div
              key={clip.id}
              className="clip-card"
              onClick={() => setActiveModalClip(clip)}
            >
              <div className="clip-thumb-wrapper">
                <img src={clip.thumbnailUrl} alt={clip.title} className="clip-thumbnail" />
                <div className="clip-duration-badge">{clip.duration}s</div>
                <div className="clip-views-badge">
                  <Eye size={12} />
                  <span>{(clip.viewsCount / 1000).toFixed(1)}k</span>
                </div>
                <div className="clip-play-overlay">
                  <Play size={28} fill="white" />
                </div>
              </div>

              <div className="clip-card-info">
                <div className="clip-streamer-avatar">
                  <img src={clip.streamerAvatar} alt={clip.streamerName} />
                </div>

                <div className="clip-card-details">
                  <h4 className="clip-title">{clip.title}</h4>
                  <div className="clip-creator-meta">
                    <Link
                      to={`/channel/${clip.streamerId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="clip-streamer-link"
                    >
                      {clip.streamerName}
                    </Link>
                    <span className="clip-book-name">📖 {clip.bookTitle}</span>
                  </div>
                  <div className="clip-footer-row">
                    <span className="clipped-by-tag">Clipped by {clip.clippedBy}</span>
                    <button
                      className={`btn-clip-like ${isLiked ? 'liked' : ''}`}
                      onClick={(e) => handleToggleLike(clip.id, e)}
                    >
                      <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                      <span>{likeCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clip Playback Modal */}
      {activeModalClip && (
        <div className="modal-backdrop" onClick={() => setActiveModalClip(null)}>
          <div className="clip-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Video size={18} color="var(--accent-secondary)" />
                <h3>{activeModalClip.title}</h3>
              </div>
              <button onClick={() => setActiveModalClip(null)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="clip-modal-player-area">
              <img src={activeModalClip.thumbnailUrl} alt="Preview" className="clip-modal-thumb" />
              <div className="clip-modal-center-play">
                <Play size={48} fill="white" />
              </div>
              <div className="clip-modal-duration-tag">00:{activeModalClip.duration}</div>
            </div>

            <div className="clip-modal-footer">
              <div className="clip-modal-left">
                <img src={activeModalClip.streamerAvatar} alt="" className="clip-modal-avatar" />
                <div>
                  <h4>{activeModalClip.streamerName}</h4>
                  <p>Reading <strong>{activeModalClip.bookTitle}</strong> by {activeModalClip.bookAuthor}</p>
                </div>
              </div>

              <div className="clip-modal-actions">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Clip URL copied to clipboard!');
                  }}
                  className="btn-secondary"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>

                <Link
                  to={`/stream/${activeModalClip.streamerId}`}
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={16} />
                  <span>Watch Streamer</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
