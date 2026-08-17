export interface HardcoverCustomization {
  coverMaterial: 'MIDNIGHT_ITALIAN_LEATHER' | 'EMERALD_BUCKRAM_CLOTH' | 'ROYAL_PURPLE_VELVET';
  foilColor: '24K_GOLD' | 'HOLOGRAPHIC_SILVER' | 'ROSE_COPPER';
  ribbonColor: 'CRIMSON' | 'GOLD' | 'FOREST_GREEN';
  sprayedEdgePattern: 'GALAXY_STARS' | 'DRAGON_SCALES' | 'SOLID_BLACK_MATTE';
  customEmbossedTitle: string;
  estimatedPriceUSD: number;
}

export const DEFAULT_HARDCOVER_CONFIG: HardcoverCustomization = {
  coverMaterial: 'MIDNIGHT_ITALIAN_LEATHER',
  foilColor: '24K_GOLD',
  ribbonColor: 'GOLD',
  sprayedEdgePattern: 'DRAGON_SCALES',
  customEmbossedTitle: 'The Chronicler\'s Grimoire: Vol. 1',
  estimatedPriceUSD: 85.00
};
