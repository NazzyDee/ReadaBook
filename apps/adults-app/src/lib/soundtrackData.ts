export interface SoundtrackSettings {
  nowPlayingTitle: string;
  nowPlayingArtist: string;
  playlistName: string;
  source: 'SPOTIFY' | 'BUILTIN_DMCA_FREE' | 'APPLE_MUSIC';
  volumePercent: number;
  isVoiceDuckingEnabled: boolean;
  duckingAmountDb: number;
  duckingSpeedMs: number;
  showNowPlayingOverlay: boolean;
}

export const DEFAULT_SOUNDTRACK_SETTINGS: SoundtrackSettings = {
  nowPlayingTitle: 'Concerning Hobbits (Acoustic Guitar Cover)',
  nowPlayingArtist: 'Fantasy Lore Ensemble',
  playlistName: 'Tolkien Hearth & Lo-Fi Beats',
  source: 'BUILTIN_DMCA_FREE',
  volumePercent: 45,
  isVoiceDuckingEnabled: true,
  duckingAmountDb: -18,
  duckingSpeedMs: 250,
  showNowPlayingOverlay: true
};

export const DMCA_FREE_PLAYLISTS = [
  { id: 'pl_lofi', name: '📖 Lo-Fi Study & Reading Beats', trackCount: 64, icon: '☕' },
  { id: 'pl_orchestral', name: '⚔️ Epic High Fantasy Orchestral', trackCount: 42, icon: '🎻' },
  { id: 'pl_gothic', name: '🔮 Gothic Mystery & Suspense Strings', trackCount: 38, icon: '🕯️' },
  { id: 'pl_rain', name: '🌧️ Windowpane Rain & Hearth Fire', trackCount: 18, icon: '🪵' }
];
