export interface ColdReadAuditioner {
  id: string;
  viewerHandle: string;
  roleTarget: string; // e.g. "Severus Snape", "Lady Macbeth"
  dramaticScore: number;
  emotionalRangePct: number;
  judgeVotesCount: number;
  hasAudienceSelected: boolean;
}

export const DEFAULT_COLD_READ_AUDITIONERS: ColdReadAuditioner[] = [
  {
    id: 'aud_01',
    viewerHandle: 'ThespianGamer',
    roleTarget: 'Gollum / Sméagol Dual Argument',
    dramaticScore: 98,
    emotionalRangePct: 96,
    judgeVotesCount: 412,
    hasAudienceSelected: true
  },
  {
    id: 'aud_02',
    viewerHandle: 'BardicWhisper',
    roleTarget: 'Lady Macbeth Sleepwalking Scene',
    dramaticScore: 92,
    emotionalRangePct: 91,
    judgeVotesCount: 320,
    hasAudienceSelected: false
  },
  {
    id: 'aud_03',
    viewerHandle: 'VoiceMasterAlex',
    roleTarget: 'Sherlock Holmes Deduction Monologue',
    dramaticScore: 89,
    emotionalRangePct: 88,
    judgeVotesCount: 284,
    hasAudienceSelected: false
  }
];
