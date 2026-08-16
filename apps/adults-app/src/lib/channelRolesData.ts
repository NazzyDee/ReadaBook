export interface ChannelUserRole {
  id: string;
  username: string;
  avatarUrl: string;
  role: 'moderator' | 'vip' | 'verified_author' | 'lore_master' | 'founder';
  badgeIcon: string;
  badgeLabel: string;
  assignedDate: string;
  permissions: {
    canPurgeChat: boolean;
    canManageShield: boolean;
    canManageCast: boolean;
    canTriggerSoundboard: boolean;
  };
}

export const MOCK_CHANNEL_ROLES: ChannelUserRole[] = [
  {
    id: 'role_novel',
    username: 'NovelScholar',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'moderator',
    badgeIcon: '⚔️',
    badgeLabel: 'Channel Moderator',
    assignedDate: 'Jan 2026',
    permissions: {
      canPurgeChat: true,
      canManageShield: true,
      canManageCast: true,
      canTriggerSoundboard: true
    }
  },
  {
    id: 'role_grim',
    username: 'GrimNarrator',
    avatarUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=200&q=80',
    role: 'vip',
    badgeIcon: '📜',
    badgeLabel: 'Scribe VIP',
    assignedDate: 'Feb 2026',
    permissions: {
      canPurgeChat: false,
      canManageShield: false,
      canManageCast: true,
      canTriggerSoundboard: true
    }
  },
  {
    id: 'role_brandon',
    username: 'Brandon_Sanderson_Official',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'verified_author',
    badgeIcon: '✍️',
    badgeLabel: 'Verified Author',
    assignedDate: 'Mar 2026',
    permissions: {
      canPurgeChat: false,
      canManageShield: false,
      canManageCast: true,
      canTriggerSoundboard: true
    }
  },
  {
    id: 'role_bookworm',
    username: 'BookWorm_42',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    role: 'lore_master',
    badgeIcon: '🧙',
    badgeLabel: 'Lore Master',
    assignedDate: 'Mar 2026',
    permissions: {
      canPurgeChat: false,
      canManageShield: false,
      canManageCast: false,
      canTriggerSoundboard: true
    }
  }
];
