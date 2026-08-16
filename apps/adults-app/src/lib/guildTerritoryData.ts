export interface TerritoryZone {
  id: string;
  name: string;
  controllingGuild: 'HIGH_ARCHIVISTS' | 'SPELLWEAVER_COVEN' | 'SHADOW_SCRIBES' | 'UNCLAIMED';
  controlPct: number;
  totalReadingMinutesLogged: number;
  bonusPerk: string;
  defenseShieldActive: boolean;
}

export const DEFAULT_TERRITORY_ZONES: TerritoryZone[] = [
  {
    id: 'zone_citadel_spire',
    name: 'The Great Archivist Citadel Spire',
    controllingGuild: 'HIGH_ARCHIVISTS',
    controlPct: 78,
    totalReadingMinutesLogged: 14200,
    bonusPerk: '+20% Sparks Earned During Sprints',
    defenseShieldActive: true
  },
  {
    id: 'zone_forbidden_crypt',
    name: 'Forbidden Tomes Necro-Crypt',
    controllingGuild: 'SHADOW_SCRIBES',
    controlPct: 62,
    totalReadingMinutesLogged: 9840,
    bonusPerk: 'Unlock Rare Obsidian Bookmark Badges',
    defenseShieldActive: false
  },
  {
    id: 'zone_astronomy_tower',
    name: 'Starlit Astronomy & Grimoire Tower',
    controllingGuild: 'SPELLWEAVER_COVEN',
    controlPct: 54,
    totalReadingMinutesLogged: 8120,
    bonusPerk: '2x Voice Morphs Cooldown Speed',
    defenseShieldActive: true
  }
];
