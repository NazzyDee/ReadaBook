import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { STREAMERS, type StreamerProfile, type ChannelPanel } from '../lib/streamersData';
import { getLocalClips } from '../lib/clipsData';
import { books } from '../lib/booksData';
import { SubModal } from '../components/SubModal';
import { OfflineChannelHero } from '../components/OfflineChannelHero';
import { ChannelTrailerModal } from '../components/ChannelTrailerModal';
import { MerchStorefrontModal } from '../components/MerchStorefrontModal';
import { soundFX } from '../lib/soundFx';
import {
  Heart,
  Star,
  Bell,
  Radio,
  Calendar,
  CheckCircle2,
  Play,
  Edit3,
  Plus,
  Trash2,
  Check,
  Film,
  ShoppingBag
} from 'lucide-react';

export const ChannelPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'schedule' | 'videos' | 'clips'>('home');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showMerchModal, setShowMerchModal] = useState(false);

  const streamer: StreamerProfile =
    (channelId && STREAMERS[channelId]) || STREAMERS['mock_lillyreads'];

  const [panels, setPanels] = useState<ChannelPanel[]>(streamer.panels);
  const [isEditingPanels, setIsEditingPanels] = useState(false);
  const [showAddPanelModal, setShowAddPanelModal] = useState(false);
  const [newPanelTitle, setNewPanelTitle] = useState('');
  const [newPanelContent, setNewPanelContent] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const allClips = getLocalClips().filter(c => c.streamerId === streamer.id);
  const recentBookObjects = streamer.recentBooks.map(id => books.find(b => b.id === id)).filter(Boolean);

  const handleAddPanel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPanelTitle.trim() || !newPanelContent.trim()) return;

    soundFX.playChestClaim();
    const newP: ChannelPanel = {
      id: `panel_${Date.now()}`,
      title: newPanelTitle.trim(),
      content: newPanelContent.trim()
    };

    setPanels(prev => [...prev, newP]);
    setShowAddPanelModal(false);
    setNewPanelTitle('');
    setNewPanelContent('');
    setToastMsg(`Panel "${newP.title}" added to channel!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDeletePanel = (id: string, title: string) => {
    soundFX.playPop();
    setPanels(prev => prev.filter(p => p.id !== id));
    setToastMsg(`Panel "${title}" removed.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRemindEvent = (evtTitle: string, day: string, time: string) => {
    soundFX.playChestClaim();
    setToastMsg(`🔔 Reminder set for ${day} at ${time} ("${evtTitle}")!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="channel-page-container">
      {/* Channel Banner */}
      <div className="channel-banner-wrapper">
        <img src={streamer.bannerUrl} alt="Banner" className="channel-banner-img" />
        <div className="banner-gradient-overlay" />
      </div>

      {/* Channel Header Bar */}
      <div className="channel-header-bar">
        <div className="channel-header-left">
          <div className="channel-avatar-wrapper">
            <img src={streamer.avatarUrl} alt={streamer.displayName} className="channel-profile-avatar" />
            {streamer.isLive && <span className="channel-live-ring-badge">LIVE</span>}
          </div>

          <div className="channel-title-meta">
            <div className="channel-name-row">
              <h2>{streamer.displayName}</h2>
              {streamer.isPartner && (
                <span className="verified-partner-badge" title="Verified Literature Partner">
                  <CheckCircle2 size={16} color="#00e5ff" fill="rgba(0, 229, 255, 0.2)" />
                </span>
              )}
            </div>
            <p className="channel-followers-count">
              {(streamer.followersCount).toLocaleString()} followers • {(streamer.subscribersCount).toLocaleString()} subscribers
            </p>
          </div>
        </div>

        <div className="channel-header-actions">
          {/* Watch Channel Trailer Button */}
          <button
            onClick={() => {
              soundFX.playPop();
              setShowTrailerModal(true);
            }}
            className="btn-secondary"
            title="Watch 60-Second Channel Trailer"
          >
            <Film size={16} color="var(--accent-secondary)" />
            <span>Channel Trailer</span>
          </button>

          {/* Merch Storefront Button */}
          <button
            onClick={() => {
              soundFX.playPop();
              setShowMerchModal(true);
            }}
            className="btn-secondary"
            title="Shop Official Channel Merchandise & Book Box"
          >
            <ShoppingBag size={16} color="#ffd700" />
            <span>Merch Store</span>
          </button>

          {/* Follow Button */}
          <button
            onClick={() => {
              soundFX.playPop();
              setIsFollowing(!isFollowing);
            }}
            className={`btn-channel-follow ${isFollowing ? 'following' : ''}`}
          >
            <Heart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>

          {/* Subscribe Button */}
          <button
            onClick={() => {
              soundFX.playPop();
              setShowSubModal(true);
            }}
            className="btn-primary btn-channel-sub"
          >
            <Star size={16} fill="currentColor" />
            <span>Subscribe</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="channel-toast">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="channel-nav-tabs">
        <button
          className={`channel-tab-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          className={`channel-tab-item ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          className={`channel-tab-item ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule ({streamer.schedule.length})
        </button>
        <button
          className={`channel-tab-item ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Past Broadcasts (VODs)
        </button>
        <button
          className={`channel-tab-item ${activeTab === 'clips' ? 'active' : ''}`}
          onClick={() => setActiveTab('clips')}
        >
          Clips ({allClips.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="channel-content-area">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="channel-home-tab">
            {streamer.isLive ? (
              <div className="live-spotlight-card">
                <div className="spotlight-left">
                  <div className="spotlight-live-pill">
                    <Radio size={14} className="pulse" />
                    <span>LIVE NOW</span>
                  </div>
                  <h3>{streamer.currentStreamTitle}</h3>
                  <p className="spotlight-bio">{streamer.bio}</p>
                  <div className="channel-tags-row">
                    {streamer.tags.map(t => (
                      <span key={t} className="channel-tag-pill">#{t}</span>
                    ))}
                  </div>
                  <Link
                    to={`/stream/${streamer.id}`}
                    className="btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', marginTop: '16px' }}
                  >
                    <Play size={16} fill="white" />
                    <span>Watch Live Reading Stream</span>
                  </Link>
                </div>

                <div className="spotlight-right-preview">
                  <img src={streamer.avatarUrl} alt="" className="spotlight-preview-thumb" />
                  <div className="spotlight-overlay-badge">
                    <span>1,420 Viewers</span>
                  </div>
                </div>
              </div>
            ) : (
              <OfflineChannelHero
                streamer={streamer}
                onSetReminder={(title, day, time) => handleRemindEvent(title, day, time)}
              />
            )}

            {/* Currently Reading Bookshelf */}
            <div className="channel-shelf-section">
              <h3 className="section-heading">📚 Currently & Recently Read Books</h3>
              <div className="shelf-grid">
                {recentBookObjects.map(book => book && (
                  <div key={book.id} className="shelf-book-card">
                    <img src={book.coverUrl} alt={book.title} className="shelf-book-cover" />
                    <div className="shelf-book-details">
                      <h4>{book.title}</h4>
                      <p>by {book.author}</p>
                      <span className="shelf-genre-badge">{book.genre}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="channel-about-tab">
            <div className="about-bio-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3>About {streamer.displayName}</h3>
                  <p className="bio-large-text">{streamer.bio}</p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setIsEditingPanels(!isEditingPanels)}
                    className={`btn-secondary ${isEditingPanels ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                  >
                    <Edit3 size={14} />
                    <span>{isEditingPanels ? 'Done Editing' : 'Edit Panels'}</span>
                  </button>

                  {isEditingPanels && (
                    <button
                      onClick={() => setShowAddPanelModal(true)}
                      className="btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Panel</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="social-links-row">
                {streamer.socials.goodreads && (
                  <a href={streamer.socials.goodreads} target="_blank" rel="noreferrer" className="social-chip">
                    📖 Goodreads Profile
                  </a>
                )}
                {streamer.socials.discord && (
                  <a href={streamer.socials.discord} target="_blank" rel="noreferrer" className="social-chip">
                    💬 Community Discord
                  </a>
                )}
                {streamer.socials.instagram && (
                  <a href={streamer.socials.instagram} target="_blank" rel="noreferrer" className="social-chip">
                    📸 Instagram
                  </a>
                )}
              </div>
            </div>

            {/* Twitch Style Info Panels Grid */}
            <div className="twitch-panels-grid">
              {panels.map(panel => (
                <div key={panel.id} className="twitch-markdown-panel" style={{ position: 'relative' }}>
                  {isEditingPanels && (
                    <button
                      onClick={() => handleDeletePanel(panel.id, panel.title)}
                      className="btn-delete-panel-corner"
                      title="Delete Panel"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                  <div className="panel-header">
                    <h4>{panel.title}</h4>
                  </div>
                  <div className="panel-body">
                    {panel.content.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {activeTab === 'schedule' && (
          <div className="channel-schedule-tab">
            <div className="schedule-header-card">
              <Calendar size={24} color="var(--accent-secondary)" />
              <div>
                <h3>Weekly Reading Broadcast Schedule</h3>
                <p>All times displayed in Eastern Standard Time (EST). Set a reminder to get notified when {streamer.displayName} goes live!</p>
              </div>
            </div>

            <div className="schedule-events-list">
              {streamer.schedule.map(evt => (
                <div key={evt.id} className={`schedule-event-card ${evt.isSpecialEvent ? 'is-special' : ''}`}>
                  <div className="event-time-col">
                    <span className="event-day">{evt.day}</span>
                    <span className="event-time">{evt.time}</span>
                  </div>

                  <div className="event-details-col">
                    <div className="event-title-row">
                      <h4>{evt.title}</h4>
                      {evt.isSpecialEvent && <span className="special-event-badge">✨ Special Event</span>}
                    </div>
                    <span className="event-book-sub">📖 {evt.bookTitle} by {evt.bookAuthor}</span>
                    <span className="event-genre-tag">{evt.genre}</span>
                  </div>

                  <div className="event-action-col">
                    <button
                      onClick={() => handleRemindEvent(evt.title, evt.day, evt.time)}
                      className="btn-secondary btn-remind-me"
                    >
                      <Bell size={14} />
                      <span>Remind Me</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEOS TAB (VODs) */}
        {activeTab === 'videos' && (
          <div className="channel-videos-tab">
            <h3 className="section-heading">Past Broadcasts & Highlights</h3>
            <div className="vod-grid">
              <div className="vod-card">
                <div className="vod-thumbnail-wrapper">
                  <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" alt="VOD" className="vod-thumb" />
                  <span className="vod-duration-tag">01:45:20</span>
                </div>
                <div className="vod-meta">
                  <h4>The Hobbit: Riddles in the Dark</h4>
                  <p>1.4k views • Streamed 2 days ago</p>
                  <Link to="/watch/vod_hobbit_1" className="btn-primary btn-watch-vod">Watch VOD</Link>
                </div>
              </div>

              <div className="vod-card">
                <div className="vod-thumbnail-wrapper">
                  <img src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80" alt="VOD" className="vod-thumb" />
                  <span className="vod-duration-tag">02:10:15</span>
                </div>
                <div className="vod-meta">
                  <h4>Pride & Prejudice: The Netherfield Ball</h4>
                  <p>2.1k views • Streamed 4 days ago</p>
                  <Link to="/watch/vod_pride_1" className="btn-primary btn-watch-vod">Watch VOD</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLIPS TAB */}
        {activeTab === 'clips' && (
          <div className="channel-clips-tab">
            <h3 className="section-heading">Trending Channel Clips</h3>
            <div className="clips-grid">
              {allClips.map(clip => (
                <div key={clip.id} className="clip-card">
                  <div className="clip-thumbnail-wrapper">
                    <img src={clip.thumbnailUrl} alt={clip.title} className="clip-thumb" />
                    <span className="clip-duration-tag">{clip.duration}s</span>
                  </div>
                  <div className="clip-info">
                    <h4>{clip.title}</h4>
                    <p className="clip-meta-sub">Clipped by <strong>{clip.clippedBy}</strong> • {clip.viewsCount.toLocaleString()} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Panel Modal */}
      {showAddPanelModal && (
        <div className="modal-backdrop">
          <div className="add-emote-modal-card">
            <div className="modal-header">
              <div className="modal-title-row">
                <Edit3 size={20} color="var(--accent-secondary)" />
                <h3>Add Channel Info Panel</h3>
              </div>
              <button onClick={() => setShowAddPanelModal(false)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPanel} className="add-emote-form">
              <div className="form-group">
                <label>Panel Header Title:</label>
                <input
                  type="text"
                  placeholder="e.g. My Reading Setup 🎙️"
                  value={newPanelTitle}
                  onChange={(e) => setNewPanelTitle(e.target.value)}
                  className="settings-text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Panel Content (Markdown / Text):</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Mic: Shure SM7B&#10;Headphones: Sennheiser HD650&#10;E-Reader: Kindle Paperwhite"
                  value={newPanelContent}
                  onChange={(e) => setNewPanelContent(e.target.value)}
                  className="settings-text-input"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddPanelModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  <span>Add Panel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub Modal */}
      {showSubModal && (
        <SubModal
          streamerName={streamer.displayName}
          onSubscribe={(tier, isGift, giftCount) => {
            soundFX.playChestClaim();
            if (isGift) {
              setToastMsg(`Gifted ${giftCount} Tier ${tier} subscriptions to ${streamer.displayName}'s community! 🎁`);
            } else {
              setToastMsg(`Subscribed to ${streamer.displayName} at Tier ${tier}! ⭐`);
            }
            setTimeout(() => setToastMsg(null), 3000);
          }}
          onClose={() => setShowSubModal(false)}
        />
      )}

      {/* Channel Trailer Modal */}
      {showTrailerModal && (
        <ChannelTrailerModal
          streamerName={streamer.displayName}
          isOwner={false}
          onClose={() => setShowTrailerModal(false)}
        />
      )}

      {/* Merch Storefront Modal */}
      {showMerchModal && (
        <MerchStorefrontModal
          streamerName={streamer.displayName}
          onClose={() => setShowMerchModal(false)}
        />
      )}
    </div>
  );
};
