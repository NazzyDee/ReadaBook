export interface StreamQualityProfile {
  id: string;
  name: string;
  badge: string;
  videoResolution: string;
  audioBitrateKbps: number;
  latencySeconds: number;
  dataUsagePerHour: string;
  isAudioOnly: boolean;
}

export const STREAM_QUALITY_PROFILES: StreamQualityProfile[] = [
  {
    id: 'prof_ultra_low',
    name: 'Ultra-Low Latency Interactive Mode',
    badge: '⚡ Real-Time CYOA',
    videoResolution: '1080p60 Source',
    audioBitrateKbps: 320,
    latencySeconds: 1.2,
    dataUsagePerHour: '2.8 GB / hr',
    isAudioOnly: false
  },
  {
    id: 'prof_studio_master',
    name: 'Studio Master High-Fidelity',
    badge: '🎙️ Audiophile 320k',
    videoResolution: '1080p60 HD',
    audioBitrateKbps: 320,
    latencySeconds: 3.5,
    dataUsagePerHour: '2.5 GB / hr',
    isAudioOnly: false
  },
  {
    id: 'prof_balanced',
    name: 'Standard Balanced Stream',
    badge: '📶 Default',
    videoResolution: '720p60 HD',
    audioBitrateKbps: 192,
    latencySeconds: 4.0,
    dataUsagePerHour: '1.4 GB / hr',
    isAudioOnly: false
  },
  {
    id: 'prof_audio_only',
    name: 'Audio-Only Commuter Podcast Mode',
    badge: '🚗 Saves 95% Data',
    videoResolution: 'Disabled (Audio Only)',
    audioBitrateKbps: 128,
    latencySeconds: 2.0,
    dataUsagePerHour: '0.06 GB / hr',
    isAudioOnly: true
  }
];
