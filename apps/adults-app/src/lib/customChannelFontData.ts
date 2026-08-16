export interface CustomFontOption {
  id: string;
  name: string;
  fontFamily: string;
  tierRequirement: 'TIER_1' | 'TIER_2' | 'TIER_3_GRIMOIRE';
  sampleText: string;
  rarityColor: string;
}

export const AVAILABLE_CHANNEL_FONTS: CustomFontOption[] = [
  {
    id: 'font_cinzel',
    name: 'Imperial Gilded Roman (Cinzel Decorative)',
    fontFamily: '"Cinzel Decorative", Georgia, serif',
    tierRequirement: 'TIER_1',
    sampleText: 'The ancient runes inscribed upon the fortress gate glowed with crimson light.',
    rarityColor: 'var(--accent-teal)'
  },
  {
    id: 'font_medieval',
    name: 'Archivist Medieval Calligraphy (MedievalSharp)',
    fontFamily: '"MedievalSharp", cursive, serif',
    tierRequirement: 'TIER_2',
    sampleText: 'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole...',
    rarityColor: 'var(--accent-secondary)'
  },
  {
    id: 'font_uncial',
    name: 'Grimoire Uncial Antiqua (Uncial Antiqua)',
    fontFamily: '"Uncial Antiqua", cursive, serif',
    tierRequirement: 'TIER_3_GRIMOIRE',
    sampleText: 'Three Rings for the Elven-kings under the sky, Seven for the Dwarf-lords in their halls of stone...',
    rarityColor: '#ffd700'
  }
];
