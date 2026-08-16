import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  Radio,
  Tv,
  Activity,
  X,
  RotateCcw,
  Users
} from 'lucide-react';
import { GuestStarStage, type GuestLayoutMode, type GuestParticipant } from './GuestStarStage';
import { SpeakerStageHUD } from './SpeakerStageHUD';
import { type StageSpeakerRequest } from '../lib/stageQueueData';
import { soundFX } from '../lib/soundFx';

interface CheerAnimationItem {
  id: string;
  bits: number;
  username: string;
  message: string;
  icon: string;
}

interface VideoPlayerProps {
  streamerName: string;
  streamTitle: string;
  isLive?: boolean;
  viewerCount: number;
  broadcastSource?: 'webcam' | 'obs';
  isObsConnected?: boolean;
  activeCheer?: CheerAnimationItem | null;
  theaterMode?: boolean;
  onToggleTheater?: () => void;
  audioOnly?: boolean;
  onToggleAudioOnly?: () => void;
  guestStarActive?: boolean;
  guestLayout?: GuestLayoutMode;
  guestParticipants?: GuestParticipant[];
  onOpenGuestStarModal?: () => void;
  activeSpeaker?: StageSpeakerRequest | null;
  onExtendSpeakerTime?: (secs: number) => void;
  onEndSpeakerTurn?: () => void;
  onToggleSpeakerMute?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamerName,
  streamTitle,
  viewerCount,
  broadcastSource = 'webcam',
  isObsConnected = false,
  activeCheer,
  theaterMode = false,
  onToggleTheater,
  audioOnly = false,
  onToggleAudioOnly,
  guestStarActive = false,
  guestLayout = 'side-by-side',
  guestParticipants = [],
  onOpenGuestStarModal,
  activeSpeaker = null,
  onExtendSpeakerTime = () => {},
  onEndSpeakerTurn = () => {},
  onToggleSpeakerMute = () => {}
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [quality, setQuality] = useState('1080p60 (Source)');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [lowLatency, setLowLatency] = useState(true);
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [streamUptime, setStreamUptime] = useState('01:42:15');

  // Live DVR Rewind state (max 3600 seconds / 1 hour)
  const [dvrOffsetSecs, setDvrOffsetSecs] = useState(0); // 0 = live head, >0 = rewound seconds

  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<any>(null);

