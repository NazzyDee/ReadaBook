import React, { useState } from 'react';
import { X, Volume2, Sparkles, Play, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LITERARY_TTS_VOICES, type TtsCharacterVoice } from '../lib/donationTtsData';
import { soundFX } from '../lib/soundFx';

interface DonationTtsStudioModalProps {
  streamerName: string;
  onClose: () => void;
}

export const DonationTtsStudioModal: React.FC<DonationTtsStudioModalProps> = ({
  streamerName,
  onClose
}) => {
  const [voices] = useState<TtsCharacterVoice[]>(LITERARY_TTS_VOICES);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('tts_wizard');
  const [testText, setTestText] = useState('Thank you for the 500 Sparks donation! Keep reading chapter 6!');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeVoice = voices.find(v => v.id === selectedVoiceId) || voices[0];

  const handleTestVoice = (v: TtsCharacterVoice) => {
    soundFX.playPop();
    if (v.id === 'tts_wizard') {
      soundFX.playChestClaim();
    } else if (v.id === 'tts_eldritch') {
      soundFX.playThunder();
    } else if (v.id === 'tts_goblin') {
      soundFX.playDragonRoar();
    } else {
      soundFX.playHarp();
    }
    setToastMsg(`🗣️ Synthesizing preview with [${v.name}]...`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playChestClaim();
    setToastMsg('🎙️ Live Dono Text-to-Speech voices updated for cheer events!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tts-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tts-modal-header">
          <div className="tts-title-group">
            <div className="tts-badge">
              <Volume2 size={16} />
              <span>LITERARY TTS CUSTOM VOICES & DONATION ENGINE</span>
            </div>
            <h3>@{streamerName}'s Live Cheer TTS Voices</h3>
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

        <p className="tts-intro-text">
          Allow chat donors to synthesize their cheered Sparks messages into live audio using iconic book character voices.
        </p>

        {/* Voices Grid */}
        <div className="tts-voices-grid">
          {voices.map(v => (
            <div
              key={v.id}
              className={`tts-voice-card ${selectedVoiceId === v.id ? 'active' : ''}`}
              style={{ borderColor: selectedVoiceId === v.id ? v.color : undefined }}
              onClick={() => {
                soundFX.playPop();
                setSelectedVoiceId(v.id);
              }}
            >
              <div className="tts-card-top">
                <span className="tts-avatar-emoji">{v.avatarEmoji}</span>
                <div className="tts-name-group">
                  <h4>{v.name}</h4>
                  <span className="tts-min-sparks">Min. {v.minSparksRequired} Sparks</span>
                </div>
              </div>

              <p className="tts-archetype-text">{v.archetype}</p>

              <button
                type="button"
                className="btn-preview-speech"
                onClick={e => {
                  e.stopPropagation();
                  handleTestVoice(v);
                }}
              >
                <Play size={12} />
                <span>Test Voice Sample</span>
              </button>
            </div>
          ))}
        </div>

        {/* Live TTS Test Simulator Form */}
        <form onSubmit={handleSave} className="tts-test-form">
          <label>Simulate Viewer Cheer Message:</label>
          <div className="tts-input-row">
            <input
              type="text"
              value={testText}
              onChange={e => setTestText(e.target.value)}
              placeholder="Enter sample donation message..."
            />
            <button
              type="button"
              className="btn-secondary btn-test-now"
              onClick={() => handleTestVoice(activeVoice)}
            >
              <Volume2 size={15} />
              <span>Speak Message</span>
            </button>
          </div>

          {/* Footer */}
          <div className="tts-modal-footer">
            <span className="tts-filter-status">
              <ShieldCheck size={13} color="var(--accent-success)" /> Profanity & Spoiler Filter Active
            </span>

            <button type="submit" className="btn-primary btn-save-tts">
              <CheckCircle2 size={16} />
              <span>Save & Enable TTS Donos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
