export interface LoreWikiEntry {
  id: string;
  name: string;
  category: 'Character' | 'Faction' | 'Artifact' | 'Realm';
  avatarEmoji: string;
  safeIntro: string;
  spoilerContent: string;
  revealsAtPage: number; // e.g. Page 280
  affiliations: string[];
}

export const MOCK_LORE_ENTRIES: LoreWikiEntry[] = [
  {
    id: 'lore_gandalf',
    name: 'Gandalf the Grey',
    category: 'Character',
    avatarEmoji: '🧙‍♂️',
    safeIntro: 'An ancient wizard of the Istari order, bearer of the sword Glamdring and guide to the Fellowship of the Ring.',
    spoilerContent: "Falls into the abyss of Moria battling the Balrog, then resurrected as Gandalf the White with enhanced angelic authority.",
    revealsAtPage: 345,
    affiliations: ['The Fellowship', 'White Council', 'The Istari']
  },
  {
    id: 'lore_one_ring',
    name: 'The Ruling Ring',
    category: 'Artifact',
    avatarEmoji: '💍',
    safeIntro: 'A plain gold band forged in the fires of Mount Doom by Sauron to dominate the minds of Middle-earth.',
    spoilerContent: 'Possesses a corrupting sentient will; can only be unmade in the Sammath Naur cracks of Mount Doom.',
    revealsAtPage: 250,
    affiliations: ['Dark Lord Sauron', 'Isildur', 'Gollum', 'Frodo Baggins']
  },
  {
    id: 'lore_rivendell',
    name: 'Rivendell (Imladris)',
    category: 'Realm',
    avatarEmoji: '🏰',
    safeIntro: 'The Last Homely House East of the Sea, an enchanted elven sanctuary nestled in the hidden valley of the Bruinen.',
    spoilerContent: 'Protected by the hidden elven Ring of Air, Vilya, wielded by Lord Elrond.',
    revealsAtPage: 190,
    affiliations: ['House of Elrond', 'High Elves of the West']
  },
  {
    id: 'lore_strider',
    name: 'Strider (Aragorn)',
    category: 'Character',
    avatarEmoji: '🗡️',
    safeIntro: 'A grim, weathered ranger of the North encountered at The Prancing Pony inn in Bree.',
    spoilerContent: 'Is secretly Aragorn II, son of Arathorn, the rightful High King of Gondor and Arnor, destined to reforge Narsil.',
    revealsAtPage: 220,
    affiliations: ['Dúnedain of the North', 'House of Telcontar', 'The Fellowship']
  }
];
