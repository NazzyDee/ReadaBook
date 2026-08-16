import React, { useState } from 'react';
import { X, BellRing, Volume2, Coins, Sparkles, Check } from 'lucide-react';
import { SOUND_ALERTS, type SoundAlert } from '../lib/soundAlertsData';
import { soundFX } from '../lib/soundFx';

interface ViewerSoundboardModalProps {
  streamerName: string;
  userPoints?: number;
  onClose: () => void;
  onAlertTriggered?: (alert: SoundAlert) => void;
}

export const ViewerSoundboardModal: React.FC<ViewerSoundboardModalProps> = ({
  streamerName,
  userPoints = 1450,
  onClose,
  onAlertTriggered
}) => {
  const [points, setPoints] = useState<number>(userPoints);
  const [selectedAlert, setSelectedAlert] = useState<SoundAlert>(SOUND_ALERTS[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'Dramatic' | 'Atmospheric' | 'Fantasy'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const playSoundEffect = (type: SoundAlert['soundType']) => {
    switch (type) {
      case 'thunder':
        soundFX.playThunder();
        break;
      case 'dragon':
        soundFX.playDragonRoar();
        break;
      case 'harp':
        soundFX.playHarp();
        break;
      case 'applause':
        soundFX.playApplause();
        break;
      case 'pageRustle':
        soundFX.playPageRustle();
        break;
      default:
        soundFX.playPop();
        break;
    }
  };

  const handlePreview = (alert: SoundAlert, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewingId(alert.id);
    playSoundEffect(alert.soundType);

    setTimeout(() => {
      setPreviewingId(null);
    }, alert.durationSeconds * 1000);
  };

  const handleRedeemAlert = (alert: SoundAlert) => {
    if (points < alert.pointsCost) {
      setToastMessage(`⚠️ You need ${alert.pointsCost} Channel Points to trigger ${alert.name}!`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setPoints(prev => prev - alert.pointsCost);
    playSoundEffect(alert.soundType);

    setToastMessage(`🔊 Triggered "${alert.name}" on @${streamerName}'s live stream! (-${alert.pointsCost} pts)`);

    if (onAlertTriggered) {
      onAlertTriggered(alert);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const filteredAlerts = activeTab === 'all'
    ? SOUND_ALERTS
    : SOUND_ALERTS.filter(a => a.category === activeTab);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="soundboard-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="soundboard-modal-header">
          <div className="soundboard-title-group">
            <span className="soundboard-badge-pill">
              <BellRing size={16} />
              <span>LIVE BROADCAST SOUND ALERTS</span>
            </span>
            <h3>Sound Alerts & Stream Soundboard</h3>
          </div>

          <div className="soundboard-header-right">
            <div className="user-points-pill" title="Your Channel Points Balance">
              <Coins size={15} color="#ffd700" />
              <span>{points.toLocaleString()} Points</span>
            </div>

            <button onClick={onClose} className="modal-close-btn" title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMessage}</span>
          </div>
        )}

        <p className="soundboard-intro-text">
          Use your Channel Points earned by watching <strong>@{streamerName}</strong> to play live sound effects directly into the stream audio and trigger on-screen alerts!
        </p>

        {/* Category Filter Chips */}
        <div className="soundboard-filter-tabs">
          {(['all', 'Dramatic', 'Atmospheric', 'Fantasy'] as const).map(cat => (
            <button
              key={cat}
              className={`soundboard-tab-btn ${activeTab === cat ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setActiveTab(cat);
              }}
            >
              {cat === 'all' ? 'All Soundbites' : cat}
            </button>
          ))}
        </div>

        {/* Sound Alerts Grid */}
        <div className="sound-alerts-grid">
          {filteredAlerts.map(alert => {
            const isSelected = selectedAlert.id === alert.id;
            const isPreviewing = previewingId === alert.id;
            const canAfford = points >= alert.pointsCost;

            return (
              <div
                key={alert.id}
                className={`sound-alert-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedAlert(alert);
                }}
              >
                <div className="sound-alert-top">
                  <span className="sound-alert-icon">{alert.icon}</span>
                  <div className="sound-cost-pill">
                    <Coins size={12} />
                    <span>{alert.pointsCost} pts</span>
                  </div>
                </div>

                <div className="sound-alert-body">
                  <h4>{alert.name}</h4>
                  <p>{alert.description}</p>
                </div>

                <div className="sound-alert-actions">
                  <button
                    type="button"
                    className={`btn-preview-sound ${isPreviewing ? 'playing' : ''}`}
                    onClick={e => handlePreview(alert, e)}
                    title="Preview Soundbite Privately"
                  >
                    <Volume2 size={14} />
                    <span>{isPreviewing ? 'Playing...' : 'Preview'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-redeem-sound"
                    disabled={!canAfford}
                    onClick={e => {
                      e.stopPropagation();
                      handleRedeemAlert(alert);
                    }}
                    title="Play on Live Stream"
                  >
                    <Check size={14} />
                    <span>Play Live</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
