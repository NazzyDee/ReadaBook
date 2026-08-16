export interface Clip {
  id: string;
  title: string;
  streamerId: string;
  streamerName: string;
  streamerAvatar: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration: number; // in seconds (typically 15-60s)
  viewsCount: number;
  likesCount: number;
  clippedBy: string;
  createdAt: string; // ISO date
  tags: string[];
}

export const INITIAL_CLIPS: Clip[] = [
  {
    id: 'clip_gollum_voice',
    title: 'The moment the Gollum voice took over completely 💀',
    streamerId: 'mock_bookishbard',
    streamerName: 'BookishBard',
    streamerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    bookId: 'the-hobbit',
    bookTitle: 'The Hobbit',
    bookAuthor: 'J.R.R. Tolkien',
    bookCoverUrl: 'https://covers.openlibrary.org/b/id/14627060-L.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    duration: 32,
    viewsCount: 14200,
    likesCount: 1840,
    clippedBy: 'MirkwoodWatcher',
    createdAt: '2026-08-15T14:20:00Z',
    tags: ['VoiceActing', 'Funny', 'Tolkien']
  },
  {
    id: 'clip_narnia_reveal',
    title: 'Audience reaction when Aslan returns! 🦁✨',
    streamerId: 'mock_lillyreads',
    streamerName: 'LillyReads',
    streamerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bookId: 'the-lion-the-witch-and-the-wardrobe',
    bookTitle: 'The Lion, the Witch and the Wardrobe',
    bookAuthor: 'C.S. Lewis',
    bookCoverUrl: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    duration: 45,
    viewsCount: 28900,
    likesCount: 3950,
    clippedBy: 'CozyReader99',
    createdAt: '2026-08-14T20:10:00Z',
    tags: ['Hype', 'PlotTwist', 'Fantasy']
  },
  {
    id: 'clip_synth_spell',
    title: 'Synthesizer harmony right as the Patronus is cast ✨',
    streamerId: 'mock_sorcererspells',
    streamerName: 'SorcererSpells',
    streamerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    bookId: 'harry-potter-and-the-sorcerer-s-stone',
    bookTitle: 'Harry Potter and the Sorcerer\'s Stone',
    bookAuthor: 'J.K. Rowling',
    bookCoverUrl: 'https://covers.openlibrary.org/b/id/276518-L.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    duration: 28,
    viewsCount: 19500,
    likesCount: 2600,
    clippedBy: 'WizardBeats',
    createdAt: '2026-08-13T18:00:00Z',
    tags: ['Music', 'Atmosphere', 'Magic']
  },
  {
    id: 'clip_red_wedding_gasp',
    title: 'Chat went completely silent during the chapter finale 😱',
    streamerId: 'mock_westeroswatcher',
    streamerName: 'WesterosWatcher',
    streamerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    bookId: 'a-game-of-thrones',
    bookTitle: 'A Game of Thrones',
    bookAuthor: 'George R.R. Martin',
    bookCoverUrl: 'https://covers.openlibrary.org/b/id/10580435-L.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=600&q=80',
    duration: 50,
    viewsCount: 45200,
    likesCount: 5800,
    clippedBy: 'WinterIsComing',
    createdAt: '2026-08-12T22:30:00Z',
    tags: ['Shocking', 'PlotTwist', 'DarkFantasy']
  },
  {
    id: 'clip_rivendell_harp',
    title: 'The most peaceful 30 seconds on the internet 🍃☕',
    streamerId: 'mock_elvenlibrarian',
    streamerName: 'ElvenLibrarian',
    streamerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    bookId: 'the-fellowship-of-the-ring',
    bookTitle: 'The Fellowship of the Ring',
    bookAuthor: 'J.R.R. Tolkien',
    bookCoverUrl: 'https://covers.openlibrary.org/b/id/14627060-L.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    duration: 30,
    viewsCount: 16800,
    likesCount: 2200,
    clippedBy: 'CozyLofiFan',
    createdAt: '2026-08-11T16:45:00Z',
    tags: ['Relaxing', 'LofiHarp', 'Bedtime']
  }
];

export function getLocalClips(): Clip[] {
  const saved = localStorage.getItem('readabook_clips');
  if (!saved) return INITIAL_CLIPS;
  try {
    const parsed = JSON.parse(saved);
    return [...parsed, ...INITIAL_CLIPS.filter(ic => !parsed.some((p: Clip) => p.id === ic.id))];
  } catch {
    return INITIAL_CLIPS;
  }
}

export function saveLocalClip(clip: Clip): void {
  const current = getLocalClips();
  const updated = [clip, ...current.filter(c => c.id !== clip.id)];
  localStorage.setItem('readabook_clips', JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
}
