export interface SquadStreamerFeed {
  id: string;
  username: string;
  role: string;
  avatarUrl: string;
  videoUrl: string;
  bookTitle: string;
  currentPage: number;
  isMuted: boolean;
  volume: number;
  isHost: boolean;
  badgeColor: string;
}

export const MOCK_SQUAD_FEEDS: SquadStreamerFeed[] = [
  {
    id: 'squad_1',
    username: 'LillyReads',
    role: 'Narrator & Bilbo',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-reading-a-book-in-a-cozy-room-41584-large.mp4',
    bookTitle: 'The Hobbit',
    currentPage: 42,
    isMuted: false,
    volume: 100,
    isHost: true,
    badgeColor: '#8a2be2'
  },
  {
    id: 'squad_2',
    username: 'ElessarVoiceActor',
    role: 'Voice: Gandalf the Grey',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-reading-a-book-in-a-library-41583-large.mp4',
    bookTitle: 'The Hobbit',
    currentPage: 42,
    isMuted: false,
    volume: 90,
    isHost: false,
    badgeColor: '#00e5ff'
  },
  {
    id: 'squad_3',
    username: 'TolkienScholar',
    role: 'Voice: Thorin Oakenshield',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-reading-a-book-in-a-comfortable-couch-41582-large.mp4',
    bookTitle: 'The Hobbit',
    currentPage: 42,
    isMuted: false,
    volume: 85,
    isHost: false,
    badgeColor: '#ffd700'
  },
  {
    id: 'squad_4',
    username: 'BardicLore',
    role: 'Live Smart Foley & Soundscapes',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-reading-a-book-near-the-window-41581-large.mp4',
    bookTitle: 'The Hobbit',
    currentPage: 42,
    isMuted: false,
    volume: 70,
    isHost: false,
    badgeColor: '#00ff88'
  }
];
