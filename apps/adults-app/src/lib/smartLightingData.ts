export interface LightingScene {
  id: string;
  name: string;
  genreType: string;
  primaryHex: string;
  secondaryHex: string;
  brightnessPct: number;
  pulseSpeed: 'OFF' | 'SLOW' | 'FAST_ACTION';
  description: string;
}

export const DEFAULT_LIGHTING_SCENES: LightingScene[] = [
  {
    id: 'light_candlelight',
    name: 'Cozy Candlelight & Fireside Hearth',
    genreType: 'Classic Cozy Reading',
    primaryHex: '#ff9e00',
    secondaryHex: '#ff5400',
    brightnessPct: 35,
    pulseSpeed: 'SLOW',
    description: 'Gentle flickering amber and warm orange tones simulating an ancient stone fireplace.'
  },
  {
    id: 'light_deep_space',
    name: 'Cyberpunk & Deep Void Nebula',
    genreType: 'Sci-Fi / Space Opera',
    primaryHex: '#00b4d8',
    secondaryHex: '#7209b7',
    brightnessPct: 55,
    pulseSpeed: 'SLOW',
    description: 'Deep cosmic cyan and violet nebula pulses synchronized to space travel passages.'
  },
  {
    id: 'light_boss_fire',
    name: 'Dragon Flame & Molten Core',
    genreType: 'High Action / Boss Battle',
    primaryHex: '#ff0054',
    secondaryHex: '#ffd000',
    brightnessPct: 85,
    pulseSpeed: 'FAST_ACTION',
    description: 'Intense flashing crimson and gold flares when dramatic combat scenes are detected.'
  }
];
