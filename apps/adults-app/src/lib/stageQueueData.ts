export interface StageSpeakerRequest {
  id: string;
  username: string;
  avatarUrl: string;
  badge: string;
  questionTopic: string;
  raisedAt: string;
  status: 'queued' | 'on_air' | 'completed' | 'declined';
  micMuted: boolean;
  timeRemainingSecs: number;
}

export const INITIAL_STAGE_QUEUE: StageSpeakerRequest[] = [
  {
    id: 'req_1',
    username: 'HermioneReads',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badge: 'Tier 3 Sub • Finished Chapter 12',
    questionTopic: 'Why didn\'t Gandalf tell Frodo about the ring sooner in the tavern?',
    raisedAt: '2m ago',
    status: 'queued',
    micMuted: false,
    timeRemainingSecs: 60
  },
  {
    id: 'req_2',
    username: 'TolkienScholar99',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badge: 'Founder • Completed Book',
    questionTopic: 'Historical parallels between Saruman\'s downfall and industrialization.',
    raisedAt: '5m ago',
    status: 'queued',
    micMuted: false,
    timeRemainingSecs: 60
  }
];
