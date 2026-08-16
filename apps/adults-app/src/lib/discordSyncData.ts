export interface DiscordServerConfig {
  serverName: string;
  serverIconUrl: string;
  totalMembers: number;
  isConnected: boolean;
  linkedDiscordUsername: string | null;
  syncedRoles: {
    name: string;
    color: string;
    description: string;
    isGranted: boolean;
  }[];
}

export const MOCK_DISCORD_CONFIG: DiscordServerConfig = {
  serverName: 'Lilly’s High Fantasy Book Guild',
  serverIconUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80',
  totalMembers: 4820,
  isConnected: false,
  linkedDiscordUsername: null,
  syncedRoles: [
    { name: '@Verified Subscriber', color: '#ffd700', description: 'Access to private monthly book voting and live Q&A audio stages', isGranted: false },
    { name: '@Lore Master', color: '#9d4edd', description: 'Access to deep lore theorycrafting and character codex channels', isGranted: false },
    { name: '@Buddy Reader', color: '#00b4d8', description: 'Access to 24/7 silent co-reading Discord voice lounges', isGranted: false }
  ]
};
