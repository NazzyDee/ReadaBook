import React, { useState } from 'react';
import { X, Volume2, VolumeX, Grid, Maximize2, Mic, Crown, Radio } from 'lucide-react';
import { MOCK_SQUAD_FEEDS, type SquadStreamerFeed } from '../lib/squadMultiData';
import { soundFX } from '../lib/soundFx';

interface SquadMultiviewPlayerProps {
  onClose: () => void;
}

export const SquadMultiviewPlayer: React.FC<SquadMultiviewPlayerProps> = ({
  onClose
}) => {
  const [feeds, setFeeds] = useState<SquadStreamerFeed[]>(MOCK_SQUAD_FEEDS);
  const [focusedFeedId, setFocusedFeedId] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'focus'>('grid');

  const toggleMute = (id: string) => {
    soundFX.playPop();
    setFeeds(prev =>
      prev.map(f => (f.id === id ? { ...f, isMuted: !f.isMuted } : f))
    );
  };

  const handleVolumeChange = (id: string, vol: number) => {
    setFeeds(prev =>
      prev.map(f => (f.id === id ? { ...f, volume: vol, isMuted: vol === 0 } : f))
    );
  };

  const activeFocusFeed = feeds.find(f => f.id === focusedFeedId) || feeds[0];

  return (
    <div className="squad-multiview-fullscreen">
      {/* Top Bar */}
      <div className="squad-multi-topbar">
        <div className="squad-multi-title-group">
          <span className="live-rec-badge">
            <Radio size={14} className="pulse" />
            <span>SQUAD CO-STREAM LIVE (4 READERS)</span>
          </span>
          <h3>{feeds[0].bookTitle} • Group Dramatic Read-Along</h3>
        </div>

        <div className="squad-multi-top-actions">
          <button
            className={`btn-squad-layout-toggle ${layoutMode === 'grid' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setLayoutMode(layoutMode === 'grid' ? 'focus' : 'grid');
            }}
          >
            <Grid size={16} />
            <span>{layoutMode === 'grid' ? 'Focus Mode' : '2x2 Grid'}</span>
          </button>

          <button onClick={onClose} className="modal-close-btn" title="Exit Squad Multiview">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="squad-multi-main-stage">
        {layoutMode === 'grid' ? (
          /* 2x2 Grid Layout */
          <div className="squad-grid-2x2">
            {feeds.map(feed => (
              <div key={feed.id} className="squad-video-tile">
                <div className="squad-video-wrapper">
                  <video
                    src={feed.videoUrl}
                    autoPlay
                    loop
                    muted={feed.isMuted}
                    playsInline
                    className="squad-tile-video"
                  />

                  {/* Tile Overlay Header */}
                  <div className="squad-tile-header">
                    <div className="squad-streamer-chip" style={{ borderColor: feed.badgeColor }}>
                      <img src={feed.avatarUrl} alt={feed.username} className="squad-chip-avatar" />
                      <div className="squad-chip-meta">
                        <div className="squad-name-row">
                          <strong>@{feed.username}</strong>
                          {feed.isHost && <Crown size={12} color="#ffd700" />}
                        </div>
                        <span className="squad-role-tag">{feed.role}</span>
                      </div>
                    </div>

                    <button
                      className="btn-tile-focus"
                      title="Focus on this reader"
                      onClick={() => {
                        soundFX.playPop();
                        setFocusedFeedId(feed.id);
                        setLayoutMode('focus');
                      }}
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>

                  {/* Tile Bottom Audio Controls */}
                  <div className="squad-tile-audio-bar">
                    <button
                      className="btn-audio-mute"
                      onClick={() => toggleMute(feed.id)}
                    >
                      {feed.isMuted || feed.volume === 0 ? (
                        <VolumeX size={15} color="var(--accent-danger)" />
                      ) : (
                        <Volume2 size={15} color="#fff" />
                      )}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={feed.isMuted ? 0 : feed.volume}
                      onChange={e => handleVolumeChange(feed.id, parseInt(e.target.value))}
                      className="squad-volume-slider"
                    />

                    <span className="squad-vol-text">{feed.isMuted ? 'Muted' : `${feed.volume}%`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Focus Stage + Filmstrip */
          <div className="squad-focus-layout">
            <div className="squad-focus-primary-video">
              <video
                src={activeFocusFeed.videoUrl}
                autoPlay
                loop
                muted={activeFocusFeed.isMuted}
                playsInline
                className="squad-primary-video"
              />

              <div className="squad-focus-header">
                <div className="squad-streamer-chip" style={{ borderColor: activeFocusFeed.badgeColor }}>
                  <img src={activeFocusFeed.avatarUrl} alt={activeFocusFeed.username} className="squad-chip-avatar" />
                  <div>
                    <strong>@{activeFocusFeed.username}</strong>
                    <div className="squad-role-tag">{activeFocusFeed.role}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Filmstrip */}
            <div className="squad-filmstrip-col">
              {feeds.map(feed => {
                const isSelected = feed.id === activeFocusFeed.id;

                return (
                  <div
                    key={feed.id}
                    className={`squad-filmstrip-card ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      soundFX.playPop();
                      setFocusedFeedId(feed.id);
                    }}
                  >
                    <div className="filmstrip-thumb-wrapper">
                      <video src={feed.videoUrl} autoPlay loop muted playsInline />
                    </div>
                    <div className="filmstrip-info">
                      <strong>@{feed.username}</strong>
                      <span>{feed.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Global Bottom Audio Deck */}
      <div className="squad-audio-master-bar">
        <div className="squad-master-label">
          <Mic size={16} color="var(--accent-secondary)" />
          <span>SQUAD AUDIO STEM MIXER (BALANCE ALL READERS)</span>
        </div>

        <div className="squad-sliders-row">
          {feeds.map(f => (
            <div key={f.id} className="squad-stem-item">
              <span className="stem-username">@{f.username}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={f.isMuted ? 0 : f.volume}
                onChange={e => handleVolumeChange(f.id, parseInt(e.target.value))}
                className="squad-volume-slider"
              />
              <span className="stem-val">{f.isMuted ? 'Muted' : `${f.volume}%`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
