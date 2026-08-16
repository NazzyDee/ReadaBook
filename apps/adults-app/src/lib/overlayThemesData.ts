export interface OverlayTheme {
  id: string;
  name: string;
  genreTag: string;
  borderStyle: string;
  primaryColor: string;
  fontFamily: string;
  previewThumbnail: string;
  isActive: boolean;
}

export const AVAILABLE_OVERLAY_THEMES: OverlayTheme[] = [
  {
    id: 'theme_high_fantasy',
    name: 'High Fantasy Parchment',
    genreTag: 'Epic Fantasy / Lore',
    borderStyle: 'Gold Leaf Filigree & Wax Seals',
    primaryColor: '#ffd700',
    fontFamily: 'Cinzel Decorative / Medieval',
    previewThumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'theme_cyberpunk_scifi',
    name: 'Cyberpunk Neon Matrix',
    genreTag: 'Sci-Fi / Dystopian',
    borderStyle: 'Cyan Laser HUD & Glitch Border',
    primaryColor: '#00f0ff',
    fontFamily: 'Orbitron / Monospace',
    previewThumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80',
    isActive: false
  },
  {
    id: 'theme_gothic_victorian',
    name: 'Dark Gothic Victorian',
    genreTag: 'Horror / Mystery',
    borderStyle: 'Wrought Iron & Velvet Crimson',
    primaryColor: '#ff2a5f',
    fontFamily: 'Playfair Display / Gothic',
    previewThumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    isActive: false
  },
  {
    id: 'theme_cozy_coffee',
    name: 'Cozy Bookstore Hearth',
    genreTag: 'Romance / Slice of Life',
    borderStyle: 'Warm Cedar Wood & Amber Glow',
    primaryColor: '#f4a261',
    fontFamily: 'Lora / Serif',
    previewThumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop&q=80',
    isActive: false
  }
];
