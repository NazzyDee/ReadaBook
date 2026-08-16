export interface BookwormFamiliar {
  id: string;
  name: string;
  evolutionStage: 'EGG' | 'LIL_GRUB' | 'SCHOLAR_CATERPILLAR' | 'ARCH_MAGE_MOTH' | 'COSMIC_PHOENIX_PUPA';
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  familiarMood: 'ECSTATIC' | 'STUDIOUS' | 'HUNGRY' | 'SLEEPING';
  equippedHat: string;
}

export const DEFAULT_BOOKWORM_FAMILIAR: BookwormFamiliar = {
  id: 'fam_001',
  name: 'Barnaby the Scholarly Silkworm',
  evolutionStage: 'SCHOLAR_CATERPILLAR',
  currentLevel: 14,
  currentXp: 840,
  nextLevelXp: 1200,
  streakDays: 42,
  familiarMood: 'ECSTATIC',
  equippedHat: 'Tiny Wizard Monocle & Fez'
};
