import React, { useState } from 'react';
import { X, Dices, Sparkles, CheckCircle2, ShieldAlert, Trophy } from 'lucide-react';
import { DEFAULT_D20_EVENT, type D20RollEvent } from '../lib/d20SkillCheckData';
import { soundFX } from '../lib/soundFx';

interface D20SkillCheckModalProps {
  streamerName: string;
  onClose: () => void;
}

export const D20SkillCheckModal: React.FC<D20SkillCheckModalProps> = ({
  streamerName,
  onClose
}) => {
  const [event, setEvent] = useState<D20RollEvent>(DEFAULT_D20_EVENT);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleRollD20 = () => {
    soundFX.playPop();
    setIsRolling(true);
    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 20) + 1;
      let outcome: D20RollEvent['outcomeResult'] = 'SUCCESS';
      if (rolled === 20) {
        outcome = 'CRITICAL_SUCCESS';
        soundFX.playApplause();
      } else if (rolled === 1) {
        outcome = 'CRITICAL_FAIL';
        soundFX.playThunder();
      } else if (rolled >= event.difficultyClass) {
        outcome = 'SUCCESS';
        soundFX.playChestClaim();
      } else {
        outcome = 'FAILURE';
        soundFX.playThunder();
      }

      setEvent(prev => ({
        ...prev,
        lastRoll: rolled,
        outcomeResult: outcome
      }));
      setIsRolling(false);
      setToastMsg(`🎲 D20 Rolled a Natural ${rolled}! Outcome: [${outcome.replace('_', ' ')}]`);
      setTimeout(() => setToastMsg(null), 3000);
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="d20-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="d20-modal-header">
          <div className="d20-title-group">
            <div className="d20-badge">
              <Dices size={16} />
              <span>INTERACTIVE D20 SKILL-CHECK NARRATIVE BRANCHING</span>
            </div>
            <h3>@{streamerName}'s Live D20 Story Encounter</h3>
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

        {/* D20 Dice Throw Screen Hero Banner */}
        <div className="d20-hero-banner">
          <div className="d20-dice-wrapper">
            <div className={`d20-polyhedral-die ${isRolling ? 'rolling' : ''}`}>
              <span>{isRolling ? '?' : event.lastRoll || 20}</span>
            </div>
            <span className="dc-target-pill">Target DC: {event.difficultyClass}</span>
          </div>

          <div className="d20-encounter-meta">
            <h4>{event.scenarioTitle}</h4>
            <div className="stat-mod-box">
              <span>Modifier: <strong>{event.statModifier}</strong></span>
            </div>

            <button
              type="button"
              className="btn-roll-d20"
              disabled={isRolling}
              onClick={handleRollD20}
            >
              <Dices size={18} />
              <span>{isRolling ? 'Rolling Polyhedral D20...' : 'Roll Interactive D20'}</span>
            </button>
          </div>
        </div>

        {/* Outcome Results Cards */}
        <div className="d20-outcomes-grid">
          <div className={`outcome-card success ${event.outcomeResult === 'SUCCESS' || event.outcomeResult === 'CRITICAL_SUCCESS' ? 'active-outcome' : ''}`}>
            <div className="outcome-top-row">
              <Trophy size={16} color="#00ff88" />
              <strong>SUCCESS (Roll ≥ {event.difficultyClass})</strong>
            </div>
            <p>{event.successOutcome}</p>
          </div>

          <div className={`outcome-card failure ${event.outcomeResult === 'FAILURE' || event.outcomeResult === 'CRITICAL_FAIL' ? 'active-outcome' : ''}`}>
            <div className="outcome-top-row">
              <ShieldAlert size={16} color="#ff3b3b" />
              <strong>FAILURE (Roll &lt; {event.difficultyClass})</strong>
            </div>
            <p>{event.failureOutcome}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="d20-modal-footer">
          <span className="footer-d20-sub">
            🎲 Integrates with Tabletop RPG solo campaigns, Choose-Your-Own-Adventure & Live Chat Sparks Modifiers.
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
