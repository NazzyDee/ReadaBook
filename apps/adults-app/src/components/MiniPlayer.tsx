import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Radio } from 'lucide-react';

interface MiniPlayerProps {
  streamerId: string;
  streamerName: string;
  streamTitle: string;
  avatarUrl: string;
  viewerCount: number;
  onClose: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  streamerId,
  streamerName,
  streamTitle,
  avatarUrl,
  viewerCount,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="twitch-mini-player">
      <div className="mini-player-canvas">
        <img src={avatarUrl} alt="" className="mini-player-bg" />
        <div className="mini-player-overlay">
          <div className="mini-player-top">
            <div className="mini-live-badge">
              <Radio size={10} className="pulse" />
              <span>LIVE</span>
            </div>
            <button onClick={onClose} className="btn-mini-close" title="Close Mini-Player">
              <X size={14} />
            </button>
          </div>

          <div className="mini-player-bottom">
            <div className="mini-stream-info">
              <span className="mini-streamer-name">{streamerName}</span>
              <p className="mini-stream-title">{streamTitle}</p>
              <span className="mini-viewers">{(viewerCount).toLocaleString()} viewers</span>
            </div>

            <div className="mini-controls-row">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-mini-ctrl"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="btn-mini-ctrl"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              <Link
                to={`/stream/${streamerId}`}
                className="btn-mini-ctrl"
                title="Expand to Full Stream"
              >
                <Maximize2 size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
