import React, { useState } from 'react';
import { X, Headphones, Sparkles, CheckCircle2, Compass } from 'lucide-react';
import { DEFAULT_SPATIAL_SOURCES, type SpatialSoundSource } from '../lib/spatialBinauralData';
import { soundFX } from '../lib/soundFx';

interface SpatialBinauralPannerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const SpatialBinauralPannerModal: React.FC<SpatialBinauralPannerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [sources, setSources] = useState<SpatialSoundSource[]>(DEFAULT_SPATIAL_SOURCES);
  const [selectedSourceId, setSelectedSourceId] = useState<string>('src_narrator');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleUpdatePos = (id: string, x: number, y: number) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, posX: x, posY: y } : s));
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ 3D Spatial HRTF Audio Panning Matrix synced to Stream Binaural DSP!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  const currentSource = sources.find(s => s.id === selectedSourceId) || sources[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="spatial-panner-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="spatial-panner-modal-header">
          <div className="spatial-panner-title-group">
            <div className="spatial-panner-badge">
              <Headphones size={16} />
              <span>SURROUND 5.1 & SPATIAL HEADPHONE BINAURAL PANNER (HRTF)</span>
            </div>
            <h3>@{streamerName}'s 3D Spatial Soundstage</h3>
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

        {/* 360 Head Soundstage Radar Banner */}
        <div className="spatial-hero-banner">
          <div className="spatial-radar-circle">
            <div className="listener-head-center">
              <Headphones size={24} color="#ffd700" />
              <span>YOU</span>
            </div>

            {sources.map(s => (
              <div
                key={s.id}
                className={`spatial-source-dot ${s.id === selectedSourceId ? 'selected' : ''}`}
                style={{
                  left: `${((s.posX + 100) / 200) * 100}%`,
                  top: `${((100 - s.posY) / 200) * 100}%`
                }}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedSourceId(s.id);
                }}
                title={s.sourceName}
              >
                <span>{s.sourceType === 'NARRATOR' ? '🎙️' : s.sourceType === 'WHISPER' ? '👂' : '🌧️'}</span>
              </div>
            ))}
          </div>

          <div className="spatial-hero-meta">
            <h4>Binaural Head-Related Transfer Function (HRTF)</h4>
            <p>
              Simulates sound wave reflections off human ears and skull for hyper-immersive 3D audio in ordinary stereo headphones.
            </p>
            <div className="active-source-badge">
              <span>Active Object: <strong>{currentSource.sourceName}</strong></span>
              <span>X: {currentSource.posX} | Y: {currentSource.posY}</span>
            </div>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="spatial-controls-grid">
          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>LEFT / RIGHT AZIMUTH (X):</label>
              <strong>{currentSource.posX > 0 ? `+${currentSource.posX} (Right)` : `${currentSource.posX} (Left)`}</strong>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={currentSource.posX}
              onChange={e => handleUpdatePos(currentSource.id, Number(e.target.value), currentSource.posY)}
              className="spatial-slider"
            />
          </div>

          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>FRONT / BACK ELEVATION (Y):</label>
              <strong>{currentSource.posY > 0 ? `+${currentSource.posY} (Front)` : `${currentSource.posY} (Behind)`}</strong>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={currentSource.posY}
              onChange={e => handleUpdatePos(currentSource.id, currentSource.posX, Number(e.target.value))}
              className="spatial-slider"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="spatial-panner-modal-footer">
          <div className="footer-spatial-note">
            <Compass size={14} color="var(--accent-teal)" />
            <span>Compatible with Apple Spatial Audio, Dolby Atmos for Headphones & DTS Headphone:X.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Apply 3D Soundstage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
