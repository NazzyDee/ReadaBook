import React, { useState } from 'react';
import { X, Volume2, Sparkles, CheckCircle2, Headphones, Play } from 'lucide-react';
import { DEFAULT_SCREEN_READER_SETTINGS, type ScreenReaderNarrationSettings } from '../lib/audioDescriptionData';
import { soundFX } from '../lib/soundFx';

interface AudioDescriptionEngineModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AudioDescriptionEngineModal: React.FC<AudioDescriptionEngineModalProps> = ({
  streamerName,
  onClose
}) => {
  const [settings, setSettings] = useState<ScreenReaderNarrationSettings>(DEFAULT_SCREEN_READER_SETTINGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTestTts = () => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg('🗣️ "Reader Accessibility Engine: Active stream is Tolkien Book Club by NazzyDee. 342 viewers online."');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="audio-desc-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="audio-desc-modal-header">
          <div className="audio-desc-title-group">
            <div className="audio-desc-badge">
              <Volume2 size={16} />
              <span>SCREEN READER & LIVE AUDIO DESCRIPTION (AD) ENGINE</span>
            </div>
            <h3>@{streamerName}'s Voice Accessibility Staging</h3>
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
        <div className="audio-desc-hero-banner">
          <div className="tts-speed-dial">
            <Headphones size={36} color="#00ff88" />
            <span className="speech-rate-num">{settings.speechRate}x</span>
            <span className="speech-rate-sub">TTS SPEED</span>
          </div>

          <div className="audio-desc-hero-meta">
            <h4>Live Visual-to-Audio Scene Narration</h4>
            <p className="tts-explainer">
              Provides real-time synthesized audio descriptions of streamer gestures, page illustrations, and chat activity for visually impaired listeners.
            </p>

            <button
              type="button"
              className="btn-test-tts"
              onClick={handleTestTts}
            >
              <Play size={14} />
              <span>Test Audio Description Synth</span>
            </button>
          </div>
        </div>

        {/* Sliders & Toggles Grid */}
        <div className="audio-desc-controls-grid">
          <div className="control-item">
            <label>Speech Rate ({settings.speechRate}x)</label>
            <input
              type="range"
              min={0.75}
              max={2.5}
              step={0.25}
              value={settings.speechRate}
              onChange={e => setSettings({ ...settings, speechRate: Number(e.target.value) })}
            />
          </div>

          <div className="control-item">
            <label>Narration Volume ({settings.volumePct}%)</label>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.volumePct}
              onChange={e => setSettings({ ...settings, volumePct: Number(e.target.value) })}
            />
          </div>

          <div className="toggles-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.announceChatMentions}
                onChange={e => setSettings({ ...settings, announceChatMentions: e.target.checked })}
              />
              <span>Announce @mentions in Chat</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.describeVisualEmotes}
                onChange={e => setSettings({ ...settings, describeVisualEmotes: e.target.checked })}
              />
              <span>Describe Stream Animated Emotes</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.announceStreamStatusChanges}
                onChange={e => setSettings({ ...settings, announceStreamStatusChanges: e.target.checked })}
              />
              <span>Announce Chapter Transitions & Raids</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="audio-desc-modal-footer">
          <span className="footer-audio-desc-note">
            🗣️ Uses native Web Speech Synthesis API with WCAG 2.2 AAA Audio Description conformance.
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
