import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bell,
  Check,
  Calendar,
  Video
} from 'lucide-react';
import { type StreamerProfile } from '../lib/streamersData';
import { soundFX } from '../lib/soundFx';

interface OfflineChannelHeroProps {
  streamer: StreamerProfile;
  onSetReminder?: (title: string, day: string, time: string) => void;
}

export const OfflineChannelHero: React.FC<OfflineChannelHeroProps> = ({
  streamer,
  onSetReminder
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasReminder, setHasReminder] = useState(false);

  // Next scheduled stream info
  const nextEvent = streamer.schedule[0] || {
    id: 'next1',
    day: 'Tomorrow',
    time: '7:00 PM EST',
    title: 'Dramatic Chapter Reading & Lore Q&A',
    bookTitle: 'The Fellowship of the Ring'
  };

  // 48-hour mock countdown target
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 8,
    minutes: 34,
    seconds: 12
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleReminder = () => {
    soundFX.playChestClaim();
    setHasReminder(!hasReminder);
    if (onSetReminder && !hasReminder) {
      onSetReminder(nextEvent.title, nextEvent.day, nextEvent.time);
    }
  };

  return (
    <div className="offline-channel-hero">
      {/* Featured Video Trailer with Ambient Glow */}
      <div className="trailer-video-canvas">
        <div className="trailer-ambient-glow" />

        {/* Video Canvas Simulation */}
        <div className="trailer-media-container">
          <img
            src={streamer.bannerUrl}
            alt="Trailer Video"
            className={`trailer-video-frame ${isPlaying ? 'playing' : 'paused'}`}
          />
          <div className="trailer-overlay-gradient" />

          {/* Top Trailer Badge */}
          <div className="trailer-top-badge">
            <Video size={14} color="#00e5ff" />
            <span>FEATURED CHANNEL TRAILER</span>
          </div>

          {/* Video Controls overlay */}
          <div className="trailer-controls-bar">
            <button
              onClick={() => {
                soundFX.playPop();
                setIsPlaying(!isPlaying);
              }}
              className="btn-trailer-ctrl"
              title={isPlaying ? 'Pause Trailer' : 'Play Trailer'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>

            <button
              onClick={() => {
                soundFX.playPop();
                setIsMuted(!isMuted);
              }}
              className="btn-trailer-ctrl"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <span className="trailer-title-chip">
              Introduction to {streamer.displayName}'s Channel
            </span>
          </div>
        </div>
      </div>

      {/* Next Stream Countdown Card */}
      <div className="next-stream-countdown-card">
        <div className="countdown-header-line">
          <div className="next-stream-badge">
            <span className="status-offline-dot"></span>
            <strong>OFFLINE • NEXT BROADCAST IN:</strong>
          </div>
          <span className="stream-timecode-badge">
            <Calendar size={13} />
            <span>{nextEvent.day} @ {nextEvent.time}</span>
          </span>
        </div>

        {/* Countdown Digits Matrix */}
        <div className="countdown-digits-grid">
          <div className="digit-card">
            <span className="digit-val">{timeLeft.days.toString().padStart(2, '0')}</span>
            <span className="digit-unit">DAYS</span>
          </div>
          <span className="digit-colon">:</span>

          <div className="digit-card">
            <span className="digit-val">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="digit-unit">HOURS</span>
          </div>
          <span className="digit-colon">:</span>

          <div className="digit-card">
            <span className="digit-val">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="digit-unit">MINS</span>
          </div>
          <span className="digit-colon">:</span>

          <div className="digit-card">
            <span className="digit-val">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="digit-unit">SECS</span>
          </div>
        </div>

        {/* Next Session Title & Reminder CTA */}
        <div className="next-event-details">
          <div className="next-event-text">
            <h4>{nextEvent.title}</h4>
            <p>Reading <strong>{nextEvent.bookTitle}</strong> with live community predictions & Q&A</p>
          </div>

          <button
            onClick={handleToggleReminder}
            className={`btn-stream-reminder ${hasReminder ? 'reminded' : ''}`}
          >
            {hasReminder ? <Check size={16} color="#00ff88" /> : <Bell size={16} />}
            <span>{hasReminder ? 'Reminder Set!' : 'Notify Me (Bell)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
