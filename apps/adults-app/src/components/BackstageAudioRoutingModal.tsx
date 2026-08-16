import React, { useState } from 'react';
import { X, Headphones, Sparkles, CheckCircle2, Volume2, Sliders, Radio, VolumeX } from 'lucide-react';
import { DEFAULT_AUDIO_BUS_ROUTES, type AudioBusRoute } from '../lib/backstageAudioData';
import { soundFX } from '../lib/soundFx';

interface BackstageAudioRoutingModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BackstageAudioRoutingModal: React.FC<BackstageAudioRoutingModalProps> = ({
  streamerName,
  onClose
}) => {
  const [routes, setRoutes] = useState<AudioBusRoute[]>(DEFAULT_AUDIO_BUS_ROUTES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleUpdateVolume = (id: string, field: 'streamMixVolume' | 'headphonesMonitorVolume', val: number) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleToggleMute = (id: string, field: 'isStreamMuted' | 'isHeadphonesMuted') => {
    soundFX.playPop();
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, [field]: !r[field] } : r));
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ Split Audio Routing Matrix applied to OBS Virtual Cables & DSP Rack!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="audio-routing-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="audio-routing-modal-header">
          <div className="audio-routing-title-group">
            <div className="audio-routing-badge">
              <Headphones size={16} />
              <span>DUAL MONITOR & BACKSTAGE AUDIO ROUTING MATRIX</span>
            </div>
            <h3>@{streamerName}'s Split Audio Matrix</h3>
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

        {/* Top Split Bus Banner */}
        <div className="split-bus-hero-banner">
          <div className="bus-col">
            <Radio size={18} color="#ff3b3b" />
            <div>
              <strong>Stream Program Output Mix</strong>
              <p>Sent to live stream broadcast (Foley + Ambience + Narrator voice).</p>
            </div>
          </div>

          <div className="bus-col">
            <Headphones size={18} color="#00ff88" />
            <div>
              <strong>Headphones IEM Monitor Mix</strong>
              <p>Sent to narrator's in-ear monitors (Director cue + Metronome click).</p>
            </div>
          </div>
        </div>

        {/* Audio Buses Matrix Table */}
        <div className="audio-buses-table">
          {routes.map(route => (
            <div key={route.id} className="audio-bus-row">
              <div className="bus-name-col">
                <strong>{route.name}</strong>
              </div>

              {/* Stream Output Slider */}
              <div className="bus-slider-col">
                <div className="slider-label-mini">
                  <Radio size={12} color="#ff3b3b" />
                  <span>Stream Mix: {route.isStreamMuted ? 'MUTED' : `${route.streamMixVolume}%`}</span>
                </div>
                <div className="slider-control-row">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    disabled={route.isStreamMuted}
                    value={route.streamMixVolume}
                    onChange={e => handleUpdateVolume(route.id, 'streamMixVolume', Number(e.target.value))}
                    className="bus-slider stream"
                  />
                  <button
                    type="button"
                    className={`btn-mute-toggle ${route.isStreamMuted ? 'muted' : ''}`}
                    onClick={() => handleToggleMute(route.id, 'isStreamMuted')}
                    title="Mute to Stream"
                  >
                    {route.isStreamMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              </div>

              {/* Headphone Monitor Slider */}
              <div className="bus-slider-col">
                <div className="slider-label-mini">
                  <Headphones size={12} color="#00ff88" />
                  <span>IEM Monitor: {route.isHeadphonesMuted ? 'MUTED' : `${route.headphonesMonitorVolume}%`}</span>
                </div>
                <div className="slider-control-row">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    disabled={route.isHeadphonesMuted}
                    value={route.headphonesMonitorVolume}
                    onChange={e => handleUpdateVolume(route.id, 'headphonesMonitorVolume', Number(e.target.value))}
                    className="bus-slider iem"
                  />
                  <button
                    type="button"
                    className={`btn-mute-toggle ${route.isHeadphonesMuted ? 'muted' : ''}`}
                    onClick={() => handleToggleMute(route.id, 'isHeadphonesMuted')}
                    title="Mute in Headphones"
                  >
                    {route.isHeadphonesMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="audio-routing-modal-footer">
          <div className="footer-routing-note">
            <Sliders size={14} color="var(--accent-teal)" />
            <span>Compatible with Voicemeeter Potato, Elgato Wavelink & OBS Split Track Recording.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Save Matrix Routing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
