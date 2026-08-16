import React, { useState } from 'react';
import { X, Gauge, Sparkles, CheckCircle2, Volume2, Play, Pause, AlertCircle } from 'lucide-react';
import { GENRE_PACING_TARGETS } from '../lib/readingPacingData';
import { soundFX } from '../lib/soundFx';

interface ReadingPacingPacerModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ReadingPacingPacerModal: React.FC<ReadingPacingPacerModalProps> = ({
  streamerName,
  onClose
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('Epic High Fantasy');
  const [currentWpm, setCurrentWpm] = useState<number>(152);
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeGenreTarget = GENRE_PACING_TARGETS.find(g => g.genre === selectedGenre) || GENRE_PACING_TARGETS[0];

  const toggleMetronome = () => {
    soundFX.playPop();
    const nextState = !isMetronomeActive;
    setIsMetronomeActive(nextState);
    if (nextState) {
      soundFX.playChestClaim();
      setToastMsg(`⏱️ Syllable Cadence Metronome started at ${activeGenreTarget.targetBpm} BPM!`);
    } else {
      setToastMsg('⏹️ Syllable Cadence Metronome paused.');
    }
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAdjustWpm = (delta: number) => {
    soundFX.playPop();
    setCurrentWpm(prev => Math.max(80, Math.min(260, prev + delta)));
  };

  // Determine cadence status
  const isPaceIdeal = Math.abs(currentWpm - activeGenreTarget.targetWpm) <= 10;
  const isPaceFast = currentWpm > activeGenreTarget.targetWpm + 10;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="pacing-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="pacing-modal-header">
          <div className="pacing-title-group">
            <div className="pacing-badge">
              <Gauge size={16} />
              <span>LIVE READING SPEEDOMETER & SYLLABLE METRONOME</span>
            </div>
            <h3>@{streamerName}'s Narration Cadence Studio</h3>
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

        {/* Speedometer Main Gauge */}
        <div className="pacing-gauge-container">
          <div className="speedometer-circle">
            <span className="wpm-value">{currentWpm}</span>
            <span className="wpm-unit">WORDS / MIN</span>
          </div>

          <div className="pacing-status-indicator">
            {isPaceIdeal ? (
              <span className="pacing-tag ideal">
                <CheckCircle2 size={16} /> IDEAL STORYTELLING CADENCE
              </span>
            ) : isPaceFast ? (
              <span className="pacing-tag fast">
                <AlertCircle size={16} /> READING TOO FAST (SLOW DOWN)
              </span>
            ) : (
              <span className="pacing-tag slow">
                <AlertCircle size={16} /> READING TOO SLOW (PICK UP PACE)
              </span>
            )}
            <p className="genre-target-note">
              Target for <strong>{activeGenreTarget.genre}</strong>: {activeGenreTarget.idealWpmRange}
            </p>
          </div>

          {/* Quick +/- WPM Adjustment Controls */}
          <div className="wpm-adjust-buttons">
            <button type="button" className="btn-wpm-adjust" onClick={() => handleAdjustWpm(-5)}>
              -5 WPM
            </button>
            <button type="button" className="btn-wpm-adjust" onClick={() => handleAdjustWpm(+5)}>
              +5 WPM
            </button>
          </div>
        </div>

        {/* Genre Selector Cards */}
        <div className="genre-targets-section">
          <label className="sec-label">SELECT GENRE PACING BENCHMARK:</label>
          <div className="genre-cards-grid">
            {GENRE_PACING_TARGETS.map(g => (
              <div
                key={g.genre}
                className={`genre-pacing-card ${selectedGenre === g.genre ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedGenre(g.genre);
                }}
              >
                <div className="genre-card-top">
                  <h4>{g.genre}</h4>
                  <span className="wpm-pill">{g.idealWpmRange}</span>
                </div>
                <p>{g.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Syllable Metronome Bar */}
        <div className="metronome-control-bar">
          <div className="metronome-info">
            <Volume2 size={18} color="var(--accent-teal)" />
            <div>
              <strong>Syllable Rhythm Metronome</strong>
              <span>Subtle audio click at {activeGenreTarget.targetBpm} BPM for cadence stability.</span>
            </div>
          </div>

          <button
            type="button"
            className={`btn-toggle-metronome ${isMetronomeActive ? 'active' : ''}`}
            onClick={toggleMetronome}
          >
            {isMetronomeActive ? (
              <>
                <Pause size={14} />
                <span>Pause Metronome</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>Start Metronome ({activeGenreTarget.targetBpm} BPM)</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="pacing-modal-footer">
          <button
            type="button"
            className="btn-primary btn-save-pacing"
            onClick={() => {
              soundFX.playChestClaim();
              setToastMsg('⏱️ Speedometer & Pacing HUD locked to Streamer HUD!');
              setTimeout(() => setToastMsg(null), 3000);
            }}
          >
            <CheckCircle2 size={16} />
            <span>Lock Pacing HUD to Overlay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
