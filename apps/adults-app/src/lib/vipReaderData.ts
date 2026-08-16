export interface VipReader {
  id: string;
  username: string;
  avatarUrl: string;
  badgeType: 'DIAMOND_VIP' | 'GRAND_SCRIBE' | 'GUILD_PATRON' | 'FOUNDER';
  badgeIcon: string;
  customChatColor: string;
  grantedAt: string;
  hasSlowModeImmunity: boolean;
}

export const MOCK_VIP_READERS: VipReader[] = [
  {
    id: 'vip_01',
    username: 'FrodoBagEnd',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badgeType: 'DIAMOND_VIP',
    badgeIcon: '💎',
    customChatColor: '#00ff88',
    grantedAt: '2 months ago',
    hasSlowModeImmunity: true
  },
  {
    id: 'vip_02',
    username: 'NovelScholar',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    badgeType: 'GRAND_SCRIBE',
    badgeIcon: '📜',
    customChatColor: '#ffd700',
    grantedAt: '5 months ago',
    hasSlowModeImmunity: true
  },
  {
    id: 'vip_03',
    username: 'CosmereSeeker',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    badgeType: 'GUILD_PATRON',
    badgeIcon: '👑',
    customChatColor: '#9d4edd',
    grantedAt: '1 year ago',
    hasSlowModeImmunity: true
  }
];
