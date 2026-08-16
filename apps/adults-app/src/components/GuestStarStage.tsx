import React from 'react';
import { Mic, MicOff, Video, VideoOff, Crown, Sparkles } from 'lucide-react';

export type GuestLayoutMode = 'side-by-side' | 'grid' | 'spotlight' | 'drama';

export interface GuestParticipant {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  videoUrl?: string;
  isMuted: boolean;
  isVideoOff: boolean;
  audioLevel: number; // 0 to 100
  isSpeaking: boolean;
  volume: number; // 0 to 100
  isHost?: boolean;
}

interface GuestStarStageProps {
  layout: GuestLayoutMode;
  participants: GuestParticipant[];
  onToggleMuteGuest?: (guestId: string) => void;
  onSelectSpotlight?: (guestId: string) => void;
  spotlightGuestId?: string;
}

export const GuestStarStage: React.FC<GuestStarStageProps> = ({
  layout,
  participants,
  onToggleMuteGuest,
  onSelectSpotlight,
  spotlightGuestId
}) => {
  if (participants.length === 0) return null;

  const spotlightUser = participants.find(p => p.id === spotlightGuestId) || participants[0];
  const otherParticipants = participants.filter(p => p.id !== spotlightUser.id);

  return (
    <div className={`guest-star-stage-container layout-${layout}`}>
      {/* SPOTLIGHT LAYOUT */}
      {layout === 'spotlight' && (
        <div className="guest-spotlight-wrapper">
          <div className={`guest-video-slot spotlight-main ${spotlightUser.isSpeaking ? 'active-speaker' : ''}`}>
            <img src={spotlightUser.avatarUrl} alt={spotlightUser.name} className="guest-video-feed" />
            <div className="guest-slot-overlay">
              <div className="guest-slot-badge">
                {spotlightUser.isHost ? <Crown size={13} color="#ffd700" /> : <Sparkles size={13} color="#00e5ff" />}
                <span className="guest-name">{spotlightUser.name}</span>
                <span className="guest-role-tag">{spotlightUser.role}</span>
              </div>
              <div className="guest-slot-status">
                {spotlightUser.isMuted ? <MicOff size={14} color="#ff3b3b" /> : <Mic size={14} color="#00e676" />}
              </div>
            </div>
            {/* Audio meter bar */}
            {!spotlightUser.isMuted && (
              <div className="audio-meter-strip">
                <div className="audio-meter-fill" style={{ width: `${spotlightUser.audioLevel}%` }} />
              </div>
            )}
          </div>

          <div className="guest-spotlight-tray">
            {otherParticipants.map((p) => (
              <div
                key={p.id}
                className={`guest-video-slot spotlight-thumb ${p.isSpeaking ? 'active-speaker' : ''}`}
                onClick={() => onSelectSpotlight && onSelectSpotlight(p.id)}
                title="Click to spotlight"
              >
                <img src={p.avatarUrl} alt={p.name} className="guest-video-feed" />
                <div className="guest-slot-overlay mini">
                  <span className="guest-name-sm">{p.name}</span>
                  {p.isMuted && <MicOff size={11} color="#ff3b3b" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE OR GRID OR DRAMA LAYOUT */}
      {layout !== 'spotlight' && (
        <div className={`guest-slots-grid count-${participants.length}`}>
          {participants.map((p) => (
            <div
              key={p.id}
              className={`guest-video-slot ${p.isSpeaking ? 'active-speaker' : ''} ${layout === 'drama' ? 'drama-slot' : ''}`}
            >
              {p.isVideoOff ? (
                <div className="guest-avatar-placeholder">
                  <img src={p.avatarUrl} alt={p.name} className="guest-avatar-img" />
                </div>
              ) : (
                <img src={p.avatarUrl} alt={p.name} className="guest-video-feed" />
              )}

              <div className="guest-slot-overlay">
                <div className="guest-slot-badge">
                  {p.isHost ? <Crown size={13} color="#ffd700" /> : <Sparkles size={13} color="#00e5ff" />}
                  <span className="guest-name">{p.name}</span>
                  <span className="guest-role-tag">{p.role}</span>
                </div>

                <div className="guest-slot-status">
                  {p.isMuted ? (
                    <button
                      className="btn-guest-mic muted"
                      onClick={() => onToggleMuteGuest && onToggleMuteGuest(p.id)}
                      title="Unmute"
                    >
                      <MicOff size={13} />
                    </button>
                  ) : (
                    <button
                      className="btn-guest-mic"
                      onClick={() => onToggleMuteGuest && onToggleMuteGuest(p.id)}
                      title="Mute"
                    >
                      <Mic size={13} />
                    </button>
                  )}
                  {p.isVideoOff ? <VideoOff size={13} color="#ff3b3b" /> : <Video size={13} color="#00e676" />}
                </div>
              </div>

              {/* Audio meter bar */}
              {!p.isMuted && (
                <div className="audio-meter-strip">
                  <div className="audio-meter-fill" style={{ width: `${p.audioLevel}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
