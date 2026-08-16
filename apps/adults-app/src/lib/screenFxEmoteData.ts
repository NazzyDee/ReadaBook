export interface ScreenFxEffect {
  id: string;
  name: string;
  effectType: 'FLYING_PAGES' | 'GOLD_LEAF_CANNON' | 'ARCANE_LIGHTNING' | 'DRAGON_FIRE_BLAST';
  iconEmoji: string;
  triggerEvent: string;
  durationSec: number;
}

export const AVAILABLE_SCREEN_FX: ScreenFxEffect[] = [
  {
    id: 'fx_parchment_burst',
    name: 'Floating Illuminated Parchment Pages',
    effectType: 'FLYING_PAGES',
    iconEmoji: '📜✨',
    triggerEvent: 'Triggered on 500+ Sparks Cheers or Tier 1 Subscriptions',
    durationSec: 5
  },
  {
    id: 'fx_gold_leaf',
    name: 'Gold Leaf Shower & Sparks Cannon',
    effectType: 'GOLD_LEAF_CANNON',
    iconEmoji: '🍂💥',
    triggerEvent: 'Triggered on Tier 2 / Tier 3 Subscriptions & Gift Bombs',
    durationSec: 7
  },
  {
    id: 'fx_arcane_lightning',
    name: 'Arcane Scribe Thunder & Rune Sparks',
    effectType: 'ARCANE_LIGHTNING',
    iconEmoji: '⚡🧙‍♂️',
    triggerEvent: 'Triggered on 2,500+ Sparks Grand Cheers & Raids',
    durationSec: 6
  },
  {
    id: 'fx_dragon_fire',
    name: 'Dragon Fire Breath & Ember Vortex',
    effectType: 'DRAGON_FIRE_BLAST',
    iconEmoji: '🐉🔥',
    triggerEvent: 'Triggered on Hype Train Level 5 Climax & 5,000+ Cheers',
    durationSec: 8
  }
];
