import React, { useEffect } from 'react';
import { Radio, Sparkles, X } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface RaidBannerProps {
  raiderName: string;
  raiderAvatar: string;
  readerCount: number;
  onShoutout: (streamerName: string) => void;
  onDismiss: () => void;
}

export const RaidBanner: React.FC<RaidBannerProps> = ({
  raiderName,
  raiderAvatar,
  readerCount,
  onShoutout,
  onDismiss
}) => {
  useEffect(() => {
    soundFX.playRaidHorn();
  }, []);

  return (
    <div className="incoming-raid-banner-alert">
      <div className="raid-alert-glow"></div>

      <div className="raid-alert-content">
        <div className="raid-avatar-wrapper">
          <img src={raiderAvatar} alt={raiderName} className="raider-avatar-img" />
          <span className="raid-horn-icon">📯</span>
        </div>

        <div className="raid-alert-text">
          <div className="raid-pill">
            <Radio size={12} className="pulse" />
            <span>INCOMING COMMUNITY RAID!</span>
          </div>
          <h3>
            <strong>{raiderName}</strong> is raiding with <strong>{readerCount.toLocaleString()}</strong> readers!
          </h3>
          <p>Give a warm bookish welcome to our new fellow readers in chat! 📖✨</p>
        </div>

        <div className="raid-alert-actions">
          <button
            onClick={() => onShoutout(raiderName)}
            className="btn-shoutout"
            title="Send chat shoutout"
          >
            <Sparkles size={14} />
            <span>Shoutout /{raiderName}</span>
          </button>
          <button onClick={onDismiss} className="btn-close-raid" title="Dismiss">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Reader Avatars swarm animation */}
      <div className="raid-swarm-particles">
        <span className="particle p1">📖</span>
        <span className="particle p2">✨</span>
        <span className="particle p3">☕</span>
        <span className="particle p4">📚</span>
        <span className="particle p5">🎉</span>
      </div>
    </div>
  );
};
