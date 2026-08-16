import React, { useState } from 'react';
import { Video, Scissors, Eye, Trash2, Check, Download, Film } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface PastBroadcast {
  id: string;
  title: string;
  bookTitle: string;
  duration: string;
  date: string;
  views: number;
  thumbnailUrl: string;
  published: boolean;
}

export const VideoProducerPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'past_broadcasts' | 'highlights' | 'uploads'>('all');
  const [videos, setVideos] = useState<PastBroadcast[]>([
    {
      id: 'vod_1',
      title: 'The Hobbit: Chapter 5 - Riddles in the Dark Live Reading',
      bookTitle: 'The Hobbit',
      duration: '3h 24m',
      date: 'Aug 15, 2026',
      views: 4820,
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      published: true
    },
    {
      id: 'vod_2',
      title: 'Late Night Cozy Fantasy Reading & Hot Tea ☕',
      bookTitle: 'The Lion, the Witch and the Wardrobe',
      duration: '2h 45m',
      date: 'Aug 13, 2026',
      views: 3150,
      thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
      published: true
    },
    {
      id: 'vod_3',
      title: 'The Fellowship of the Ring: Table Read & Lore Breakdown',
      bookTitle: 'The Fellowship of the Ring',
      duration: '4h 10m',
      date: 'Aug 11, 2026',
      views: 6410,
      thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      published: true
    }
  ]);

  const [highlightModal, setHighlightModal] = useState<PastBroadcast | null>(null);
  const [startTrim, setStartTrim] = useState('00:15:00');
  const [endTrim, setEndTrim] = useState('00:45:00');
  const [highlightTitle, setHighlightTitle] = useState('');
  const [createdToast, setCreatedToast] = useState<string | null>(null);

  const togglePublish = (id: string) => {
    soundFX.playPop();
    setVideos(prev =>
      prev.map(v => (v.id === id ? { ...v, published: !v.published } : v))
    );
  };

  const deleteVideo = (id: string) => {
    soundFX.playPop();
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const handleCreateHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!highlightModal) return;

    soundFX.playChestClaim();
    const newHighlight: PastBroadcast = {
      id: `hl_${Date.now()}`,
      title: highlightTitle || `[Highlight] ${highlightModal.title}`,
      bookTitle: highlightModal.bookTitle,
      duration: '30m 00s',
      date: 'Just now',
      views: 0,
      thumbnailUrl: highlightModal.thumbnailUrl,
      published: true
    };

    setVideos(prev => [newHighlight, ...prev]);
    setHighlightModal(null);
    setCreatedToast(`Highlight "${newHighlight.title}" created successfully!`);
    setTimeout(() => setCreatedToast(null), 3000);
  };

  return (
    <div className="producer-page-container">
      {/* Hero Header */}
      <div className="producer-hero-header">
        <div className="producer-badge">
          <Film size={15} />
          <span>TWITCH VIDEO PRODUCER</span>
        </div>
        <h1>Video Producer & VOD Manager</h1>
        <p>Manage your past broadcasts, trim highlights, export recordings, and manage video privacy.</p>

        {/* Filter Navigation */}
        <div className="producer-tabs-row">
          <button
            className={`btn-producer-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Videos ({videos.length})
          </button>
          <button
            className={`btn-producer-tab ${activeFilter === 'past_broadcasts' ? 'active' : ''}`}
            onClick={() => setActiveFilter('past_broadcasts')}
          >
            Past Broadcasts
          </button>
          <button
            className={`btn-producer-tab ${activeFilter === 'highlights' ? 'active' : ''}`}
            onClick={() => setActiveFilter('highlights')}
          >
            Highlights
          </button>
          <button
            className={`btn-producer-tab ${activeFilter === 'uploads' ? 'active' : ''}`}
            onClick={() => setActiveFilter('uploads')}
          >
            Uploads
          </button>
        </div>
      </div>

      {createdToast && (
        <div className="producer-success-toast">
          <Check size={16} />
          <span>{createdToast}</span>
        </div>
      )}

      {/* Videos List */}
      <div className="producer-videos-list">
        {videos.map(v => (
          <div key={v.id} className="producer-video-card">
            <div className="producer-thumb-col">
              <img src={v.thumbnailUrl} alt="" className="producer-thumb-img" />
              <span className="producer-duration-tag">{v.duration}</span>
            </div>

            <div className="producer-meta-col">
              <div className="producer-meta-top">
                <span className="producer-date-tag">{v.date}</span>
                <span className="producer-views-tag">
                  <Eye size={12} /> {v.views.toLocaleString()} views
                </span>
                <span className={`producer-status-tag ${v.published ? 'published' : 'unpublished'}`}>
                  {v.published ? 'Published' : 'Unlisted'}
                </span>
              </div>

              <h3>{v.title}</h3>
              <span className="producer-book-label">📖 {v.bookTitle}</span>
            </div>

            <div className="producer-actions-col">
              {/* Highlight Button */}
              <button
                onClick={() => {
                  setHighlightModal(v);
                  setHighlightTitle(`[Highlight] ${v.title}`);
                }}
                className="btn-producer-action"
                title="Generate Highlight Reel"
              >
                <Scissors size={15} />
                <span>Highlight</span>
              </button>

              {/* Publish Toggle */}
              <button
                onClick={() => togglePublish(v.id)}
                className="btn-producer-action"
                title="Toggle Visibility"
              >
                <Video size={15} />
                <span>{v.published ? 'Unlist' : 'Publish'}</span>
              </button>

              {/* Download */}
              <button
                onClick={() => alert(`Starting download for ${v.title}...`)}
                className="btn-producer-action"
                title="Download VOD"
              >
                <Download size={15} />
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteVideo(v.id)}
                className="btn-producer-action btn-danger-action"
                title="Delete Video"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Highlight Generator Modal */}
      {highlightModal && (
        <div className="modal-backdrop">
          <div className="highlight-generator-card">
            <div className="modal-header">
              <div className="modal-title-row">
                <Scissors size={20} color="var(--accent-secondary)" />
                <h3>Generate Highlight Reel</h3>
              </div>
              <button onClick={() => setHighlightModal(null)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHighlight} className="highlight-form">
              <div className="form-group">
                <label>Highlight Title:</label>
                <input
                  type="text"
                  value={highlightTitle}
                  onChange={(e) => setHighlightTitle(e.target.value)}
                  className="settings-text-input"
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label>Start Timestamp (HH:MM:SS):</label>
                  <input
                    type="text"
                    value={startTrim}
                    onChange={(e) => setStartTrim(e.target.value)}
                    className="settings-text-input"
                  />
                </div>

                <div className="form-group">
                  <label>End Timestamp (HH:MM:SS):</label>
                  <input
                    type="text"
                    value={endTrim}
                    onChange={(e) => setEndTrim(e.target.value)}
                    className="settings-text-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setHighlightModal(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Scissors size={16} />
                  <span>Publish Highlight</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
