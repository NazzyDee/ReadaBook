import React, { useState } from 'react';
import { X, Smartphone, Sparkles, CheckCircle2, QrCode, Sliders, Play, RotateCcw, BatteryCharging } from 'lucide-react';
import { DEFAULT_TELEPROMPTER_CONFIG, type TeleprompterConfig } from '../lib/mobileTeleprompterData';
import { soundFX } from '../lib/soundFx';

interface MobileTeleprompterRemoteModalProps {
  streamerName: string;
  onClose: () => void;
}

export const MobileTeleprompterRemoteModal: React.FC<MobileTeleprompterRemoteModalProps> = ({
  streamerName,
  onClose
}) => {
  const [config, setConfig] = useState<TeleprompterConfig>(DEFAULT_TELEPROMPTER_CONFIG);
  const [isScrolling, setIsScrolling] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCopyQrToken = () => {
    soundFX.playPop();
    navigator.clipboard.writeText(`https://readabook.tv/remote?token=${config.syncToken}`);
    setToastMsg('📲 Remote pairing link copied to clipboard! Open on your tablet or phone.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleVoiceTracking = () => {
    soundFX.playPop();
    setConfig(prev => ({ ...prev, isVoiceTrackingEnabled: !prev.isVoiceTrackingEnabled }));
    setToastMsg(config.isVoiceTrackingEnabled ? 'Voice tracking disabled' : '🎙️ AI Voice Speech-Pacing tracking enabled!');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleTogglePlayScroll = () => {
    soundFX.playPop();
    setIsScrolling(prev => !prev);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="teleprompter-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="teleprompter-modal-header">
          <div className="teleprompter-title-group">
            <div className="teleprompter-badge">
              <Smartphone size={16} />
              <span>MOBILE COMPANION TELEPROMPTER & WIRELESS REMOTE</span>
            </div>
            <h3>@{streamerName}'s Teleprompter Deck</h3>
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

        {/* Paired Device Status Bar */}
        <div className="paired-device-banner">
          <div className="device-left">
            <Smartphone size={20} color="var(--accent-teal)" />
            <div>
              <strong>{config.pairedDeviceName}</strong>
              <div className="battery-row">
                <BatteryCharging size={12} color="#00ff88" />
                <span>{config.batteryLevel}% Battery • Low Latency WebRTC Active</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-qr-pair"
            onClick={handleCopyQrToken}
          >
            <QrCode size={14} />
            <span>Pair Another Device</span>
          </button>
        </div>

        {/* Live Manuscript Teleprompter Canvas Preview */}
        <div className="teleprompter-preview-screen">
          <div className="prompter-hud-top">
            <span className="prompter-cue-tag">ACT II • SCENE 3</span>
            <span className="voice-sync-badge">
              {config.isVoiceTrackingEnabled ? '🎙️ VOICE SYNC ACTIVE' : '⏱️ FIXED SPEED'}
            </span>
          </div>

          <div
            className="manuscript-text-scroll"
            style={{
              fontSize: `${config.fontSizePt}px`,
              animationPlayState: isScrolling ? 'running' : 'paused'
            }}
          >
            <p className="highlight-spoken">
              "Three Rings for the Elven-kings under the sky, Seven for the Dwarf-lords in their halls of stone, Nine for Mortal Men doomed to die..."
            </p>
            <p className="upcoming-text">
              "One for the Dark Lord on his dark throne In the Land of Mordor where the Shadows lie."
            </p>
          </div>

          <div className="prompter-controls-bar">
            <button
              type="button"
              className={`btn-prompter-play ${isScrolling ? 'active' : ''}`}
              onClick={handleTogglePlayScroll}
            >
              <Play size={14} />
              <span>{isScrolling ? 'Pause Scroll' : 'Start Auto-Scroll'}</span>
            </button>

            <button
              type="button"
              className="btn-prompter-reset"
              onClick={() => soundFX.playPop()}
            >
              <RotateCcw size={14} />
              <span>Rewind</span>
            </button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="prompter-settings-grid">
          <div className="setting-tile">
            <div className="tile-top">
              <label>READING CADENCE (WPM):</label>
              <strong>{config.scrollSpeedWpm} WPM</strong>
            </div>
            <input
              type="range"
              min="100"
              max="250"
              value={config.scrollSpeedWpm}
              onChange={e => setConfig(prev => ({ ...prev, scrollSpeedWpm: Number(e.target.value) }))}
              className="prompter-slider"
            />
          </div>

          <div className="setting-tile">
            <div className="tile-top">
              <label>MANUSCRIPT FONT SIZE:</label>
              <strong>{config.fontSizePt}pt</strong>
            </div>
            <input
              type="range"
              min="18"
              max="44"
              value={config.fontSizePt}
              onChange={e => setConfig(prev => ({ ...prev, fontSizePt: Number(e.target.value) }))}
              className="prompter-slider"
            />
          </div>

          <div className="setting-tile voice-toggle-tile">
            <div>
              <strong>AI Speech-Pacing Tracking</strong>
              <p>Automatically advances the manuscript as you speak each syllable.</p>
            </div>
            <button
              type="button"
              className={`btn-toggle-switch ${config.isVoiceTrackingEnabled ? 'on' : 'off'}`}
              onClick={handleToggleVoiceTracking}
            >
              {config.isVoiceTrackingEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="teleprompter-modal-footer">
          <div className="footer-tip">
            <Sliders size={14} color="var(--accent-teal)" />
            <span>Use Bluetooth foot pedals (Page Up/Down) to step paragraphs silently.</span>
          </div>
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
