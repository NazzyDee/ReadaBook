export interface WatchPartyMember {
  id: string;
  username: string;
  avatarUrl: string;
  isHost: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  role: string;
}

export interface WatchPartySession {
  id: string;
  roomName: string;
  bookTitle: string;
  bookAuthor: string;
  currentChapter: string;
  currentPage: number;
  currentPlaybackSeconds: number;
  totalDurationSeconds: number;
  isPlaying: boolean;
  members: WatchPartyMember[];
  highlightedSentence: string;
}

export const ACTIVE_WATCH_PARTY_DEMO: WatchPartySession = {
  id: 'room_fantasy_fellowship',
  roomName: 'High Fantasy Co-Reading Sanctuary ☕',
  bookTitle: 'The Fellowship of the Ring',
  bookAuthor: 'J.R.R. Tolkien',
  currentChapter: 'Chapter 2: The Shadow of the Past',
  currentPage: 54,
  currentPlaybackSeconds: 142,
  totalDurationSeconds: 600,
  isPlaying: true,
  highlightedSentence: "Three Rings for the Elven-kings under the sky, Seven for the Dwarf-lords in their halls of stone...",
  members: [
    {
      id: 'm1',
      username: 'LillyReads',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isHost: true,
      isMuted: false,
      isSpeaking: true,
      role: 'Host & Narrator'
    },
    {
      id: 'm2',
      username: 'NovelScholar',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isHost: false,
      isMuted: true,
      isSpeaking: false,
      role: 'Co-Listener'
    },
    {
      id: 'm3',
      username: 'RivendellElf',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      isHost: false,
      isMuted: false,
      isSpeaking: false,
      role: 'Co-Listener'
    },
    {
      id: 'm4',
      username: 'BookWorm_42',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isHost: false,
      isMuted: true,
      isSpeaking: false,
      role: 'Co-Listener'
    }
  ]
};
