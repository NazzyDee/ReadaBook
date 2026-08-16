export interface PronunciationEntry {
  term: string;
  phonetic: string;
  languageOrOrigin: string;
  audioSampleNote: string;
  category: 'CHARACTER' | 'LOCATION' | 'SPELL_OR_ITEM';
}

export interface CharacterVoiceNote {
  characterName: string;
  accent: string;
  pitch: string;
  mannerisms: string;
}

export const MOCK_PRONUNCIATIONS: PronunciationEntry[] = [
  {
    term: 'Smaug',
    phonetic: '[SMAWWG] (rhymes with "cow", not "smog")',
    languageOrOrigin: 'Old Norse / Dragon Lore',
    audioSampleNote: 'Deep rumble with rolling consonants.',
    category: 'CHARACTER'
  },
  {
    term: 'Galadriel',
    phonetic: '[gah-LAH-dree-el]',
    languageOrOrigin: 'Sindarin Elvish',
    audioSampleNote: 'Ethereal, measured, whisper-soft finish.',
    category: 'CHARACTER'
  },
  {
    term: 'Erebor',
    phonetic: '[EH-reh-bor]',
    languageOrOrigin: 'Dwarvish Realm',
    audioSampleNote: 'Heavy guttural roll on initial syllable.',
    category: 'LOCATION'
  },
  {
    term: 'Mithril',
    phonetic: '[MITH-ril]',
    languageOrOrigin: 'Sindarin',
    audioSampleNote: 'Soft "th" like "think", light lilt on "ril".',
    category: 'SPELL_OR_ITEM'
  }
];

export const MOCK_CHARACTER_VOICES: CharacterVoiceNote[] = [
  {
    characterName: 'Bilbo Baggins',
    accent: 'Shire English (Warm Rural West Country)',
    pitch: 'Medium-High Tenor',
    mannerisms: 'Fastidious, flustered at first, growing courage, warm hearth cadence.'
  },
  {
    characterName: 'Gandalf the Grey',
    accent: 'Ancient Classical Oxbridge Baritone',
    pitch: 'Deep Resonant Chest Baritone',
    mannerisms: 'Authoritative, sudden booming emphasis, mischievous twinkle in quiet moments.'
  },
  {
    characterName: 'Thorin Oakenshield',
    accent: 'Sturdy Northern Scottish / Dwarven Growl',
    pitch: 'Gravelly Bass',
    mannerisms: 'Proud, stubborn, majestic, measured pauses before bold proclamations.'
  }
];
