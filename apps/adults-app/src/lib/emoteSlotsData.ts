export interface EmoteSlotItem {
  id: string;
  code: string;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'ANIMATED';
  imageUrl: string;
  subPointsRequired: number;
  isUnlocked: boolean;
  status: 'ACTIVE' | 'PENDING_REVIEW' | 'EMPTY';
}

export const MOCK_EMOTE_SLOTS: EmoteSlotItem[] = [
  {
    id: 'em_1',
    code: 'bilboHype',
    tier: 'TIER_1',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80',
    subPointsRequired: 0,
    isUnlocked: true,
    status: 'ACTIVE'
  },
  {
    id: 'em_2',
    code: 'dragonFire',
    tier: 'TIER_1',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=64&auto=format&fit=crop&q=80',
    subPointsRequired: 5,
    isUnlocked: true,
    status: 'ACTIVE'
  },
  {
    id: 'em_3',
    code: 'bookPog',
    tier: 'TIER_1',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=64&auto=format&fit=crop&q=80',
    subPointsRequired: 15,
    isUnlocked: true,
    status: 'ACTIVE'
  },
  {
    id: 'em_4',
    code: 'gandalfPass',
    tier: 'TIER_2',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80',
    subPointsRequired: 25,
    isUnlocked: true,
    status: 'ACTIVE'
  },
  {
    id: 'em_5',
    code: 'ringInvis',
    tier: 'TIER_3',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&auto=format&fit=crop&q=80',
    subPointsRequired: 50,
    isUnlocked: false,
    status: 'EMPTY'
  },
  {
    id: 'em_6',
    code: 'pageTurnDance',
    tier: 'ANIMATED',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&auto=format&fit=crop&q=80',
    subPointsRequired: 35,
    isUnlocked: true,
    status: 'ACTIVE'
  }
];
