import React, { useState } from 'react';
import { X, Mic, Sparkles, CheckCircle2, Sliders, Volume2, ShieldCheck } from 'lucide-react';
import { DEFAULT_ACOUSTIC_PROFILES, type AcousticProfile } from '../lib/roomAcousticData';
import { soundFX } from '../lib/soundFx';

interface RoomAcousticOptimizerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const RoomAcousticOptimizerModal: React.FC<RoomAcousticOptimizerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [profiles] = useState<AcousticProfile[]>(DEFAULT_ACOUSTIC_PROFILES);
  const [selectedId, setSelectedId] = useState<string>('prof_home_library');
  const [reverbDb, setReverbDb] = useState<number>(-18);
  const [noiseGateDb, setNoiseGateDb] = useState<number>(-48);
  const [mouthClickFilter, setMouthClickFilter] = useState<boolean>(true);
  const [pageTurnDeEsser, setPageTurnDeEsser] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectProfile = (p: AcousticProfile) => {
    soundFX.playPop();
    setSelectedId(p.id);
    setReverbDb(p.reverbSuppressionDb);
    setMouthClickFilter(p.mouthClickFilter);
    setPageTurnDeEsser(p.pageTurnDeEsser);
    setToastMsg(`🎙️ Calibrated Acoustic Room Profile: "${p.name}"`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ Studio Room Acoustic Filters applied to Live Broadcast DSP Rack!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="acoustic-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="acoustic-modal-header">
          <div className="acoustic-title-group">
            <div className="acoustic-badge">
              <Mic size={16} />
              <span>STUDIO NOISE GATE & ROOM ACOUSTIC OPTIMIZER</span>
            </div>
            <h3>@{streamerName}'s Acoustic Studio Rack</h3>
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

        {/* Active Acoustic Monitor Banner */}
        <div className="acoustic-hero-banner">
          <div className="spectrum-visual">
            <span className="spectrum-bars animate-pulse"> ▃▅▇█▇▅▃ </span>
            <div className="noise-floor-tag">
              <Volume2 size={14} color="#00ff88" />
              <span>Room Noise Floor: {noiseGateDb} dB (Audible Silence)</span>
            </div>
          </div>

          <div className="acoustic-hero-meta">
            <h4>Real-Time Audiobook Studio Calibration</h4>
            <p>
              Automatically suppresses room reflections, fan hums, saliva mouth clicks, and paper-turn rustles without muffling high-frequency consonant clarity.
            </p>
          </div>
        </div>

        {/* Room Presets Grid */}
        <div className="acoustic-profiles-grid">
          {profiles.map(p => {
            const isSelected = p.id === selectedId;
            return (
              <div
                key={p.id}
                className={`acoustic-profile-tile ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectProfile(p)}
              >
                <div className="profile-top">
                  <strong>{p.name}</strong>
                  <ShieldCheck size={14} color={isSelected ? '#00ff88' : 'var(--text-muted)'} />
                </div>
                <span className="room-type-label">{p.roomType}</span>
                <div className="profile-specs-mini">
                  <span>Reverb: {p.reverbSuppressionDb}dB</span>
                  <span>Floor: {p.noiseFloorDb}dB</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Precision Sliders */}
        <div className="acoustic-controls-grid">
          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>REVERB DEREVERBERATION:</label>
              <strong>{reverbDb} dB</strong>
            </div>
            <input
              type="range"
              min="-36"
              max="0"
              value={reverbDb}
              onChange={e => setReverbDb(Number(e.target.value))}
              className="acoustic-slider"
            />
          </div>

          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>NOISE GATE THRESHOLD:</label>
              <strong>{noiseGateDb} dB</strong>
            </div>
            <input
              type="range"
              min="-70"
              max="-30"
              value={noiseGateDb}
              onChange={e => setNoiseGateDb(Number(e.target.value))}
              className="acoustic-slider"
            />
          </div>

          <div className="toggle-feature-box">
            <div>
              <strong>Saliva & Mouth-Click Filter</strong>
              <p>Eliminates high-frequency mouth clicks during intimate whispering.</p>
            </div>
            <button
              type="button"
              className={`btn-toggle-switch ${mouthClickFilter ? 'on' : 'off'}`}
              onClick={() => {
                soundFX.playPop();
                setMouthClickFilter(prev => !prev);
              }}
            >
              {mouthClickFilter ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          <div className="toggle-feature-box">
            <div>
              <strong>Page Turn & Manuscript De-Esser</strong>
              <p>Subdues harsh paper turning noises while narrator reads ahead.</p>
            </div>
            <button
              type="button"
              className={`btn-toggle-switch ${pageTurnDeEsser ? 'on' : 'off'}`}
              onClick={() => {
                soundFX.playPop();
                setPageTurnDeEsser(prev => !prev);
              }}
            >
              {pageTurnDeEsser ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="acoustic-modal-footer">
          <div className="footer-dsp-note">
            <Sliders size={14} color="var(--accent-teal)" />
            <span>Calibrated for XLR Cardioid condenser & dynamic microphones (Shure SM7B, Rode NT1).</span>
          </div>
          <button
            type="button"
            className="btn-primary btn-apply-acoustic"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Apply Acoustic Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
