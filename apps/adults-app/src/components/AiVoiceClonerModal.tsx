import React, { useState } from 'react';
import { X, Mic, Sparkles, CheckCircle2, Cpu, Play } from 'lucide-react';
import { DEFAULT_CLONED_VOICES, type ClonedCharacterVoice } from '../lib/aiVoiceClonerData';
import { soundFX } from '../lib/soundFx';

interface AiVoiceClonerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AiVoiceClonerModal: React.FC<AiVoiceClonerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [voices, setVoices] = useState<ClonedCharacterVoice[]>(DEFAULT_CLONED_VOICES);
  const [activeVoiceId, setActiveVoiceId] = useState<string>('voice_gandalf');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggleVoice = (voice: ClonedCharacterVoice) => {
    soundFX.playPop();
    if (voice.voiceGender === 'MONSTER') {
      soundFX.playDragonRoar();
    } else {
      soundFX.playHarp();
    }
    setVoices(prev => prev.map(v => ({
      ...v,
      isAiCloneActive: v.id === voice.id ? !v.isAiCloneActive : false
    })));
    setToastMsg(`🎙️ Character Voice Filter "${voice.characterName}" ${!voice.isAiCloneActive ? 'ACTIVATED ON MIC' : 'DEACTIVATED'}.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTestPlayback = (voice: ClonedCharacterVoice) => {
    soundFX.playPop();
    if (voice.voiceGender === 'MONSTER') {
      soundFX.playThunder();
    } else {
      soundFX.playHarp();
    }
    setToastMsg(`🔊 Playing real-time neural voice sample for "${voice.characterName}"!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentVoice = voices.find(v => v.id === activeVoiceId) || voices[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="voice-cloner-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="voice-cloner-modal-header">
          <div className="voice-cloner-title-group">
            <div className="voice-cloner-badge">
              <Cpu size={16} />
              <span>AI CHARACTER VOICE CLONER & DYNAMIC NPC DSP FX</span>
            </div>
            <h3>@{streamerName}'s Real-Time Vocal Staging Engine</h3>
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

        {/* Hero Voice Banner */}
        <div className="voice-cloner-hero-banner">
          <div className="voice-dsp-dial">
            <Mic size={36} color={currentVoice.isAiCloneActive ? '#00ff88' : '#ffd700'} />
            <span className={`voice-state-tag ${currentVoice.isAiCloneActive ? 'active' : ''}`}>
              {currentVoice.isAiCloneActive ? 'LIVE ON STREAM' : 'STANDBY'}
            </span>
          </div>

          <div className="voice-cloner-hero-meta">
            <div className="voice-gender-row">
              <span className="gender-pill">{currentVoice.voiceGender}</span>
              <span className="pitch-pill">Pitch: {currentVoice.pitchShift > 0 ? `+${currentVoice.pitchShift}` : currentVoice.pitchShift} st</span>
              <span className="reverb-pill">Reverb: {currentVoice.reverbDecaySeconds}s</span>
            </div>

            <h4>{currentVoice.characterName}</h4>
            <p className="sample-dialogue-quote">{currentVoice.sampleDialogue}</p>

            <div className="voice-action-buttons">
              <button
                type="button"
                className="btn-test-playback"
                onClick={() => handleTestPlayback(currentVoice)}
              >
                <Play size={14} />
                <span>Test Neural Sample</span>
              </button>

              <button
                type="button"
                className={`btn-toggle-filter ${currentVoice.isAiCloneActive ? 'active' : ''}`}
                onClick={() => handleToggleVoice(currentVoice)}
              >
                <Mic size={14} />
                <span>{currentVoice.isAiCloneActive ? 'Deactivate Live Mic DSP' : 'Arm Live Microphone DSP'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Voices Preset Grid */}
        <div className="voices-preset-grid">
          {voices.map(v => (
            <div
              key={v.id}
              className={`voice-tile ${v.id === activeVoiceId ? 'selected' : ''} ${v.isAiCloneActive ? 'armed' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setActiveVoiceId(v.id);
              }}
            >
              <div className="voice-tile-top">
                <strong>{v.characterName.split('(')[0]}</strong>
                <span className="voice-gender-sm">{v.voiceGender}</span>
              </div>
              <span className="voice-desc-sub">{v.characterName.split('(')[1]?.replace(')', '') || ''}</span>
              <span className={`voice-armed-sub ${v.isAiCloneActive ? 'on' : 'off'}`}>
                {v.isAiCloneActive ? '● ARMED' : '○ Standby'}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="voice-cloner-modal-footer">
          <span className="footer-voice-note">
            🧠 Real-time 8ms ultra-low latency WebAudio DSP node with pitch-formant warping and dynamic convolution reverb.
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
