export interface LoungeMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  subTier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  messageText: string;
  timestamp: string;
  isHost: boolean;
}

export const DEFAULT_LOUNGE_MESSAGES: LoungeMessage[] = [
  {
    id: 'lounge_1',
    senderName: 'MithrilScholar',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80',
    subTier: 'TIER_3',
    messageText: 'What did everyone think of that character death in chapter 14? Totally caught me off guard!',
    timestamp: '8:42 PM',
    isHost: false
  },
  {
    id: 'lounge_2',
    senderName: 'LordOfLore (Host)',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80',
    subTier: 'TIER_3',
    messageText: 'I know! We are going to do a deep-dive analysis into the foreshadowing during Friday night private salon.',
    timestamp: '8:44 PM',
    isHost: true
  }
];
