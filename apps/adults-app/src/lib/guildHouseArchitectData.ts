export interface GuildFurnitureItem {
  id: string;
  itemName: string;
  category: 'FURNITURE' | 'LIGHTING' | 'TROPHY_CASE' | 'ENCHANTED_DECOR';
  sparkCost: number;
  isUnlocked: boolean;
  prestigeBoost: number;
}

export const DEFAULT_GUILD_FURNITURE: GuildFurnitureItem[] = [
  {
    id: 'item_fireplace',
    itemName: 'Grand Stained-Glass Hearth of Alexandria',
    category: 'LIGHTING',
    sparkCost: 1500,
    isUnlocked: true,
    prestigeBoost: 450
  },
  {
    id: 'item_mahogany_shelves',
    itemName: 'Ancient Mahogany Rolling Library Ladder & Shelves',
    category: 'FURNITURE',
    sparkCost: 2400,
    isUnlocked: true,
    prestigeBoost: 800
  },
  {
    id: 'item_floating_candles',
    itemName: 'Great Hall Enchanted Floating Candles',
    category: 'ENCHANTED_DECOR',
    sparkCost: 3200,
    isUnlocked: false,
    prestigeBoost: 1200
  }
];
