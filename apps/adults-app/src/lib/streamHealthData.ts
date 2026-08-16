export interface StreamHealthMetrics {
  streamStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  videoBitrateKbps: number;
  audioBitrateKbps: number;
  frameRateFps: number;
  resolution: string;
  lufsLoudness: number; // Target -16 LUFS
  dynamicRangeDb: number;
  ingestLatencyMs: number;
  droppedFramesPercent: number;
  codec: string;
  serverRegion: string;
}

export const MOCK_STREAM_HEALTH: StreamHealthMetrics = {
  streamStatus: 'Excellent',
  videoBitrateKbps: 6020,
  audioBitrateKbps: 320,
  frameRateFps: 60,
  resolution: '1920x1080 (1080p60)',
  lufsLoudness: -16.2,
  dynamicRangeDb: 14.5,
  ingestLatencyMs: 1180,
  droppedFramesPercent: 0.01,
  codec: 'H.264 / Opus 48kHz Stereo (High Fidelity)',
  serverRegion: 'US-East (Virginia WebRTC Edge)'
};
