import React, { useState } from 'react';
import { X, Sliders, Sparkles, CheckCircle2, Mic, Volume2, ShieldCheck } from 'lucide-react';
import { DEFAULT_VOCAL_DYNAMICS, type VocalDynamicsSettings } from '../lib/vocalDynamicsData';
import { soundFX } from '../lib/soundFx';

interface VocalDynamicsRackModalProps {
  streamerName: string;
  onClose: () => void;
}

export const VocalDynamicsRackModal: React.FC<VocalDynamicsRackModalProps> = ({
  streamerName,
  onClose
}) => {
  const [settings, setSettings] = useState<VocalDynamicsSettings>(DEFAULT_VOCAL_DYNAMICS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleApplyPreset = (presetName: string) => {
    soundFX.playPop();
    if (presetName === 'AUDIOBOOK_MASTER') {
      setSettings({
        compressorThresholdDb: -20,
        compressorRatio: '3:1',
        makeupGainDb: 3.5,
        noiseGateThresholdDb: -52,
        deEsserFrequencyKhz: 6.5,
        highPassFilterHz: 80,
        isGateEnabled: true,
        isCompressorEnabled: true,
        isDeEsserEnabled: true
      });
    } else if (presetName === 'WHISPER_ASMR') {
      setSettings({
        compressorThresholdDb: -28,
        compressorRatio: '5:1',
        makeupGainDb: 7.0,
        noiseGateThresholdDb: -60,
        deEsserFrequencyKhz: 7.2,
        highPassFilterHz: 100,
        isGateEnabled: true,
        isCompressorEnabled: true,
        isDeEsserEnabled: true
      });
    } else if (presetName === 'DRAMATIC_COMBAT') {
      setSettings({
        compressorThresholdDb: -16,
        compressorRatio: '4:1',
        makeupGainDb: 2.0,
        noiseGateThresholdDb: -42,
        deEsserFrequencyKhz: 6.0,
        highPassFilterHz: 60,
        isGateEnabled: true,
        isCompressorEnabled: true,
        isDeEsserEnabled: true
      });
    }
    setToastMsg(`🎙️ Applied "${presetName.replace('_', ' ')}" Audio Processing Preset!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playChestClaim();
    setToastMsg('🎛️ Vocal Dynamics Rack saved to Master Audio Output!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="dynamics-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="dynamics-modal-header">
          <div className="dynamics-title-group">
            <div className="dynamics-badge">
              <Sliders size={16} />
              <span>VOCAL DYNAMICS, NOISE GATE & DE-ESSER RACK</span>
            </div>
            <h3>@{streamerName}'s Master Audio Processing Studio</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Preset Selector Buttons */}
        <div className="dynamics-presets-row">
          <span className="preset-label">AUDIO PRESETS:</span>
          <div className="preset-buttons-group">
            <button
              type="button"
              className="btn-preset-chip"
              onClick={() => handleApplyPreset('AUDIOBOOK_MASTER')}
            >
              🎙️ Audiobook Master
            </button>
            <button
              type="button"
              className="btn-preset-chip"
              onClick={() => handleApplyPreset('WHISPER_ASMR')}
            >
              🤫 Whisper ASMR
            </button>
            <button
              type="button"
              className="btn-preset-chip"
              onClick={() => handleApplyPreset('DRAMATIC_COMBAT')}
            >
              ⚔️ Dramatic Combat
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="dynamics-form">
          {/* Compressor Module */}
          <div className="rack-module-box">
            <div className="module-header">
              <div className="mod-title">
                <Volume2 size={16} color="var(--accent-primary)" />
                <h4>Optical Vocal Compressor</h4>
              </div>
              <span className="active-tag">ACTIVE</span>
            </div>

            <div className="module-controls-grid">
              <div className="control-slider-group">
                <label>Threshold ({settings.compressorThresholdDb} dB)</label>
                <input
                  type="range"
                  min="-40"
                  max="0"
                  value={settings.compressorThresholdDb}
                  onChange={e => setSettings({ ...settings, compressorThresholdDb: Number(e.target.value) })}
                />
              </div>

              <div className="control-slider-group">
                <label>Makeup Gain (+{settings.makeupGainDb} dB)</label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={settings.makeupGainDb}
                  onChange={e => setSettings({ ...settings, makeupGainDb: Number(e.target.value) })}
                />
              </div>

              <div className="control-slider-group">
                <label>Compression Ratio ({settings.compressorRatio})</label>
                <select
                  value={settings.compressorRatio}
                  onChange={e => setSettings({ ...settings, compressorRatio: e.target.value })}
                >
                  <option value="2:1">2:1 (Gentle Smoothing)</option>
                  <option value="3:1">3:1 (Standard Audiobook)</option>
                  <option value="3.5:1">3.5:1 (Broadcast Balanced)</option>
                  <option value="5:1">5:1 (Heavy Limiting)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Noise Gate & De-Esser Split Row */}
          <div className="rack-two-col-grid">
            {/* Noise Gate */}
            <div className="rack-module-box">
              <div className="module-header">
                <div className="mod-title">
                  <Mic size={16} color="var(--accent-teal)" />
                  <h4>Page-Rustle Noise Gate</h4>
                </div>
              </div>

              <div className="control-slider-group">
                <label>Gate Threshold ({settings.noiseGateThresholdDb} dB)</label>
                <input
                  type="range"
                  min="-70"
                  max="-30"
                  value={settings.noiseGateThresholdDb}
                  onChange={e => setSettings({ ...settings, noiseGateThresholdDb: Number(e.target.value) })}
                />
                <span className="helper-sub">Eliminates paper turns & microphone breathing.</span>
              </div>
            </div>

            {/* De-Esser */}
            <div className="rack-module-box">
              <div className="module-header">
                <div className="mod-title">
                  <ShieldCheck size={16} color="#ffd700" />
                  <h4>Sibilance De-Esser</h4>
                </div>
              </div>

              <div className="control-slider-group">
                <label>Target Frequency ({settings.deEsserFrequencyKhz} kHz)</label>
                <input
                  type="range"
                  min="4.0"
                  max="9.0"
                  step="0.2"
                  value={settings.deEsserFrequencyKhz}
                  onChange={e => setSettings({ ...settings, deEsserFrequencyKhz: Number(e.target.value) })}
                />
                <span className="helper-sub">Tames harsh 'S' and 'Sh' character dialogue.</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="dynamics-modal-footer">
            <span className="latency-status">DSP Engine: 32-bit Floating Point • 0.8ms Latency</span>
            <button type="submit" className="btn-primary btn-save-dynamics">
              <CheckCircle2 size={16} />
              <span>Apply Master Audio Rack</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
