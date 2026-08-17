export interface AmbientMoodProfile {
  id: string;
  moodName: string;
  weatherSound: 'GENTLE_RAIN' | 'HOWLING_BLIZZARD' | 'CRACKLING_FIREPLACE' | 'SUMMER_CICADAS';
  musicLayer: 'LOW_CELLO_DRONE' | 'LUTE_AND_HARP' | 'ORCHESTRAL_BATTLE' | 'ETHEREAL_CHOIR';
  reverbSpace: 'CATHEDRAL' | 'TAVERN' | 'COZY_CABIN' | 'CAVERN';
  intensityLevelPct: number; // 0 to 100
  isAutoAdaptingToText: boolean;
}

export const DEFAULT_AMBIENT_PROFILES: AmbientMoodProfile[] = [
  {
    id: 'mood_tavern',
    moodName: 'Warm Prancing Pony Tavern (Fireplace & Lute)',
    weatherSound: 'CRACKLING_FIREPLACE',
    musicLayer: 'LUTE_AND_HARP',
    reverbSpace: 'TAVERN',
    intensityLevelPct: 45,
    isAutoAdaptingToText: true
  },
  {
    id: 'mood_battle',
    moodName: 'The Battle of the Pelennor Fields (War Drums)',
    weatherSound: 'HOWLING_BLIZZARD',
    musicLayer: 'ORCHESTRAL_BATTLE',
    reverbSpace: 'CAVERN',
    intensityLevelPct: 85,
    isAutoAdaptingToText: false
  },
  {
    id: 'mood_rivendell',
    moodName: 'The Last Homely House (Gentle Rain & Choir)',
    weatherSound: 'GENTLE_RAIN',
    musicLayer: 'ETHEREAL_CHOIR',
    reverbSpace: 'CATHEDRAL',
    intensityLevelPct: 30,
    isAutoAdaptingToText: false
  }
];
