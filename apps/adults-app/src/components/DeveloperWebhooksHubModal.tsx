import React, { useState } from 'react';
import { X, Code2, Sparkles, CheckCircle2, Send, Webhook } from 'lucide-react';
import { DEFAULT_DEVELOPER_WEBHOOKS, type DeveloperWebhookEndpoint } from '../lib/developerWebhooksData';
import { soundFX } from '../lib/soundFx';

interface DeveloperWebhooksHubModalProps {
  streamerName: string;
  onClose: () => void;
}

export const DeveloperWebhooksHubModal: React.FC<DeveloperWebhooksHubModalProps> = ({
  streamerName,
  onClose
}) => {
  const [webhooks] = useState<DeveloperWebhookEndpoint[]>(DEFAULT_DEVELOPER_WEBHOOKS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTestWebhookPing = (endpoint: DeveloperWebhookEndpoint) => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg(`🧪 Sent mock "stream.page_turn" HMAC-SHA256 payload to ${endpoint.webhookUrl} (HTTP 200 OK - 18ms)!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="webhooks-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="webhooks-modal-header">
          <div className="webhooks-title-group">
            <div className="webhooks-badge">
              <Code2 size={16} />
              <span>READABOOK OPEN API & DEVELOPER WEBHOOKS HUB</span>
            </div>
            <h3>@{streamerName}'s Developer Staging Portal</h3>
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
        <div className="webhooks-hero-banner">
          <div className="api-metric-dial">
            <Webhook size={44} color="#00ff88" />
            <span className="success-rate-num">99.9%</span>
            <span className="success-rate-sub">UPTIME SLA</span>
          </div>

          <div className="webhooks-hero-meta">
            <h4>Build Custom Stream Overlays, Discord Bots & Home Automation</h4>
            <p className="webhooks-explainer">
              Trigger smart LED Hue lighting on paragraph climaxes, send page-turn WebSockets to Elgato Stream Decks, and sync Goodreads shelves via REST API.
            </p>
          </div>
        </div>

        {/* Active Webhook Endpoints List */}
        <div className="webhooks-list">
          <h4>Configured Webhook Endpoints ({webhooks.length})</h4>
          {webhooks.map(wh => (
            <div key={wh.id} className="webhook-card">
              <div className="webhook-left">
                <Code2 size={22} color="#ffd700" />
                <div className="webhook-info">
                  <strong>{wh.webhookUrl}</strong>
                  <div className="events-chip-row">
                    {wh.subscribedEvents.map(evt => (
                      <span key={evt} className="event-chip">{evt}</span>
                    ))}
                  </div>
                  <span className="secret-sub">Secret: {wh.secretKeyMasked} • Success: {wh.deliverySuccessRatePct}%</span>
                </div>
              </div>

              <div className="webhook-right">
                <button
                  type="button"
                  className="btn-test-ping"
                  onClick={() => handleTestWebhookPing(wh)}
                >
                  <Send size={14} />
                  <span>Send Test Ping</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="webhooks-modal-footer">
          <span className="footer-webhooks-note">
            🧪 OpenAPI 3.1 & AsyncAPI documentation available at developers.readabook.tv.
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
