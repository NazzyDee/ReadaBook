import React, { useState } from 'react';
import { X, Radio, Sparkles, CheckCircle2, Music, Mic, Volume2 } from 'lucide-react';
import {
  DEFAULT_SOUNDTRACK_SETTINGS,
  DMCA_FREE_PLAYLISTS,
  type SoundtrackSettings
} from '../lib/soundtrackData';
import { soundFX } from '../lib/soundFx';

interface SoundtrackIntegrationModalProps {
  streamerName: string;
  onClose: () => void;
}

export const SoundtrackIntegrationModal: React.FC<SoundtrackIntegrationModalProps> = ({
  streamerName,
  onClose
}) => {
  const [settings, setSettings] = useState<SoundtrackSettings>(DEFAULT_SOUNDTRACK_SETTINGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectPlaylist = (name: string) => {
    soundFX.playPop();
    setSettings(prev => ({
      ...prev,
      playlistName: name,
      nowPlayingTitle: `${name} (Track 1)`,
      nowPlayingArtist: 'ReadaBook Soundtracks'
    }));
    setToastMsg(`🎵 Switched active soundtrack playlist to: "${name}"`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playChestClaim();
    setToastMsg('📻 Atmosphere Soundtrack & Voice Ducking settings saved!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="soundtrack-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="soundtrack-modal-header">
          <div className="soundtrack-title-group">
            <div className="soundtrack-badge">
              <Radio size={16} />
              <span>NARRATOR SOUNDTRACK & SPOTIFY NOW PLAYING DECK</span>
            </div>
            <h3>@{streamerName}'s Atmosphere Audio Manager</h3>
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

        {/* Now Playing Banner */}
        <div className="now-playing-banner">
          <div className="music-disc-icon spin-slow">
            <Music size={24} color="#ffd700" />
          </div>
          <div className="track-details">
            <span className="now-playing-pill">NOW STREAMING</span>
            <h4>{settings.nowPlayingTitle}</h4>
            <p>{settings.nowPlayingArtist} • {settings.playlistName}</p>
          </div>
          <div className="source-tag-pill">
            {settings.source === 'SPOTIFY' ? '🟢 Spotify Sync' : '🛡️ 100% DMCA-Safe'}
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSave} className="soundtrack-form">
          {/* Voice Ducking Box */}
          <div className="ducking-controls-box">
            <div className="ducking-header">
              <div className="duck-title">
                <Mic size={16} color="var(--accent-teal)" />
                <strong>Smart Voice Ducking (OBS Sidechain Compressor)</strong>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={settings.isVoiceDuckingEnabled}
                  onChange={e => setSettings({ ...settings, isVoiceDuckingEnabled: e.target.checked })}
                />
                <span className="switch-slider"></span>
              </label>
            </div>
            <p className="ducking-subtext">
              Automatically dips background soundtrack volume by {Math.abs(settings.duckingAmountDb)}dB whenever narrator voice is detected.
            </p>

            <div className="ducking-sliders-row">
              <div className="ducking-slider-item">
                <label>Music Volume ({settings.volumePercent}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volumePercent}
                  onChange={e => setSettings({ ...settings, volumePercent: Number(e.target.value) })}
                />
              </div>

              <div className="ducking-slider-item">
                <label>Ducking Depth ({settings.duckingAmountDb} dB)</label>
                <input
                  type="range"
                  min="-30"
                  max="-6"
                  value={settings.duckingAmountDb}
                  onChange={e => setSettings({ ...settings, duckingAmountDb: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* DMCA Free Curated Playlists */}
          <div className="curated-playlists-section">
            <label className="sec-label">DMCA-FREE ATMOSPHERE PLAYLISTS:</label>
            <div className="playlists-grid">
              {DMCA_FREE_PLAYLISTS.map(pl => (
                <div
                  key={pl.id}
                  className={`playlist-card ${settings.playlistName === pl.name ? 'active' : ''}`}
                  onClick={() => handleSelectPlaylist(pl.name)}
                >
                  <span className="pl-icon">{pl.icon}</span>
                  <div className="pl-info">
                    <h4>{pl.name}</h4>
                    <span>{pl.trackCount} Atmospheric Tracks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay Toggle Row */}
          <div className="overlay-toggle-row">
            <label className="toggle-label-row">
              <input
                type="checkbox"
                checked={settings.showNowPlayingOverlay}
                onChange={e => setSettings({ ...settings, showNowPlayingOverlay: e.target.checked })}
              />
              <div className="toggle-text">
                <strong><Volume2 size={14} /> Display "Now Playing" Widget in Video Player</strong>
                <span>Shows subtle song title chip in bottom corner of stream.</span>
              </div>
            </label>
          </div>

          {/* Footer */}
          <div className="soundtrack-modal-footer">
            <button type="submit" className="btn-primary btn-save-soundtrack">
              <CheckCircle2 size={16} />
              <span>Apply Atmosphere Soundtrack</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
