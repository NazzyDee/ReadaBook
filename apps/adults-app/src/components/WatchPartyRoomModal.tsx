import React, { useState, useEffect } from 'react';
import { X, Users, Play, Pause, Volume2, Mic, MicOff, Sparkles, BookOpen, Crown, Radio } from 'lucide-react';
import { ACTIVE_WATCH_PARTY_DEMO, type WatchPartySession } from '../lib/watchPartyData';
import { soundFX } from '../lib/soundFx';

interface WatchPartyRoomModalProps {
  onClose: () => void;
}

export const WatchPartyRoomModal: React.FC<WatchPartyRoomModalProps> = ({
  onClose
}) => {
  const [session] = useState<WatchPartySession>(ACTIVE_WATCH_PARTY_DEMO);
  const [isPlaying, setIsPlaying] = useState<boolean>(session.isPlaying);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(session.currentPlaybackSeconds);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [partyChat, setPartyChat] = useState<{ id: string; user: string; text: string }[]>([
    { id: '1', user: 'NovelScholar', text: 'The Elven ring lore gives me goosebumps every single time!' },
    { id: '2', user: 'RivendellElf', text: 'Agreed! Lilly’s cadence here is flawless.' }
  ]);

  // Synchronized playback simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackSeconds(prev => (prev >= session.totalDurationSeconds ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, session.totalDurationSeconds]);

  const togglePlay = () => {
    soundFX.playPop();
    setIsPlaying(!isPlaying);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    soundFX.playPop();
    setPartyChat(prev => [
      ...prev,
      { id: `msg_${Date.now()}`, user: 'You', text: chatInput.trim() }
    ]);
    setChatInput('');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="watch-party-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="watch-party-header">
          <div className="watch-party-title-group">
            <div className="party-live-badge">
              <Radio size={14} className="pulse" />
              <span>COMMUNITY WATCH PARTY • SYNCHRONIZED AUDIO LOUNGE</span>
            </div>
            <h3>{session.roomName}</h3>
          </div>

          <div className="party-header-right">
            <button
              className={`btn-party-mic ${isMicMuted ? 'muted' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setIsMicMuted(!isMicMuted);
              }}
              title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMicMuted ? <MicOff size={15} color="var(--accent-danger)" /> : <Mic size={15} color="var(--accent-success)" />}
              <span>{isMicMuted ? 'Muted' : 'Mic Live'}</span>
            </button>

            <button onClick={onClose} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main 2-Column Stage */}
        <div className="watch-party-grid">
          {/* Left: Synchronized E-Reader & Audio Deck */}
          <div className="watch-party-stage-col">
            <div className="party-book-header">
              <BookOpen size={16} color="var(--accent-secondary)" />
              <strong>{session.bookTitle}</strong>
              <span className="party-chapter-sub">• {session.currentChapter} (Page {session.currentPage})</span>
            </div>

            {/* Glowing Synchronized Reading Text */}
            <div className="party-synced-text-box">
              <p className="party-ambient-text">
                "Ash nazg durbatulûk, ash nazg gimbatul, ash nazg thrakatulûk agh burzum-ishi krimpatul."
              </p>
              <div className="party-highlight-card">
                <Sparkles size={16} color="#ffd700" className="sparkle-icon" />
                <p className="party-current-sentence">"{session.highlightedSentence}"</p>
              </div>
              <p className="party-ambient-text">
                "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them."
              </p>
            </div>

            {/* Synchronized Playback Transport Bar */}
            <div className="party-audio-transport">
              <button
                type="button"
                className="btn-party-play-pause"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
              </button>

              <div className="party-time-readout">
                <span>{formatTime(playbackSeconds)}</span>
                <span>/</span>
                <span>{formatTime(session.totalDurationSeconds)}</span>
              </div>

              <div className="party-progress-track">
                <div
                  className="party-progress-fill"
                  style={{ width: `${(playbackSeconds / session.totalDurationSeconds) * 100}%` }}
                />
              </div>

              <div className="party-volume-indicator">
                <Volume2 size={16} color="var(--text-muted)" />
              </div>
            </div>
          </div>

          {/* Right: Members & Party Chat */}
          <div className="watch-party-side-col">
            {/* Active Members Grid */}
            <div className="party-members-panel">
              <span className="party-section-label">
                <Users size={14} />
                <span>Active Listeners ({session.members.length})</span>
              </span>

              <div className="party-members-list">
                {session.members.map(m => (
                  <div key={m.id} className="party-member-chip">
                    <img src={m.avatarUrl} alt={m.username} className="member-avatar" />
                    <div className="member-info">
                      <div className="member-name-row">
                        <strong>@{m.username}</strong>
                        {m.isHost && <Crown size={11} color="#ffd700" />}
                      </div>
                      <span className="member-role">{m.role}</span>
                    </div>
                    {m.isSpeaking && (
                      <span className="speaking-pulse-indicator" title="Speaking Live">
                        <Mic size={12} color="var(--accent-success)" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Real-Time Party Chat */}
            <div className="party-chat-panel">
              <div className="party-chat-feed">
                {partyChat.map(c => (
                  <div key={c.id} className="party-chat-msg">
                    <strong>@{c.user}:</strong>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="party-chat-input-row">
                <input
                  type="text"
                  placeholder="Whisper to watch party..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                />
                <button type="submit" className="btn-send-party-msg">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
