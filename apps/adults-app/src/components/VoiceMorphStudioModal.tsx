import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Sliders,
  CheckCircle2,
  Headphones,
  Zap,
  Mic
} from 'lucide-react';
import {
  VOICE_PROFILES,
  type VoiceProfile,
  voiceMorph
} from '../lib/voiceMorphEngine';
import { soundFX } from '../lib/soundFx';

interface VoiceMorphStudioModalProps {
  onClose: () => void;
}

export const VoiceMorphStudioModal: React.FC<VoiceMorphStudioModalProps> = ({ onClose }) => {
  const [activeProfile, setActiveProfile] = useState<VoiceProfile>(voiceMorph.getProfile());
  const [isEnabled, setIsEnabled] = useState(voiceMorph.getIsEnabled());
  const [customPitch, setCustomPitch] = useState(activeProfile.pitchSemitones);
  const [customReverb, setCustomReverb] = useState(Math.round(activeProfile.reverbAmount * 100));
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [vuLevel, setVuLevel] = useState(45);

  useEffect(() => {
    return voiceMorph.subscribe((profile, enabled) => {
      setActiveProfile(profile);
      setIsEnabled(enabled);
      setCustomPitch(profile.pitchSemitones);
      setCustomReverb(Math.round(profile.reverbAmount * 100));
    });
  }, []);

  // Simulate subtle VU meter animation
  useEffect(() => {
    if (!isEnabled) {
      setVuLevel(0);
      return;
    }
    const interval = setInterval(() => {
      setVuLevel(Math.round(30 + Math.random() * 55));
    }, 150);
    return () => clearInterval(interval);
  }, [isEnabled]);

  const handleToggleMaster = async () => {
    soundFX.playPop();
    if (isEnabled) {
      voiceMorph.stopMic();
    } else {
      await voiceMorph.startMic();
    }
  };

  const handleSelectProfile = (p: VoiceProfile) => {
    soundFX.playChestClaim();
    voiceMorph.setProfile(p);
    setActiveProfile(p);
    setCustomPitch(p.pitchSemitones);
    setCustomReverb(Math.round(p.reverbAmount * 100));
  };

  const handleCustomPitchChange = (semitones: number) => {
    setCustomPitch(semitones);
    const updated: VoiceProfile = {
      ...activeProfile,
      pitchSemitones: semitones,
      name: `${activeProfile.name} (Custom ${semitones > 0 ? `+${semitones}` : semitones}st)`
    };
    voiceMorph.setProfile(updated);
  };

  return (
    <div className="modal-backdrop">
      <div className="voice-morph-modal-card">
        {/* Header */}
        <div className="voice-modal-header">
          <div className="voice-title-row">
            <Sparkles size={22} color="#00e5ff" />
            <div>
              <h3>🧙 Real-Time Character Voice Shifter</h3>
              <span className="modal-subtitle">Web Audio DSP Formant Modulator for Solo Voice Actors</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Master Power & Mic VU Meter */}
        <div className={`voice-master-bar ${isEnabled ? 'active' : 'disabled'}`}>
          <div className="master-status-left">
            <button
              type="button"
              onClick={handleToggleMaster}
              className={`btn-power-toggle ${isEnabled ? 'on' : 'off'}`}
            >
              <Mic size={16} />
              <span>{isEnabled ? 'DSP Active' : 'DSP Bypass'}</span>
            </button>
            <div>
              <strong className="status-title">
                Active Profile: {activeProfile.name} {activeProfile.icon}
              </strong>
              <span className="status-sub">
                {isEnabled ? 'Microphone stream is being morphed in real time.' : 'Voice morpher is offline.'}
              </span>
            </div>
          </div>

          {/* Real-time Simulated VU Meter */}
          <div className="vu-meter-box">
            <span className="vu-lbl">MIC LEVEL</span>
            <div className="vu-bar-track">
              <div
                className="vu-bar-fill"
                style={{
                  width: `${isEnabled ? vuLevel : 0}%`,
                  background: vuLevel > 75 ? '#ff3b3b' : vuLevel > 50 ? '#ffd700' : '#00ff88'
                }}
              />
            </div>
          </div>
        </div>

        {/* Preset Character Voice Profiles Matrix */}
        <div className="voice-profiles-section">
          <label className="section-label">
            <Zap size={13} color="var(--accent-secondary)" /> Select Character Persona:
          </label>
          <div className="profiles-grid">
            {VOICE_PROFILES.map(p => {
              const isActive = activeProfile.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProfile(p)}
                  className={`btn-profile-card ${isActive ? 'active' : ''}`}
                >
                  <span className="p-icon">{p.icon}</span>
                  <div className="p-text">
                    <strong>{p.name}</strong>
                    <span className="p-type">{p.characterType}</span>
                  </div>
                  {isActive && <CheckCircle2 size={16} color="#00ff88" className="p-check" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fine Tuning DSP Sliders */}
        <div className="voice-dsp-tuning-box">
          <div className="dsp-tuning-header">
            <Sliders size={14} color="var(--accent-secondary)" />
            <span>Acoustic Fine-Tuning</span>
          </div>

          <div className="dsp-sliders-grid">
            {/* Pitch Shift */}
            <div className="dsp-slider-col">
              <div className="slider-label-row">
                <span>Pitch Shift</span>
                <strong>{customPitch > 0 ? `+${customPitch}` : customPitch} Semitones</strong>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={customPitch}
                onChange={e => handleCustomPitchChange(parseInt(e.target.value, 10))}
                className="dsp-slider"
              />
            </div>

            {/* Reverb Wet/Dry */}
            <div className="dsp-slider-col">
              <div className="slider-label-row">
                <span>Cavern Reverb</span>
                <strong>{customReverb}% Wet</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={customReverb}
                onChange={e => setCustomReverb(parseInt(e.target.value, 10))}
                className="dsp-slider"
              />
            </div>
          </div>
        </div>

        {/* Headphone Monitor Toggle & Done Action */}
        <div className="voice-footer-actions">
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setIsMonitoring(!isMonitoring);
            }}
            className={`btn-headphone-monitor ${isMonitoring ? 'monitoring' : ''}`}
            title="Listen to your own morphed voice in your headphones"
          >
            <Headphones size={15} />
            <span>Headphone Monitor: {isMonitoring ? 'ON' : 'OFF'}</span>
          </button>

          <button type="button" onClick={onClose} className="btn-primary">
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
