export interface MerchItem {
  id: string;
  title: string;
  category: 'bookmarks' | 'candles' | 'apparel' | 'bookplates';
  price: number;
  tokensPrice: number;
  imageUrl: string;
  badge?: string;
  description: string;
  inStock: boolean;
}

export const MERCH_CATALOG: MerchItem[] = [
  {
    id: 'merch-1',
    title: 'The One Ring Engraved Brass Bookmark',
    category: 'bookmarks',
    price: 18.00,
    tokensPrice: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    badge: 'Bestseller',
    description: 'Solid aged brass laser-etched with Tengwar script. Includes emerald silk tassel.',
    inStock: true
  },
  {
    id: 'merch-2',
    title: 'Old Library & Amber Resin Soy Candle (8oz)',
    category: 'candles',
    price: 24.00,
    tokensPrice: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=300&q=80',
    badge: 'Artisanal',
    description: 'Notes of weathered parchment, Spanish cedar, worn leather bindings, and dark amber.',
    inStock: true
  },
  {
    id: 'merch-3',
    title: 'SarahReads "One More Chapter" Heavyweight Hoodie',
    category: 'apparel',
    price: 48.00,
    tokensPrice: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80',
    badge: 'Limited Edition',
    description: '100% organic cotton fleece with embroidered quill & fantasy mountain back print.',
    inStock: true
  },
  {
    id: 'merch-4',
    title: 'Author-Signed Archival Bookplate (Pack of 3)',
    category: 'bookplates',
    price: 12.00,
    tokensPrice: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80',
    badge: 'Official',
    description: 'Embossed gold foil bookplates with hand-signed broadcaster seals.',
    inStock: true
  }
];
