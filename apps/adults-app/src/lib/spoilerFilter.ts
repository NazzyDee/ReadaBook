export interface SpoilerRule {
  keyword: string;
  chapter: number;
  description: string;
}

export const BOOK_SPOILER_RULES: Record<string, SpoilerRule[]> = {
  'book_lotr': [
    { keyword: 'boromir death', chapter: 22, description: 'Boromir falls defending Merry and Pippin' },
    { keyword: 'boromir dies', chapter: 22, description: 'Boromir death' },
    { keyword: 'gandalf falls', chapter: 14, description: 'Gandalf battle with the Balrog in Moria' },
    { keyword: 'balrog', chapter: 14, description: 'Balrog encounter in Khazad-dûm' },
    { keyword: 'strider is aragorn', chapter: 10, description: 'Aragorn true identity reveal' },
    { keyword: 'isildur heir', chapter: 10, description: 'Aragorn royal bloodline' },
    { keyword: 'saruman traitor', chapter: 12, description: 'Saruman corruption by Sauron' },
    { keyword: 'gollum takes the ring', chapter: 24, description: 'Climax at Mount Doom' }
  ],
  'book_dune': [
    { keyword: 'leto death', chapter: 14, description: 'Duke Leto betrayal and death' },
    { keyword: 'yueh traitor', chapter: 13, description: 'Dr. Yueh betrayal of House Atreides' },
    { keyword: 'kwisatz haderach', chapter: 15, description: 'Paul prescient awakening' },
    { keyword: 'harkonnen defeated', chapter: 28, description: 'Battle of Arrakeen climax' }
  ]
};

export interface SpoilerCheckResult {
  hasSpoiler: boolean;
  spoilerChapter?: number;
  matchedKeyword?: string;
  maskedText: string;
}

export function filterSpoilers(
  text: string,
  currentStreamChapter = 2,
  userMaxChapter = 2,
  bookId = 'book_lotr'
): SpoilerCheckResult {
  const rules = BOOK_SPOILER_RULES[bookId] || BOOK_SPOILER_RULES['book_lotr'];
  const lower = text.toLowerCase();

  for (const rule of rules) {
    if (lower.includes(rule.keyword.toLowerCase())) {
      // If the spoiler is from a chapter ahead of the user or streamer
      const threshold = Math.max(currentStreamChapter, userMaxChapter);
      if (rule.chapter > threshold) {
        return {
          hasSpoiler: true,
          spoilerChapter: rule.chapter,
          matchedKeyword: rule.keyword,
          maskedText: text
        };
      }
    }
  }

  return {
    hasSpoiler: false,
    maskedText: text
  };
}
