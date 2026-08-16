import React, { useState } from 'react';
import {
  X,
  VolumeX,
  CloudRain,
  Flame,
  Waves,
  BookOpen,
  Sliders
} from 'lucide-react';
import { ambientEngine } from '../lib/ambientSoundEngine';
import { soundFX } from '../lib/soundFx';

interface AmbientSoundMixerProps {
  onClose: () => void;
}

export const AmbientSoundMixer: React.FC<AmbientSoundMixerProps> = ({ onClose }) => {
  const [rainVol, setRainVol] = useState(0);
  const [fireVol, setFireVol] = useState(0);
  const [wavesVol, setWavesVol] = useState(0);
  const [libraryVol, setLibraryVol] = useState(0);

  const handleSetRain = (val: number) => {
    setRainVol(val);
    ambientEngine.setSoundVolume('rain', val / 100);
  };

  const handleSetFire = (val: number) => {
    setFireVol(val);
    ambientEngine.setSoundVolume('fire', val / 100);
  };

  const handleSetWaves = (val: number) => {
    setWavesVol(val);
    ambientEngine.setSoundVolume('waves', val / 100);
  };

  const handleSetLibrary = (val: number) => {
    setLibraryVol(val);
    ambientEngine.setSoundVolume('library', val / 100);
  };

  const handlePreset = (preset: 'rainy_cafe' | 'fireplace_focus' | 'deep_sea') => {
    soundFX.playPop();
    if (preset === 'rainy_cafe') {
      handleSetRain(60);
      handleSetFire(0);
      handleSetWaves(0);
      handleSetLibrary(40);
    } else if (preset === 'fireplace_focus') {
      handleSetRain(0);
      handleSetFire(70);
      handleSetWaves(0);
      handleSetLibrary(30);
    } else if (preset === 'deep_sea') {
      handleSetRain(30);
      handleSetFire(0);
      handleSetWaves(75);
      handleSetLibrary(0);
    }
  };

  const handleStopAll = () => {
    soundFX.playPop();
    handleSetRain(0);
    handleSetFire(0);
    handleSetWaves(0);
    handleSetLibrary(0);
    ambientEngine.stopAll();
  };

  const isAnyActive = rainVol > 0 || fireVol > 0 || wavesVol > 0 || libraryVol > 0;

  return (
    <div className="ambient-sound-mixer-card">
      {/* Header */}
      <div className="mixer-header">
        <div className="mixer-title-group">
          <Sliders size={16} color="var(--accent-secondary)" />
          <h4>Personal Lo-Fi & Ambient Sound Mixer</h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAnyActive && (
            <button onClick={handleStopAll} className="btn-mixer-mute-all" title="Mute all ambient sounds">
              <VolumeX size={14} /> Mute All
            </button>
          )}
          <button onClick={onClose} className="mixer-close-btn">
            <X size={16} />
          </button>
        </div>
      </div>

      <p className="mixer-sub">Layer procedural relaxing sounds beneath the broadcaster's voice.</p>

      {/* Preset Buttons */}
      <div className="mixer-presets-row">
        <button
          type="button"
          onClick={() => handlePreset('rainy_cafe')}
          className="btn-preset-chip"
        >
          🌧️ Rainy Library
        </button>
        <button
          type="button"
          onClick={() => handlePreset('fireplace_focus')}
          className="btn-preset-chip"
        >
          🔥 Cozy Hearth
        </button>
        <button
          type="button"
          onClick={() => handlePreset('deep_sea')}
          className="btn-preset-chip"
        >
          🌊 Ocean Calm
        </button>
      </div>

      {/* Sound Sliders List */}
      <div className="mixer-channels-list">
        {/* Rain */}
        <div className="mixer-channel-row">
          <div className="channel-icon-label">
            <CloudRain size={16} color="#00e5ff" />
            <span>Gentle Rain</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={rainVol}
            onChange={e => handleSetRain(parseInt(e.target.value, 10))}
            className="mixer-slider"
          />
          <span className="mixer-vol-num">{rainVol}%</span>
        </div>

        {/* Fireplace */}
        <div className="mixer-channel-row">
          <div className="channel-icon-label">
            <Flame size={16} color="#ffb703" />
            <span>Fireplace Crackle</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={fireVol}
            onChange={e => handleSetFire(parseInt(e.target.value, 10))}
            className="mixer-slider"
          />
          <span className="mixer-vol-num">{fireVol}%</span>
        </div>

        {/* Waves */}
        <div className="mixer-channel-row">
          <div className="channel-icon-label">
            <Waves size={16} color="#00ff88" />
            <span>Ocean Waves</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={wavesVol}
            onChange={e => handleSetWaves(parseInt(e.target.value, 10))}
            className="mixer-slider"
          />
          <span className="mixer-vol-num">{wavesVol}%</span>
        </div>

        {/* Library */}
        <div className="mixer-channel-row">
          <div className="channel-icon-label">
            <BookOpen size={16} color="#ffd700" />
            <span>Library Whir</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={libraryVol}
            onChange={e => handleSetLibrary(parseInt(e.target.value, 10))}
            className="mixer-slider"
          />
          <span className="mixer-vol-num">{libraryVol}%</span>
        </div>
      </div>
    </div>
  );
};
