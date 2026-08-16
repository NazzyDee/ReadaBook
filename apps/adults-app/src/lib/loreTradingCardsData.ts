export interface LoreCard {
  id: string;
  name: string;
  rarity: 'LEGENDARY_HOLO' | 'EPIC_FOIL' | 'RARE' | 'COMMON';
  category: 'ARTIFACT' | 'CHARACTER' | 'SPELL' | 'LOCATION';
  cardImageUrl: string;
  attackPower: number;
  loreQuote: string;
  copiesOwned: number;
}

export const DEFAULT_LORE_CARDS: LoreCard[] = [
  {
    id: 'card_anduril',
    name: 'Andúril, Flame of the West',
    rarity: 'LEGENDARY_HOLO',
    category: 'ARTIFACT',
    cardImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
    attackPower: 95,
    loreQuote: '"The blade that was broken shall return to the king\'s hand."',
    copiesOwned: 1
  },
  {
    id: 'card_sandworm',
    name: 'Shai-Hulud, Grandfather of the Desert',
    rarity: 'EPIC_FOIL',
    category: 'CHARACTER',
    cardImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    attackPower: 88,
    loreQuote: '"Bless the Maker and His water."',
    copiesOwned: 3
  },
  {
    id: 'card_elven_cloak',
    name: 'Lorien Elven Camouflage Cloak',
    rarity: 'RARE',
    category: 'ARTIFACT',
    cardImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    attackPower: 60,
    loreQuote: '"Woven by the Lady Galadriel herself."',
    copiesOwned: 5
  }
];
