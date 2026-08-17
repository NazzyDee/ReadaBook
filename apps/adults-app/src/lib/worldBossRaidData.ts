export interface WorldBossRaidState {
  bossName: string; // e.g. "Ignis the Ash Wyrm of Mordor"
  bossMaxHealth: number;
  bossCurrentHealth: number;
  pagesReadCollectively: number;
  totalDamageDealt: number;
  activeAttackSpells: { name: string; damage: number; sparkCost: number }[];
  isDefeated: boolean;
}

export const DEFAULT_WORLD_BOSS_RAID: WorldBossRaidState = {
  bossName: 'Mor’Gath the Ink-Drake of Mount Doom',
  bossMaxHealth: 1000000,
  bossCurrentHealth: 684200,
  pagesReadCollectively: 6316,
  totalDamageDealt: 315800,
  activeAttackSpells: [
    { name: '📖 Vellum Strike (Page Turn)', damage: 500, sparkCost: 0 },
    { name: '🔥 Dragonfire Annotate', damage: 2500, sparkCost: 50 },
    { name: '⚡ Arcane Chapter Burst', damage: 10000, sparkCost: 200 }
  ],
  isDefeated: false
};
