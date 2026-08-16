export interface TtsCharacterVoice {
  id: string;
  name: string;
  archetype: string;
  avatarEmoji: string;
  sampleAudioGreeting: string;
  minSparksRequired: number;
  pitch: number;
  speed: number;
  color: string;
}

export const LITERARY_TTS_VOICES: TtsCharacterVoice[] = [
  {
    id: 'tts_wizard',
    name: 'Sir Ian the Grand Archmage',
    archetype: 'Wise, booming, ancient mystical baritone',
    avatarEmoji: '🧙‍♂️',
    sampleAudioGreeting: '“Hark, mortal listener! Your generosity illuminates the darkest pages of our grand quest!”',
    minSparksRequired: 100,
    pitch: 0.9,
    speed: 0.95,
    color: '#00b4d8'
  },
  {
    id: 'tts_sorceress',
    name: 'Lady Morgana the Enchanter',
    archetype: 'Velvety, enchanting, seductive gothic alto',
    avatarEmoji: '🔮',
    sampleAudioGreeting: '“Shadows dance in your honor. Thank you for fueling the fires of this dark romance.”',
    minSparksRequired: 250,
    pitch: 1.1,
    speed: 1.0,
    color: '#9d4edd'
  },
  {
    id: 'tts_goblin',
    name: 'Gribble the Goblin Scribe',
    archetype: 'Chaotic, squeaky, mischievous impish tenor',
    avatarEmoji: '👺',
    sampleAudioGreeting: '“Shiny shiny gold sparks for the book box! Gribble write your name in goblin ink!”',
    minSparksRequired: 500,
    pitch: 1.4,
    speed: 1.25,
    color: '#00ff88'
  },
  {
    id: 'tts_eldritch',
    name: 'The Whispering Tome of Cthulhu',
    archetype: 'Deep binaural eldritch whisper with cosmic dread',
    avatarEmoji: '👁️',
    sampleAudioGreeting: '“Ph’nglui mglw’nafh... the words awaken from their centuries of slumber.”',
    minSparksRequired: 1000,
    pitch: 0.7,
    speed: 0.85,
    color: '#ff0055'
  }
];
