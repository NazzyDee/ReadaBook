export interface StretchMilestone {
  id: string;
  milestoneTarget: number;
  rewardTitle: string;
  rewardDescription: string;
  isUnlocked: boolean;
  unlockedAtPercent: number;
}

export interface CommunityReadingGoal {
  id: string;
  title: string;
  category: 'pages_read' | 'subscriber_count' | 'books_finished';
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  description: string;
  milestones: StretchMilestone[];
}

export const MOCK_COMMUNITY_GOALS: CommunityReadingGoal[] = [
  {
    id: 'goal_fantasy_pages_august',
    title: 'High Fantasy August: 10,000 Community Pages',
    category: 'pages_read',
    currentValue: 7420,
    targetValue: 10000,
    unit: 'Pages Read Together',
    deadline: 'August 31, 2026',
    description: 'Every chapter read live on stream or logged by viewers contributes to this community milestone!',
    milestones: [
      {
        id: 'm1',
        milestoneTarget: 2500,
        rewardTitle: '🎨 3 Exclusive Discord Book Runes Emotes',
        rewardDescription: 'Unlocked custom rune emotes for all active channel subscribers.',
        isUnlocked: true,
        unlockedAtPercent: 25
      },
      {
        id: 'm2',
        milestoneTarget: 5000,
        rewardTitle: '🎙️ Live Author Q&A Guest Stream',
        rewardDescription: 'Special guest co-read and live AMA with the fantasy author.',
        isUnlocked: true,
        unlockedAtPercent: 50
      },
      {
        id: 'm3',
        milestoneTarget: 7500,
        rewardTitle: '☕ 12-Hour Weekend Reading Marathon',
        rewardDescription: 'Non-stop weekend read-a-thon with guest narrator squad shifts.',
        isUnlocked: false,
        unlockedAtPercent: 75
      },
      {
        id: 'm4',
        milestoneTarget: 10000,
        rewardTitle: '🧙 Full Gandalf / Gollum Voice Cosplay Stream',
        rewardDescription: 'Streamer performs the entire climax in full theatrical wizard cosplay.',
        isUnlocked: false,
        unlockedAtPercent: 100
      }
    ]
  }
];
