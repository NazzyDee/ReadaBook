import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { MOCK_CHANNEL_RULES, type ChannelRulesConfig } from '../lib/channelRulesData';
import { soundFX } from '../lib/soundFx';

interface ChannelRulesGateModalProps {
  streamerName: string;
  onClose: () => void;
  onAcceptRules?: () => void;
}

export const ChannelRulesGateModal: React.FC<ChannelRulesGateModalProps> = ({
  streamerName,
  onClose,
  onAcceptRules
}) => {
  const [rulesConfig] = useState<ChannelRulesConfig>({
    ...MOCK_CHANNEL_RULES,
    streamerName
  });
  const [hasAgreed, setHasAgreed] = useState(false);
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);

  const handleAccept = () => {
    if (!hasAgreed) return;

    soundFX.playChestClaim();
    if (onAcceptRules) {
      onAcceptRules();
    }

    setAcceptedToast(`📜 You accepted @${streamerName}'s Channel Rules! Live chat unlocked.`);
    setTimeout(() => {
      setAcceptedToast(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="rules-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="rules-modal-header">
          <div className="rules-title-group">
            <div className="rules-badge">
              <ShieldCheck size={16} />
              <span>COMMUNITY CHAT RULES & SPOILER PACT</span>
            </div>
            <h3>Welcome to @{streamerName}'s Channel</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {acceptedToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{acceptedToast}</span>
          </div>
        )}

        <p className="rules-intro-text">{rulesConfig.channelTagline}</p>

        {/* Rules List */}
        <div className="rules-list-grid">
          {rulesConfig.rules.map(rule => (
            <div key={rule.id} className="rule-item-card">
              <span className="rule-icon-tag">{rule.icon}</span>
              <div className="rule-info-body">
                <h4>{rule.title}</h4>
                <p>{rule.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Agreement Box */}
        <div className="rules-agreement-box">
          <label className="agreement-checkbox-label">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={e => {
                soundFX.playPop();
                setHasAgreed(e.target.checked);
              }}
            />
            <span>
              I have read and agree to follow these community guidelines and promise not to post spoilers.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="rules-modal-footer">
          <div className="footer-warning-note">
            <AlertTriangle size={14} color="#ffd700" />
            <span>Violating rules may result in temporary timeout or channel ban.</span>
          </div>

          <button
            type="button"
            className="btn-primary btn-accept-rules"
            disabled={!hasAgreed}
            onClick={handleAccept}
          >
            <CheckCircle2 size={16} />
            <span>I Agree & Unlock Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
