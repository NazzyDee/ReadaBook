export interface RoomParticipant {
  id: string;
  username: string;
  avatarUrl: string;
  isHost: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  currentPage: number;
}

export interface SharedNote {
  id: string;
  username: string;
  avatarUrl: string;
  text: string;
  timestampSec: number;
  likes: number;
}

export interface CoListeningRoom {
  id: string;
  title: string;
  bookTitle: string;
  author: string;
  coverUrl: string;
  currentChapter: string;
  hostName: string;
  participantsCount: number;
  isPlaying: boolean;
  currentTimeSec: number;
  totalDurationSec: number;
  syncMode: 'host_led' | 'collaborative';
  tags: string[];
  participants: RoomParticipant[];
  sharedNotes: SharedNote[];
  transcriptSnippet: string[];
}

export const SAMPLE_CO_LISTENING_ROOMS: CoListeningRoom[] = [
  {
    id: 'room-1',
    title: 'Tolkien Fellowship Society: Moria Expedition',
    bookTitle: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    currentChapter: 'Chapter 4: A Journey in the Dark',
    hostName: 'SarahReads',
    participantsCount: 8,
    isPlaying: true,
    currentTimeSec: 480,
    totalDurationSec: 2100,
    syncMode: 'host_led',
    tags: ['High Fantasy', 'Discussion', 'Voice Active'],
    participants: [
      {
        id: 'p1',
        username: 'SarahReads',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isHost: true,
        isSpeaking: true,
        isMuted: false,
        currentPage: 245
      },
      {
        id: 'p2',
        username: 'LothlorienScholar',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        isHost: false,
        isSpeaking: false,
        isMuted: false,
        currentPage: 245
      },
      {
        id: 'p3',
        username: 'RangerStrider',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        isHost: false,
        isSpeaking: false,
        isMuted: true,
        currentPage: 245
      },
      {
        id: 'p4',
        username: 'BookwyrmQueen',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        isHost: false,
        isSpeaking: false,
        isMuted: false,
        currentPage: 245
      }
    ],
    sharedNotes: [
      {
        id: 'n1',
        username: 'LothlorienScholar',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'Listen closely to Gandalf\'s voice right here at 08:12 — classic foreshadowing of the Balrog.',
        timestampSec: 492,
        likes: 5
      },
      {
        id: 'n2',
        username: 'SarahReads',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: 'The drumbeats in the deep: "Doom, doom, doom" will start in 2 minutes!',
        timestampSec: 600,
        likes: 8
      }
    ],
    transcriptSnippet: [
      '"There are older and fouler things than Orcs in the deep places of the world."',
      'Frodo said nothing, but clutched his elven dagger closer.',
      'The air grew heavier, smelling of ancient stone and undisturbed dust.'
    ]
  },
  {
    id: 'room-2',
    title: 'Dune Messiah: Arrakis Deep Lore & Silent Focus',
    bookTitle: 'Dune Messiah',
    author: 'Frank Herbert',
    coverUrl: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=300&q=80',
    currentChapter: 'Chapter 2: The Conspiracy of the Guild',
    hostName: 'ArrakisScholar',
    participantsCount: 14,
    isPlaying: true,
    currentTimeSec: 1240,
    totalDurationSec: 2800,
    syncMode: 'collaborative',
    tags: ['Sci-Fi', 'Silent Reading', 'Shared Notes'],
    participants: [],
    sharedNotes: [],
    transcriptSnippet: []
  }
];
