export interface SubBadgeTier {
  months: number;
  badgeIcon: string;
  tierTitle: string;
  badgeBorderColor: string;
  perksDescription: string;
}

export const SUB_LOYALTY_TIERS: SubBadgeTier[] = [
  { months: 1, badgeIcon: '🥉', tierTitle: 'Novice Scribe', badgeBorderColor: '#cd7f32', perksDescription: 'Base channel subscriber emotes and ad-free viewing.' },
  { months: 3, badgeIcon: '🥈', tierTitle: 'Apprentice Reader', badgeBorderColor: '#a0aec0', perksDescription: 'Silver badge glow and priority poll voting weighting.' },
  { months: 6, badgeIcon: '📜', tierTitle: 'Lore Scholar', badgeBorderColor: '#ffd700', perksDescription: 'Gold parchment badge and access to sub-only voice rooms.' },
  { months: 12, badgeIcon: '🧙', tierTitle: 'Grand Lore Master', badgeBorderColor: '#9d4edd', perksDescription: 'Purple mystic rune badge and monthly free signed book giveaway entry.' },
  { months: 24, badgeIcon: '👑', tierTitle: 'Immortal Guild Founder', badgeBorderColor: '#ff0055', perksDescription: 'Animated pulsing crown badge and personal name credited in channel VODs.' }
];

export interface UserSubMilestoneState {
  currentStreakMonths: number;
  totalMonthsSubscribed: number;
  currentTier: SubBadgeTier;
  totalPagesReadWithStreamer: number;
  canShareMilestoneMessage: boolean;
}

export const DEFAULT_USER_SUB_STATE: UserSubMilestoneState = {
  currentStreakMonths: 6,
  totalMonthsSubscribed: 6,
  currentTier: SUB_LOYALTY_TIERS[2], // 6-month tier
  totalPagesReadWithStreamer: 2480,
  canShareMilestoneMessage: true
};
