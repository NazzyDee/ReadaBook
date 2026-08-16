export interface ModAuditAction {
  id: string;
  actionType: 'TIMEOUT' | 'BAN' | 'DELETE_MSG' | 'SLOW_MODE' | 'SHIELD_MODE';
  targetUser?: string;
  moderatorName: string;
  reason: string;
  timestamp: string;
  durationSeconds?: number;
  isReversed?: boolean;
}

export const MOCK_MOD_AUDIT_LOGS: ModAuditAction[] = [
  {
    id: 'act_01',
    actionType: 'TIMEOUT',
    targetUser: 'SpoilerTroll99',
    moderatorName: 'HeadArchivist_Mod',
    reason: 'Major plot spoiler about Chapter 7 ending in public chat',
    timestamp: '4:22 PM',
    durationSeconds: 600,
    isReversed: false
  },
  {
    id: 'act_02',
    actionType: 'DELETE_MSG',
    targetUser: 'CryptoPromoBot',
    moderatorName: 'AutoMod Sentinel',
    reason: 'Unauthorized third-party cryptocurrency links detected',
    timestamp: '4:18 PM',
    isReversed: false
  },
  {
    id: 'act_03',
    actionType: 'BAN',
    targetUser: 'ToxicBackseater',
    moderatorName: 'LoreKeeper_Elena',
    reason: 'Repeated harassment towards narrator character voices',
    timestamp: '4:05 PM',
    isReversed: false
  },
  {
    id: 'act_04',
    actionType: 'SLOW_MODE',
    moderatorName: 'HeadArchivist_Mod',
    reason: 'Set chat rate limit to 5 seconds during high-intensity scene',
    timestamp: '3:50 PM',
    durationSeconds: 5,
    isReversed: false
  }
];
