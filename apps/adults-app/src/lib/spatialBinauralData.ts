export interface SpatialSoundSource {
  id: string;
  sourceName: string;
  posX: number; // -100 (left) to 100 (right)
  posY: number; // -100 (behind) to 100 (front)
  reverbSize: number; // 0 to 100
  hrtfFilterEnabled: boolean;
  sourceType: 'NARRATOR' | 'FOLEY_ATMOSPHERE' | 'SOUNDTRACK' | 'WHISPER';
}

export const DEFAULT_SPATIAL_SOURCES: SpatialSoundSource[] = [
  {
    id: 'src_narrator',
    sourceName: 'Narrator Direct Vocal (Front Center)',
    posX: 0,
    posY: 70,
    reverbSize: 15,
    hrtfFilterEnabled: true,
    sourceType: 'NARRATOR'
  },
  {
    id: 'src_rain_foley',
    sourceName: '360° Ambient Storm & Rain Canopy',
    posX: -60,
    posY: -40,
    reverbSize: 65,
    hrtfFilterEnabled: true,
    sourceType: 'FOLEY_ATMOSPHERE'
  },
  {
    id: 'src_whisper_ghost',
    sourceName: 'Left Ear Intimate Ghostly Whisper',
    posX: -85,
    posY: 10,
    reverbSize: 20,
    hrtfFilterEnabled: true,
    sourceType: 'WHISPER'
  }
];
