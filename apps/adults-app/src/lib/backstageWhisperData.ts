export interface BackstageMessage {
  id: string;
  sender: string;
  role: 'BROADCASTER' | 'CO_NARRATOR' | 'HEAD_MOD' | 'AUDIO_ENGINEER';
  text: string;
  timestamp: string;
  isUrgent?: boolean;
}

export const MOCK_BACKSTAGE_MESSAGES: BackstageMessage[] = [
  {
    id: 'bw_1',
    sender: 'Sarah_Mod',
    role: 'HEAD_MOD',
    text: 'Chat is loving the Smaug voice! Pacing is spot on at 155 WPM.',
    timestamp: '2 mins ago'
  },
  {
    id: 'bw_2',
    sender: 'SoundTech_Leo',
    role: 'AUDIO_ENGINEER',
    text: 'Lowered atmospheric reverb by -3dB for the dialogue section.',
    timestamp: '1 min ago'
  },
  {
    id: 'bw_3',
    sender: 'Marcus_Guest',
    role: 'CO_NARRATOR',
    text: 'Ready on mic 2 for Gandalf lines in Chapter 6!',
    timestamp: 'Just now',
    isUrgent: true
  }
];

export const QUICK_BACKSTAGE_CUES = [
  '⏱️ Wrap current chapter in 2 mins',
  '🎙️ Check mic level (a bit hot)',
  '🌧️ Queuing thunder foley effect',
  '☕ 5-minute hydration intermission'
];
