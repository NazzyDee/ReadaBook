export interface AudioBusRoute {
  id: string;
  name: string;
  streamMixVolume: number;
  headphonesMonitorVolume: number;
  isStreamMuted: boolean;
  isHeadphonesMuted: boolean;
}

export const DEFAULT_AUDIO_BUS_ROUTES: AudioBusRoute[] = [
  {
    id: 'bus_narrator_mic',
    name: 'Narrator Main Mic (Shure SM7B)',
    streamMixVolume: 90,
    headphonesMonitorVolume: 75,
    isStreamMuted: false,
    isHeadphonesMuted: false
  },
  {
    id: 'bus_foley_soundboard',
    name: 'Atmospheric Foley & Soundboard',
    streamMixVolume: 70,
    headphonesMonitorVolume: 50,
    isStreamMuted: false,
    isHeadphonesMuted: false
  },
  {
    id: 'bus_ambient_soundtrack',
    name: 'Background Ambient Soundtrack (Spotify/Deck)',
    streamMixVolume: 45,
    headphonesMonitorVolume: 30,
    isStreamMuted: false,
    isHeadphonesMuted: false
  },
  {
    id: 'bus_director_talkback',
    name: 'Co-Host / Stage Director Talkback',
    streamMixVolume: 0, // Never sent to live audience
    headphonesMonitorVolume: 85,
    isStreamMuted: true,
    isHeadphonesMuted: false
  },
  {
    id: 'bus_pacing_metronome',
    name: 'Syllable Metronome Pacer Click',
    streamMixVolume: 0, // Broadcaster only
    headphonesMonitorVolume: 40,
    isStreamMuted: true,
    isHeadphonesMuted: false
  }
];
