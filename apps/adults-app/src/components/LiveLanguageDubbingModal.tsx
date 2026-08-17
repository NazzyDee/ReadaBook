import React, { useState } from 'react';
import { X, Globe, Sparkles, CheckCircle2, Radio } from 'lucide-react';
import { DEFAULT_DUBBING_TRACKS, type DubbedLanguageTrack } from '../lib/liveLanguageDubbingData';
import { soundFX } from '../lib/soundFx';

interface LiveLanguageDubbingModalProps {
  streamerName: string;
  onClose: () => void;
}

export const LiveLanguageDubbingModal: React.FC<LiveLanguageDubbingModalProps> = ({
  streamerName,
  onClose
}) => {
  const [tracks, setTracks] = useState<DubbedLanguageTrack[]>(DEFAULT_DUBBING_TRACKS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggleTrack = (track: DubbedLanguageTrack) => {
    soundFX.playPop();
    setTracks(prev => prev.map(t => t.id === track.id ? { ...t, isEnabled: !t.isEnabled } : t));
    setToastMsg(`🌐 ${track.flagEmoji} ${track.languageName} Dubbing & Subtitles ${!track.isEnabled ? 'ACTIVATED' : 'MUTED'}.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalListeners = tracks.reduce((acc, t) => acc + (t.isEnabled ? t.activeListenersCount : 0), 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="dubbing-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="dubbing-modal-header">
          <div className="dubbing-title-group">
            <div className="dubbing-badge">
              <Globe size={16} />
              <span>REAL-TIME MULTI-LANGUAGE AUDIO DUBBING & LIVE SUBTITLES</span>
            </div>
            <h3>@{streamerName}'s Global Broadcast Matrix</h3>
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

        {/* Hero Banner */}
        <div className="dubbing-hero-banner">
          <div className="dubbing-stat-dial">
            <Globe size={36} color="#00ff88" />
            <span className="global-listeners-num">{totalListeners.toLocaleString()}</span>
            <span className="global-listeners-sub">INTL LISTENERS</span>
          </div>

          <div className="dubbing-hero-meta">
            <h4>Live Neural Voice Dubbing Channels</h4>
            <p className="dubbing-explainer">
              Stream speech is converted into synthesized multilingual audio tracks and closed captions with emotional tone preservation.
            </p>

            <div className="active-tracks-pill-row">
              {tracks.filter(t => t.isEnabled).map(t => (
                <span key={t.id} className="active-track-chip">
                  {t.flagEmoji} {t.languageName.split(' ')[0]} ({t.activeListenersCount} listeners)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="dubbing-tracks-grid">
          {tracks.map(t => (
            <div key={t.id} className={`dubbing-track-card ${t.isEnabled ? 'active' : ''}`}>
              <div className="track-header-row">
                <div className="track-lang-info">
                  <span className="track-flag">{t.flagEmoji}</span>
                  <strong>{t.languageName}</strong>
                </div>
                <span className="track-model-tag">{t.aiVoiceModel.replace(/_/g, ' ')}</span>
              </div>

              <p className="track-sample-subtitle">{t.sampleSubtitle}</p>

              <div className="track-footer-row">
                <span className="track-listeners-count">🎧 {t.activeListenersCount} listening</span>
                <button
                  type="button"
                  className={`btn-toggle-dub ${t.isEnabled ? 'active' : ''}`}
                  onClick={() => handleToggleTrack(t)}
                >
                  <Radio size={12} />
                  <span>{t.isEnabled ? 'Broadcast Live' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="dubbing-modal-footer">
          <span className="footer-dubbing-note">
            🌐 Viewers can select individual audio streams from the video player settings gear menu.
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
