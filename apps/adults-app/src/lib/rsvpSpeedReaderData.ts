export interface RsvpSpeedSession {
  targetWpm: number;
  chunkSizeWords: number;
  highlightCenterPivot: boolean;
  sampleSentence: string[];
  currentWordIndex: number;
  isStreamingOverlay: boolean;
}

export const DEFAULT_RSVP_SESSION: RsvpSpeedSession = {
  targetWpm: 650,
  chunkSizeWords: 1,
  highlightCenterPivot: true,
  sampleSentence: [
    'The', 'man', 'in', 'black', 'fled', 'across', 'the', 'desert,',
    'and', 'the', 'gunslinger', 'followed.', 'The', 'desert', 'was',
    'the', 'apotheosis', 'of', 'all', 'deserts,', 'huge,', 'standing',
    'to', 'the', 'sky', 'for', 'what', 'looked', 'like', 'eternity.'
  ],
  currentWordIndex: 10,
  isStreamingOverlay: true
};
