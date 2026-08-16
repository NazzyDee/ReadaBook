export interface MapWaypoint {
  id: string;
  name: string;
  region: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  chapterUnlocked: number;
  description: string;
  dangerLevel: 'Safe' | 'Moderate' | 'Perilous' | 'Deadly';
  distanceKm: number;
  activeCharacters: string[];
}

export interface FantasyWorldMap {
  id: string;
  bookTitle: string;
  worldName: string;
  mapBackgroundUrl: string;
  waypoints: MapWaypoint[];
}

export const SAMPLE_MAPS: FantasyWorldMap[] = [
  {
    id: 'middle-earth',
    bookTitle: 'The Fellowship of the Ring',
    worldName: 'Middle-earth (North-Western Regions)',
    mapBackgroundUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    waypoints: [
      {
        id: 'shire',
        name: 'Hobbiton & The Shire',
        region: 'Eriador',
        xPercent: 18,
        yPercent: 32,
        chapterUnlocked: 1,
        description: 'Peaceful rural land of the Hobbits. Frodo departs Bag End with the One Ring.',
        dangerLevel: 'Safe',
        distanceKm: 0,
        activeCharacters: ['Frodo', 'Sam', 'Pippin']
      },
      {
        id: 'bree',
        name: 'The Prancing Pony (Bree)',
        region: 'Bree-land',
        xPercent: 32,
        yPercent: 38,
        chapterUnlocked: 2,
        description: 'Where the Hobbits encounter the Ranger Strider (Aragorn) while fleeing the Ringwraiths.',
        dangerLevel: 'Moderate',
        distanceKm: 195,
        activeCharacters: ['Frodo', 'Sam', 'Merry', 'Pippin', 'Aragorn']
      },
      {
        id: 'weathertop',
        name: 'Weathertop (Amon Sûl)',
        region: 'Lone-lands',
        xPercent: 44,
        yPercent: 42,
        chapterUnlocked: 3,
        description: 'Ruined ancient watchtower where the Witch-king stabs Frodo with a Morgul-blade.',
        dangerLevel: 'Perilous',
        distanceKm: 340,
        activeCharacters: ['Frodo', 'Aragorn', 'Nazgûl']
      },
      {
        id: 'rivendell',
        name: 'Rivendell (Imladris)',
        region: 'Misty Mountains Foothills',
        xPercent: 58,
        yPercent: 36,
        chapterUnlocked: 3,
        description: 'The sanctuary of Lord Elrond. Council of Elrond forms the Fellowship of the Nine.',
        dangerLevel: 'Safe',
        distanceKm: 650,
        activeCharacters: ['Frodo', 'Gandalf', 'Aragorn', 'Legolas', 'Gimli', 'Boromir']
      },
      {
        id: 'moria',
        name: 'Mines of Moria (Khazad-dûm)',
        region: 'Misty Mountains',
        xPercent: 64,
        yPercent: 56,
        chapterUnlocked: 4,
        description: 'Ancient subterranean dwarf realm. Confrontation with the Balrog of Morgoth at the Bridge.',
        dangerLevel: 'Deadly',
        distanceKm: 890,
        activeCharacters: ['Fellowship of Nine', 'Balrog']
      },
      {
        id: 'lothlorien',
        name: 'Lothlórien (Caras Galadhon)',
        region: 'Wilderland',
        xPercent: 74,
        yPercent: 62,
        chapterUnlocked: 5,
        description: 'Enchanted Golden Wood ruled by Lady Galadriel and Lord Celeborn. Mirror of Galadriel.',
        dangerLevel: 'Safe',
        distanceKm: 1040,
        activeCharacters: ['Fellowship of Eight', 'Galadriel']
      },
      {
        id: 'amon-hen',
        name: 'Amon Hen (Falls of Rauros)',
        region: 'Anduin Valley',
        xPercent: 82,
        yPercent: 78,
        chapterUnlocked: 6,
        description: 'The Hill of Sight. Breaking of the Fellowship and Boromir\'s heroic last stand.',
        dangerLevel: 'Deadly',
        distanceKm: 1320,
        activeCharacters: ['Frodo & Sam', 'Aragorn, Legolas, Gimli']
      }
    ]
  }
];
