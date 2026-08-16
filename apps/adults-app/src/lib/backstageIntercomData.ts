export interface IntercomCrewMember {
  id: string;
  name: string;
  role: 'LEAD_PRODUCER' | 'HEAD_MODERATOR' | 'SOUND_ENGINEER' | 'GUEST_HOST';
  avatarUrl: string;
  isPushToTalkActive: boolean;
  channel: 'MAIN_STAGE_EARPIECE' | 'MOD_ONLY_WHISPER' | 'DIRECTOR_DESK';
}

export const DEFAULT_CREW_MEMBERS: IntercomCrewMember[] = [
  {
    id: 'crew_producer',
    name: 'Sarah (Show Producer)',
    role: 'LEAD_PRODUCER',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&auto=format&fit=crop&q=80',
    isPushToTalkActive: false,
    channel: 'MAIN_STAGE_EARPIECE'
  },
  {
    id: 'crew_audio_tech',
    name: 'Marcus (Audio Engineer)',
    role: 'SOUND_ENGINEER',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&auto=format&fit=crop&q=80',
    isPushToTalkActive: false,
    channel: 'DIRECTOR_DESK'
  },
  {
    id: 'crew_head_mod',
    name: 'Elena (Lore Warden Mod)',
    role: 'HEAD_MODERATOR',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&auto=format&fit=crop&q=80',
    isPushToTalkActive: false,
    channel: 'MOD_ONLY_WHISPER'
  }
];
