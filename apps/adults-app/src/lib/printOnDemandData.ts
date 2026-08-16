export interface MerchItem {
  id: string;
  name: string;
  category: 'APPAREL' | 'DRINKWARE' | 'BOOKMARK' | 'POSTER';
  priceUsd: number;
  mockupUrl: string;
  inStock: boolean;
  salesCount: number;
}

export const DEFAULT_MERCH_ITEMS: MerchItem[] = [
  {
    id: 'merch_hoodie',
    name: 'Midnight Reader Velvet Heavyweight Hoodie',
    category: 'APPAREL',
    priceUsd: 48.00,
    mockupUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80',
    inStock: true,
    salesCount: 142
  },
  {
    id: 'merch_mug',
    name: 'Dragon Flame Ceramic Tea Cauldron Mug (15oz)',
    category: 'DRINKWARE',
    priceUsd: 22.00,
    mockupUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    inStock: true,
    salesCount: 310
  },
  {
    id: 'merch_bookmark_set',
    name: 'Handcrafted Antique Brass Bookmark Set (Pack of 3)',
    category: 'BOOKMARK',
    priceUsd: 16.50,
    mockupUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    inStock: true,
    salesCount: 520
  }
];
