export interface PianoNoteKey {
  note: string;
  freq: number;
  label: string;
  isBlack?: boolean;
}

export const PIANO_SCALE_KEYS: PianoNoteKey[] = [
  { note: 'C4', freq: 261.63, label: 'Do' },
  { note: 'C#4', freq: 277.18, label: 'Do#', isBlack: true },
  { note: 'D4', freq: 293.66, label: 'Re' },
  { note: 'D#4', freq: 311.13, label: 'Re#', isBlack: true },
  { note: 'E4', freq: 329.63, label: 'Mi' },
  { note: 'F4', freq: 349.23, label: 'Fa' },
  { note: 'F#4', freq: 369.99, label: 'Fa#', isBlack: true },
  { note: 'G4', freq: 392.00, label: 'Sol' },
  { note: 'G#4', freq: 415.30, label: 'Sol#', isBlack: true },
  { note: 'A4', freq: 440.00, label: 'La' },
  { note: 'A#4', freq: 466.16, label: 'La#', isBlack: true },
  { note: 'B4', freq: 493.88, label: 'Ti' },
  { note: 'C5', freq: 523.25, label: 'Do (High)' }
];

export const TONGUE_TWISTERS = [
  'Peter Piper picked a peck of pickled Palantíri.',
  'Seven slimy serpents slithered silently through Smaug’s silver stronghold.',
  'A proper cup of coffee from a copper dragon coffeepot.'
];
