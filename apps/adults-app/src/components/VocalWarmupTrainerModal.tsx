import React, { useState } from 'react';
import { X, Music, Sparkles, CheckCircle2, Wind } from 'lucide-react';
import { PIANO_SCALE_KEYS, TONGUE_TWISTERS, type PianoNoteKey } from '../lib/vocalWarmupTrainerData';
import { soundFX } from '../lib/soundFx';

interface VocalWarmupTrainerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const VocalWarmupTrainerModal: React.FC<VocalWarmupTrainerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [twisterIndex, setTwisterIndex] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const playPianoNote = (key: PianoNoteKey) => {
    soundFX.playPop();
    setActiveNote(key.note);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(key.freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log('AudioContext pitch error:', e);
    }

    setTimeout(() => setActiveNote(null), 400);
  };

  const handleNextTwister = () => {
    soundFX.playPop();
    setTwisterIndex(prev => (prev + 1) % TONGUE_TWISTERS.length);
  };

  const handleToggleBreath = () => {
    soundFX.playPop();
    if (breathPhase === 'Inhale (4s)') setBreathPhase('Hold (7s)');
    else if (breathPhase === 'Hold (7s)') setBreathPhase('Exhale (8s)');
    else setBreathPhase('Inhale (4s)');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="vocal-trainer-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="trainer-modal-header">
          <div className="trainer-title-group">
            <div className="trainer-badge">
              <Music size={16} />
              <span>PRE-STREAM VOCAL WARMUP PIANO & BREATHWORK</span>
            </div>
            <h3>@{streamerName}'s Voice Performance Studio</h3>
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

        {/* Pitch Scale Piano Keyboard */}
        <div className="piano-keyboard-section">
          <div className="piano-sec-header">
            <label>PITCH SCALE ARPEGGIO TRAINER (DO-RE-MI-FA-SOL):</label>
            <span className="active-pitch-pill">Active Note: {activeNote || 'None'}</span>
          </div>

          <div className="piano-keys-row">
            {PIANO_SCALE_KEYS.map(k => (
              <button
                key={k.note}
                type="button"
                className={`piano-key-btn ${k.isBlack ? 'black-key' : 'white-key'} ${activeNote === k.note ? 'pressed' : ''}`}
                onClick={() => playPianoNote(k)}
              >
                <span className="note-name">{k.note}</span>
                <span className="solfege-name">{k.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4-7-8 Breathwork & Tongue Twisters Grid */}
        <div className="trainer-bottom-grid">
          {/* Breathwork Circle */}
          <div className="breathwork-card" onClick={handleToggleBreath}>
            <div className="breath-card-top">
              <Wind size={16} color="var(--accent-teal)" />
              <strong>4-7-8 Diaphragmatic Breath Pacer</strong>
            </div>

            <div className="breath-circle-pacer">
              <span className="breath-phase-text">{breathPhase}</span>
              <span className="breath-tap-hint">(Tap to cycle phase)</span>
            </div>
          </div>

          {/* Tongue Twisters */}
          <div className="tongue-twisters-card">
            <div className="twister-top">
              <strong>Fantasy Diction & Articulation Gauntlet</strong>
              <button
                type="button"
                className="btn-next-twister"
                onClick={handleNextTwister}
              >
                Next ({(twisterIndex + 1)}/{TONGUE_TWISTERS.length})
              </button>
            </div>

            <p className="twister-quote">
              "{TONGUE_TWISTERS[twisterIndex]}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="trainer-modal-footer">
          <button
            type="button"
            className="btn-primary btn-finish-warmup"
            onClick={() => {
              soundFX.playChestClaim();
              setToastMsg('🎙️ Vocal cords warmed up and tuned! Ready to broadcast.');
              setTimeout(() => {
                setToastMsg(null);
                onClose();
              }, 1500);
            }}
          >
            <CheckCircle2 size={16} />
            <span>Finish Vocal Warmup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
