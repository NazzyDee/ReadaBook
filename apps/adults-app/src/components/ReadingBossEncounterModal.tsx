import React, { useState } from 'react';
import { X, Swords, Sparkles, Flame, ShieldAlert, Award } from 'lucide-react';
import { DEFAULT_BOSS_RAID_STATE, type BossRaidState } from '../lib/readingBossData';
import { soundFX } from '../lib/soundFx';

interface ReadingBossEncounterModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ReadingBossEncounterModal: React.FC<ReadingBossEncounterModalProps> = ({
  streamerName,
  onClose
}) => {
  const [boss, setBoss] = useState<BossRaidState>(DEFAULT_BOSS_RAID_STATE);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAttackBoss = (dmg: number, attackName: string) => {
    soundFX.playPop();
    soundFX.playDragonRoar();
    setBoss(prev => {
      const nextHp = Math.max(0, prev.currentHp - dmg);
      return {
        ...prev,
        currentHp: nextHp
      };
    });

    setToastMsg(`⚔️ CRITICAL STRIKE: Dealt ${dmg} DMG with "${attackName}"!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const hpPct = Math.round((boss.currentHp / boss.maxHp) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="boss-raid-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="boss-raid-modal-header">
          <div className="boss-raid-title-group">
            <div className="boss-raid-badge">
              <Swords size={16} />
              <span>COMMUNITY READING BOSS RAID & BEAST ENCOUNTER</span>
            </div>
            <h3>@{streamerName}'s Active Stream Encounter</h3>
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

        {/* Boss Visual & HP Bar Banner */}
        <div className="boss-hero-banner">
          <div className="boss-avatar-col">
            <span className="boss-emoji-huge">{boss.avatarEmoji}</span>
            <span className="boss-weakness-tag">WEAKNESS: {boss.weaknessType}</span>
          </div>

          <div className="boss-info-col">
            <div className="boss-name-row">
              <h4>{boss.bossName}</h4>
              <span className="boss-hp-num">{boss.currentHp} / {boss.maxHp} HP ({hpPct}%)</span>
            </div>
            <p className="boss-title-sub">{boss.bossTitle}</p>

            <div className="boss-hp-bar-track">
              <div
                className="boss-hp-bar-fill"
                style={{ width: `${hpPct}%` }}
              ></div>
            </div>

            <div className="boss-top-attacker-row">
              <Award size={14} color="#ffd700" />
              <span>Top Champion: <strong>@{boss.topAttackerName}</strong> ({boss.topAttackerDamage} DMG)</span>
            </div>
          </div>
        </div>

        {/* Attack Actions Bar */}
        <div className="boss-attack-actions-card">
          <label>DEAL COMMUNITY DAMAGE TO THE BEAST:</label>
          <div className="attack-buttons-grid">
            <button
              type="button"
              className="btn-attack-strike strike-reading"
              onClick={() => handleAttackBoss(250, '10 Min Focus Reading Sprint')}
            >
              <Swords size={16} />
              <div>
                <strong>Focus Reading Strike</strong>
                <span>+250 DMG (10m Listen)</span>
              </div>
            </button>

            <button
              type="button"
              className="btn-attack-strike strike-sparks"
              onClick={() => handleAttackBoss(600, '500 Sparks Radiant Burst')}
            >
              <Flame size={16} />
              <div>
                <strong>Sparks Radiant Flare</strong>
                <span>+600 DMG (500 Sparks)</span>
              </div>
            </button>

            <button
              type="button"
              className="btn-attack-strike strike-trivia"
              onClick={() => handleAttackBoss(400, 'Lore Trivia Spell Cast')}
            >
              <ShieldAlert size={16} />
              <div>
                <strong>Lore Arcane Spell</strong>
                <span>+400 DMG (Quiz Answer)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="boss-raid-modal-footer">
          <span className="boss-rules-note">
            🏆 Defeating the boss unlocks +500 Bonus Sparks drop and an exclusive Chat Flair badge for all active stream readers.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <span>Close Boss Arena</span>
          </button>
        </div>
      </div>
    </div>
  );
};
