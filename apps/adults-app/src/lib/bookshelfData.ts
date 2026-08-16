export interface ShelfWoodTheme {
  id: string;
  name: string;
  colorHex: string;
  borderStyle: string;
  description: string;
}

export const SHELF_WOOD_THEMES: ShelfWoodTheme[] = [
  { id: 'ancient_oak', name: 'Ancient Oak', colorHex: '#4a2c11', borderStyle: '#8b5a2b', description: 'Classic weathered oak with golden corner brackets' },
  { id: 'dark_obsidian', name: 'Dark Obsidian & Velvet', colorHex: '#1a1829', borderStyle: '#9d4edd', description: 'Gothic black marble with purple velvet lining' },
  { id: 'gilded_marble', name: 'Gilded High-Elven Marble', colorHex: '#f0ede6', borderStyle: '#ffd700', description: 'Pristine white marble with gold foil trim' },
  { id: 'enchanted_pine', name: 'Enchanted Green Pine', colorHex: '#143022', borderStyle: '#00ff88', description: 'Lush woodland emerald timber with glowing moss' }
];

export interface ShelfBookItem {
  id: string;
  title: string;
  author: string;
  spineColor: string;
  isSignedEdition: boolean;
  trophyBadge?: string;
}

export const DEFAULT_SHELF_BOOKS: ShelfBookItem[] = [
  { id: 'bk_lotr', title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', spineColor: '#b8860b', isSignedEdition: true, trophyBadge: '🏆 Completed Live' },
  { id: 'bk_twok', title: 'The Way of Kings', author: 'Brandon Sanderson', spineColor: '#1e3a8a', isSignedEdition: true, trophyBadge: '⚡ 1,000+ Pages' },
  { id: 'bk_dune', title: 'Dune: Deluxe Hardcover', author: 'Frank Herbert', spineColor: '#d97706', isSignedEdition: false },
  { id: 'bk_name_wind', title: 'The Name of the Wind', author: 'Patrick Rothfuss', spineColor: '#047857', isSignedEdition: true, trophyBadge: '✨ Masterpiece' }
];
