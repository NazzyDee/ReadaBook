export interface ChatColorOption {
  id: string;
  name: string;
  hex: string;
  glow: string;
}

export const CHAT_NAME_COLORS: ChatColorOption[] = [
  { id: 'gold', name: 'Dragon Gold', hex: '#ffd700', glow: 'rgba(255, 215, 0, 0.4)' },
  { id: 'mithril', name: 'Mithril Silver', hex: '#00b4d8', glow: 'rgba(0, 180, 216, 0.4)' },
  { id: 'emerald', name: 'Emerald Forest', hex: '#00ff88', glow: 'rgba(0, 255, 136, 0.4)' },
  { id: 'crimson', name: 'Royal Crimson', hex: '#ff3b3b', glow: 'rgba(255, 59, 59, 0.4)' },
  { id: 'void', name: 'Void Violet', hex: '#9d4edd', glow: 'rgba(157, 78, 221, 0.4)' }
];

export interface ChatPreferences {
  nameColorId: string;
  fontSize: 'small' | 'medium' | 'large';
  showTimestamps: boolean;
  zenReadingMode: boolean;
  highlightAuthorMessages: boolean;
  selectedBadges: string[];
}

export const DEFAULT_CHAT_PREFS: ChatPreferences = {
  nameColorId: 'gold',
  fontSize: 'medium',
  showTimestamps: true,
  zenReadingMode: false,
  highlightAuthorMessages: true,
  selectedBadges: ['⚔️ Mod', '👑 Sub', '📖 100-Book']
};
