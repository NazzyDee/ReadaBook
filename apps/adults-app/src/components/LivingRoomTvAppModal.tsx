import React, { useState } from 'react';
import { X, Tv, Sparkles, CheckCircle2, Cast, MonitorPlay } from 'lucide-react';
import { DEFAULT_TV_DEVICES, type LivingRoomTvDevice } from '../lib/livingRoomTvAppData';
import { soundFX } from '../lib/soundFx';

interface LivingRoomTvAppModalProps {
  streamerName: string;
  onClose: () => void;
}

export const LivingRoomTvAppModal: React.FC<LivingRoomTvAppModalProps> = ({
  streamerName,
  onClose
}) => {
  const [tvs, setTvs] = useState<LivingRoomTvDevice[]>(DEFAULT_TV_DEVICES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCastToTv = (tv: LivingRoomTvDevice) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setTvs(prev => prev.map(t => ({
      ...t,
      isCastingActive: t.tvId === tv.tvId ? !t.isCastingActive : t.isCastingActive
    })));
    setToastMsg(`📺 Casted @${streamerName}'s stream in 4K HDR Ambient Fireplace mode to "${tv.tvRoomName}"!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tv-hub-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tv-hub-modal-header">
          <div className="tv-hub-title-group">
            <div className="tv-hub-badge">
              <Tv size={16} />
              <span>APPLE TV & ANDROID TV 4K LIVING ROOM HUB</span>
            </div>
            <h3>@{streamerName}'s Big Screen Broadcast Hub</h3>
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

        {/* Hero Banner */}
        <div className="tv-hub-hero-banner">
          <div className="tv-icon-dial">
            <MonitorPlay size={44} color="#00ff88" />
            <span className="tv-res-badge">4K ULTRA HD</span>
          </div>

          <div className="tv-hub-hero-meta">
            <h4>Immersive Cozy Fireplace Reading Mode</h4>
            <p className="tv-explainer">
              Displays giant illuminated manuscript typography on your OLED TV while rendering a crackling 4K hearth and background rain soundscape.
            </p>
          </div>
        </div>

        {/* TV Devices Grid */}
        <div className="tv-devices-grid">
          <h4>Detected Smart Televisions & Streaming Sticks</h4>
          {tvs.map(tv => (
            <div key={tv.tvId} className="tv-device-card">
              <div className="tv-device-left">
                <Tv size={24} color="#ffd700" />
                <div className="tv-info">
                  <strong>{tv.tvRoomName}</strong>
                  <span className="tv-meta-sub">{tv.tvPlatform.replace(/_/g, ' ')} • {tv.tvResolution}</span>
                </div>
              </div>

              <div className="tv-device-right">
                <button
                  type="button"
                  className={`btn-cast-tv ${tv.isCastingActive ? 'active' : ''}`}
                  onClick={() => handleCastToTv(tv)}
                >
                  <Cast size={14} />
                  <span>{tv.isCastingActive ? 'Casting Active (Disconnect)' : 'AirPlay / Google Cast'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="tv-hub-modal-footer">
          <span className="footer-tv-note">
            📺 Supports tvOS 17+, Android TV / Google TV 12+, Fire OS 8, and LG webOS 24.
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
