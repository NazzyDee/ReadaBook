import React, { useState } from 'react';
import { X, Mic, Volume2, Sliders, Activity, Sparkles, RefreshCw } from 'lucide-react';
import { VOICE_PRESETS, type VoicePreset } from '../lib/voiceFxData';
import { soundFX } from '../lib/soundFx';

interface VoiceModulationRackProps {
  onClose: () => void;
  onPresetApplied?: (preset: VoicePreset) => void;
}

export const VoiceModulationRack: React.FC<VoiceModulationRackProps> = ({
  onClose,
  onPresetApplied
}) => {
  const [activePreset, setActivePreset] = useState<VoicePreset>(VOICE_PRESETS[0]);
  const [pitch, setPitch] = useState<number>(activePreset.pitchShiftSemis);
  const [reverb, setReverb] = useState<number>(activePreset.reverbDecaySeconds);
  const [lowPass, setLowPass] = useState<number>(activePreset.lowPassCutoffHz);
  const [stereoWidth, setStereoWidth] = useState<number>(activePreset.stereoWidthPercent);
  const [isMicMonitoring, setIsMicMonitoring] = useState<boolean>(true);
  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const handleSelectPreset = (preset: VoicePreset) => {
    soundFX.playPop();
    setActivePreset(preset);
    setPitch(preset.pitchShiftSemis);
    setReverb(preset.reverbDecaySeconds);
    setLowPass(preset.lowPassCutoffHz);
    setStereoWidth(preset.stereoWidthPercent);

    if (onPresetApplied) {
      onPresetApplied(preset);
    }
  };

  const handlePlayVoiceTest = () => {
    setIsPlayingTest(true);
    soundFX.playPop();

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Base carrier oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Set pitch
      const baseFreq = 220 * Math.pow(2, pitch / 12);
      osc.type = activePreset.id.includes('synth') ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      // Low pass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(lowPass, ctx.currentTime);
      filter.Q.setValueAtTime(activePreset.resonanceBoostDb > 0 ? activePreset.resonanceBoostDb : 1, ctx.currentTime);

      // Modulation envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + Math.min(2.5, reverb + 0.5));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.0);

      setTimeout(() => {
        setIsPlayingTest(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsPlayingTest(false);
    }
  };

  const handleApplyToBroadcast = () => {
    soundFX.playApplause();
    setStatusToast(`🎙️ Voice Preset "${activePreset.name}" is now ACTIVE on your broadcast mic!`);
    setTimeout(() => {
      setStatusToast(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="voice-rack-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="voice-rack-header">
          <div className="voice-rack-title-group">
            <div className="voice-rack-badge">
              <Sliders size={16} />
              <span>NARRATOR AUDIO DSP & MIC MODULATION</span>
            </div>
            <h3>Studio Voice Acting Modulation Rack</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Status Toast */}
        {statusToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={20} color="#ffd700" />
            <span>{statusToast}</span>
          </div>
        )}

        {/* Main Grid Layout: Presets on Left, DSP Sliders on Right */}
        <div className="voice-rack-body-grid">
          {/* Left: Preset Selector */}
          <div className="voice-presets-list">
            <span className="section-col-title">CHARACTER PRESETS</span>
            <div className="presets-scroll-column">
              {VOICE_PRESETS.map(preset => {
                const isSelected = activePreset.id === preset.id;

                return (
                  <div
                    key={preset.id}
                    className={`voice-preset-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <span className="preset-card-icon">{preset.icon}</span>
                    <div className="preset-card-details">
                      <div className="preset-card-name-row">
                        <strong>{preset.name}</strong>
                        <span className="preset-cat-tag">{preset.category}</span>
                      </div>
                      <p>{preset.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Real-Time DSP Controls & VU Meter */}
          <div className="voice-dsp-controls-panel">
            <div className="dsp-panel-header">
              <span className="section-col-title">PARAMETRIC DSP RACK</span>
              <div className="mic-monitoring-switch">
                <Mic size={14} color={isMicMonitoring ? 'var(--accent-success)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.78rem' }}>Mic Monitor</span>
                <input
                  type="checkbox"
                  checked={isMicMonitoring}
                  onChange={e => setIsMicMonitoring(e.target.checked)}
                />
              </div>
            </div>

            {/* Live VU Meter Simulation */}
            <div className="voice-vu-meter-box">
              <div className="vu-meter-label-row">
                <span className="vu-label">
                  <Activity size={13} className="pulse" />
                  <span>Real-Time Mic Input VU</span>
                </span>
                <span className="vu-db-readout">-6.2 dB (Optimal)</span>
              </div>

              <div className="vu-bars-track">
                {Array.from({ length: 24 }).map((_, idx) => {
                  const isHot = idx > 18;
                  const isWarn = idx > 14 && idx <= 18;
                  const isActive = idx < (activePreset.id === 'preset_dragon_roar' ? 20 : 15);

                  return (
                    <div
                      key={idx}
                      className={`vu-segment ${isActive ? 'active' : ''} ${isHot ? 'hot' : isWarn ? 'warn' : 'normal'}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* DSP Sliders */}
            <div className="dsp-sliders-list">
              {/* Pitch Shift Slider */}
              <div className="dsp-slider-group">
                <div className="slider-label-row">
                  <label>Pitch Shift</label>
                  <span className="slider-val-readout">{pitch > 0 ? `+${pitch}` : pitch} Semitones</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={pitch}
                  onChange={e => setPitch(parseInt(e.target.value))}
                  className="dsp-range-slider"
                />
                <div className="slider-ticks">
                  <span>-12 (Deep Dragon)</span>
                  <span>0 (Natural)</span>
                  <span>+12 (Pixie)</span>
                </div>
              </div>

              {/* Reverb Decay Slider */}
              <div className="dsp-slider-group">
                <div className="slider-label-row">
                  <label>Reverb Space & Decay</label>
                  <span className="slider-val-readout">{reverb.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="8.0"
                  step="0.1"
                  value={reverb}
                  onChange={e => setReverb(parseFloat(e.target.value))}
                  className="dsp-range-slider"
                />
                <div className="slider-ticks">
                  <span>Dry Studio</span>
                  <span>Cathedral</span>
                  <span>Endless Cavern</span>
                </div>
              </div>

              {/* Low-Pass Cutoff Slider */}
              <div className="dsp-slider-group">
                <div className="slider-label-row">
                  <label>Low-Pass Cutoff Filter</label>
                  <span className="slider-val-readout">{lowPass >= 1000 ? `${(lowPass / 1000).toFixed(1)} kHz` : `${lowPass} Hz`}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="20000"
                  step="100"
                  value={lowPass}
                  onChange={e => setLowPass(parseInt(e.target.value))}
                  className="dsp-range-slider"
                />
              </div>

              {/* Stereo Width */}
              <div className="dsp-slider-group">
                <div className="slider-label-row">
                  <label>Binaural Stereo Field Width</label>
                  <span className="slider-val-readout">{stereoWidth}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="250"
                  step="5"
                  value={stereoWidth}
                  onChange={e => setStereoWidth(parseInt(e.target.value))}
                  className="dsp-range-slider"
                />
              </div>
            </div>

            {/* Test Voice & Apply Actions */}
            <div className="dsp-actions-footer">
              <button
                type="button"
                className="btn-secondary btn-test-audio"
                onClick={handlePlayVoiceTest}
                disabled={isPlayingTest}
              >
                <Volume2 size={16} />
                <span>{isPlayingTest ? 'Synthesizing...' : `Test ${activePreset.name} Audio`}</span>
              </button>

              <button
                type="button"
                className="btn-primary btn-apply-dsp"
                onClick={handleApplyToBroadcast}
              >
                <RefreshCw size={16} />
                <span>Apply to Live Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
