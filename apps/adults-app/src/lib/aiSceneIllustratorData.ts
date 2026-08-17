export interface GeneratedSceneArtwork {
  id: string;
  sceneTitle: string;
  artStyle: 'OIL_PAINTING_FANTASY' | 'ANIME_STUDIO_GHIBLI' | 'DARK_GOTHIC_ETCHING' | 'CYBERPUNK_NEON';
  scenePromptSummary: string;
  generatedImageUrl: string;
  likesCount: number;
  isStreamBackdropActive: boolean;
}

export const DEFAULT_GENERATED_SCENES: GeneratedSceneArtwork[] = [
  {
    id: 'art_001',
    sceneTitle: 'The Gates of the Ancient Citadel in Twilight',
    artStyle: 'OIL_PAINTING_FANTASY',
    scenePromptSummary: 'Massive obsidian battlements overlooking a mist-shrouded river valley with twin crescent moons.',
    generatedImageUrl: '/assets/illustrations/citadel_twilight.jpg',
    likesCount: 1420,
    isStreamBackdropActive: true
  },
  {
    id: 'art_002',
    sceneTitle: 'The Alchemist\'s Hidden Greenhouse',
    artStyle: 'ANIME_STUDIO_GHIBLI',
    scenePromptSummary: 'Bioluminescent mushrooms, glowing potions on wooden shelves, sunbeams filtering through ivy-covered glass.',
    generatedImageUrl: '/assets/illustrations/alchemist_greenhouse.jpg',
    likesCount: 980,
    isStreamBackdropActive: false
  }
];
