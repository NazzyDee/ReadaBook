export interface AudioChannelConfig {
  channelId: string;
  name: string;
  role: 'Host' | 'Guest' | 'Foley SFX' | 'Music';
  volume: number; // 0 to 100
  isMuted: boolean;
  pan: number; // -50 (L) to +50 (R)
  noiseGateThresholdDb: number;
}

export interface DualAudioMixerState {
  hostChannel: AudioChannelConfig;
  guestChannel: AudioChannelConfig;
  foleyChannel: AudioChannelConfig;
  isAutoDuckingEnabled: boolean;
  duckingAttenuationDb: number;
}

export const DEFAULT_DUAL_AUDIO_STATE: DualAudioMixerState = {
  hostChannel: {
    channelId: 'ch_host',
    name: 'Host Mic (Narrator)',
    role: 'Host',
    volume: 90,
    isMuted: false,
    pan: 0,
    noiseGateThresholdDb: -42
  },
  guestChannel: {
    channelId: 'ch_guest',
    name: 'Guest Co-Reader (Discord / Stage)',
    role: 'Guest',
    volume: 85,
    isMuted: false,
    pan: 15,
    noiseGateThresholdDb: -40
  },
  foleyChannel: {
    channelId: 'ch_foley',
    name: 'Ambient Foley & Hearth FX',
    role: 'Foley SFX',
    volume: 45,
    isMuted: false,
    pan: 0,
    noiseGateThresholdDb: -60
  },
  isAutoDuckingEnabled: true,
  duckingAttenuationDb: -14
};
