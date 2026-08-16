import React, { useState } from 'react';
import { X, Palette, CheckCircle2, Sparkles, Send, Image as ImageIcon } from 'lucide-react';
import { MOCK_EMOTE_ARTISTS, type EmoteArtist } from '../lib/emoteArtistData';
import { soundFX } from '../lib/soundFx';

interface EmoteArtistAttributionModalProps {
  onClose: () => void;
}

export const EmoteArtistAttributionModal: React.FC<EmoteArtistAttributionModalProps> = ({
  onClose
}) => {
  const [artists] = useState<EmoteArtist[]>(MOCK_EMOTE_ARTISTS);
  const [selectedArtist, setSelectedArtist] = useState<EmoteArtist>(MOCK_EMOTE_ARTISTS[0]);
  const [commissionSuccess, setCommissionSuccess] = useState<string | null>(null);

  const handleCommissionRequest = (artist: EmoteArtist) => {
    soundFX.playApplause();
    setCommissionSuccess(`✨ Commission inquiry sent to @${artist.handle}! They will reply to your ReadaBook inbox.`);
    setTimeout(() => setCommissionSuccess(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="artist-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="artist-modal-header">
          <div className="artist-title-group">
            <div className="artist-badge">
              <Palette size={16} />
              <span>COMMUNITY EMOTE ARTIST DIRECTORY & ATTRIBUTION</span>
            </div>
            <h3>Book Club Emote & Badge Artists</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Banner */}
        {commissionSuccess && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{commissionSuccess}</span>
          </div>
        )}

        <p className="artist-intro-text">
          Support community illustrators who design subscriber loyalty badges, animated book club runes, and stream graphics. Discover top fantasy artists or request custom commissions for your channel.
        </p>

        {/* 2-Column Section */}
        <div className="artist-grid-layout">
          {/* Left: Artists List */}
          <div className="artist-list-col">
            {artists.map(art => {
              const isSelected = selectedArtist.id === art.id;

              return (
                <div
                  key={art.id}
                  className={`artist-list-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedArtist(art);
                  }}
                >
                  <img src={art.avatarUrl} alt={art.artistName} className="artist-item-avatar" />
                  <div className="artist-item-info">
                    <div className="artist-name-row">
                      <strong>{art.artistName}</strong>
                      {art.isVerified && (
                        <CheckCircle2 size={14} color="#00e5ff" fill="rgba(0, 229, 255, 0.2)" />
                      )}
                    </div>
                    <span className="artist-specialty-sub">{art.specialty}</span>
                    <div className="artist-status-row">
                      <span className={`commission-chip ${art.commissionStatus.toLowerCase()}`}>
                        Commissions {art.commissionStatus}
                      </span>
                      <span className="artist-starting-price">From ${art.startingPrice}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Artist Portfolio & Commission Form */}
          <div className="artist-profile-col">
            <div className="artist-hero-box">
              <div className="artist-hero-left">
                <img src={selectedArtist.avatarUrl} alt={selectedArtist.artistName} className="artist-hero-avatar" />
                <div>
                  <div className="hero-name-badge">
                    <h3>{selectedArtist.artistName}</h3>
                    {selectedArtist.isVerified && (
                      <CheckCircle2 size={16} color="#00e5ff" fill="rgba(0, 229, 255, 0.2)" />
                    )}
                  </div>
                  <span className="hero-handle">@{selectedArtist.handle}</span>
                </div>
              </div>

              <div className="hero-pricing-box">
                <span className="pricing-sub">Base Commission</span>
                <strong>${selectedArtist.startingPrice} USD</strong>
              </div>
            </div>

            <p className="artist-bio-text">{selectedArtist.bio}</p>

            {/* Portfolio Sample Showcase */}
            <div className="artist-portfolio-showcase">
              <span className="portfolio-label">
                <ImageIcon size={14} />
                <span>Featured Badges & Sub Runes</span>
              </span>

              <div className="portfolio-thumbs-row">
                {selectedArtist.sampleArtUrls.map((url, idx) => (
                  <img key={idx} src={url} alt="Portfolio item" className="portfolio-sample-thumb" />
                ))}
              </div>
            </div>

            {/* Commission Action Button */}
            <button
              type="button"
              className="btn-primary btn-request-commission"
              onClick={() => handleCommissionRequest(selectedArtist)}
            >
              <Send size={16} />
              <span>Request Custom Emote / Badge Commission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
