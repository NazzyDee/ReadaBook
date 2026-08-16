export interface EmoteArtist {
  id: string;
  artistName: string;
  handle: string;
  avatarUrl: string;
  specialty: string;
  isVerified: boolean;
  commissionStatus: 'Open' | 'Waitlist' | 'Closed';
  startingPrice: number;
  sampleArtUrls: string[];
  bio: string;
}

export const MOCK_EMOTE_ARTISTS: EmoteArtist[] = [
  {
    id: 'artist_mythic_ink',
    artistName: 'MythicInk Art',
    handle: 'mythic_ink',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    specialty: 'High Fantasy Sub Runes & Dragon Badges',
    isVerified: true,
    commissionStatus: 'Open',
    startingPrice: 35,
    sampleArtUrls: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=300&q=80'
    ],
    bio: 'Digital illustrator specializing in Tolkien-inspired loyalty badges, animated tier runes, and streamer channel brand identities.'
  },
  {
    id: 'artist_gothic_quill',
    artistName: 'GothicQuill',
    handle: 'gothicquill_creations',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    specialty: 'Lovecraftian & Dark Romance Emote Packs',
    isVerified: true,
    commissionStatus: 'Waitlist',
    startingPrice: 45,
    sampleArtUrls: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80'
    ],
    bio: 'Custom animated twitch-style emotes for mystery, thriller, and horror book clubs.'
  }
];
