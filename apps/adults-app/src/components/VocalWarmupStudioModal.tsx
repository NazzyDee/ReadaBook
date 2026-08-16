import React, { useState, useEffect } from 'react';
import { X, Mic, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { MOCK_VOCAL_WARMUPS, type VocalExercise } from '../lib/vocalWarmupData';
import { soundFX } from '../lib/soundFx';

interface VocalWarmupStudioModalProps {
  streamerName: string;
  onClose: () => void;
}

export const VocalWarmupStudioModal: React.FC<VocalWarmupStudioModalProps> = ({
  streamerName,
  onClose
}) => {
  const [exercises] = useState<VocalExercise[]>(MOCK_VOCAL_WARMUPS);
  const [selectedExId, setSelectedExId] = useState<string>('ex_tongue_twister');
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeExercise = exercises.find(e => e.id === selectedExId) || exercises[0];

  useEffect(() => {
    if (!isPlaying || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(s => {
        if (s <= 1) {
          setIsPlaying(false);
          soundFX.playChestClaim();
          setToastMsg('✨ Warmup exercise completed! Vocal cords ready for narration.');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, timerSeconds]);

  const handleSelectExercise = (ex: VocalExercise) => {
    soundFX.playPop();
    setSelectedExId(ex.id);
    setTimerSeconds(ex.durationSeconds);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    soundFX.playPop();
    setIsPlaying(!isPlaying);
  };

  const handleResetTimer = () => {
    soundFX.playPop();
    setIsPlaying(false);
    setTimerSeconds(activeExercise.durationSeconds);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="vocal-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="vocal-modal-header">
          <div className="vocal-title-group">
            <div className="vocal-badge">
              <Mic size={16} />
              <span>NARRATOR VOCAL WARMUP & BREATH CONTROL STUDIO</span>
            </div>
            <h3>@{streamerName}'s Pre-Stream Vocal Suite</h3>
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

        <div className="vocal-body-grid">
          {/* Left: Exercises List */}
          <div className="vocal-exercises-sidebar">
            <span className="sidebar-sec-label">ROUTINE EXERCISES</span>
            <div className="exercises-nav-list">
              {exercises.map(ex => (
                <button
                  key={ex.id}
                  type="button"
                  className={`exercise-chip-btn ${selectedExId === ex.id ? 'active' : ''}`}
                  onClick={() => handleSelectExercise(ex)}
                >
                  <span className="ex-icon">{ex.icon}</span>
                  <div className="ex-info">
                    <strong>{ex.name}</strong>
                    <span className="ex-cat">{ex.category} • {ex.durationSeconds}s</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Active Workout Studio */}
          <div className="vocal-workout-pane">
            <div className="active-ex-header">
              <span className="ex-cat-pill">{activeExercise.category}</span>
              <h4>{activeExercise.name}</h4>
              <p className="ex-instructions">{activeExercise.instructions}</p>
            </div>

            {/* Tongue Twister Phrase Box */}
            {activeExercise.samplePhrase && (
              <div className="tongue-twister-phrase-box">
                <span className="twister-label">READ ALOUD AT INCREASING SPEED:</span>
                <p className="twister-text">{activeExercise.samplePhrase}</p>
              </div>
            )}

            {/* Metronome / Timer HUD */}
            <div className="vocal-timer-box">
              <div className="timer-seconds-display">
                <span>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
              </div>

              <div className="timer-buttons-row">
                <button
                  type="button"
                  className="btn-primary btn-play-timer"
                  onClick={handleTogglePlay}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isPlaying ? 'Pause Warmup' : 'Start Timer'}</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary btn-reset-timer"
                  onClick={handleResetTimer}
                  title="Reset Timer"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
