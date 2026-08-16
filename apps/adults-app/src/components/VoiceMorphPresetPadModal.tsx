import React, { useState } from 'react';
import { X, Mic, Sparkles, CheckCircle2, Volume2, Sliders, Play } from 'lucide-react';
import { AVAILABLE_VOICE_PADS, type VoicePadPreset } from '../lib/voiceMorphPresetData';
import { soundFX } from '../lib/soundFx';

interface VoiceMorphPresetPadModalProps {
  streamerName: string;
  onClose: () => void;
}

export const VoiceMorphPresetPadModal: React.FC<VoiceMorphPresetPadModalProps> = ({
  streamerName,
  onClose
}) => {
  const [pads] = useState<VoicePadPreset[]>(AVAILABLE_VOICE_PADS);
  const [activePadId, setActivePadId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTriggerPad = (pad: VoicePadPreset) => {
    soundFX.playPop();
    if (pad.category === 'FOLEY_SFX') {
      soundFX.playThunder();
    } else {
      soundFX.playDragonRoar();
    }

    setActivePadId(pad.id);
    setToastMsg(`🎙️ TRIGGERED PAD #${pad.padNumber}: "${pad.name}" (Pitch: ${pad.pitchShiftSemitones > 0 ? '+' : ''}${pad.pitchShiftSemitones} semitones)`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="voice-pad-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="voice-pad-modal-header">
          <div className="voice-pad-title-group">
            <div className="voice-pad-badge">
              <Mic size={16} />
              <span>CHARACTER VOICE MORPH PRESETS & PHYSICAL PAD DECK</span>
            </div>
            <h3>@{streamerName}'s Voice Morph Soundboard</h3>
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

        {/* Active Pad Monitor */}
        <div className="voice-pad-hero-banner">
          <div className="pad-status-left">
            <Volume2 size={24} color="#ffd700" />
            <div>
              <h4>Real-Time Low-Latency DSP Pitch Shifter</h4>
              <p>Bind to Stream Deck / MIDI controller keys or tap directly during live dialogue delivery.</p>
            </div>
          </div>
          <span className="dsp-latency-tag">⚡ 3ms DSP LATENCY</span>
        </div>

        {/* 6-Pad Hardware Grid */}
        <div className="hardware-pads-grid">
          {pads.map(pad => {
            const isActive = pad.id === activePadId;
            return (
              <div
                key={pad.id}
                className={`hardware-pad-tile ${isActive ? 'active' : ''} ${pad.category === 'FOLEY_SFX' ? 'foley' : 'voice'}`}
                onClick={() => handleTriggerPad(pad)}
              >
                <div className="pad-top-row">
                  <span className="pad-num-badge">PAD {pad.padNumber}</span>
                  <span className="pad-hotkey-badge">{pad.hotkeyKey}</span>
                </div>
                <span className="pad-emoji-large">{pad.iconEmoji}</span>
                <strong className="pad-name">{pad.name}</strong>
                <div className="pad-spec-row">
                  <span>{pad.category === 'FOLEY_SFX' ? 'Foley SFX' : `Pitch: ${pad.pitchShiftSemitones > 0 ? '+' : ''}${pad.pitchShiftSemitones}st`}</span>
                  <Play size={12} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="voice-pad-modal-footer">
          <div className="footer-midi-note">
            <Sliders size={14} color="var(--accent-teal)" />
            <span>Supports Elgato Stream Deck, Novation Launchpad & AKAI APC mini USB MIDI mapping.</span>
          </div>
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
