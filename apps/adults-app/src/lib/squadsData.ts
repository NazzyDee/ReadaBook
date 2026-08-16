export interface SquadMember {
  streamerId: string;
  streamerName: string;
  avatarUrl: string;
  role: string;
  bookPageText?: string;
  viewerCount: number;
}

export interface SquadStream {
  id: string;
  title: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  genre: string;
  members: SquadMember[];
  totalViewers: number;
  description: string;
  tags: string[];
}

export const SQUAD_STREAMS: SquadStream[] = [
  {
    id: 'squad_tolkien_fellowship',
    title: 'The Council of Elrond: 4-Way Dramatic Script & Table Read! 🧝‍♂️🧙‍♂️',
    bookId: 'the-fellowship-of-the-ring',
    bookTitle: 'The Fellowship of the Ring',
    bookAuthor: 'J.R.R. Tolkien',
    bookCoverUrl: 'https://covers.openlibrary.org/b/id/14627060-L.jpg',
    genre: 'Fantasy',
    totalViewers: 8400,
    description: 'Four voice artists join forces to read the legendary Council of Elrond with distinct character roles!',
    tags: ['TableRead', 'SquadStream', 'Tolkien', 'VoiceActing'],
    members: [
      {
        streamerId: 'mock_bookishbard',
        streamerName: 'BookishBard',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        role: 'Gandalf & Gimli',
        viewerCount: 3500
      },
      {
        streamerId: 'mock_lillyreads',
        streamerName: 'LillyReads',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        role: 'Frodo & Narrator',
        viewerCount: 2200
      },
      {
        streamerId: 'mock_elvenlibrarian',
        streamerName: 'ElvenLibrarian',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
        role: 'Lord Elrond & Legolas',
        viewerCount: 1700
      },
      {
        streamerId: 'mock_westeroswatcher',
        streamerName: 'WesterosWatcher',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
        role: 'Boromir & Aragorn',
        viewerCount: 1000
      }
    ]
  },
  {
    id: 'squad_scifi_debate',
    title: 'Dune vs Foundation: Worldbuilding Showdown & Co-Reading 🚀',
    bookId: 'dune',
    bookTitle: 'Dune',
    bookAuthor: 'Frank Herbert',
    bookCoverUrl: 'https://covers.openlibrary.org/b/id/11186714-L.jpg',
    genre: 'Sci-Fi',
    totalViewers: 6100,
    description: 'Analyzing sci-fi literature classics side-by-side with audience live voting and interactive lore debates!',
    tags: ['SciFi', 'Debate', 'SquadStream', 'DeepDive'],
    members: [
      {
        streamerId: 'mock_sorcererspells',
        streamerName: 'SorcererSpells',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
        role: 'Dune Lorekeeper',
        viewerCount: 3900
      },
      {
        streamerId: 'mock_westeroswatcher',
        streamerName: 'WesterosWatcher',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
        role: 'Foundation Analyst',
        viewerCount: 2200
      }
    ]
  }
];
