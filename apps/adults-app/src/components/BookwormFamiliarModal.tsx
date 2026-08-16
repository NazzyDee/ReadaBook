import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Flame, Heart, Award, Utensils } from 'lucide-react';
import { DEFAULT_BOOKWORM_FAMILIAR, type BookwormFamiliar } from '../lib/bookwormFamiliarData';
import { soundFX } from '../lib/soundFx';

interface BookwormFamiliarModalProps {
  streamerName: string;
  onClose: () => void;
}

export const BookwormFamiliarModal: React.FC<BookwormFamiliarModalProps> = ({
  streamerName,
  onClose
}) => {
  const [familiar, setFamiliar] = useState<BookwormFamiliar>(DEFAULT_BOOKWORM_FAMILIAR);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleFeedPages = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setFamiliar(prev => ({
      ...prev,
      currentXp: Math.min(prev.nextLevelXp, prev.currentXp + 150),
      familiarMood: 'ECSTATIC'
    }));
    setToastMsg(`🐛 Fed Barnaby 50 Pages of Lore! +150 Familiar XP Gained.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const xpPct = Math.round((familiar.currentXp / familiar.nextLevelXp) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="familiar-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="familiar-modal-header">
          <div className="familiar-title-group">
            <div className="familiar-badge">
              <Heart size={16} />
              <span>READER LOYALTY STREAKS & EVOLVING BOOKWORM FAMILIAR</span>
            </div>
            <h3>@{streamerName}'s Companion Familiar</h3>
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

        {/* Familiar Virtual Pet Stage Banner */}
        <div className="familiar-hero-banner">
          <div className="familiar-pet-stage">
            <div className="familiar-avatar-bubble">
              <span className="pet-emoji">🐛</span>
              <span className="pet-accessory-tag">{familiar.equippedHat}</span>
            </div>
            <span className="pet-mood-pill">Mood: {familiar.familiarMood}</span>
          </div>

          <div className="familiar-hero-meta">
            <div className="familiar-streak-row">
              <Flame size={16} color="#ff3b3b" />
              <span>{familiar.streakDays}-Day Continuous Daily Reading Streak!</span>
            </div>
            <h4>{familiar.name}</h4>
            <span className="evolution-stage-sub">Stage: {familiar.evolutionStage.replace(/_/g, ' ')} • Lv. {familiar.currentLevel}</span>

            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${xpPct}%` }}></div>
            </div>
            <div className="xp-label-row">
              <span>{familiar.currentXp} / {familiar.nextLevelXp} XP</span>
              <span className="pct-xp">{xpPct}% to Arch-Mage Moth Form</span>
            </div>

            <button
              type="button"
              className="btn-feed-familiar"
              onClick={handleFeedPages}
            >
              <Utensils size={14} />
              <span>Feed 50 Sprint Pages (+150 XP)</span>
            </button>
          </div>
        </div>

        {/* Familiar Evolution Perks Grid */}
        <div className="familiar-perks-grid">
          <div className="perk-box">
            <Award size={18} color="#ffd700" />
            <div className="perk-box-text">
              <strong>Live Stream Chat Emote</strong>
              <span>Unlocks animated jumping caterpillar emote in streamer chat.</span>
            </div>
          </div>
          <div className="perk-box">
            <Sparkles size={18} color="#00ff88" />
            <div className="perk-box-text">
              <strong>+10% Sparks Multiplier</strong>
              <span>Passive boost to all book club challenge reward sparks.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="familiar-modal-footer">
          <span className="footer-familiar-note">
            🌟 Familiars sit next to your username in chat and react when the streamer changes chapters.
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
