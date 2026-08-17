import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, CheckCircle2, Lock, AlertOctagon } from 'lucide-react';
import { DEFAULT_GUARDIAN_RULES, type ModerationFilterRule } from '../lib/guardianAntiHarassmentData';
import { soundFX } from '../lib/soundFx';

interface GuardianAntiHarassmentModalProps {
  streamerName: string;
  onClose: () => void;
}

export const GuardianAntiHarassmentModal: React.FC<GuardianAntiHarassmentModalProps> = ({
  streamerName,
  onClose
}) => {
  const [rules, setRules] = useState<ModerationFilterRule[]>(DEFAULT_GUARDIAN_RULES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggleRule = (rule: ModerationFilterRule) => {
    soundFX.playPop();
    setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isEnabled: !r.isEnabled } : r));
    setToastMsg(`🛡️ Guardian Shield filter "${rule.ruleName}" ${!rule.isEnabled ? 'activated' : 'disabled'}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePanicShieldMode = () => {
    soundFX.playPop();
    soundFX.playDragonRoar();
    setToastMsg('🚨 EMERGENCY SHIELD ACTIVATED: Followers-only chat (14d+), auto-shadowban all incoming links, emote-only mode engaged!');
    setTimeout(() => setToastMsg(null), 4000);
  };

  const totalBlocked = rules.reduce((acc, r) => acc + r.eventsBlockedToday, 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="guardian-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="guardian-modal-header">
          <div className="guardian-title-group">
            <div className="guardian-badge">
              <ShieldAlert size={16} />
              <span>ANTI-HARASSMENT SHADOW-BANNING & GUARDIAN SHIELD</span>
            </div>
            <h3>@{streamerName}'s Broadcast Security Matrix</h3>
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

        {/* Hero Security Banner */}
        <div className="guardian-hero-banner">
          <div className="threat-dial-box">
            <ShieldAlert size={44} color="#00ff88" />
            <span className="blocked-count-num">{totalBlocked}</span>
            <span className="blocked-sub-label">THREATS BLOCKED TODAY</span>
          </div>

          <div className="guardian-hero-meta">
            <h4>Stealth Shadow-Banning & Anti-Troll AI Matrix</h4>
            <p className="guardian-explainer">
              Trolls and bad actors see their own messages successfully sent without realizing their comments are invisible to everyone else on stream.
            </p>

            <button
              type="button"
              className="btn-panic-shield"
              onClick={handlePanicShieldMode}
            >
              <AlertOctagon size={14} />
              <span>Trigger 1-Click Panic Shield Mode</span>
            </button>
          </div>
        </div>

        {/* Filter Rules List */}
        <div className="guardian-rules-list">
          <h4>Active Automated Defense Layers</h4>
          {rules.map(rule => (
            <div key={rule.id} className="guardian-rule-card">
              <div className="rule-card-left">
                <Lock size={20} color={rule.isEnabled ? '#00ff88' : 'var(--text-muted)'} />
                <div className="rule-info">
                  <strong>{rule.ruleName}</strong>
                  <span className="rule-meta-sub">
                    Action: {rule.actionTaken.replace(/_/g, ' ')} • {rule.eventsBlockedToday} stopped
                  </span>
                </div>
              </div>

              <div className="rule-card-right">
                <button
                  type="button"
                  className={`btn-toggle-rule ${rule.isEnabled ? 'active' : ''}`}
                  onClick={() => handleToggleRule(rule)}
                >
                  {rule.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="guardian-modal-footer">
          <span className="footer-guardian-note">
            🛡️ Compliant with Digital Services Act (DSA) & GDPR anonymized telemetry.
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
