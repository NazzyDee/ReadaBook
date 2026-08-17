export interface ReaderFaction {
  id: string;
  factionName: string;
  motto: string;
  loreDescription: string;
  totalMembersCount: number;
  territoryControlPct: number;
  accentColor: string;
  isUserAligned: boolean;
}

export const DEFAULT_FACTIONS: ReaderFaction[] = [
  {
    id: 'fac_inkwardens',
    factionName: 'The Inkwardens of Alexandria',
    motto: '"Preserve the Eternal Word."',
    loreDescription: 'Keepers of ancient manuscripts, rare physical first editions, and historical lore accuracy.',
    totalMembersCount: 14280,
    territoryControlPct: 42,
    accentColor: '#00ff88',
    isUserAligned: true
  },
  {
    id: 'fac_silverquill',
    factionName: 'The Order of Silverquill',
    motto: '"Wit sharper than any blade."',
    loreDescription: 'Master orators, speed-readers, dramatic narrators, and analytical close-reading duelists.',
    totalMembersCount: 11920,
    territoryControlPct: 34,
    accentColor: '#ffd700',
    isUserAligned: false
  },
  {
    id: 'fac_scholomance',
    factionName: 'The Shadow Scholomance',
    motto: '"Forbidden knowledge burns brightest."',
    loreDescription: 'Seekers of gothic horror, grimdark epics, arcane lore secrets, and unreleased author drafts.',
    totalMembersCount: 9840,
    territoryControlPct: 24,
    accentColor: '#9d4edd',
    isUserAligned: false
  }
];
