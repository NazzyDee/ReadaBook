export interface SignedBookplate {
  id: string;
  recipientName: string;
  authorDedication: string;
  signatureStyle: 'GOLD_FOIL_SCRIPT' | 'ARCHIVAL_IRON_GALL' | 'RUNIC_EMBOSSED';
  waxSealColor: 'CRIMSON_ROYAL' | 'EMERALD_GUILD' | 'MIDNIGHT_OBSIDIAN';
  waxSealInsignia: string;
  signedAt: string;
  certificateHash: string;
}

export const DEFAULT_BOOKPLATES: SignedBookplate[] = [
  {
    id: 'sign_001',
    recipientName: 'Lady Eleanor of Ravenwood',
    authorDedication: '"May your path through the misty woods be illuminated by the ancient embers."',
    signatureStyle: 'GOLD_FOIL_SCRIPT',
    waxSealColor: 'CRIMSON_ROYAL',
    waxSealInsignia: 'Dragon Crest with Quill',
    signedAt: 'August 16, 2026',
    certificateHash: '0x8f2d...9c4a'
  },
  {
    id: 'sign_002',
    recipientName: 'Archivist Thorne',
    authorDedication: '"For keeping the sacred scrolls unbroken."',
    signatureStyle: 'ARCHIVAL_IRON_GALL',
    waxSealColor: 'MIDNIGHT_OBSIDIAN',
    waxSealInsignia: 'Tower of High Wisdom',
    signedAt: 'August 16, 2026',
    certificateHash: '0x4b7e...11e2'
  }
];
