export interface WpmHistoryRecord {
  minute: number;
  wpm: number;
  targetGenreWpm: number;
  cadenceState: 'OPTIMAL' | 'RUSHING' | 'DRAGGING';
  sceneContext: string;
}

export const DEFAULT_WPM_HISTORY: WpmHistoryRecord[] = [
  {
    minute: 5,
    wpm: 145,
    targetGenreWpm: 150,
    cadenceState: 'OPTIMAL',
    sceneContext: 'Tavern exposition dialogue with Butterbur'
  },
  {
    minute: 10,
    wpm: 185,
    targetGenreWpm: 150,
    cadenceState: 'RUSHING',
    sceneContext: 'Black Rider cloaked entrance at the gate'
  },
  {
    minute: 15,
    wpm: 110,
    targetGenreWpm: 140,
    cadenceState: 'DRAGGING',
    sceneContext: 'Whispered poem recitation ("All that is gold does not glitter")'
  },
  {
    minute: 20,
    wpm: 152,
    targetGenreWpm: 150,
    cadenceState: 'OPTIMAL',
    sceneContext: 'Strider guides hobbits through the Midgewater Marshes'
  }
];
