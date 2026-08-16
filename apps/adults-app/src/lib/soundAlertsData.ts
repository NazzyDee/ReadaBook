export interface SoundAlert {
  id: string;
  name: string;
  category: 'Dramatic' | 'Atmospheric' | 'Comedic' | 'Fantasy';
  pointsCost: number;
  icon: string;
  description: string;
  soundType: 'pop' | 'applause' | 'thunder' | 'harp' | 'dragon' | 'pageRustle';
  durationSeconds: number;
}

export const SOUND_ALERTS: SoundAlert[] = [
  {
    id: 'alert_thunder',
    name: 'Dramatic Thunder Strike',
    category: 'Dramatic',
    pointsCost: 250,
    icon: '⚡',
    description: 'Trigger a lightning crash and ominous storm rumble on the broadcast.',
    soundType: 'thunder',
    durationSeconds: 3.5
  },
  {
    id: 'alert_dragon_roar',
    name: 'Dragon Roar & Flames',
    category: 'Fantasy',
    pointsCost: 500,
    icon: '🐉',
    description: 'Play a terrifying primal dragon roar that shakes the live stream audio.',
    soundType: 'dragon',
    durationSeconds: 4.0
  },
  {
    id: 'alert_elven_harp',
    name: 'Elven Celestial Harp',
    category: 'Atmospheric',
    pointsCost: 350,
    icon: '🎶',
    description: 'Play a serene glissando harp melody during beautiful story scenes.',
    soundType: 'harp',
    durationSeconds: 4.5
  },
  {
    id: 'alert_applause',
    name: 'Audience Grand Standing Ovation',
    category: 'Dramatic',
    pointsCost: 400,
    icon: '👏',
    description: 'Cheer the narrator with a roaring standing ovation and whistling.',
    soundType: 'applause',
    durationSeconds: 3.0
  },
  {
    id: 'alert_page_rustle',
    name: 'Ancient Manuscript Rustle',
    category: 'Atmospheric',
    pointsCost: 150,
    icon: '📜',
    description: 'ASMR parchment paper and turning leaf audio trigger.',
    soundType: 'pageRustle',
    durationSeconds: 2.0
  },
  {
    id: 'alert_plot_twist',
    name: 'Plot Twist Brass Stinger',
    category: 'Dramatic',
    pointsCost: 300,
    icon: '😱',
    description: 'Shocking cinematic brass hit for unexpected plot revelations.',
    soundType: 'pop',
    durationSeconds: 2.5
  }
];

export interface SoundAlertRedemption {
  id: string;
  username: string;
  avatarUrl: string;
  alertName: string;
  alertIcon: string;
  pointsSpent: number;
  timestamp: string;
}
