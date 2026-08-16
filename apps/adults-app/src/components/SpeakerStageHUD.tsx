import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Clock,
  Plus,
  X,
  MessageSquare
} from 'lucide-react';
import { type StageSpeakerRequest } from '../lib/stageQueueData';
import { soundFX } from '../lib/soundFx';

interface SpeakerStageHUDProps {
  activeSpeaker: StageSpeakerRequest | null;
  onExtendSpeakerTime: (extraSecs: number) => void;
  onEndSpeakerTurn: () => void;
  onToggleSpeakerMute: () => void;
}

export const SpeakerStageHUD: React.FC<SpeakerStageHUDProps> = ({
  activeSpeaker,
  onExtendSpeakerTime,
  onEndSpeakerTurn,
  onToggleSpeakerMute
}) => {
  const [timeLeft, setTimeLeft] = useState(activeSpeaker?.timeRemainingSecs || 60);

  useEffect(() => {
    if (!activeSpeaker) return;
    setTimeLeft(activeSpeaker.timeRemainingSecs);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          soundFX.playPop();
          onEndSpeakerTurn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSpeaker]);

  if (!activeSpeaker) return null;

  return (
    <div className="speaker-stage-hud-overlay">
      <div className="speaker-hud-card">
        {/* Live Audio Indicator */}
        <div className="speaker-avatar-container">
          <img
            src={activeSpeaker.avatarUrl}
            alt={activeSpeaker.username}
            className={`speaker-hud-avatar ${!activeSpeaker.micMuted ? 'speaking-pulse' : ''}`}
          />
          <div className="on-air-badge">
            <span className="live-dot-pulse"></span>
            <span>ON AIR</span>
          </div>
        </div>

        {/* Info & Topic */}
        <div className="speaker-hud-details">
          <div className="speaker-name-row">
            <strong>{activeSpeaker.username}</strong>
            <span className="speaker-badge-pill">{activeSpeaker.badge}</span>
          </div>

          <div className="speaker-topic-row">
            <MessageSquare size={12} color="var(--accent-secondary)" />
            <span>"{activeSpeaker.questionTopic}"</span>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className={`speaker-hud-timer ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
          <Clock size={14} />
          <span>{timeLeft}s</span>
        </div>

        {/* Host Controls */}
        <div className="speaker-hud-controls">
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              onExtendSpeakerTime(30);
              setTimeLeft(prev => prev + 30);
            }}
            className="btn-hud-extend"
            title="Extend mic time by 30 seconds"
          >
            <Plus size={13} />
            <span>+30s</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              onToggleSpeakerMute();
            }}
            className={`btn-hud-mute ${activeSpeaker.micMuted ? 'muted' : ''}`}
            title={activeSpeaker.micMuted ? 'Unmute speaker' : 'Mute speaker'}
          >
            {activeSpeaker.micMuted ? <MicOff size={14} /> : <Mic size={14} />}
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              onEndSpeakerTurn();
            }}
            className="btn-hud-end"
            title="Thank and yield mic"
          >
            <X size={14} />
            <span>Yield</span>
          </button>
        </div>
      </div>
    </div>
  );
};
