import React, { useState, useEffect } from 'react';
import { X, Gauge, Sparkles, CheckCircle2, Play, Pause, FastForward } from 'lucide-react';
import { DEFAULT_RSVP_SESSION, type RsvpSpeedSession } from '../lib/rsvpSpeedReaderData';
import { soundFX } from '../lib/soundFx';

interface RsvpSpeedReaderModalProps {
  streamerName: string;
  onClose: () => void;
}

export const RsvpSpeedReaderModal: React.FC<RsvpSpeedReaderModalProps> = ({
  streamerName,
  onClose
}) => {
  const [session, setSession] = useState<RsvpSpeedSession>(DEFAULT_RSVP_SESSION);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [wordIdx, setWordIdx] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.round((60 / session.targetWpm) * 1000);
    const timer = setInterval(() => {
      setWordIdx(prev => (prev + 1) % session.sampleSentence.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, session.targetWpm, session.sampleSentence.length]);

  const currentWord = session.sampleSentence[wordIdx] || 'Reading';
  const pivotIndex = Math.floor(currentWord.length / 2);
  const leftPart = currentWord.slice(0, pivotIndex);
  const pivotChar = currentWord[pivotIndex] || '';
  const rightPart = currentWord.slice(pivotIndex + 1);

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg(`✨ RSVP Speed Reader HUD (${session.targetWpm} WPM) projected onto live broadcast overlay!`);
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="rsvp-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="rsvp-modal-header">
          <div className="rsvp-title-group">
            <div className="rsvp-badge">
              <Gauge size={16} />
              <span>SPEED-READING RSVP (RAPID SERIAL VISUAL PRESENTATION) HUD</span>
            </div>
            <h3>@{streamerName}'s High-Speed RSVP Flasher</h3>
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

        {/* RSVP Flasher Projection Screen */}
        <div className="rsvp-hero-flasher-box">
          <div className="flasher-guide top"></div>
          <div className="flasher-word-display">
            <span className="part-left">{leftPart}</span>
            <span className="part-pivot">{pivotChar}</span>
            <span className="part-right">{rightPart}</span>
          </div>
          <div className="flasher-guide bottom"></div>
          <span className="wpm-display-tag">{session.targetWpm} WPM</span>
        </div>

        {/* Speed Controls */}
        <div className="rsvp-controls-grid">
          <div className="control-slider-box">
            <div className="slider-label-row">
              <label>TARGET SPEED CADENCE:</label>
              <strong>{session.targetWpm} WORDS PER MINUTE</strong>
            </div>
            <input
              type="range"
              min="250"
              max="1200"
              step="50"
              value={session.targetWpm}
              onChange={e => setSession(prev => ({ ...prev, targetWpm: Number(e.target.value) }))}
              className="rsvp-slider"
            />
          </div>

          <div className="rsvp-playback-row">
            <button
              type="button"
              className="btn-play-pause-rsvp"
              onClick={() => {
                soundFX.playPop();
                setIsPlaying(prev => !prev);
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              <span>{isPlaying ? 'Pause Flasher' : 'Resume Flasher'}</span>
            </button>
            <div className="rsvp-presets-buttons">
              <button onClick={() => setSession(prev => ({ ...prev, targetWpm: 450 }))}>450 WPM</button>
              <button onClick={() => setSession(prev => ({ ...prev, targetWpm: 650 }))}>650 WPM</button>
              <button onClick={() => setSession(prev => ({ ...prev, targetWpm: 900 }))}>900 WPM</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rsvp-modal-footer">
          <div className="footer-rsvp-note">
            <FastForward size={14} color="#ffd700" />
            <span>Eliminates saccadic eye movement fatigue allowing chat to read along at 3x standard reading speed.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Project Flasher Overlay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
