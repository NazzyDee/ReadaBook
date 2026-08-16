export interface CastSlot {
  id: string;
  roleName: string;
  characterName: string;
  voiceActorName: string;
  avatarUrl: string;
  panPosition: number; // -100 (left) to 100 (right)
  volumeLevel: number; // 0 to 100
  eqPreset: 'WARM_MALE' | 'BRIGHT_FEMALE' | 'DEEP_CREATURE' | 'WHISPER';
  isMuted: boolean;
  isActiveSpeaker: boolean;
}

export const DEFAULT_CAST_SLOTS: CastSlot[] = [
  {
    id: 'slot_narrator',
    roleName: 'Main Narrator',
    characterName: 'Omniscient Chronicler',
    voiceActorName: 'LordOfLore',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80',
    panPosition: 0,
    volumeLevel: 95,
    eqPreset: 'WARM_MALE',
    isMuted: false,
    isActiveSpeaker: true
  },
  {
    id: 'slot_gandalf',
    roleName: 'Lead Wizard',
    characterName: 'Gandalf the Grey',
    voiceActorName: 'GuestStar_Ian',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80',
    panPosition: -45,
    volumeLevel: 90,
    eqPreset: 'DEEP_CREATURE',
    isMuted: false,
    isActiveSpeaker: false
  },
  {
    id: 'slot_frodo',
    roleName: 'Protagonist',
    characterName: 'Frodo Baggins',
    voiceActorName: 'Elijah_Voice',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&auto=format&fit=crop&q=80',
    panPosition: 40,
    volumeLevel: 88,
    eqPreset: 'BRIGHT_FEMALE',
    isMuted: false,
    isActiveSpeaker: false
  },
  {
    id: 'slot_gollum',
    roleName: 'Creature Voice',
    characterName: 'Gollum / Sméagol',
    voiceActorName: 'Andy_Foley',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&auto=format&fit=crop&q=80',
    panPosition: -80,
    volumeLevel: 85,
    eqPreset: 'WHISPER',
    isMuted: false,
    isActiveSpeaker: false
  }
];
