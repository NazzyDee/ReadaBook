import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Flame, Swords, Heart } from 'lucide-react';
import { DEFAULT_WORLD_BOSS_RAID, type WorldBossRaidState } from '../lib/worldBossRaidData';
import { soundFX } from '../lib/soundFx';

interface WorldBossRaidModalProps {
  streamerName: string;
  onClose: () => void;
}

export const WorldBossRaidModal: React.FC<WorldBossRaidModalProps> = ({
  streamerName,
  onClose
}) => {
  const [boss, setBoss] = useState<WorldBossRaidState>(DEFAULT_WORLD_BOSS_RAID);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCastSpell = (spell: { name: string; damage: number; sparkCost: number }) => {
    soundFX.playPop();
    soundFX.playDragonRoar();
    setBoss(prev => {
      const nextHp = Math.max(0, prev.bossCurrentHealth - spell.damage);
      return {
        ...prev,
        bossCurrentHealth: nextHp,
        totalDamageDealt: prev.totalDamageDealt + spell.damage,
        isDefeated: nextHp === 0
      };
    });
    setToastMsg(`💥 Cast ${spell.name} dealing ${spell.damage.toLocaleString()} damage to ${boss.bossName}!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const hpPct = Math.round((boss.bossCurrentHealth / boss.bossMaxHealth) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="boss-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="boss-modal-header">
          <div className="boss-title-group">
            <div className="boss-badge">
              <Flame size={16} />
              <span>COMMUNITY MMORPG WORLD BOSS RAID (1M HP)</span>
            </div>
            <h3>@{streamerName}'s Live Boss Encounter</h3>
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

        {/* Boss Health Bar Hero Banner */}
        <div className="boss-hero-banner">
          <div className="dragon-head-dial">
            <Flame size={44} color="#ff3b3b" />
            <span className="boss-level-tag">LEVEL 100 BOSS</span>
          </div>

          <div className="boss-hero-meta">
            <h4>{boss.bossName}</h4>
            <div className="boss-hp-wrapper">
              <div className="boss-hp-track">
                <div className="boss-hp-fill" style={{ width: `${hpPct}%` }}></div>
              </div>
              <div className="hp-numbers-row">
                <span className="hp-left"><Heart size={14} color="#ff3b3b" /> {boss.bossCurrentHealth.toLocaleString()} / {boss.bossMaxHealth.toLocaleString()} HP ({hpPct}%)</span>
                <span className="pages-attack-tag">📖 {boss.pagesReadCollectively.toLocaleString()} Pages Read By Chat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attack Spells Roster */}
        <div className="boss-spells-list">
          <h4>Cooperative Raid Attacks & Spell Rotations</h4>
          <div className="spells-grid">
            {boss.activeAttackSpells.map((spell, idx) => (
              <div key={idx} className="spell-card">
                <div className="spell-info">
                  <strong>{spell.name}</strong>
                  <span className="dmg-sub">💥 Deals {spell.damage.toLocaleString()} DMG • {spell.sparkCost === 0 ? 'FREE with Page Turn' : `${spell.sparkCost} Sparks`}</span>
                </div>
                <button
                  type="button"
                  className="btn-cast-spell"
                  onClick={() => handleCastSpell(spell)}
                  disabled={boss.isDefeated}
                >
                  <Swords size={14} />
                  <span>Cast Spell</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="boss-modal-footer">
          <span className="footer-boss-note">
            🐉 Defeating the World Boss grants all active stream viewers a Mythic Dragon-Slayer Chat Badge!
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
