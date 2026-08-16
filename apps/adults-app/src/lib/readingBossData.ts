export interface BossRaidState {
  bossName: string;
  bossTitle: string;
  currentHp: number;
  maxHp: number;
  avatarEmoji: string;
  weaknessType: 'READING_MINUTES' | 'SPARKS_CHEER' | 'TRIVIA_ANSWER';
  timeRemainingSec: number;
  topAttackerName: string;
  topAttackerDamage: number;
}

export const DEFAULT_BOSS_RAID_STATE: BossRaidState = {
  bossName: 'The Shadow Balrog of Moria',
  bossTitle: 'Ancient Flame Demon of the Underworld',
  currentHp: 3450,
  maxHp: 10000,
  avatarEmoji: '👹🔥',
  weaknessType: 'SPARKS_CHEER',
  timeRemainingSec: 420,
  topAttackerName: 'MithrilBlade',
  topAttackerDamage: 1250
};
