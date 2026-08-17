export interface FantasyLexiconEntry {
  id: string;
  term: string;
  phoneticSpelling: string; // e.g. "AY-gur-lorn"
  languageOrLoreOrigin: string; // e.g. "Sindarin Elvish", "High Valyrian", "Dothraki"
  definition: string;
  audioPronunciationAvailable: boolean;
}

export const DEFAULT_LEXICON_ENTRIES: FantasyLexiconEntry[] = [
  {
    id: 'lex_aiglos',
    term: 'Aeglos',
    phoneticSpelling: 'EYE-gloss',
    languageOrLoreOrigin: 'Sindarin (Elvish)',
    definition: 'The great spear of Gil-galad, High King of the Ñoldor, whose gleam made the Orcs cower.',
    audioPronunciationAvailable: true
  },
  {
    id: 'lex_mithril',
    term: 'Mithril',
    phoneticSpelling: 'MITH-ril',
    languageOrLoreOrigin: 'Sindarin (Grey-Elven)',
    definition: 'A legendary silvery metal mined in Moria, light as a feather yet stronger than hardened steel.',
    audioPronunciationAvailable: true
  },
  {
    id: 'lex_valar',
    term: 'Valar',
    phoneticSpelling: 'VAH-lahr',
    languageOrLoreOrigin: 'Quenya (High Elven)',
    definition: 'The Powers of Arda; the fourteen great angelic spirits who shaped the world under Ilúvatar.',
    audioPronunciationAvailable: true
  }
];
