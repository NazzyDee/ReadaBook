import React, { useState } from 'react';
import { Shield, ShieldAlert, X } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface ShieldModeModalProps {
  isOpen: boolean;
  isShieldActive: boolean;
  onToggleShield: (active: boolean) => void;
  onClose: () => void;
}

export const ShieldModeModal: React.FC<ShieldModeModalProps> = ({
  isShieldActive,
  onToggleShield,
  onClose
}) => {
  const [chatRestriction, setChatRestriction] = useState<'subs' | 'followers' | 'emoteOnly'>('subs');
  const [clearChatOnActivate, setClearChatOnActivate] = useState(true);
  const [elevateAutoMod, setElevateAutoMod] = useState(true);
  const [hideSpoilers, setHideSpoilers] = useState(true);

  const handleActivateShield = () => {
    soundFX.playCheer();
    onToggleShield(true);
    onClose();
  };

  const handleDeactivateShield = () => {
    soundFX.playPop();
    onToggleShield(false);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="shield-mode-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            {isShieldActive ? (
              <ShieldAlert size={20} color="#ff3b3b" className="pulse-fast" />
            ) : (
              <Shield size={20} color="var(--accent-secondary)" />
            )}
            <h3>Twitch Shield Mode (Emergency Lockdown)</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Current Status Pill */}
        <div className={`shield-status-box ${isShieldActive ? 'active' : 'inactive'}`}>
          <div className="status-left">
            <span className="status-dot"></span>
            <div>
              <strong>{isShieldActive ? 'SHIELD MODE IS ACTIVE' : 'Shield Mode Inactive'}</strong>
              <p>{isShieldActive ? 'Maximum chat protection and safety filters are deployed.' : 'Ready to deploy emergency safety protocols in 1-click.'}</p>
            </div>
          </div>
          {isShieldActive ? (
            <button type="button" onClick={handleDeactivateShield} className="btn-deactivate-shield">
              Deactivate
            </button>
          ) : (
            <button type="button" onClick={handleActivateShield} className="btn-activate-shield">
              <ShieldAlert size={15} />
              <span>Activate Shield</span>
            </button>
          )}
        </div>

        {/* Preset Settings when Shield Mode is triggered */}
        <div className="shield-config-section">
          <label className="section-label">Automated Safety Actions on Activation:</label>

          <div className="shield-option-group">
            <label className="shield-checkbox-label">
              <input
                type="checkbox"
                checked={clearChatOnActivate}
                onChange={(e) => setClearChatOnActivate(e.target.checked)}
              />
              <div>
                <strong>Clear Recent Chat Spam</strong>
                <span>Instantly wipes recent messages to stop coordinated raid text.</span>
              </div>
            </label>

            <label className="shield-checkbox-label">
              <input
                type="checkbox"
                checked={elevateAutoMod}
                onChange={(e) => setElevateAutoMod(e.target.checked)}
              />
              <div>
                <strong>Elevate AutoMod to Level 4 (Maximum)</strong>
                <span>Holds all flagged, suspicious, and aggressive messages for mod review.</span>
              </div>
            </label>

            <label className="shield-checkbox-label">
              <input
                type="checkbox"
                checked={hideSpoilers}
                onChange={(e) => setHideSpoilers(e.target.checked)}
              />
              <div>
                <strong>Aggressive Book Spoiler Shield</strong>
                <span>Hides any character death, ending, or plot twist keyword automatically.</span>
              </div>
            </label>
          </div>

          <div className="shield-chat-restriction">
            <label className="section-label">Chat Access Mode:</label>
            <div className="restriction-buttons-row">
              <button
                type="button"
                className={`btn-restriction ${chatRestriction === 'subs' ? 'active' : ''}`}
                onClick={() => setChatRestriction('subs')}
              >
                Subscribers Only
              </button>
              <button
                type="button"
                className={`btn-restriction ${chatRestriction === 'followers' ? 'active' : ''}`}
                onClick={() => setChatRestriction('followers')}
              >
                Followers (10m+ tenure)
              </button>
              <button
                type="button"
                className={`btn-restriction ${chatRestriction === 'emoteOnly' ? 'active' : ''}`}
                onClick={() => setChatRestriction('emoteOnly')}
              >
                Emotes Only
              </button>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
          {!isShieldActive && (
            <button type="button" onClick={handleActivateShield} className="btn-primary btn-danger-glow">
              <ShieldAlert size={15} />
              <span>Engage Shield Mode</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
