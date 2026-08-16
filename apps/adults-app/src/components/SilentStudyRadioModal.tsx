import React, { useState } from 'react';
import { X, Radio, Sparkles, CheckCircle2, Play, Pause, Clock, Volume2, Users, Flame } from 'lucide-react';
import { DEFAULT_RADIO_TRACKS, DEFAULT_POMODORO_SESSION, type RadioTrack, type PomodoroSession } from '../lib/silentStudyRadioData';
import { soundFX } from '../lib/soundFx';

interface SilentStudyRadioModalProps {
  streamerName: string;
  onClose: () => void;
}

export const SilentStudyRadioModal: React.FC<SilentStudyRadioModalProps> = ({
  streamerName,
  onClose
}) => {
  const [tracks] = useState<RadioTrack[]>(DEFAULT_RADIO_TRACKS);
  const [session] = useState<PomodoroSession>(DEFAULT_POMODORO_SESSION);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTrackId, setActiveTrackId] = useState<string>('track_lofi_rain');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTogglePlay = () => {
    soundFX.playPop();
    setIsPlaying(prev => !prev);
    setToastMsg(isPlaying ? '⏸️ Paused 24/7 Silent Study Lo-Fi Stream.' : '▶️ Resumed 24/7 Silent Study Lo-Fi Stream.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectTrack = (t: RadioTrack) => {
    soundFX.playPop();
    soundFX.playPageRustle();
    setActiveTrackId(t.id);
    setIsPlaying(true);
    setToastMsg(`📻 Now Playing: "${t.title}" (${t.ambienceMix})`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const minutes = Math.floor(session.timeRemainingSec / 60);
  const seconds = session.timeRemainingSec % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const currentTrack = tracks.find(t => t.id === activeTrackId) || tracks[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="radio-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="radio-modal-header">
          <div className="radio-title-group">
            <div className="radio-badge">
              <Radio size={16} />
              <span>24/7 SILENT STUDY RADIO & COZY POMODORO ROOM</span>
            </div>
            <h3>@{streamerName}'s Silent Library Sanctuary</h3>
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

        {/* Pomodoro Timer Hero Banner */}
        <div className="pomodoro-hero-banner">
          <div className="pomodoro-clock-dial">
            <Clock size={28} color="#00ff88" />
            <span className="timer-digits">{timeFormatted}</span>
            <span className="mode-tag">{session.mode === 'STUDY_FOCUS' ? 'FOCUS SPRINT' : 'COZY BREAK'}</span>
          </div>

          <div className="pomodoro-info-col">
            <div className="active-readers-stat">
              <Users size={14} color="#ffd700" />
              <span>{session.activeReadersCount} readers currently studying in silence with you</span>
            </div>
            <h4>25/5 Pomodoro Cycle Active</h4>
            <p>
              Chat is automatically put in Slow & Whisper mode during 25-minute silent reading blocks.
            </p>
            <div className="streak-tag">
              <Flame size={14} color="#ff3b3b" />
              <span>{session.totalStudyMinToday} mins total focus study completed today</span>
            </div>
          </div>
        </div>

        {/* Live Lo-Fi Radio Player */}
        <div className="radio-player-card">
          <div className="radio-top-bar">
            <div className="track-playing-meta">
              <span className="live-radio-dot animate-pulse"></span>
              <div>
                <strong>{currentTrack.title}</strong>
                <p>{currentTrack.artist} • {currentTrack.ambienceMix}</p>
              </div>
            </div>

            <button
              type="button"
              className="btn-play-pause"
              onClick={handleTogglePlay}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>

          <div className="tracks-list">
            {tracks.map(t => (
              <div
                key={t.id}
                className={`track-item-row ${t.id === activeTrackId ? 'active' : ''}`}
                onClick={() => handleSelectTrack(t)}
              >
                <div className="track-left">
                  <Volume2 size={14} color={t.id === activeTrackId ? '#00ff88' : 'var(--text-muted)'} />
                  <span>{t.title}</span>
                </div>
                <span className="track-time">{t.durationMin}:00</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="radio-modal-footer">
          <span className="radio-sub-notice">
            🎧 Royalty-free DMCA-safe lo-fi beats + binaural study ambient soundscapes.
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
