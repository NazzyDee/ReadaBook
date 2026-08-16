export interface VocalExercise {
  id: string;
  name: string;
  category: 'Breathing' | 'Articulation' | 'Resonance' | 'Hydration';
  instructions: string;
  samplePhrase?: string;
  durationSeconds: number;
  icon: string;
}

export const MOCK_VOCAL_WARMUPS: VocalExercise[] = [
  {
    id: 'ex_lip_trills',
    name: 'Diaphragmatic Lip Trills',
    category: 'Breathing',
    instructions: 'Blow air through relaxed lips to create a motorboat sound, gliding up and down your pitch range.',
    durationSeconds: 45,
    icon: '💨'
  },
  {
    id: 'ex_tongue_twister',
    name: 'Literary Articulation Twister',
    category: 'Articulation',
    instructions: 'Repeat clearly at increasing tempos with exaggerated consonants.',
    samplePhrase: '“Six thick thistle sticks. Six thick thistle sticks.”',
    durationSeconds: 60,
    icon: '🗣️'
  },
  {
    id: 'ex_sirens',
    name: 'Resonance Sirens & Hums',
    category: 'Resonance',
    instructions: 'Hum gently on an “Mmm” sound, feeling the vibration in the mask of your face from low to high pitch.',
    durationSeconds: 45,
    icon: '🎵'
  },
  {
    id: 'ex_throat_tea',
    name: 'Throat Coat & Herbal Hydration Recipe',
    category: 'Hydration',
    instructions: 'Sip warm water with honey and slippery elm bark tea. Avoid dairy or iced drinks 30 mins before broadcast.',
    durationSeconds: 30,
    icon: '🍵'
  }
];
