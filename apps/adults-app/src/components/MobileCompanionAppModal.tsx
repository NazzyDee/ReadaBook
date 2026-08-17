import React, { useState } from 'react';
import { X, Smartphone, Sparkles, CheckCircle2, QrCode, RefreshCw, Radio } from 'lucide-react';
import { DEFAULT_COMPANION_DEVICES, type MobileCompanionDevice } from '../lib/mobileCompanionAppData';
import { soundFX } from '../lib/soundFx';

interface MobileCompanionAppModalProps {
  streamerName: string;
  onClose: () => void;
}

export const MobileCompanionAppModal: React.FC<MobileCompanionAppModalProps> = ({
  streamerName,
  onClose
}) => {
  const [devices] = useState<MobileCompanionDevice[]>(DEFAULT_COMPANION_DEVICES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePairNewDevice = () => {
    soundFX.playPop();
    soundFX.playPageRustle();
    setToastMsg('📱 Generated new 6-digit WebSocket pairing PIN for iOS / Android ReadaBook Remote: [742-991]!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="companion-app-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="companion-app-modal-header">
          <div className="companion-app-title-group">
            <div className="companion-app-badge">
              <Smartphone size={16} />
              <span>READABOOK MOBILE COMPANION APP REMOTE & POCKET STREAM DECK</span>
            </div>
            <h3>@{streamerName}'s Mobile Control Surface</h3>
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
        <div className="companion-app-hero-banner">
          <div className="qr-pairing-box">
            <QrCode size={48} color="#00ff88" />
            <span className="qr-sub">SCAN TO PAIR PHONE</span>
          </div>

          <div className="companion-app-hero-meta">
            <h4>Control Your Live Stream From Bed or Studio Couch</h4>
            <p className="companion-explainer">
              Trigger page turns, soundboard foley, poll launches, and moderate live chat with zero-latency WebRTC data channels on your smartphone.
            </p>

            <button
              type="button"
              className="btn-pair-device"
              onClick={handlePairNewDevice}
            >
              <RefreshCw size={14} />
              <span>Generate Pair PIN / QR Code</span>
            </button>
          </div>
        </div>

        {/* Paired Devices List */}
        <div className="companion-devices-list">
          <h4>Active Paired Hardware ({devices.length})</h4>
          {devices.map(dev => (
            <div key={dev.deviceId} className="companion-device-card">
              <div className="device-card-left">
                <Smartphone size={24} color="#00ff88" />
                <div className="device-info">
                  <strong>{dev.deviceName}</strong>
                  <span className="device-meta-sub">🔋 {dev.batteryLevelPct}% • Paired {dev.pairedAt}</span>
                </div>
              </div>

              <div className="device-card-right">
                <span className="live-status-pill">
                  <Radio size={12} className="spin-slow" />
                  <span>REMOTE ACTIVE</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="companion-app-modal-footer">
          <span className="footer-companion-note">
            📱 Native iOS & Android companion apps available on Apple App Store & Google Play Store.
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
