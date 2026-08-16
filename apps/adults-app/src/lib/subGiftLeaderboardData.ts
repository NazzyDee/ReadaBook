export interface SubGifterEntry {
  rank: number;
  username: string;
  avatarUrl: string;
  subsGiftedCount: number;
  badgeTitle: string;
  badgeEmoji: string;
  crownColor: string;
}

export const MOCK_SUB_GIFTERS_MONTHLY: SubGifterEntry[] = [
  {
    rank: 1,
    username: 'BookWyrmMaster',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    subsGiftedCount: 145,
    badgeTitle: 'Grand Benefactor of the Realm',
    badgeEmoji: '👑',
    crownColor: '#ffd700'
  },
  {
    rank: 2,
    username: 'LadyEowyn_99',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    subsGiftedCount: 92,
    badgeTitle: 'Arch-Patron Scribe',
    badgeEmoji: '🥈',
    crownColor: '#e0e0e0'
  },
  {
    rank: 3,
    username: 'GrimReader_Tolkien',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    subsGiftedCount: 50,
    badgeTitle: 'Guild Patron',
    badgeEmoji: '🥉',
    crownColor: '#cd7f32'
  },
  {
    rank: 4,
    username: 'FantasyScholar',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    subsGiftedCount: 25,
    badgeTitle: 'Book Guild Champion',
    badgeEmoji: '💎',
    crownColor: '#00b4d8'
  },
  {
    rank: 5,
    username: 'NightLurkerBooks',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    subsGiftedCount: 15,
    badgeTitle: 'Fellowship Benefactor',
    badgeEmoji: '📜',
    crownColor: '#a855f7'
  }
];

export const MOCK_SUB_GIFTERS_ALL_TIME: SubGifterEntry[] = [
  {
    rank: 1,
    username: 'BookWyrmMaster',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    subsGiftedCount: 820,
    badgeTitle: 'Eternal Immortal Patron',
    badgeEmoji: '👑',
    crownColor: '#ffd700'
  },
  {
    rank: 2,
    username: 'MythicScribe',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
    subsGiftedCount: 460,
    badgeTitle: 'Grand Benefactor of the Realm',
    badgeEmoji: '🥈',
    crownColor: '#e0e0e0'
  },
  {
    rank: 3,
    username: 'LadyEowyn_99',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    subsGiftedCount: 310,
    badgeTitle: 'Arch-Patron Scribe',
    badgeEmoji: '🥉',
    crownColor: '#cd7f32'
  }
];
