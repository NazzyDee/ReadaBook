import React, { useState } from 'react';
import { X, Sliders, Sparkles, CheckCircle2, Wifi, Copy } from 'lucide-react';
import { DEFAULT_STREAM_DECK_MAPPINGS, type StreamDeckActionMapping } from '../lib/streamDeckWsData';
import { soundFX } from '../lib/soundFx';

interface StreamDeckWebSocketModalProps {
  streamerName: string;
  onClose: () => void;
}

export const StreamDeckWebSocketModal: React.FC<StreamDeckWebSocketModalProps> = ({
  streamerName,
  onClose
}) => {
  const [mappings] = useState<StreamDeckActionMapping[]>(DEFAULT_STREAM_DECK_MAPPINGS);
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [wsPort] = useState<number>(4455);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTestKey = (mapping: StreamDeckActionMapping) => {
    soundFX.playPop();
    setActiveKey(mapping.keyIndex);
    setToastMsg(`🎛️ WebSocket Triggered [KEY ${mapping.keyIndex}]: "${mapping.actionName}" -> (${mapping.wsPayloadEvent})`);
    setTimeout(() => {
      setActiveKey(null);
      setToastMsg(null);
    }, 2500);
  };

  const handleCopyEndpoint = () => {
    soundFX.playPop();
    navigator.clipboard.writeText(`ws://127.0.0.1:${wsPort}/readabook-deck`);
    setToastMsg('📋 Copied Stream Deck WebSocket URL to Clipboard!');
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="deck-ws-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="deck-ws-modal-header">
          <div className="deck-ws-title-group">
            <div className="deck-ws-badge">
              <Sliders size={16} />
              <span>DUAL-PC STREAM DECK WEBSOCKET COMPANION & HARDWARE BRIDGE</span>
            </div>
            <h3>@{streamerName}'s Physical Stream Deck Mapping</h3>
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

        {/* WebSocket Connection Banner */}
        <div className="deck-ws-hero-banner">
          <div className="ws-status-left">
            <Wifi size={24} color="#00ff88" />
            <div>
              <h4>Localhost WebSocket Server Active (Port {wsPort})</h4>
              <p className="endpoint-code">ws://127.0.0.1:{wsPort}/readabook-deck</p>
            </div>
          </div>

          <button type="button" className="btn-copy-ws" onClick={handleCopyEndpoint}>
            <Copy size={14} />
            <span>Copy URL</span>
          </button>
        </div>

        {/* 6-Key Stream Deck Hardware Simulator */}
        <div className="deck-keys-grid">
          {mappings.map(m => {
            const isActive = m.keyIndex === activeKey;
            return (
              <div
                key={m.keyIndex}
                className={`deck-key-tile ${isActive ? 'active-tap' : ''}`}
                onClick={() => handleTestKey(m)}
              >
                <div className="key-top-row">
                  <span className="key-idx">KEY {m.keyIndex}</span>
                  <span className="key-hotkey">{m.hotkeyBinding}</span>
                </div>
                <span className="key-emoji-lg">{m.iconEmoji}</span>
                <strong className="key-title">{m.actionName}</strong>
                <span className="key-event-sub">{m.wsPayloadEvent.replace('EVENT_', '')}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="deck-ws-modal-footer">
          <span className="deck-plugin-note">
            ⚡ Compatible with Elgato Stream Deck (MK.2, Plus, Pedal) & Loupedeck Live via standard WebSocket plugin.
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
