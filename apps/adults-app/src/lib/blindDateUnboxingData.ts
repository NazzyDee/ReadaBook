export interface BlindDateBookParcel {
  id: string;
  donorViewerName: string;
  genreKeywords: string[]; // e.g. ["Gothic Castle", "Enemies to Lovers", "Cryptic Diary"]
  wrappingPaperStyle: 'BROWN_PARCHMENT_STRING' | 'MIDNIGHT_VELVET' | 'VINTAGE_FLORAL';
  waxStampInitial: string;
  hintQuote: string;
  unboxedBookTitle: string | null;
  status: 'WRAPPED_IN_QUEUE' | 'OPENING_LIVE_NOW' | 'UNVEILED';
}

export const DEFAULT_PARCELS: BlindDateBookParcel[] = [
  {
    id: 'parcel_001',
    donorViewerName: 'CozyReaderJess',
    genreKeywords: ['Haunted Manor', 'Forgotten Grimoire', 'Slow-Burn Romance'],
    wrappingPaperStyle: 'BROWN_PARCHMENT_STRING',
    waxStampInitial: 'R',
    hintQuote: '"There are secrets in the attic that no living soul remembers."',
    unboxedBookTitle: 'The Shadow of the Wind by Carlos Ruiz Zafón',
    status: 'OPENING_LIVE_NOW'
  },
  {
    id: 'parcel_002',
    donorViewerName: 'CyberScribe99',
    genreKeywords: ['Neon Cyberpunk', 'Rogue AI Detective', 'Hard Sci-Fi'],
    wrappingPaperStyle: 'MIDNIGHT_VELVET',
    waxStampInitial: 'N',
    hintQuote: '"The sky above the port was the color of television, tuned to a dead channel."',
    unboxedBookTitle: null,
    status: 'WRAPPED_IN_QUEUE'
  }
];
