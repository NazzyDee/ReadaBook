export interface CraftingRecipe {
  id: string;
  artifactName: string;
  buffDescription: string;
  durationMinutes: number;
  requiredMaterials: { materialName: string; count: number; userHasCount: number }[];
  isCraftable: boolean;
}

export const DEFAULT_CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'recipe_xp_scroll',
    artifactName: 'Scroll of Double Scribe XP (2hr)',
    buffDescription: 'Doubles all reading sprint XP and Battle Pass progress for 2 hours.',
    durationMinutes: 120,
    requiredMaterials: [
      { materialName: 'Vellum Shards', count: 3, userHasCount: 8 },
      { materialName: 'Dragon Bile Ink', count: 1, userHasCount: 2 }
    ],
    isCraftable: true
  },
  {
    id: 'recipe_rainbow_pen',
    artifactName: 'Enchanted Prismatic Quill',
    buffDescription: 'Transforms all on-screen highlight annotations into glowing rainbow gradients.',
    durationMinutes: 60,
    requiredMaterials: [
      { materialName: 'Gold Leaf Flakes', count: 5, userHasCount: 12 },
      { materialName: 'Phoenix Feather Quill', count: 1, userHasCount: 1 }
    ],
    isCraftable: true
  },
  {
    id: 'recipe_shield_ward',
    artifactName: 'Ward of Silence & Focus',
    buffDescription: 'Mutes all chat sound effects for pure zen deep-reading meditation.',
    durationMinutes: 180,
    requiredMaterials: [
      { materialName: 'Runestone Pebble', count: 2, userHasCount: 1 },
      { materialName: 'Vellum Shards', count: 4, userHasCount: 8 }
    ],
    isCraftable: false
  }
];
