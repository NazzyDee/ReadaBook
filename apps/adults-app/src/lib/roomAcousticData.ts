export interface AcousticProfile {
  id: string;
  name: string;
  roomType: string;
  reverbSuppressionDb: number;
  mouthClickFilter: boolean;
  pageTurnDeEsser: boolean;
  noiseFloorDb: number;
}

export const DEFAULT_ACOUSTIC_PROFILES: AcousticProfile[] = [
  {
    id: 'prof_home_library',
    name: 'Hardwood Bookshop & Library',
    roomType: 'Mild Echo / Hardwood Surfaces',
    reverbSuppressionDb: -18,
    mouthClickFilter: true,
    pageTurnDeEsser: true,
    noiseFloorDb: -52
  },
  {
    id: 'prof_padded_booth',
    name: 'Studio Foam Isolation Booth',
    roomType: 'Treated Vocal Booth',
    reverbSuppressionDb: -6,
    mouthClickFilter: true,
    pageTurnDeEsser: false,
    noiseFloorDb: -68
  },
  {
    id: 'prof_open_room',
    name: 'Open Living Room / High Ceilings',
    roomType: 'High Reverb / Ambient Noise',
    reverbSuppressionDb: -26,
    mouthClickFilter: true,
    pageTurnDeEsser: true,
    noiseFloorDb: -44
  }
];
