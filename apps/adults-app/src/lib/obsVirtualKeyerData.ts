export interface VirtualSetScene {
  id: string;
  name: string;
  category: 'FANTASY' | 'SCI_FI' | 'GOTHIC' | 'COZY';
  backdropUrl: string;
  lightingTone: string;
  ambientParticles: 'FIRE_EMBER' | 'RAIN_DROPS' | 'GOLD_DUST' | 'NONE';
  depthBlurPct: number;
}

export const DEFAULT_VIRTUAL_SETS: VirtualSetScene[] = [
  {
    id: 'set_archivist_library',
    name: 'Ancient Alexandrian Great Library',
    category: 'FANTASY',
    backdropUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80',
    lightingTone: 'Warm Candle Amber',
    ambientParticles: 'GOLD_DUST',
    depthBlurPct: 20
  },
  {
    id: 'set_tavern_hearth',
    name: 'Rainy Mountain Tavern Fireside',
    category: 'COZY',
    backdropUrl: 'https://images.unsplash.com/photo-1542314831-c6a4d27038e9?w=600&auto=format&fit=crop&q=80',
    lightingTone: 'Molten Hearthfire Glow',
    ambientParticles: 'FIRE_EMBER',
    depthBlurPct: 35
  },
  {
    id: 'set_cyberpunk_archive',
    name: 'Neo-Tokyo Holographic Manuscript Vault',
    category: 'SCI_FI',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    lightingTone: 'Cyan & Magenta Neon Haze',
    ambientParticles: 'RAIN_DROPS',
    depthBlurPct: 15
  }
];
