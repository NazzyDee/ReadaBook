import React, { useState } from 'react';
import { X, Disc, Play, Pause, Download, Volume2, VolumeX, Sparkles, Music2, Mic, CloudRain } from 'lucide-react';
import { MOCK_AUDIO_STEMS, type AudioStemPackage } from '../lib/audioStemsData';
import { soundFX } from '../lib/soundFx';

interface AudiobookStemsMarketplaceModalProps {
  onClose: () => void;
}

export const AudiobookStemsMarketplaceModal: React.FC<AudiobookStemsMarketplaceModalProps> = ({
  onClose
}) => {
  const [selectedPack, setSelectedPack] = useState<AudioStemPackage>(MOCK_AUDIO_STEMS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mutedStems, setMutedStems] = useState<Record<string, boolean>>({});
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const toggleMute = (stemName: string) => {
    soundFX.playPop();
    setMutedStems(prev => ({
      ...prev,
      [stemName]: !prev[stemName]
    }));
  };

  const handleDownload = (pack: AudioStemPackage) => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    setDownloadSuccess(`📥 Downloaded "${pack.title}" (Isolated 24-bit FLAC Stems + Commercial License PDF)`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="stems-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="stems-modal-header">
          <div className="stems-title-group">
            <div className="stems-badge">
              <Disc size={16} />
              <span>CREATOR AUDIO STEMS MARKETPLACE & SOUNDTRACK</span>
            </div>
            <h3>Audiobook Multi-Stem Audio Hub</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Download Success Banner */}
        {downloadSuccess && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <p className="stems-intro-text">
          License and download isolated audio stems from top live audiobooks. Isolate clean narrator dialogue, custom character voices, ambient foley soundscapes, and orchestral background scores for remixes and podcasts.
        </p>

        {/* 2-Column Section: Catalog & Stem Mixer Stage */}
        <div className="stems-grid-layout">
          {/* Left: Packages Catalog */}
          <div className="stems-catalog-col">
            {MOCK_AUDIO_STEMS.map(pack => {
              const isSelected = selectedPack.id === pack.id;

              return (
                <div
                  key={pack.id}
                  className={`stem-pack-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedPack(pack);
                  }}
                >
                  <img src={pack.coverUrl} alt={pack.title} className="stem-pack-thumb" />
                  <div className="stem-pack-info">
                    <div className="pack-top-row">
                      <span className="pack-genre">{pack.genre}</span>
                      <span className="pack-price">
                        {pack.price === 0 ? 'FREE (PASS)' : `$${pack.price} USD`}
                      </span>
                    </div>
                    <h4>{pack.title}</h4>
                    <span className="pack-narrator">by @{pack.narrator} • {pack.duration}</span>

                    <div className="pack-chips-row">
                      <span className="pack-meta-chip">{pack.bpm}</span>
                      <span className="pack-meta-chip">{pack.key}</span>
                      <span className="pack-stems-count">{pack.stems.length} Stems</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Stem Mixer & Transport Deck */}
          <div className="stems-mixer-col">
            <div className="mixer-header-box">
              <div className="mixer-title-meta">
                <span className="mixer-pill">MULTI-TRACK STEM MIXER</span>
                <h3>{selectedPack.title}</h3>
                <p>Narrated by @{selectedPack.narrator} • {selectedPack.bookTitle}</p>
              </div>

              <button
                type="button"
                className="btn-primary btn-download-stems"
                onClick={() => handleDownload(selectedPack)}
              >
                <Download size={16} />
                <span>{selectedPack.price === 0 ? 'Download Free Stem Pack' : `License Pack ($${selectedPack.price})`}</span>
              </button>
            </div>

            {/* Playback Transport Preview */}
            <div className="stems-transport-bar">
              <button
                type="button"
                className="btn-stems-play"
                onClick={() => {
                  soundFX.playPop();
                  setIsPlaying(!isPlaying);
                }}
              >
                {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
                <span>{isPlaying ? 'Pause Preview' : 'Play Multi-Stem Preview'}</span>
              </button>
            </div>

            {/* Individual Stem Channels */}
            <div className="stems-channels-list">
              {selectedPack.stems.map((stem, idx) => {
                const isMuted = !!mutedStems[stem.name];

                return (
                  <div key={idx} className={`stem-channel-card ${isMuted ? 'muted' : ''}`}>
                    <div className="stem-channel-left">
                      <div className="stem-icon-badge">
                        {stem.type === 'vocal' ? (
                          <Mic size={15} color="var(--accent-primary)" />
                        ) : stem.type === 'foley' ? (
                          <CloudRain size={15} color="var(--accent-secondary)" />
                        ) : (
                          <Music2 size={15} color="#ffd700" />
                        )}
                      </div>
                      <div className="stem-name-group">
                        <strong>{stem.name}</strong>
                        <span className="stem-type-label">{stem.type.toUpperCase()} STEM</span>
                      </div>
                    </div>

                    {/* Waveform graphic mock */}
                    <div className="stem-waveform-visual">
                      {stem.waveformMock.map((height, hIdx) => (
                        <div
                          key={hIdx}
                          className={`wave-bar ${isPlaying && !isMuted ? 'active-pulse' : ''}`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>

                    {/* Stem Mute Button */}
                    <button
                      type="button"
                      className={`btn-stem-mute ${isMuted ? 'is-muted' : ''}`}
                      onClick={() => toggleMute(stem.name)}
                      title={isMuted ? 'Unmute Stem' : 'Mute Stem'}
                    >
                      {isMuted ? <VolumeX size={15} color="var(--accent-danger)" /> : <Volume2 size={15} color="var(--text-muted)" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
