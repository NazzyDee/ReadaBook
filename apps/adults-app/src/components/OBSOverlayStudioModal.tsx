import React, { useState } from 'react';
import { X, Video, Copy, Check, Sparkles, Layout, Sliders, Bell, MessageSquare, BookOpen, ExternalLink } from 'lucide-react';
import { DEFAULT_OVERLAY_CONFIG, type OverlayWidgetConfig } from '../lib/obsOverlayData';
import { soundFX } from '../lib/soundFx';

interface OBSOverlayStudioModalProps {
  streamerName: string;
  onClose: () => void;
}

export const OBSOverlayStudioModal: React.FC<OBSOverlayStudioModalProps> = ({
  streamerName,
  onClose
}) => {
  const [config, setConfig] = useState<OverlayWidgetConfig>(DEFAULT_OVERLAY_CONFIG);
  const [copied, setCopied] = useState(false);
  const [activeTestAlert, setActiveTestAlert] = useState<{ title: string; subtitle: string; icon: string } | null>(null);

  const overlayUrl = `https://readabook.tv/overlay/${streamerName.toLowerCase()}?theme=${config.theme}&progress=${config.showBookProgress}&alerts=${config.showAlertBox}&chat=${config.showTransparentChat}`;

  const handleCopyUrl = () => {
    soundFX.playPop();
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerTestAlert = (type: 'sub' | 'gift' | 'raid' | 'moment') => {
    soundFX.playChestClaim();
    if (type === 'sub') {
      setActiveTestAlert({
        title: '⭐ NEW TIER 3 SUBSCRIBER!',
        subtitle: '@ElvenScholar subscribed for 12 months with Prime!',
        icon: '👑'
      });
    } else if (type === 'gift') {
      setActiveTestAlert({
        title: '🎁 20 COMMUNITY GIFT SUBS!',
        subtitle: '@GondorKing gifted 20 subs to chat!',
        icon: '🎉'
      });
    } else if (type === 'raid') {
      setActiveTestAlert({
        title: '⚔️ INCOMING RAID!',
        subtitle: '@BrandonSanderson raided with 1,420 readers!',
        icon: '🛡️'
      });
    } else {
      setActiveTestAlert({
        title: '🏆 LIVE MOMENT CLAIMED!',
        subtitle: 'Page 340 Climax Badge unlocked by 320 viewers!',
        icon: '🔥'
      });
    }

    setTimeout(() => setActiveTestAlert(null), 4500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="obs-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="obs-modal-header">
          <div className="obs-title-group">
            <div className="obs-badge">
              <Video size={16} />
              <span>OBS & STREAMLABS BROWSER SOURCE STUDIO</span>
            </div>
            <h3>Custom Broadcast Stream Overlay</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Copy URL Bar */}
        <div className="obs-url-bar">
          <div className="obs-url-input-wrap">
            <ExternalLink size={15} color="var(--text-muted)" />
            <input type="text" readOnly value={overlayUrl} className="obs-url-input" />
          </div>

          <button
            type="button"
            className={`btn-primary btn-copy-obs ${copied ? 'copied' : ''}`}
            onClick={handleCopyUrl}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied to OBS!' : 'Copy Browser Source'}</span>
          </button>
        </div>

        {/* 2-Column Setup: Controls & Live Simulated Preview */}
        <div className="obs-studio-grid">
          {/* Controls Column */}
          <div className="obs-controls-panel">
            <div className="obs-section-title">
              <Sliders size={15} />
              <span>Overlay Themes & Widgets</span>
            </div>

            {/* Theme Selector */}
            <div className="obs-control-group">
              <label>Visual Style</label>
              <div className="obs-theme-options">
                {(['parchment', 'cyberpunk', 'dark_fantasy', 'minimalist'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`obs-theme-chip ${config.theme === t ? 'active' : ''}`}
                    onClick={() => {
                      soundFX.playPop();
                      setConfig({ ...config, theme: t });
                    }}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Widget Toggles */}
            <div className="obs-toggle-list">
              <label className="obs-toggle-item">
                <input
                  type="checkbox"
                  checked={config.showBookProgress}
                  onChange={e => setConfig({ ...config, showBookProgress: e.target.checked })}
                />
                <div className="toggle-text">
                  <strong>
                    <BookOpen size={14} />
                    <span>Live Book Progress HUD</span>
                  </strong>
                  <span>Shows current page, total pages & animated bookmark</span>
                </div>
              </label>

              <label className="obs-toggle-item">
                <input
                  type="checkbox"
                  checked={config.showAlertBox}
                  onChange={e => setConfig({ ...config, showAlertBox: e.target.checked })}
                />
                <div className="toggle-text">
                  <strong>
                    <Bell size={14} />
                    <span>Animated Alert Box</span>
                  </strong>
                  <span>Subscribers, Gift Bombs, Raids & Moments</span>
                </div>
              </label>

              <label className="obs-toggle-item">
                <input
                  type="checkbox"
                  checked={config.showTransparentChat}
                  onChange={e => setConfig({ ...config, showTransparentChat: e.target.checked })}
                />
                <div className="toggle-text">
                  <strong>
                    <MessageSquare size={14} />
                    <span>Transparent Chat Overlay</span>
                  </strong>
                  <span>Floating chat messages with verified badges & runes</span>
                </div>
              </label>
            </div>

            {/* Test Alert Buttons */}
            <div className="obs-test-alerts-section">
              <span className="test-alert-label">
                <Sparkles size={13} color="#ffd700" />
                <span>Test Alert Triggers</span>
              </span>

              <div className="test-alert-buttons">
                <button onClick={() => handleTriggerTestAlert('sub')}>Test Sub</button>
                <button onClick={() => handleTriggerTestAlert('gift')}>Test Gift Sub</button>
                <button onClick={() => handleTriggerTestAlert('raid')}>Test Raid</button>
                <button onClick={() => handleTriggerTestAlert('moment')}>Test Moment</button>
              </div>
            </div>
          </div>

          {/* Live Preview Deck */}
          <div className="obs-preview-deck">
            <div className="preview-deck-header">
              <Layout size={14} />
              <span>LIVE BROWSER SOURCE PREVIEW (1920x1080)</span>
            </div>

            <div className={`obs-preview-viewport theme-${config.theme}`}>
              {/* Top-Left: Reading Progress HUD */}
              {config.showBookProgress && (
                <div className="overlay-progress-hud">
                  <div className="overlay-book-spine">📖</div>
                  <div className="overlay-book-info">
                    <span className="overlay-book-title">The Fellowship of the Ring</span>
                    <div className="overlay-progress-bar-wrap">
                      <div className="overlay-progress-fill" style={{ width: '38%' }} />
                    </div>
                    <span className="overlay-page-counter">Page 142 / 423 (38%)</span>
                  </div>
                </div>
              )}

              {/* Center: Animated Alert Popup */}
              {activeTestAlert && (
                <div className="overlay-alert-card animate-alert-bounce">
                  <span className="alert-emoji">{activeTestAlert.icon}</span>
                  <div className="alert-texts">
                    <h3>{activeTestAlert.title}</h3>
                    <p>{activeTestAlert.subtitle}</p>
                  </div>
                </div>
              )}

              {/* Bottom-Right: Transparent Chat */}
              {config.showTransparentChat && (
                <div className="overlay-chat-hud">
                  <div className="overlay-chat-line">
                    <span className="chat-user">@NovelScholar:</span>
                    <span className="chat-msg">That voice transition for Gandalf was insane! 🔥</span>
                  </div>
                  <div className="overlay-chat-line">
                    <span className="chat-user">@RivendellElf:</span>
                    <span className="chat-msg">Page 150 milestone incoming! ✨</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
