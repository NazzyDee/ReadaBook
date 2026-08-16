export interface AutoHostTeamMember {
  id: string;
  username: string;
  avatarUrl: string;
  guildName: string;
  currentBookReading: string;
  isLiveNow: boolean;
  priorityOrder: number;
}

export const AUTO_HOST_TEAM_MEMBERS: AutoHostTeamMember[] = [
  {
    id: 'mem_1',
    username: 'ClassicTomes',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80',
    guildName: 'High Fantasy Narrators Guild',
    currentBookReading: 'A Tale of Two Cities',
    isLiveNow: true,
    priorityOrder: 1
  },
  {
    id: 'mem_2',
    username: 'LoreSeeker_Dan',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&auto=format&fit=crop&q=80',
    guildName: 'High Fantasy Narrators Guild',
    currentBookReading: 'The Silmarillion',
    isLiveNow: true,
    priorityOrder: 2
  },
  {
    id: 'mem_3',
    username: 'SciFiChronicles',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&auto=format&fit=crop&q=80',
    guildName: 'Audiobook Cast Collective',
    currentBookReading: 'Dune (Book 1)',
    isLiveNow: false,
    priorityOrder: 3
  }
];
