export interface RadioTrack {
  id: string;
  title: string;
  artist: string;
  ambienceMix: string;
  durationMin: number;
}

export interface PomodoroSession {
  mode: 'STUDY_FOCUS' | 'COZY_BREAK';
  timeRemainingSec: number;
  totalStudyMinToday: number;
  activeReadersCount: number;
}

export const DEFAULT_RADIO_TRACKS: RadioTrack[] = [
  {
    id: 'track_lofi_rain',
    title: 'Rainy Night in Oxford Library',
    artist: 'Archivist Chillhop Collective',
    ambienceMix: 'Heavy Rain on Glass + Crackling Fireplace',
    durationMin: 25
  },
  {
    id: 'track_tavern_lute',
    title: 'Prancing Pony Hearthside Ballad',
    artist: 'Bree Tavern String Ensemble',
    ambienceMix: 'Muffled Murmurs + Gentle Lute Strings',
    durationMin: 25
  },
  {
    id: 'track_cosmic_synth',
    title: 'Arrakis Starlit Astronomy Chamber',
    artist: 'Deep Space Synthesizer Guild',
    ambienceMix: 'Subtle Desert Wind + Warm Analog Drone',
    durationMin: 25
  }
];

export const DEFAULT_POMODORO_SESSION: PomodoroSession = {
  mode: 'STUDY_FOCUS',
  timeRemainingSec: 1420,
  totalStudyMinToday: 135,
  activeReadersCount: 486
};
