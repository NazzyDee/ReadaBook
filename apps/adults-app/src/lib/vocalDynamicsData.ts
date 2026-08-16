export interface VocalDynamicsSettings {
  compressorThresholdDb: number;
  compressorRatio: string;
  makeupGainDb: number;
  noiseGateThresholdDb: number;
  deEsserFrequencyKhz: number;
  highPassFilterHz: number;
  isGateEnabled: boolean;
  isCompressorEnabled: boolean;
  isDeEsserEnabled: boolean;
}

export const DEFAULT_VOCAL_DYNAMICS: VocalDynamicsSettings = {
  compressorThresholdDb: -22,
  compressorRatio: '3.5:1',
  makeupGainDb: 4.5,
  noiseGateThresholdDb: -48,
  deEsserFrequencyKhz: 6.8,
  highPassFilterHz: 80,
  isGateEnabled: true,
  isCompressorEnabled: true,
  isDeEsserEnabled: true
};
