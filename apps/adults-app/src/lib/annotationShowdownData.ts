export interface AnnotationMatchParticipant {
  id: string;
  streamerName: string;
  score: number;
  annotationsCount: number;
  accuracyRatingPct: number;
  topThemeIdentified: string;
}

export interface AnnotationShowdownMatch {
  matchId: string;
  excerptTitle: string;
  timeRemainingSeconds: number;
  isMatchActive: boolean;
  participantA: AnnotationMatchParticipant;
  participantB: AnnotationMatchParticipant;
  audienceVoteWinner: 'A' | 'B' | 'TIE';
}

export const DEFAULT_ANNOTATION_MATCH: AnnotationShowdownMatch = {
  matchId: 'match_battle_01',
  excerptTitle: 'The Opening Stanza of Beowulf & Heorot Hall',
  timeRemainingSeconds: 74,
  isMatchActive: true,
  participantA: {
    id: 'p_nazzy',
    streamerName: 'NazzyDee',
    score: 1420,
    annotationsCount: 14,
    accuracyRatingPct: 96,
    topThemeIdentified: 'Alliterative Germanic Kinship & Fate (Wyrd)'
  },
  participantB: {
    id: 'p_elena',
    streamerName: 'Elena Rostova',
    score: 1380,
    annotationsCount: 12,
    accuracyRatingPct: 94,
    topThemeIdentified: 'Pagan-Christian Syncretism in Scyld Scefing'
  },
  audienceVoteWinner: 'A'
};
