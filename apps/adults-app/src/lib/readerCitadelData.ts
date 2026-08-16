export interface CitadelTrophyItem {
  id: string;
  name: string;
  type: 'LEATHER_FOLIO' | 'CRYSTAL_STATUETTE' | 'ANTIQUE_HOURGLASS' | 'GOLD_QUILL';
  obtainedFrom: string;
  shelfTier: number; // Shelf 1, 2, 3
  shelfPosition: number; // 1 to 5
  glowColor: string;
}

export const DEFAULT_CITADEL_TROPHIES: CitadelTrophyItem[] = [
  {
    id: 'trophy_quill_100k',
    name: '100,000 Words Scribe Gold Quill',
    type: 'GOLD_QUILL',
    obtainedFrom: 'Complete 100k Reading Sprints',
    shelfTier: 1,
    shelfPosition: 1,
    glowColor: '#ffd700'
  },
  {
    id: 'trophy_folio_lotr',
    name: 'First Edition Leather Lord of the Rings',
    type: 'LEATHER_FOLIO',
    obtainedFrom: 'Attend all 24 chapters live',
    shelfTier: 1,
    shelfPosition: 2,
    glowColor: '#00ff88'
  },
  {
    id: 'trophy_hourglass_marathon',
    name: '24-Hour Solstice Read-a-thon Hourglass',
    type: 'ANTIQUE_HOURGLASS',
    obtainedFrom: 'Solstice Marathon Raid Badge',
    shelfTier: 2,
    shelfPosition: 1,
    glowColor: '#00b4d8'
  }
];
