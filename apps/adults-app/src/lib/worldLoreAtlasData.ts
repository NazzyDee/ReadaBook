export interface MapLocationPoi {
  id: string;
  name: string;
  region: string;
  coordinates: { x: number; y: number }; // percentage 0-100
  loreSummary: string;
  distanceFromStartLeagues: number;
  isNarratorCurrentLocation?: boolean;
}

export const REALM_MAP_LOCATIONS: MapLocationPoi[] = [
  {
    id: 'poi_shire',
    name: 'Hobbiton (The Shire)',
    region: 'Eriador',
    coordinates: { x: 22, y: 38 },
    loreSummary: 'A peaceful, idyllic haven of rolling green hills, hobbit-holes, and cozy hearths.',
    distanceFromStartLeagues: 0
  },
  {
    id: 'poi_bree',
    name: 'Bree & The Prancing Pony',
    region: 'Bree-land',
    coordinates: { x: 38, y: 42 },
    loreSummary: 'A bustling crossroad village where Men and Hobbits dwell side by side. Where Frodo meets Strider.',
    distanceFromStartLeagues: 40,
    isNarratorCurrentLocation: true
  },
  {
    id: 'poi_rivendell',
    name: 'Rivendell (Imladris)',
    region: 'Misty Mountains',
    coordinates: { x: 55, y: 34 },
    loreSummary: 'The Last Homely House East of the Sea, sanctuary of Lord Elrond.',
    distanceFromStartLeagues: 120
  },
  {
    id: 'poi_moria',
    name: 'Mines of Moria (Khazad-dûm)',
    region: 'Misty Mountains',
    coordinates: { x: 62, y: 55 },
    loreSummary: 'Ancient underground dwarven kingdom of mithril, now lurking with shadow and flame.',
    distanceFromStartLeagues: 190
  },
  {
    id: 'poi_mordor',
    name: 'Mount Doom (Orodruin)',
    region: 'Mordor',
    coordinates: { x: 86, y: 78 },
    loreSummary: 'The fiery volcanic heart of Mordor where the One Ring was forged.',
    distanceFromStartLeagues: 450
  }
];
