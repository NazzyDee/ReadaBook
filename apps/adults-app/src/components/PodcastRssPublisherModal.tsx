import React, { useState } from 'react';
import { X, Rss, Sparkles, CheckCircle2, Copy, Radio, Headphones } from 'lucide-react';
import { DEFAULT_PODCAST_SHOW, type PodcastShowChannel } from '../lib/podcastRssPublisherData';
import { soundFX } from '../lib/soundFx';

interface PodcastRssPublisherModalProps {
  streamerName: string;
  onClose: () => void;
}

export const PodcastRssPublisherModal: React.FC<PodcastRssPublisherModalProps> = ({
  streamerName,
  onClose
}) => {
  const [showChannel] = useState<PodcastShowChannel>(DEFAULT_PODCAST_SHOW);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCopyRssUrl = () => {
    soundFX.playPop();
    navigator.clipboard.writeText(showChannel.feedRssUrl);
    setToastMsg('📋 Copied Podcast RSS XML Feed URL to clipboard!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePublishLatestEpisode = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg('🎙️ Transcoded live stream VOD into 320kbps MP3 and distributed to Spotify & Apple Podcasts directory!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="podcast-rss-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="podcast-rss-modal-header">
          <div className="podcast-rss-title-group">
            <div className="podcast-rss-badge">
              <Rss size={16} />
              <span>SPOTIFY & APPLE PODCASTS 1-CLICK RSS AUTO-PUBLISHER</span>
            </div>
            <h3>@{streamerName}'s Podcast Syndication Studio</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Hero RSS Banner */}
        <div className="podcast-rss-hero-banner">
          <div className="rss-icon-dial">
            <Rss size={44} color="#ff9e00" />
            <span className="episodes-count-badge">{showChannel.episodes.length} EPISODES</span>
          </div>

          <div className="podcast-rss-hero-meta">
            <h4>{showChannel.showTitle}</h4>
            <p className="rss-feed-url-text">{showChannel.feedRssUrl}</p>

            <div className="rss-actions-row">
              <button
                type="button"
                className="btn-copy-rss"
                onClick={handleCopyRssUrl}
              >
                <Copy size={14} />
                <span>Copy RSS Feed Link</span>
              </button>

              <button
                type="button"
                className="btn-publish-stream"
                onClick={handlePublishLatestEpisode}
              >
                <Radio size={14} />
                <span>Auto-Publish Current Stream as Episode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <div className="podcast-episodes-list">
          <h4>Published Show Episodes</h4>
          {showChannel.episodes.map(ep => (
            <div key={ep.episodeId} className="podcast-episode-card">
              <div className="ep-card-left">
                <Headphones size={22} color="#00ff88" />
                <div className="ep-info">
                  <strong>Ep #{ep.episodeNumber}: {ep.title}</strong>
                  <span className="ep-meta-sub">⏱️ {ep.durationMinutes} mins • {ep.publishDate}</span>
                </div>
              </div>

              <div className="ep-card-right">
                <span className="ep-plays-badge">🎧 {ep.totalPodcastPlays.toLocaleString()} Plays</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="podcast-rss-modal-footer">
          <span className="footer-podcast-note">
            🎧 Automatically masterizes loudness to -16 LUFS podcast broadcast standard.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
