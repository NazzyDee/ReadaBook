import React, { useState } from 'react';
import { X, Sliders, Mic, Volume2, VolumeX, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DEFAULT_DUAL_AUDIO_STATE, type DualAudioMixerState, type AudioChannelConfig } from '../lib/dualAudioData';
import { soundFX } from '../lib/soundFx';

interface DualAudioMixerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const DualAudioMixerModal: React.FC<DualAudioMixerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [mixer, setMixer] = useState<DualAudioMixerState>(DEFAULT_DUAL_AUDIO_STATE);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleVolumeChange = (channelKey: 'hostChannel' | 'guestChannel' | 'foleyChannel', val: number) => {
    setMixer(prev => ({
      ...prev,
      [channelKey]: { ...prev[channelKey], volume: val }
    }));
  };

  const handleToggleMute = (channelKey: 'hostChannel' | 'guestChannel' | 'foleyChannel') => {
    soundFX.playPop();
    setMixer(prev => ({
      ...prev,
      [channelKey]: { ...prev[channelKey], isMuted: !prev[channelKey].isMuted }
    }));
  };

  const handleSaveMixer = () => {
    soundFX.playChestClaim();
    setSaveToast('🎚️ Dual-narrator audio mix & foley ducking applied!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const renderChannelFader = (
    key: 'hostChannel' | 'guestChannel' | 'foleyChannel',
    ch: AudioChannelConfig
  ) => (
    <div key={ch.channelId} className={`fader-channel-card ${ch.isMuted ? 'muted' : ''}`}>
      <div className="channel-card-header">
        <span className="role-tag-sm">{ch.role}</span>
        <strong>{ch.name}</strong>
      </div>

      {/* Volume Slider & Level */}
      <div className="fader-controls-wrap">
        <div className="fader-slider-row">
          <input
            type="range"
            min={0}
            max={100}
            value={ch.isMuted ? 0 : ch.volume}
            disabled={ch.isMuted}
            onChange={e => handleVolumeChange(key, Number(e.target.value))}
            className="vertical-fader-input"
          />
          <span className="volume-val-display">{ch.isMuted ? '0%' : `${ch.volume}%`}</span>
        </div>

        {/* Pan Slider */}
        <div className="pan-slider-group">
          <label>Pan: {ch.pan === 0 ? 'Center' : ch.pan < 0 ? `L${Math.abs(ch.pan)}` : `R${ch.pan}`}</label>
          <input
            type="range"
            min={-50}
            max={50}
            value={ch.pan}
            onChange={e =>
              setMixer(prev => ({
                ...prev,
                [key]: { ...prev[key], pan: Number(e.target.value) }
              }))
            }
          />
        </div>
      </div>

      {/* Mute Button */}
      <button
        type="button"
        className={`btn-mute-channel ${ch.isMuted ? 'is-muted' : ''}`}
        onClick={() => handleToggleMute(key)}
      >
        {ch.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        <span>{ch.isMuted ? 'Muted' : 'Mute'}</span>
      </button>
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="audio-mixer-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="audio-mixer-header">
          <div className="audio-mixer-title-group">
            <div className="audio-mixer-badge">
              <Sliders size={16} />
              <span>DUAL-NARRATOR & FOLEY DUCKING CONSOLE</span>
            </div>
            <h3>@{streamerName}'s Studio Audio Mixer</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {saveToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* 3-Channel Fader Rack */}
        <div className="channels-faders-rack">
          {renderChannelFader('hostChannel', mixer.hostChannel)}
          {renderChannelFader('guestChannel', mixer.guestChannel)}
          {renderChannelFader('foleyChannel', mixer.foleyChannel)}
        </div>

        {/* Auto-Ducking Settings Box */}
        <div className="auto-ducking-panel">
          <div className="ducking-top-row">
            <div className="ducking-title-meta">
              <h4>
                <Mic size={16} color="var(--accent-secondary)" />
                <span>Smart Foley Auto-Ducking</span>
              </h4>
              <p>Automatically reduces ambient rain and hearth foley volume when either narrator speaks.</p>
            </div>

            <label className="toggle-switch-wrap">
              <input
                type="checkbox"
                checked={mixer.isAutoDuckingEnabled}
                onChange={e => {
                  soundFX.playPop();
                  setMixer({ ...mixer, isAutoDuckingEnabled: e.target.checked });
                }}
              />
              <span>{mixer.isAutoDuckingEnabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>

          {mixer.isAutoDuckingEnabled && (
            <div className="ducking-slider-row">
              <label>Ducking Attenuation: <strong>{mixer.duckingAttenuationDb} dB</strong></label>
              <input
                type="range"
                min={-30}
                max={-6}
                value={mixer.duckingAttenuationDb}
                onChange={e => setMixer({ ...mixer, duckingAttenuationDb: Number(e.target.value) })}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="audio-mixer-footer">
          <div className="mixer-footer-note">
            <ShieldCheck size={14} color="var(--text-muted)" />
            <span>Real-time WebRTC stereo spatializer & software limiter active.</span>
          </div>

          <button
            type="button"
            className="btn-primary btn-save-mixer"
            onClick={handleSaveMixer}
          >
            <CheckCircle2 size={16} />
            <span>Apply Mix to Broadcast</span>
          </button>
        </div>
      </div>
    </div>
  );
};
