import React, { useState, useEffect } from 'react';
import { X, Trophy, Sparkles, Clock, CheckCircle2, ShieldCheck, Flame, BookOpen } from 'lucide-react';
import { ACTIVE_MOMENT_DEMO, MOCK_USER_CLAIMED_MOMENTS, type BroadcastMoment } from '../lib/momentsData';
import { soundFX } from '../lib/soundFx';

interface ReaderMomentsModalProps {
  isStreamer?: boolean;
  streamerName?: string;
  onClose: () => void;
  onMomentTriggered?: (moment: BroadcastMoment) => void;
  onMomentClaimed?: (moment: BroadcastMoment) => void;
}

export const ReaderMomentsModal: React.FC<ReaderMomentsModalProps> = ({
  isStreamer = false,
  streamerName = 'LillyReads',
  onClose,
  onMomentTriggered,
  onMomentClaimed
}) => {
  const [activeTab, setActiveTab] = useState<'claim' | 'gallery' | 'create'>('claim');
  const [activeMoment, setActiveMoment] = useState<BroadcastMoment>(ACTIVE_MOMENT_DEMO);
  const [timeLeft, setTimeLeft] = useState<number>(activeMoment.durationSeconds);
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const [claimedList, setClaimedList] = useState<BroadcastMoment[]>(MOCK_USER_CLAIMED_MOMENTS);

  // New Moment form state for streamer
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPageNum, setNewPageNum] = useState('340');
  const [newRarity, setNewRarity] = useState<'Rare' | 'Epic' | 'Legendary'>('Legendary');

  // Countdown timer for active moment
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleClaim = () => {
    if (hasClaimed || timeLeft <= 0) return;
    soundFX.playPop();
    soundFX.playApplause();
    soundFX.playChestClaim();

    setHasClaimed(true);
    const updated = {
      ...activeMoment,
      claimedByCount: activeMoment.claimedByCount + 1
    };
    setActiveMoment(updated);
    setClaimedList(prev => [updated, ...prev]);

    if (onMomentClaimed) {
      onMomentClaimed(updated);
    }
  };

  const handleCreateMoment = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playThunder();
    soundFX.playApplause();

    const created: BroadcastMoment = {
      id: `moment_${Date.now()}`,
      streamerId: 'streamer_me',
      streamerName: streamerName,
      bookTitle: 'The Fellowship of the Ring',
      bookCoverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      momentTitle: newTitle.trim() || 'Epic Plot Climax Moment',
      momentDescription: newDesc.trim() || 'A legendary moment witnessed live by the chat community!',
      badgeIcon: newRarity === 'Legendary' ? '🔥' : newRarity === 'Epic' ? '⚡' : '✨',
      badgeRarity: newRarity,
      pageNumber: parseInt(newPageNum) || 1,
      timestamp: 'Just now',
      claimedByCount: 1,
      durationSeconds: 60
    };

    setActiveMoment(created);
    setTimeLeft(60);
    setHasClaimed(true);
    setActiveTab('claim');

    if (onMomentTriggered) {
      onMomentTriggered(created);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="moments-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="moments-modal-header">
          <div className="moments-title-group">
            <span className="moments-badge-pill">
              <Trophy size={16} />
              <span>OFFICIAL BROADCAST MOMENTS</span>
            </span>
            <h3>Streamer Moments & Climax Badges</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="moments-nav-tabs">
          <button
            className={`moment-tab-btn ${activeTab === 'claim' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setActiveTab('claim');
            }}
          >
            <Flame size={15} />
            <span>Live Moment ({timeLeft > 0 ? `${timeLeft}s` : 'Expired'})</span>
          </button>
          <button
            className={`moment-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setActiveTab('gallery');
            }}
          >
            <ShieldCheck size={15} />
            <span>My Moments Showcase ({claimedList.length})</span>
          </button>
          {isStreamer && (
            <button
              className={`moment-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setActiveTab('create');
              }}
            >
              <Sparkles size={15} />
              <span>Trigger New Moment</span>
            </button>
          )}
        </div>

        {/* TAB 1: LIVE MOMENT CLAIM */}
        {activeTab === 'claim' && (
          <div className="moment-claim-view">
            <div className="moment-banner-card">
              <div className="moment-card-top">
                <div className="moment-rarity-pill" data-rarity={activeMoment.badgeRarity}>
                  <Sparkles size={12} />
                  <span>{activeMoment.badgeRarity} Moment Badge</span>
                </div>

                <div className="moment-timer-counter">
                  <Clock size={14} />
                  <span>{timeLeft > 0 ? `${timeLeft}s left to claim` : 'Claim Period Ended'}</span>
                </div>
              </div>

              <div className="moment-main-content">
                <div className="moment-badge-visual">
                  <div className="moment-badge-glow-ring">
                    <span className="moment-badge-glyph">{activeMoment.badgeIcon}</span>
                  </div>
                  <span className="moment-badge-cert">Official Proof of Attendance</span>
                </div>

                <div className="moment-text-details">
                  <h4>{activeMoment.momentTitle}</h4>
                  <div className="moment-book-meta">
                    <BookOpen size={14} color="var(--accent-secondary)" />
                    <span>{activeMoment.bookTitle} • Page {activeMoment.pageNumber}</span>
                  </div>
                  <p className="moment-narrative-desc">{activeMoment.momentDescription}</p>

                  <div className="moment-broadcaster-tag">
                    <span>Broadcaster: <strong>@{activeMoment.streamerName}</strong></span>
                    <span>•</span>
                    <span>{activeMoment.claimedByCount} Readers Claimed</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="moment-action-row">
                {hasClaimed ? (
                  <div className="moment-claimed-status">
                    <CheckCircle2 size={20} color="var(--accent-success)" />
                    <span>Moment Claimed! Badge added to your Reader Profile.</span>
                  </div>
                ) : timeLeft > 0 ? (
                  <button
                    className="btn-primary btn-claim-moment"
                    onClick={handleClaim}
                  >
                    <Trophy size={18} />
                    <span>Claim Limited-Edition Badge ({timeLeft}s)</span>
                  </button>
                ) : (
                  <div className="moment-expired-status">
                    <span>This broadcast moment has concluded. Stay tuned for the next plot climax!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHOWCASE GALLERY */}
        {activeTab === 'gallery' && (
          <div className="moments-gallery-grid">
            {claimedList.map(m => (
              <div key={m.id} className="moment-gallery-item">
                <div className="gallery-badge-box" data-rarity={m.badgeRarity}>
                  <span className="gallery-badge-icon">{m.badgeIcon}</span>
                  <span className="gallery-rarity-chip">{m.badgeRarity}</span>
                </div>

                <div className="gallery-item-info">
                  <h5>{m.momentTitle}</h5>
                  <span className="gallery-book-sub">📖 {m.bookTitle} (p. {m.pageNumber})</span>
                  <p>{m.momentDescription}</p>
                  <div className="gallery-item-footer">
                    <span>Broadcast by <strong>@{m.streamerName}</strong></span>
                    <span>{m.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CREATE / TRIGGER MOMENT (STREAMER ONLY) */}
        {activeTab === 'create' && isStreamer && (
          <form onSubmit={handleCreateMoment} className="create-moment-form">
            <p className="create-moment-intro">
              Trigger an on-screen 60-second Moment during plot twists, book endings, or epic quotes to award exclusive proof-of-attendance badges to all live chatters!
            </p>

            <div className="form-group-moment">
              <label>Moment Title</label>
              <input
                type="text"
                placeholder="e.g. The Bridge of Khazad-dûm Climax"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group-moment">
              <label>Narrative Description</label>
              <textarea
                placeholder="Describe what happened live during this broadcast moment..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="form-row-dual">
              <div className="form-group-moment">
                <label>Book Page Number</label>
                <input
                  type="number"
                  value={newPageNum}
                  onChange={e => setNewPageNum(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-moment">
                <label>Badge Rarity</label>
                <select
                  value={newRarity}
                  onChange={e => setNewRarity(e.target.value as any)}
                >
                  <option value="Rare">Rare (Silver Halo)</option>
                  <option value="Epic">Epic (Purple Plasma)</option>
                  <option value="Legendary">Legendary (Golden Dragon Aura)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-broadcast-moment">
              <Flame size={18} />
              <span>Broadcast Moment Live to Chat (60s Claim Ring)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
