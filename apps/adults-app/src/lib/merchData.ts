export interface MerchItem {
  id: string;
  title: string;
  price: number;
  tokensPrice: number;
  badge?: string;
  category: 'Bookmarks' | 'Signed Editions' | 'Apparel' | 'Ambience' | 'Drinkware' | string;
  imageUrl: string;
  inStock: boolean;
  stockCount: number;
  description: string;
}

export const MOCK_MERCH_ITEMS: MerchItem[] = [
  {
    id: 'merch_foil_bookmark',
    title: 'Engraved High-Elven Foil Brass Bookmark',
    price: 16.00,
    tokensPrice: 1600,
    badge: 'Popular',
    category: 'Bookmarks',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    stockCount: 85,
    description: 'Laser-engraved solid brass bookmark with floral Tengwar runes and velvet tassel.'
  },
  {
    id: 'merch_reading_candle',
    title: '“Old Library & Amber Hearth” Soy Reading Candle',
    price: 24.00,
    tokensPrice: 2400,
    badge: 'Handmade',
    category: 'Ambience',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    stockCount: 42,
    description: 'Hand-poured 8oz soy wax candle with notes of teakwood, worn leather, amber, and vanilla.'
  },
  {
    id: 'merch_signed_bookplate',
    title: 'Limited Edition Signed Author Bookplate & Wax Seal',
    price: 30.00,
    tokensPrice: 3000,
    badge: 'Signed Rare',
    category: 'Signed Editions',
    imageUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    stockCount: 18,
    description: 'Foil-stamped bookplate signed by the author and sealed with ReadaBook royal crimson wax.'
  },
  {
    id: 'merch_reading_hoodie',
    title: '“Just One More Chapter” Heavyweight Reading Hoodie',
    price: 48.00,
    tokensPrice: 4800,
    badge: 'Cozy Pick',
    category: 'Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    stockCount: 30,
    description: 'Ultra-plush fleece hoodie designed for marathon late-night reading streams.'
  }
];

export const MERCH_CATALOG: MerchItem[] = MOCK_MERCH_ITEMS;
