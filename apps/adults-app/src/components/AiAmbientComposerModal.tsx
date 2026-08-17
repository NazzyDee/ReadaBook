import React, { useState } from 'react';
import { X, Music, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { DEFAULT_AMBIENT_PROFILES, type AmbientMoodProfile } from '../lib/aiAmbientComposerData';
import { soundFX } from '../lib/soundFx';

interface AiAmbientComposerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AiAmbientComposerModal: React.FC<AiAmbientComposerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [profiles, setProfiles] = useState<AmbientMoodProfile[]>(DEFAULT_AMBIENT_PROFILES);
  const [selectedMoodId, setSelectedMoodId] = useState<string>('mood_tavern');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleApplyMood = (mood: AmbientMoodProfile) => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg(`🎧 Live Ambient Soundscape shifted to "${mood.moodName}"!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentMood = profiles.find(m => m.id === selectedMoodId) || profiles[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="ambient-composer-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ambient-composer-modal-header">
          <div className="ambient-composer-title-group">
            <div className="ambient-composer-badge">
              <Music size={16} />
              <span>GENERATIVE AMBIENT SOUNDSCAPE AI COMPOSER</span>
            </div>
            <h3>@{streamerName}'s Dynamic Acoustic Score</h3>
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

        {/* Hero Mood Banner */}
        <div className="ambient-hero-banner">
          <div className="soundscape-visualizer-dial">
            <Music size={36} color="#00ff88" />
            <span className="intensity-pct-num">{currentMood.intensityLevelPct}%</span>
            <span className="intensity-label">MOOD INTENSITY</span>
          </div>

          <div className="ambient-hero-meta">
            <div className="ambient-tags-row">
              <span className="sound-layer-pill">🌧️ {currentMood.weatherSound.replace(/_/g, ' ')}</span>
              <span className="music-layer-pill">🎵 {currentMood.musicLayer.replace(/_/g, ' ')}</span>
              <span className="reverb-pill">🏛️ {currentMood.reverbSpace} REVERB</span>
            </div>

            <h4>{currentMood.moodName}</h4>
            <p className="ambient-explainer">
              Real-time procedural audio synthesis generated directly in your browser with 0 copyright DMCA claims.
            </p>

            <div className="ambient-action-buttons">
              <button
                type="button"
                className="btn-apply-ambient"
                onClick={() => handleApplyMood(currentMood)}
              >
                <Play size={14} />
                <span>Trigger Soundscape Transition</span>
              </button>

              <label className="toggle-adaptive-label">
                <input
                  type="checkbox"
                  checked={currentMood.isAutoAdaptingToText}
                  onChange={e => setProfiles(prev => prev.map(p => p.id === currentMood.id ? { ...p, isAutoAdaptingToText: e.target.checked } : p))}
                />
                <span>Auto-Adapt to Story Plot Changes</span>
              </label>
            </div>
          </div>
        </div>

        {/* Mood Profiles Grid */}
        <div className="ambient-profiles-grid">
          {profiles.map(p => (
            <div
              key={p.id}
              className={`ambient-tile ${p.id === selectedMoodId ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedMoodId(p.id);
              }}
            >
              <div className="ambient-tile-top">
                <strong>{p.moodName.split('(')[0]}</strong>
                <span className="intensity-badge">{p.intensityLevelPct}% Vol</span>
              </div>
              <span className="ambient-weather-sub">🌧️ {p.weatherSound.replace(/_/g, ' ')}</span>
              <span className="ambient-music-sub">🎵 {p.musicLayer.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="ambient-composer-modal-footer">
          <span className="footer-ambient-note">
            🎧 100% royalty-free generative soundscape engine powered by WebAudio API oscillators and noise generators.
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
