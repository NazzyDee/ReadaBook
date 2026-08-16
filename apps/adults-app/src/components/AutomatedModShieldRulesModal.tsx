import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, CheckCircle2, ShieldCheck, EyeOff } from 'lucide-react';
import { DEFAULT_MOD_SHIELD_RULES, type ModShieldRule } from '../lib/automatedModShieldData';
import { soundFX } from '../lib/soundFx';

interface AutomatedModShieldRulesModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AutomatedModShieldRulesModal: React.FC<AutomatedModShieldRulesModalProps> = ({
  streamerName,
  onClose
}) => {
  const [rules, setRules] = useState<ModShieldRule[]>(DEFAULT_MOD_SHIELD_RULES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggleRule = (id: string) => {
    soundFX.playPop();
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.isEnabled;
        setToastMsg(nextState ? `🛡️ Enabled Shield Rule: "${r.name}"` : `Disabled rule: "${r.name}"`);
        return { ...r, isEnabled: nextState };
      }
      return r;
    }));
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ Arcane Moderation Shield & AI Anti-Spoiler Rules activated in Chat Gateway!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modshield-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modshield-modal-header">
          <div className="modshield-title-group">
            <div className="modshield-badge">
              <ShieldAlert size={16} />
              <span>ARCANE MODERATION SHIELD & AI ANTI-SPOILER RULES ENGINE</span>
            </div>
            <h3>@{streamerName}'s AutoMod Shield Rules</h3>
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

        {/* AI Shield Hero Banner */}
        <div className="modshield-hero-banner">
          <ShieldCheck size={28} color="#00ff88" />
          <div className="modshield-hero-meta">
            <h4>Live Book AI Context-Aware Spoiler Filter</h4>
            <p>
              Understands chapter pacing and automatically blurs or censors plot twists, character fates, and mystery revelations before other chat readers see them.
            </p>
          </div>
        </div>

        {/* Rules Matrix List */}
        <div className="modshield-rules-list">
          {rules.map(r => (
            <div key={r.id} className={`shield-rule-tile ${r.isEnabled ? 'enabled' : 'disabled'}`}>
              <div className="rule-info-col">
                <div className="rule-name-row">
                  <strong>{r.name}</strong>
                  <span className="category-pill">{r.category}</span>
                </div>
                <code className="regex-preview">{r.triggerRegex}</code>
                <div className="rule-specs-row">
                  <span className="action-tag">Action: {r.actionType}</span>
                  <span className="blocked-count">{r.blockedCount} messages intercepted</span>
                </div>
              </div>

              <div className="rule-toggle-col">
                <button
                  type="button"
                  className={`btn-toggle-switch ${r.isEnabled ? 'on' : 'off'}`}
                  onClick={() => handleToggleRule(r.id)}
                >
                  {r.isEnabled ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="modshield-modal-footer">
          <div className="footer-shield-sub">
            <EyeOff size={14} color="var(--accent-danger)" />
            <span>Intercepted spoiler messages can be revealed with a single click by appointed Channel Mods.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Save Shield Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};
