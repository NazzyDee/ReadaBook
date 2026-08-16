export interface CoStreamRoleAssignment {
  characterName: string;
  assignedStreamer: string;
  voiceStyle: string;
  color: string;
  dialogueCount: number;
}

export const MOCK_CO_STREAM_ROLES: CoStreamRoleAssignment[] = [
  {
    characterName: 'Narrator / Third-Person Voice',
    assignedStreamer: 'Host (You)',
    voiceStyle: 'Grounded, warm, descriptive baritone',
    color: '#ffd700',
    dialogueCount: 42
  },
  {
    characterName: 'Gandalf the Grey',
    assignedStreamer: 'GrimNarrator',
    voiceStyle: 'Gravelly, resonant, commanding ancient wisdom',
    color: '#00b4d8',
    dialogueCount: 18
  },
  {
    characterName: 'Bilbo Baggins',
    assignedStreamer: 'LillysNumberOneFan',
    voiceStyle: 'Nervous, quick-witted, cheerful hobbit tenor',
    color: '#00ff88',
    dialogueCount: 26
  },
  {
    characterName: 'Smaug the Magnificent',
    assignedStreamer: 'NovelScholar',
    voiceStyle: 'Deep, rumbling, sinister reptilian hiss with reverb',
    color: '#ff0055',
    dialogueCount: 12
  }
];

export const MOCK_AVAILABLE_CO_HOSTS = [
  'Host (You)',
  'GrimNarrator',
  'LillysNumberOneFan',
  'NovelScholar',
  'BookWorm_42'
];
