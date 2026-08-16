export interface LoreEntity {
  id: string;
  name: string;
  type: 'character' | 'location' | 'artifact' | 'faction';
  title: string;
  avatarUrl: string;
  pronunciation: string;
  summary: string;
  spoilerSafeChapter: number;
  factionOrRealm: string;
  allies: string[];
  enemies: string[];
  keyQuote?: string;
  trivia: string[];
}

export const BOOK_LORE: Record<string, LoreEntity[]> = {
  'book_lotr': [
    {
      id: 'frodo_baggins',
      name: 'Frodo Baggins',
      type: 'character',
      title: 'Ring-Bearer of the Shire',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      pronunciation: 'FROH-doh BAG-inz',
      summary: 'A hobbit of the Shire who inherited the One Ring from his cousin Bilbo. Chosen by destiny to carry the dark burden to Mount Doom in Mordor.',
      spoilerSafeChapter: 1,
      factionOrRealm: 'The Shire / Fellowship',
      allies: ['Samwise Gamgee', 'Gandalf', 'Aragorn', 'Merry', 'Pippin'],
      enemies: ['Sauron', 'The Nazgûl', 'Saruman', 'Gollum'],
      keyQuote: '"I will take the Ring, though I do not know the way."',
      trivia: [
        'Frodo is 50 years old when he sets out from the Shire.',
        'His name comes from the Old English word "fród", meaning "wise through experience".'
      ]
    },
    {
      id: 'gandalf_the_grey',
      name: 'Gandalf the Grey',
      type: 'character',
      title: 'The Grey Pilgrim • Istari Wizard',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      pronunciation: 'GAN-dahlf',
      summary: 'An ancient Maia spirit sent to Middle-earth to inspire resistance against Sauron. Bearer of Narya, the Elven Ring of Fire.',
      spoilerSafeChapter: 1,
      factionOrRealm: 'The White Council / Order of Wizards',
      allies: ['Frodo', 'Elrond', 'Galadriel', 'Aragorn'],
      enemies: ['Sauron', 'The Balrog of Moria'],
      keyQuote: '"A wizard is never late, Frodo Baggins. Nor is he early. He arrives precisely when he means to."',
      trivia: [
        'He has walked Middle-earth for over 2,000 years in mortal guise.',
        'His horse Shadowfax is the lord of all Mearas horses.'
      ]
    },
    {
      id: 'aragorn_strider',
      name: 'Aragorn',
      type: 'character',
      title: 'Strider • Chieftain of the Dúnedain',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      pronunciation: 'AIR-uh-gorn',
      summary: 'Heir of Isildur and rightful King of Arnor and Gondor. Disguised as the ranger Strider in the tavern of Bree.',
      spoilerSafeChapter: 9,
      factionOrRealm: 'Rangers of the North / Kingdom of Gondor',
      allies: ['Gandalf', 'Legolas', 'Gimli', 'Arwen'],
      enemies: ['The Ringwraiths', 'Sauron'],
      keyQuote: '"Not all those who wander are lost."',
      trivia: [
        'Raised in secrecy by Lord Elrond in Rivendell under the name Estel ("Hope").',
        'Wields Andúril, the Flame of the West, forged from the shards of Narsil.'
      ]
    },
    {
      id: 'the_one_ring',
      name: 'The One Ring',
      type: 'artifact',
      title: 'Ruling Ring of Power • Isildur\'s Bane',
      avatarUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=80',
      pronunciation: 'Dhu Wun Ring',
      summary: 'Forged secretly by the Dark Lord Sauron in the fires of Mount Doom to dominate the other Rings of Power and enslave Middle-earth.',
      spoilerSafeChapter: 1,
      factionOrRealm: 'Mordor / Mount Doom',
      allies: [],
      enemies: ['Free Peoples of Middle-earth'],
      keyQuote: '"One Ring to rule them all, One Ring to find them, One Ring to bring them all, and in the darkness bind them."',
      trivia: [
        'Inscribed with fiery Black Speech Tengwar runes when heated.',
        'Corrupts the mind and extends the lifespan of any mortal bearer.'
      ]
    },
    {
      id: 'rivendell_imladris',
      name: 'Rivendell',
      type: 'location',
      title: 'The Last Homely House East of the Sea',
      avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
      pronunciation: 'RIV-en-del (Im-LAH-dris)',
      summary: 'A hidden Elven refuge nestled in a steep valley under the Misty Mountains, governed by Lord Elrond Half-elven.',
      spoilerSafeChapter: 11,
      factionOrRealm: 'Elves of Middle-earth',
      allies: ['The White Council', 'Dúnedain'],
      enemies: ['Orcs of the Misty Mountains', 'Angmar'],
      keyQuote: '"Here you will find rest, counsel, and a shelter from the gathering storm."',
      trivia: [
        'Protected by the power of Vilya, the Ring of Sapphire.',
        'Site of the legendary Council of Elrond where the Fellowship is formed.'
      ]
    }
  ],
  'book_dune': [
    {
      id: 'paul_atreides',
      name: 'Paul Atreides',
      type: 'character',
      title: 'Muad\'Dib • Duke of Arrakis',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      pronunciation: 'PALL uh-TRAY-deez',
      summary: 'Son of Duke Leto and Lady Jessica, trained in Bene Gesserit prana-bindu mental disciplines. Fulfills Fremen prophecies of the Kwisatz Haderach.',
      spoilerSafeChapter: 1,
      factionOrRealm: 'House Atreides / Fremen of Arrakis',
      allies: ['Lady Jessica', 'Chani', 'Stilgar', 'Gurney Halleck'],
      enemies: ['Baron Vladimir Harkonnen', 'Padishah Emperor Shaddam IV'],
      keyQuote: '"Fear is the mind-killer. Fear is the little-death that brings total obliteration."',
      trivia: [
        'Consumes spice melange to expand his prescient consciousness.',
        'Took the desert name Muad\'Dib after the agile desert mouse.'
      ]
    },
    {
      id: 'arrakis_dune',
      name: 'Arrakis',
      type: 'location',
      title: 'Dune • The Spice Planet',
      avatarUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=150&auto=format&fit=crop&q=80',
      pronunciation: 'uh-RAH-kis',
      summary: 'A desert wasteland planet and the sole source in the known universe of the precious geriatric spice melange.',
      spoilerSafeChapter: 1,
      factionOrRealm: 'Imperium / Fremen Sietches',
      allies: [],
      enemies: [],
      keyQuote: '"God created Arrakis to train the faithful."',
      trivia: [
        'Home to colossal sandworms (Shai-Hulud) exceeding 400 meters in length.',
        'Atmosphere contains zero open bodies of water; Fremen recycle moisture with stillsuits.'
      ]
    },
    {
      id: 'spice_melange',
      name: 'Spice Melange',
      type: 'artifact',
      title: 'The Geriatric Spice of Life',
      avatarUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80',
      pronunciation: 'SPICE may-LONJ',
      summary: 'A narcotic substance produced by sandworms that extends human life, turns the eyes deep blue (Eyes of Ibad), and enables Space Guild navigators to fold spacetime.',
      spoilerSafeChapter: 1,
      factionOrRealm: 'Deep Desert of Arrakis',
      allies: [],
      enemies: [],
      keyQuote: '"He who controls the spice controls the universe."',
      trivia: [
        'Smells like bitter cinnamon to newcomers.',
        'Extremely addictive; withdrawal is fatal.'
      ]
    }
  ]
};

// Global matcher helper to find lore entities by name or alias
export function findLoreEntity(wordOrPhrase: string, bookId = 'book_lotr'): LoreEntity | undefined {
  const entities = BOOK_LORE[bookId] || BOOK_LORE['book_lotr'];
  const cleaned = wordOrPhrase.toLowerCase().trim();
  return entities.find(e =>
    e.name.toLowerCase() === cleaned ||
    e.name.toLowerCase().includes(cleaned) ||
    cleaned.includes(e.name.toLowerCase()) ||
    e.title.toLowerCase().includes(cleaned)
  );
}
