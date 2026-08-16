export interface CastMember {
  id: string;
  characterName: string;
  characterTagline: string;
  assignedActorName: string;
  assignedActorAvatar: string;
  isSpeaking: boolean;
  voiceStyle: string;
}

export const MOCK_CAST_MATRIX: CastMember[] = [
  {
    id: 'cast_narrator',
    characterName: 'The Narrator',
    characterTagline: 'World Exposition & Scene Transitions',
    assignedActorName: 'LillyReads',
    assignedActorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isSpeaking: true,
    voiceStyle: 'Melodic, British Received Pronunciation'
  },
  {
    id: 'cast_frodo',
    characterName: 'Frodo Baggins',
    characterTagline: 'The Ring-bearer',
    assignedActorName: 'NovelScholar',
    assignedActorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isSpeaking: false,
    voiceStyle: 'Gentle, earnest Shire cadence'
  },
  {
    id: 'cast_gandalf',
    characterName: 'Gandalf the Grey',
    characterTagline: 'The Wandering Wizard',
    assignedActorName: 'GrimNarrator',
    assignedActorAvatar: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=200&q=80',
    isSpeaking: false,
    voiceStyle: 'Deep, resonant, booming authority'
  },
  {
    id: 'cast_samwise',
    characterName: 'Samwise Gamgee',
    characterTagline: 'Loyal Companion & Gardener',
    assignedActorName: 'BookWorm_42',
    assignedActorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isSpeaking: false,
    voiceStyle: 'Warm West Country rural dialect'
  }
];
