import React, { useState } from 'react';
import {
  X,
  BookMarked,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Share2
} from 'lucide-react';
import { SAMPLE_PASSPORT, type ReaderPassportProfile } from '../lib/readerPassportData';
import { soundFX } from '../lib/soundFx';

interface ReaderPassportModalProps {
  onClose: () => void;
}

export const ReaderPassportModal: React.FC<ReaderPassportModalProps> = ({ onClose }) => {
  const [profile] = useState<ReaderPassportProfile>(SAMPLE_PASSPORT);
  const [activeShelf, setActiveShelf] = useState<'currently_reading' | 'favorites' | 'want_to_read'>('currently_reading');
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredBooks = profile.books.filter(b => b.shelf === activeShelf);
  const goalPercent = Math.round((profile.yearlyGoal.completed / profile.yearlyGoal.target) * 100);

  const handleSharePassport = () => {
    soundFX.playPop();
    navigator.clipboard.writeText(`https://readabook.tv/passport/${profile.username}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="modal-backdrop">
      <div className="passport-modal-card">
        {/* Header */}
        <div className="passport-modal-header">
          <div className="passport-title-group">
            <BookMarked size={24} color="#ffd700" />
            <div>
              <h3>📚 Reader Passport & Virtual Bookshelves</h3>
              <span className="modal-subtitle">@{profile.username}'s Literary Identity & Reading Challenge</span>
            </div>
          </div>
          <div className="passport-header-actions">
            <button
              type="button"
              onClick={handleSharePassport}
              className="btn-share-passport"
              title="Share Reader Passport"
            >
              {copiedLink ? <CheckCircle2 size={14} color="#00ff88" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Passport'}</span>
            </button>
            <button onClick={onClose} className="modal-close-btn">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Profile Identity & Stats Hero */}
        <div className="passport-hero-box">
          <div className="passport-user-row">
            <img src={profile.avatarUrl} alt="" className="passport-avatar" />
            <div className="passport-user-info">
              <div className="user-name-tags">
                <strong className="passport-name">{profile.username}</strong>
                <span className="passport-badge-tag">Verified Broadcaster</span>
              </div>
              <p className="passport-bio">{profile.bio}</p>
              <span className="passport-joined">Member since {profile.memberSince}</span>
            </div>

            {/* Sync Badges */}
            <div className="passport-sync-badges">
              {profile.isGoodreadsLinked && (
                <span className="sync-badge goodreads">
                  <CheckCircle2 size={12} /> Goodreads Synced
                </span>
              )}
              {profile.isStoryGraphLinked && (
                <span className="sync-badge storygraph">
                  <CheckCircle2 size={12} /> StoryGraph Synced
                </span>
              )}
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="passport-stats-strip">
            <div className="stat-item">
              <Clock size={16} color="var(--accent-secondary)" />
              <div>
                <strong>{(profile.totalMinutesListened / 60).toFixed(0)} Hours</strong>
                <span>Stream Listening</span>
              </div>
            </div>

            <div className="stat-item">
              <BookOpen size={16} color="#00ff88" />
              <div>
                <strong>{profile.totalSprintPages.toLocaleString()} Pages</strong>
                <span>Sprint Focus Logged</span>
              </div>
            </div>

            <div className="stat-item">
              <Award size={16} color="#ffd700" />
              <div>
                <strong>{profile.unlockedBadges.length} Crests</strong>
                <span>Badges & Trophies</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2026 Annual Reading Challenge Bar */}
        <div className="yearly-goal-box">
          <div className="goal-header">
            <div>
              <strong>🎯 2026 Reading Challenge Goal</strong>
              <span>{profile.yearlyGoal.completed} of {profile.yearlyGoal.target} Books Completed ({goalPercent}%)</span>
            </div>
            <span className="goal-pct-badge">{goalPercent}%</span>
          </div>
          <div className="goal-track">
            <div className="goal-fill" style={{ width: `${goalPercent}%` }} />
          </div>
        </div>

        {/* Virtual Bookshelf Tabs */}
        <div className="passport-shelves-section">
          <div className="shelf-tabs-row">
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setActiveShelf('currently_reading');
              }}
              className={`shelf-tab-btn ${activeShelf === 'currently_reading' ? 'active' : ''}`}
            >
              📖 Currently Reading ({profile.books.filter(b => b.shelf === 'currently_reading').length})
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setActiveShelf('favorites');
              }}
              className={`shelf-tab-btn ${activeShelf === 'favorites' ? 'active' : ''}`}
            >
              ⭐ All-Time Favorites ({profile.books.filter(b => b.shelf === 'favorites').length})
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setActiveShelf('want_to_read');
              }}
              className={`shelf-tab-btn ${activeShelf === 'want_to_read' ? 'active' : ''}`}
            >
              🔖 Want to Read ({profile.books.filter(b => b.shelf === 'want_to_read').length})
            </button>
          </div>

          {/* Books Shelf Grid */}
          <div className="shelf-books-grid">
            {filteredBooks.map(b => (
              <div key={b.id} className="shelf-book-card">
                <img src={b.coverUrl} alt="" className="shelf-book-cover" />
                <div className="shelf-book-meta">
                  <strong className="shelf-title">{b.title}</strong>
                  <span className="shelf-author">by {b.author}</span>

                  {b.shelf === 'currently_reading' && (
                    <div className="shelf-progress-box">
                      <div className="shelf-progress-track">
                        <div
                          className="shelf-progress-fill"
                          style={{ width: `${Math.round((b.pagesRead / b.totalPages) * 100)}%` }}
                        />
                      </div>
                      <span className="shelf-progress-text">
                        Page {b.pagesRead} of {b.totalPages} ({Math.round((b.pagesRead / b.totalPages) * 100)}%)
                      </span>
                    </div>
                  )}

                  {b.streamerRecommended && (
                    <span className="shelf-rec-tag">
                      <Sparkles size={10} color="#ffd700" /> Read with @{b.streamerRecommended}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlocked Badges & Trophies */}
        <div className="passport-badges-box">
          <span className="badges-section-lbl">🏆 Unlocked Reader Crests & Trophies</span>
          <div className="badges-grid">
            {profile.unlockedBadges.map(bg => (
              <div key={bg.id} className="badge-item-card" title={bg.description}>
                <span className="badge-item-icon">{bg.icon}</span>
                <div>
                  <strong className="badge-item-name">{bg.name}</strong>
                  <span className="badge-item-desc">{bg.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
