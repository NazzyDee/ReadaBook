export interface ChannelTrailerConfig {
  streamerId: string;
  streamerName: string;
  trailerTitle: string;
  tagline: string;
  videoUrl: string;
  narratorVoiceType: string;
  featuredGenres: string[];
  scheduleSnippet: string;
  subTiersSummary: string;
  viewsCount: number;
}

export const DEFAULT_TRAILER_CONFIG: ChannelTrailerConfig = {
  streamerId: 'lillyreads',
  streamerName: 'LillyReads',
  trailerTitle: 'Welcome to Lilly’s Cozy Fantasy Reading Tavern ☕✨',
  tagline: 'High-fantasy dramatic readings, live character voice acting, and evening book club discussions.',
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-reading-a-book-in-a-cozy-room-41584-large.mp4',
  narratorVoiceType: 'Warm, Melodic & Resonant Multi-Character Voice Actor',
  featuredGenres: ['High Fantasy', 'Mythology & Lore', 'Gothic Fiction', 'Sci-Fi Space Opera'],
  scheduleSnippet: 'Live Monday, Wednesday, Friday at 7:00 PM EST',
  subTiersSummary: 'Tier 1 ($4.99) unlocks 10 custom runes & ad-free VODs',
  viewsCount: 14890
};
