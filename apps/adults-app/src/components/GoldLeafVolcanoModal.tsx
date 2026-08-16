import React, { useState } from 'react';
import { X, Flame, Sparkles, CheckCircle2, Award, Zap } from 'lucide-react';
import { DEFAULT_HYPE_VOLCANO, type GoldLeafHypeTrain } from '../lib/goldLeafVolcanoData';
import { soundFX } from '../lib/soundFx';

interface GoldLeafVolcanoModalProps {
  streamerName: string;
  onClose: () => void;
}

export const GoldLeafVolcanoModal: React.FC<GoldLeafVolcanoModalProps> = ({
  streamerName,
  onClose
}) => {
  const [hypeTrain, setHypeTrain] = useState<GoldLeafHypeTrain>(DEFAULT_HYPE_VOLCANO);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleTriggerVolcanoEruption = () => {
    soundFX.playThunder();
    soundFX.playApplause();
    setHypeTrain(prev => ({
      ...prev,
      totalGoldLeavesErupted: prev.totalGoldLeavesErupted + 1000
    }));
    setToastMsg(`🌋 GOLD LEAF VOLCANO LEVEL 100 ERUPTED! 1,000 Gold Leaves Rained on Stream!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="volcano-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="volcano-modal-header">
          <div className="volcano-title-group">
            <div className="volcano-badge">
              <Flame size={16} />
              <span>HYPE TRAIN LEVEL 100: GOLD LEAF VOLCANO ERUPTION</span>
            </div>
            <h3>@{streamerName}'s Golden Hype Volcano</h3>
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

        {/* Volcano Stage Hero Banner */}
        <div className="volcano-hero-banner">
          <div className="volcano-dial-box">
            <span className="volcano-emoji">🌋</span>
            <span className="level-100-badge">LEVEL {hypeTrain.currentLevel}</span>
            <span className="erupted-count">🍂 {hypeTrain.totalGoldLeavesErupted.toLocaleString()} Leaves</span>
          </div>

          <div className="volcano-hero-meta">
            <div className="volcano-status-row">
              <Zap size={14} color="#ffd700" />
              <span>CRITICAL OVERDRIVE ACTIVATED</span>
            </div>
            <h4>Maximum Reading Excitement Reached!</h4>
            <div className="progress-bar-container">
              <div className="progress-bar-fill gold-volcano-bar" style={{ width: '100%' }}></div>
            </div>
            <p>
              When community sparks and gift subscriptions hit maximum threshold, the Gold Leaf Volcano erupts 24K shimmering gold confetti across the entire stream screen.
            </p>

            <button
              type="button"
              className="btn-erupt-volcano"
              onClick={handleTriggerVolcanoEruption}
            >
              <Flame size={16} />
              <span>Trigger Manual Gold Volcano Eruption</span>
            </button>
          </div>
        </div>

        {/* Unlocked Perks List */}
        <div className="volcano-perks-grid">
          {hypeTrain.unlockedPerks.map((perk, idx) => (
            <div key={idx} className="volcano-perk-card">
              <Award size={16} color="#ffd700" />
              <span>{perk}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="volcano-modal-footer">
          <span className="footer-volcano-note">
            🌋 Level 100 Hype Trains are permanently archived in the streamer's Hall of Fame.
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
