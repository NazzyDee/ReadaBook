export interface CustomPointReward {
  id: string;
  title: string;
  cost: number;
  icon: string;
  backgroundColor: string;
  description: string;
  requiresUserInput: boolean;
  userInputPrompt?: string;
  cooldownSeconds: number;
  isEnabled: boolean;
}

export const DEFAULT_CHANNEL_POINT_REWARDS: CustomPointReward[] = [
  {
    id: 'reward_scottish_accent',
    title: 'Read Next Page in Scottish Accent',
    cost: 10000,
    icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    backgroundColor: '#1e3a8a',
    description: 'Forces the broadcaster to voice all characters in a hearty Scottish brogue for 1 full page.',
    requiresUserInput: false,
    cooldownSeconds: 300,
    isEnabled: true
  },
  {
    id: 'reward_author_lore_q',
    title: 'Ask 1 Live Lore Question',
    cost: 5000,
    icon: '🧙',
    backgroundColor: '#9d4edd',
    description: 'Submit a question about worldbuilding theories for the narrator to answer live.',
    requiresUserInput: true,
    userInputPrompt: 'Enter your lore or theory question:',
    cooldownSeconds: 120,
    isEnabled: true
  },
  {
    id: 'reward_sip_tea',
    title: 'Hydrate & Sip Tea ☕',
    cost: 500,
    icon: '🍵',
    backgroundColor: '#047857',
    description: 'Reminds the narrator to take a sip of tea or water to keep vocal cords pristine.',
    requiresUserInput: false,
    cooldownSeconds: 60,
    isEnabled: true
  },
  {
    id: 'reward_highlight_quote',
    title: 'Highlight Book Quote on Stream HUD',
    cost: 2500,
    icon: '✨',
    backgroundColor: '#ffd700',
    description: 'Display your favorite line from the current chapter on the stream banner for 60s.',
    requiresUserInput: true,
    userInputPrompt: 'Enter the book quote to highlight:',
    cooldownSeconds: 180,
    isEnabled: true
  }
];
