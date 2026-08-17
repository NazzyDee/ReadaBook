import React, { useState } from 'react';
import { X, Tablet, Sparkles, CheckCircle2, Send } from 'lucide-react';
import { DEFAULT_EINK_PROFILE, type EInkDeviceProfile } from '../lib/eInkCompanionData';
import { soundFX } from '../lib/soundFx';

interface EInkCompanionExtensionModalProps {
  streamerName: string;
  onClose: () => void;
}

export const EInkCompanionExtensionModal: React.FC<EInkCompanionExtensionModalProps> = ({
  streamerName,
  onClose
}) => {
  const [profile, setProfile] = useState<EInkDeviceProfile>(DEFAULT_EINK_PROFILE);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePushToKindle = () => {
    soundFX.playPop();
    soundFX.playPageRustle();
    setToastMsg(`📟 Pushed active stream chapter page directly to your Kindle Paperwhite via Send-to-Kindle API!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="eink-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="eink-modal-header">
          <div className="eink-title-group">
            <div className="eink-badge">
              <Tablet size={16} />
              <span>KINDLE & KOBO E-INK COMPANION BROWSER EXTENSION</span>
            </div>
            <h3>@{streamerName}'s E-Ink Synchronizer</h3>
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
        <div className="eink-hero-banner">
          <div className="eink-screen-dial">
            <Tablet size={40} color="#ffffff" />
            <span className="eink-model-tag">{profile.deviceModel.replace(/_/g, ' ')}</span>
          </div>

          <div className="eink-hero-meta">
            <span className="synced-book-tag">📖 {profile.activeEpubSyncTitle}</span>
            <h4>Zero-Eye-Strain Live Stream Companion</h4>
            <p className="eink-explainer">
              Read along on your physical e-reader with 1-bit monochrome rendering while listening to high-fidelity streamer voice audio.
            </p>

            <button
              type="button"
              className="btn-push-kindle"
              onClick={handlePushToKindle}
            >
              <Send size={14} />
              <span>Push Active Chapter to Kindle / Kobo</span>
            </button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="eink-settings-grid">
          <div className="control-item">
            <label>E-Ink Hardware Target</label>
            <select
              value={profile.deviceModel}
              onChange={e => setProfile({ ...profile, deviceModel: e.target.value as any })}
            >
              <option value="KINDLE_PAPERWHITE">Amazon Kindle Paperwhite (11th Gen)</option>
              <option value="KINDLE_SCRIBE">Amazon Kindle Scribe (10.2" Canvas)</option>
              <option value="KOBO_CLARA">Rakuten Kobo Clara 2E</option>
              <option value="BOOX_PALMA">Onyx BOOX Palma (Android E-Ink)</option>
            </select>
          </div>

          <div className="control-item">
            <label>E-Ink Refresh Waveform</label>
            <select
              value={profile.refreshRateMode}
              onChange={e => setProfile({ ...profile, refreshRateMode: e.target.value as any })}
            >
              <option value="REGAL_HIGH_QUALITY">Regal Clear (High Contrast, No Ghosting)</option>
              <option value="A2_FAST_REFRESH">A2 Speed Mode (Fast Page Turns)</option>
              <option value="NORMAL">Normal Standard Refresh</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="eink-modal-footer">
          <span className="footer-eink-note">
            📟 WebExtension available for Chrome, Firefox, Safari & Android E-Ink browsers.
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
