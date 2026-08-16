export interface ScheduleEvent {
  id: string;
  day: string;
  time: string;
  title: string;
  bookTitle: string;
  bookAuthor: string;
  genre: string;
  isSpecialEvent?: boolean;
}

export interface ChannelPanel {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
}

export interface StreamerProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  followersCount: number;
  subscribersCount: number;
  isPartner: boolean;
  isLive: boolean;
  currentStreamTitle?: string;
  currentBookId?: string;
  tags: string[];
  socials: {
    twitter?: string;
    discord?: string;
    goodreads?: string;
    youtube?: string;
    instagram?: string;
  };
  schedule: ScheduleEvent[];
  panels: ChannelPanel[];
  recentBooks: string[]; // Book IDs
}

export const STREAMERS: Record<string, StreamerProfile> = {
  'mock_lillyreads': {
    id: 'mock_lillyreads',
    username: 'LillyReads',
    displayName: 'LillyReads 🌧️',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    bio: 'Storyteller, voice artist & literature enthusiast. Grab your favorite herbal tea and curl up with classic fantasy and cozy mystery readings.',
    followersCount: 38400,
    subscribersCount: 1420,
    isPartner: true,
    isLive: true,
    currentStreamTitle: 'Cozy Bedtime Storytelling & Soft Rain Lofi 🌧️',
    currentBookId: 'the-lion-the-witch-and-the-wardrobe',
    tags: ['CozyVibes', 'VoiceActing', 'Fantasy', 'LofiStudy', 'Audiobook'],
    socials: {
      goodreads: 'https://goodreads.com',
      discord: 'https://discord.gg',
      instagram: 'https://instagram.com'
    },
    schedule: [
      { id: 's1', day: 'Tuesday', time: '8:00 PM EST', title: 'Narnia Chronicles Chapter 6-8', bookTitle: 'The Lion, the Witch and the Wardrobe', bookAuthor: 'C.S. Lewis', genre: 'Fantasy' },
      { id: 's2', day: 'Thursday', time: '8:00 PM EST', title: 'Cozy Rain Study & Silent Reading Sprint (50/10)', bookTitle: 'Pride and Prejudice', bookAuthor: 'Jane Austen', genre: 'Classics' },
      { id: 's3', day: 'Sunday', time: '7:00 PM EST', title: 'Sunday Bedtime Fairy Tales & Subscriber Choice', bookTitle: 'Alice\'s Adventures in Wonderland', bookAuthor: 'Lewis Carroll', genre: 'Classics', isSpecialEvent: true }
    ],
    panels: [
      {
        id: 'p1',
        title: '📖 Welcome to The Story Haven',
        content: 'Hi! I am Lilly, a full-time audiobook narrator and classical literature fan. My streams are focused on immersive storytelling with live voice acting, atmospheric ambient soundscapes, and synchronized reading text on screen.'
      },
      {
        id: 'p2',
        title: '📜 Chat Rules & Etiquette',
        content: '1. Respect everyone in chat.\n2. NO UNMARKED SPOILERS! Always use /spoiler in chat.\n3. Be cozy, respectful, and enjoy the story!'
      },
      {
        id: 'p3',
        title: '🎙️ Audio & Broadcast Specs',
        content: '• Mic: Shure SM7B + Cloudlifter CL-1\n• Audio Interface: Focusrite Scarlett 2i2 4th Gen\n• Software: OBS Studio + ReadaBook Ingest Engine\n• Headphones: Sennheiser HD 600'
      },
      {
        id: 'p4',
        title: '✨ Subscriber Perks (Bookworm Tier)',
        content: '• Ad-free stream viewing\n• 18 Custom animated channel emotes\n• Sub-only Book Club monthly meetings\n• Priority Book Nomination in community polls'
      }
    ],
    recentBooks: ['the-lion-the-witch-and-the-wardrobe', 'pride-and-prejudice', 'alice-in-wonderland']
  },
  'mock_bookishbard': {
    id: 'mock_bookishbard',
    username: 'BookishBard',
    displayName: 'BookishBard 🐉',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    bio: 'High-energy epic fantasy readings, full character accents, D&D lore discussions, and community read-along quests!',
    followersCount: 62100,
    subscribersCount: 3500,
    isPartner: true,
    isLive: true,
    currentStreamTitle: 'Adventure Quest! Epic Reading & Voice Acting 🐉',
    currentBookId: 'the-hobbit',
    tags: ['EpicFantasy', 'VoiceActing', 'Tolkien', 'Interactive', 'TableRead'],
    socials: {
      goodreads: 'https://goodreads.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com'
    },
    schedule: [
      { id: 'sb1', day: 'Monday', time: '6:00 PM EST', title: 'The Hobbit: Riddles in the Dark voice acting!', bookTitle: 'The Hobbit', bookAuthor: 'J.R.R. Tolkien', genre: 'Fantasy' },
      { id: 'sb2', day: 'Wednesday', time: '6:00 PM EST', title: 'Squad Stream: Dramatic Script Read with LillyReads!', bookTitle: 'The Fellowship of the Ring', bookAuthor: 'J.R.R. Tolkien', genre: 'Fantasy', isSpecialEvent: true },
      { id: 'sb3', day: 'Saturday', time: '3:00 PM EST', title: 'Weekend Fantasy Worldbuilding & Lore Breakdown', bookTitle: 'The Silmarillion', bookAuthor: 'J.R.R. Tolkien', genre: 'Fantasy' }
    ],
    panels: [
      {
        id: 'pb1',
        title: '⚔️ The Bard\'s Guild',
        content: 'Welcome adventurer! We do character voices for every NPC, roll D20 dice for story outcomes, and celebrate every epic plot twist with Book Sparks!'
      },
      {
        id: 'pb2',
        title: '🏆 Channel Points Quest Rewards',
        content: '• 500 Sparks: Character Voice Accent of your choice!\n• 1000 Sparks: Live Sound FX triggering\n• 5000 Sparks: Streamer sings a tavern ballad!'
      }
    ],
    recentBooks: ['the-hobbit', 'the-fellowship-of-the-ring', 'the-two-towers']
  },
  'mock_sorcererspells': {
    id: 'mock_sorcererspells',
    username: 'SorcererSpells',
    displayName: 'SorcererSpells ✨',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
    bio: 'Magical reading atmospheres, synth-wave soundscapes, and spellbinding sci-fi & fantasy deep dives.',
    followersCount: 89000,
    subscribersCount: 5600,
    isPartner: true,
    isLive: true,
    currentStreamTitle: 'Magical Reading & Soundscape Synthesizers ✨',
    currentBookId: 'harry-potter-and-the-sorcerer-s-stone',
    tags: ['Magic', 'Soundscapes', 'CozyLofi', 'Audiobook', 'Chill'],
    socials: {
      instagram: 'https://instagram.com',
      discord: 'https://discord.gg'
    },
    schedule: [
      { id: 'ss1', day: 'Wednesday', time: '7:30 PM EST', title: 'Hogwarts Express Chapter with live sound FX', bookTitle: 'Harry Potter and the Sorcerer\'s Stone', bookAuthor: 'J.K. Rowling', genre: 'Fantasy' },
      { id: 'ss2', day: 'Friday', time: '9:00 PM EST', title: 'Late Night Synth Reading Session', bookTitle: 'Dune', bookAuthor: 'Frank Herbert', genre: 'Sci-Fi' }
    ],
    panels: [
      {
        id: 'ps1',
        title: '🪄 Ambient Magic Experience',
        content: 'Every stream combines custom synthesized music matched dynamically to the tone of the book pages.'
      }
    ],
    recentBooks: ['harry-potter-and-the-sorcerer-s-stone', 'dune', 'frankenstein']
  },
  'mock_westeroswatcher': {
    id: 'mock_westeroswatcher',
    username: 'WesterosWatcher',
    displayName: 'WesterosWatcher ⚔️',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80',
    bio: 'Grimdark fantasy analyst, co-writing sprints, chapter dissecting, and deep lore predictions!',
    followersCount: 45000,
    subscribersCount: 2800,
    isPartner: true,
    isLive: true,
    currentStreamTitle: 'Epic Fantasy Study Night - Join Co-Writing Sprinters!',
    currentBookId: 'a-game-of-thrones',
    tags: ['DarkFantasy', 'Discussion', 'StudySprint', 'Pomodoro', 'Predictions'],
    socials: {
      twitter: 'https://twitter.com',
      discord: 'https://discord.gg'
    },
    schedule: [
      { id: 'ww1', day: 'Monday', time: '8:00 PM EST', title: 'A Game of Thrones: Tower of Joy Breakdown', bookTitle: 'A Game of Thrones', bookAuthor: 'George R.R. Martin', genre: 'Fantasy' }
    ],
    panels: [
      {
        id: 'pw1',
        title: '⚔️ Grimdark Reading Society',
        content: 'We analyze themes, plot intricacies, and launch live Predictions with Book Sparks on who survives!'
      }
    ],
    recentBooks: ['a-game-of-thrones', 'the-name-of-the-wind']
  },
  'mock_elvenlibrarian': {
    id: 'mock_elvenlibrarian',
    username: 'ElvenLibrarian',
    displayName: 'ElvenLibrarian 🍃',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80',
    bio: 'Rivendell cozy library aesthetic, silent reading hours, lo-fi harp music, and classic poetry readings.',
    followersCount: 29500,
    subscribersCount: 1850,
    isPartner: true,
    isLive: true,
    currentStreamTitle: 'Rivendell Study Room: Cozy Fireplace & Silent Reading',
    currentBookId: 'the-fellowship-of-the-ring',
    tags: ['SilentStudy', 'LofiHarp', 'CozyVibes', 'Poetry', 'LateNight'],
    socials: {
      instagram: 'https://instagram.com'
    },
    schedule: [
      { id: 'el1', day: 'Daily', time: '10:00 PM EST', title: 'Silent Midnight Study & Reading Room (50/10 Pomodoro)', bookTitle: 'The Fellowship of the Ring', bookAuthor: 'J.R.R. Tolkien', genre: 'Fantasy' }
    ],
    panels: [
      {
        id: 'pel1',
        title: '🍃 The Silent Haven',
        content: 'Join hundreds of readers studying and reading together in peaceful silence with soft ambient fireplace sounds.'
      }
    ],
    recentBooks: ['the-fellowship-of-the-ring', 'dracula', 'great-expectations']
  }
};