  // Uptime tick
  useEffect(() => {
    let secs = 6135;
    const interval = setInterval(() => {
      secs += 1;
      const h = Math.floor(secs / 3600).toString().padStart(2, '0');
      const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
      const s = (secs % 60).toString().padStart(2, '0');
      setStreamUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    hideControlsTimerRef.current = setTimeout(() => {
      if (isPlaying) setControlsVisible(false);
    }, 3500);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleTimelineScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseInt(e.target.value, 10);
    setDvrOffsetSecs(3600 - rawVal);
  };

  const handleReturnToLive = () => {
    soundFX.playPop();
    setDvrOffsetSecs(0);
  };

  const formatOffset = (offset: number) => {
    if (offset === 0) return 'LIVE';
    const m = Math.floor(offset / 60);
    const s = offset % 60;
    return `-${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`twitch-video-player-container ${theaterMode ? 'theater-mode' : ''} ${isFullscreen ? 'fullscreen-mode' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
    >
      {/* Ambient Lighting Glow Halo */}
      {ambientGlow && <div className="ambient-glow-halo" />}

      {/* Visual Canvas: Guest Star Stage VS Audio-Only VS OBS VS Webcam */}
      {guestStarActive && guestParticipants.length > 0 ? (
        <GuestStarStage
          layout={guestLayout}
          participants={guestParticipants}
        />
      ) : audioOnly ? (
        <div className="audio-only-canvas">
          <div className="audio-soundwave-bars">
            {[40, 75, 100, 60, 85, 30, 90, 65, 45, 95, 80, 50, 70, 85].map((h, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i * 0.1).toFixed(1)}s`
                }}
              />
            ))}
          </div>
          <h3>Audio-Only Bandwidth Saver Active</h3>
          <p>Listening to <strong>{streamerName}</strong>'s soothing voice stream • Low CPU & Data usage</p>
        </div>
      ) : broadcastSource === 'obs' ? (
        isObsConnected ? (
          <div className="obs-feed-canvas">
            <div className="obs-avatar-pulse">
              <span className="obs-icon">📡</span>
            </div>
            <h3>{streamerName}'s OBS Studio Stream</h3>
            <span className="obs-badge">🟢 1080p60 • 6000 Kbps Ingestion Feed</span>
            <p className="obs-subtext">Live broadcast from OBS Studio • Audio synchronized</p>
          </div>
        ) : (
          <div className="obs-awaiting-canvas">
            <span className="awaiting-icon">📡</span>
            <h3>Awaiting OBS Signal...</h3>
            <p>Storyteller is connecting their high-definition stream.</p>
          </div>
        )
      ) : (
        <div className="webcam-feed-canvas">
          <div className="streamer-webcam-avatar">
            <span>{streamerName.substring(0, 2).toUpperCase()}</span>
          </div>
          <h3 className="streamer-live-name">{streamerName} is Live!</h3>
          <span className="live-status-pill">Webcam Broadcast Active</span>
          <p className="live-subtext">Narrating live on camera with ambient studio lighting 🎥</p>
        </div>
      )}

      {/* Cheer Animation Overlay */}
      {activeCheer && (
        <div className="cheer-flyout-overlay">
          <div className="cheer-flyout-box">
            <span className="cheer-flyout-icon">{activeCheer.icon}</span>
            <div className="cheer-flyout-details">
              <span className="cheer-flyout-user">{activeCheer.username} cheered {activeCheer.bits.toLocaleString()} Sparks!</span>
              <p className="cheer-flyout-msg">"{activeCheer.message}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Left Live Pill & DVR Rewind Indicator */}
      <div className="player-top-overlay">
        <div
          className={`player-live-pill ${dvrOffsetSecs > 0 ? 'dvr-rewound' : ''}`}
          onClick={dvrOffsetSecs > 0 ? handleReturnToLive : undefined}
          style={{ cursor: dvrOffsetSecs > 0 ? 'pointer' : 'default' }}
          title={dvrOffsetSecs > 0 ? 'Click to jump to LIVE' : 'Broadcasting Live'}
        >
          <span className={`rec-dot-animated ${dvrOffsetSecs > 0 ? 'grey' : ''}`}></span>
          <span>{dvrOffsetSecs > 0 ? `REWOUND (${formatOffset(dvrOffsetSecs)})` : 'LIVE'}</span>
          <span className="uptime-divider">|</span>
          <span className="uptime-text">{streamUptime}</span>
          {dvrOffsetSecs > 0 && <span className="jump-live-btn-tag">JUMP TO LIVE ⤺</span>}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {guestStarActive && (
            <div className="player-guest-pill" onClick={onOpenGuestStarModal} style={{ cursor: 'pointer' }}>
              <Users size={13} color="#00e5ff" />
              <span>Guest Star ({guestParticipants.length})</span>
            </div>
          )}

          <div className="player-stats-pill">
            <span className="viewer-dot"></span>
            <span>{(viewerCount).toLocaleString()} viewers</span>
          </div>
        </div>
      </div>

      {/* Video Stats for Geeks Overlay HUD */}
      {showStats && (
        <div className="player-stats-for-geeks-hud">
          <div className="stats-hud-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#00ff88" />
              <span>Video Diagnostic Stats</span>
            </div>
            <button onClick={() => setShowStats(false)} className="btn-close-stats-hud">
              <X size={12} />
            </button>
          </div>
          <div className="stats-hud-grid">
            <div className="stats-hud-row"><span>Video Resolution:</span><strong>1920x1080@60fps</strong></div>
            <div className="stats-hud-row"><span>Live Bitrate:</span><strong>6,142 Kbps</strong></div>
            <div className="stats-hud-row"><span>Audio Codec:</span><strong>AAC (48.0 kHz Stereo)</strong></div>
            <div className="stats-hud-row"><span>Latency to Host:</span><strong>1.18s (Low Latency)</strong></div>
            <div className="stats-hud-row"><span>Dropped Frames:</span><strong>0 / 48,290 (0.00%)</strong></div>
            <div className="stats-hud-row"><span>Buffer Health:</span><strong>2.42s</strong></div>
            <div className="stats-hud-row"><span>Broadcast Protocol:</span><strong>WebRTC H.264 High</strong></div>
          </div>
        </div>
      )}

      {/* Active Live Audience Speaker HUD */}
      {activeSpeaker && (
        <SpeakerStageHUD
          activeSpeaker={activeSpeaker}
          onExtendSpeakerTime={onExtendSpeakerTime}
          onEndSpeakerTurn={onEndSpeakerTurn}
          onToggleSpeakerMute={onToggleSpeakerMute}
        />
      )}

      {/* Bottom Floating Control Bar with Live DVR Scrubber */}
      <div className={`player-controls-bar ${controlsVisible ? 'visible' : 'hidden'}`}>
        {/* DVR Scrubber Timeline */}
        <div className="live-dvr-scrubber-track">
          <input
            type="range"
            min="0"
            max="3600"
            step="5"
            value={3600 - dvrOffsetSecs}
            onChange={handleTimelineScrub}
            className="dvr-range-input"
          />
          <div className="dvr-buffer-bar" style={{ width: '100%' }} />
          <div
            className="dvr-progress-bar"
            style={{ width: `${((3600 - dvrOffsetSecs) / 3600) * 100}%` }}
          />

          {/* Time text / Live head */}
          <div className="dvr-time-row">
            <div className="dvr-left-badge">
              {dvrOffsetSecs > 0 ? (
                <button type="button" onClick={handleReturnToLive} className="btn-dvr-jump-live">
                  <RotateCcw size={12} />
                  <span>Return to Live ({formatOffset(dvrOffsetSecs)})</span>
                </button>
              ) : (
                <span className="live-sync-indicator">🔴 Synchronized to Live Head</span>
              )}
            </div>
            <span className="dvr-duration-label">{streamUptime} / Live</span>
          </div>
        </div>

        <div className="player-buttons-row">
          <div className="controls-left">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-player-control"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div className="volume-control-group">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="btn-player-control"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="player-volume-slider"
              />
            </div>

            <span className="player-stream-title-snip">{streamTitle}</span>
          </div>

          <div className="controls-right">
            {/* Guest Star Stage Launcher */}
            {onOpenGuestStarModal && (
              <button
                onClick={onOpenGuestStarModal}
                className={`btn-player-control ${guestStarActive ? 'active-toggle' : ''}`}
                title="Guest Star Multi-Reader Stage"
              >
                <Users size={18} />
              </button>
            )}

            {/* Audio-Only Radio Mode Toggle */}
            {onToggleAudioOnly && (
              <button
                onClick={onToggleAudioOnly}
                className={`btn-player-control ${audioOnly ? 'active-toggle' : ''}`}
                title="Audio-Only Bandwidth Saver"
              >
                <Radio size={18} />
              </button>
            )}

            {/* Settings Menu */}
            <div className="player-settings-wrapper">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="btn-player-control"
                title="Video Settings"
              >
                <Settings size={18} />
              </button>

              {showSettingsMenu && (
                <div className="player-settings-popover">
                  <div className="settings-header">Settings</div>
                  <div className="settings-section">
                    <span className="settings-label">Quality:</span>
                    {['1080p60 (Source)', '720p60', '480p', '360p', 'Auto'].map(q => (
                      <button
                        key={q}
                        className={`settings-opt-btn ${quality === q ? 'active' : ''}`}
                        onClick={() => {
                          setQuality(q);
                          setShowSettingsMenu(false);
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <div className="settings-divider"></div>
                  <div className="settings-toggle-row">
                    <span>Low Latency Mode</span>
                    <input
                      type="checkbox"
                      checked={lowLatency}
                      onChange={(e) => setLowLatency(e.target.checked)}
                    />
                  </div>
                  <div className="settings-toggle-row" style={{ marginTop: '8px' }}>
                    <span>Ambient Glow Halo</span>
                    <input
                      type="checkbox"
                      checked={ambientGlow}
                      onChange={(e) => setAmbientGlow(e.target.checked)}
                    />
                  </div>
                  <div className="settings-divider"></div>
                  <button
                    className="settings-opt-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => {
                      setShowStats(!showStats);
                      setShowSettingsMenu(false);
                    }}
                  >
                    <Activity size={14} />
                    <span>{showStats ? 'Hide Video Stats' : 'Video Stats for Geeks'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theater Mode Toggle */}
            {onToggleTheater && (
              <button
                onClick={onToggleTheater}
                className={`btn-player-control ${theaterMode ? 'active-toggle' : ''}`}
                title="Theater Mode (Alt+T)"
              >
                <Tv size={18} />
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="btn-player-control"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
