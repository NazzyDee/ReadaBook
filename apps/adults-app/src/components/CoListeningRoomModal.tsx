import React, { useState, useEffect } from 'react';
import {
  X,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Mic,
  MicOff,
  Hand,
  MessageSquare,
  Sparkles,
  Heart,
  Plus
} from 'lucide-react';
import {
  SAMPLE_CO_LISTENING_ROOMS,
  type CoListeningRoom,
  type SharedNote
} from '../lib/coListeningData';
import { soundFX } from '../lib/soundFx';

interface CoListeningRoomModalProps {
  onClose: () => void;
}

export const CoListeningRoomModal: React.FC<CoListeningRoomModalProps> = ({ onClose }) => {
  const [selectedRoom, setSelectedRoom] = useState<CoListeningRoom>(SAMPLE_CO_LISTENING_ROOMS[0]);
  const [isPlaying, setIsPlaying] = useState(selectedRoom.isPlaying);
  const [currentTime, setCurrentTime] = useState(selectedRoom.currentTimeSec);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [notes, setNotes] = useState<SharedNote[]>(selectedRoom.sharedNotes);

  // Synchronized playback simulation
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= selectedRoom.totalDurationSec) return 0;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, selectedRoom.totalDurationSec]);

  const handleTogglePlay = () => {
    soundFX.playPop();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (sec: number) => {
    soundFX.playPop();
    setCurrentTime(sec);
  };

  const handleToggleMic = () => {
    soundFX.playPop();
    setIsMicMuted(!isMicMuted);
  };

  const handleToggleHand = () => {
    soundFX.playPop();
    setIsHandRaised(!isHandRaised);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    soundFX.playChestClaim();

    const note: SharedNote = {
      id: `note-${Date.now()}`,
      username: 'YOU',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text: newNoteText.trim(),
      timestampSec: currentTime,
      likes: 1
    };

    setNotes([note, ...notes]);
    setNewNoteText('');
  };

  const handleLikeNote = (noteId: string) => {
    soundFX.playPop();
    setNotes(prev =>
      prev.map(n => (n.id === noteId ? { ...n, likes: n.likes + 1 } : n))
    );
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(100, Math.round((currentTime / selectedRoom.totalDurationSec) * 100));

  return (
    <div className="modal-backdrop">
      <div className="co-listening-modal-card">
        {/* Header */}
        <div className="co-listening-header">
          <div className="co-title-group">
            <Headphones size={24} color="#00e5ff" />
            <div>
              <h3>🎧 Community Co-Listening Lounge</h3>
              <span className="modal-subtitle">Synchronized Audiobook & Reading Room • {selectedRoom.title}</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Room Switcher Tabs */}
        <div className="co-rooms-tabs">
          {SAMPLE_CO_LISTENING_ROOMS.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                soundFX.playPop();
                setSelectedRoom(r);
                setIsPlaying(r.isPlaying);
                setCurrentTime(r.currentTimeSec);
                setNotes(r.sharedNotes);
              }}
              className={`co-room-tab-btn ${selectedRoom.id === r.id ? 'active' : ''}`}
            >
              <span>{r.title}</span>
              <span className="co-room-count">👥 {r.participantsCount}</span>
            </button>
          ))}
        </div>

        {/* Main Grid: Left Stage/Player & Right Synced Notes */}
        <div className="co-listening-layout">
          {/* Left Column: Player & Voice Stage */}
          <div className="co-player-col">
            {/* Synchronized Player Bar */}
            <div className="co-player-box">
              <div className="book-playing-meta">
                <img src={selectedRoom.coverUrl} alt="" className="co-book-cover" />
                <div>
                  <strong className="co-book-title">{selectedRoom.bookTitle}</strong>
                  <span className="co-book-ch">{selectedRoom.currentChapter}</span>
                  <span className="co-host-tag">Hosted by @{selectedRoom.hostName}</span>
                </div>
              </div>

              {/* Progress Scrubber */}
              <div className="co-scrub-row">
                <span className="co-time-lbl">{formatTime(currentTime)}</span>
                <div
                  className="co-scrub-track"
                  onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    handleSeek(Math.floor(pct * selectedRoom.totalDurationSec));
                  }}
                >
                  <div className="co-scrub-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="co-time-lbl">{formatTime(selectedRoom.totalDurationSec)}</span>
              </div>

              {/* Playback Controls */}
              <div className="co-controls-row">
                <button
                  type="button"
                  onClick={() => handleSeek(Math.max(0, currentTime - 15))}
                  className="btn-co-control"
                  title="Rewind 15 seconds"
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="btn-co-play"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSeek(Math.min(selectedRoom.totalDurationSec, currentTime + 15))}
                  className="btn-co-control"
                  title="Forward 15 seconds"
                >
                  <RotateCw size={16} />
                </button>

                {/* Voice & Hand Controls */}
                <div className="co-mic-controls">
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className={`btn-co-mic ${isMicMuted ? 'muted' : 'active'}`}
                    title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                  >
                    {isMicMuted ? <MicOff size={16} /> : <Mic size={16} />}
                    <span>{isMicMuted ? 'Muted' : 'Mic Live'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleHand}
                    className={`btn-co-hand ${isHandRaised ? 'raised' : ''}`}
                    title="Raise Hand to Speak"
                  >
                    <Hand size={16} />
                    <span>{isHandRaised ? 'Hand Raised' : 'Raise Hand'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Synchronized Read-Along Snippet */}
            <div className="co-transcript-box">
              <span className="co-section-lbl">📖 Synchronized Story Paragraphs</span>
              <div className="co-transcript-text">
                {selectedRoom.transcriptSnippet.map((p, idx) => (
                  <p
                    key={idx}
                    className={`co-p-line ${idx === 0 ? 'active-highlight' : ''}`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Live Participants Voice Stage */}
            <div className="co-voice-stage-box">
              <span className="co-section-lbl">🎙️ Co-Listening Voice Lounge ({selectedRoom.participants.length} Active)</span>
              <div className="co-participants-grid">
                {selectedRoom.participants.map(p => (
                  <div key={p.id} className={`co-participant-card ${p.isSpeaking ? 'speaking' : ''}`}>
                    <div className="avatar-mic-wrapper">
                      <img src={p.avatarUrl} alt={p.username} className="co-p-avatar" />
                      {p.isSpeaking && <span className="speaking-ring-pulse"></span>}
                      {p.isMuted && <span className="muted-dot"><MicOff size={10} /></span>}
                    </div>
                    <strong className="co-p-name">{p.username}</strong>
                    <span className="co-p-status">{p.isHost ? 'Host' : p.isSpeaking ? 'Speaking' : 'Listening'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Shared Notes & Quotes Sticky Board */}
          <div className="co-notes-col">
            <div className="co-notes-header">
              <MessageSquare size={16} color="var(--accent-secondary)" />
              <span>Shared Live Notes & Quotes</span>
            </div>

            {/* Note Input Form */}
            <form onSubmit={handleAddNote} className="co-note-form">
              <input
                type="text"
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
                placeholder={`Add note at ${formatTime(currentTime)}...`}
                className="co-note-input"
              />
              <button type="submit" className="btn-add-note" title="Post note">
                <Plus size={16} />
              </button>
            </form>

            {/* Notes List */}
            <div className="co-notes-list">
              {notes.map(n => (
                <div key={n.id} className="co-note-card">
                  <div className="co-note-top">
                    <div className="co-note-author">
                      <img src={n.avatarUrl} alt={n.username} className="note-avatar" />
                      <strong>{n.username}</strong>
                    </div>
                    <span className="note-time-chip">⏱️ {formatTime(n.timestampSec)}</span>
                  </div>

                  <p className="note-text">{n.text}</p>

                  <div className="note-bottom-bar">
                    <button
                      type="button"
                      onClick={() => handleLikeNote(n.id)}
                      className="btn-like-note"
                    >
                      <Heart size={12} color="#ff477e" />
                      <span>{n.likes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSeek(n.timestampSec)}
                      className="btn-jump-time"
                    >
                      <Sparkles size={11} /> Jump to time
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Leave Lounge
          </button>
        </div>
      </div>
    </div>
  );
};
