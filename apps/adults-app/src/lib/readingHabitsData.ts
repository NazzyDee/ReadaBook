export interface ReadingHabitsProfile {
  currentStreakDays: number;
  longestStreakDays: number;
  todayMinutesRead: number;
  dailyGoalMinutes: number;
  weeklyHeatmap: {
    dayName: string;
    minutes: number;
    isCompleted: boolean;
  }[];
  monthlyCompletionRatePercent: number;
  streakRewardsUnlocked: {
    streakDaysRequired: number;
    title: string;
    badgeIcon: string;
    isUnlocked: boolean;
  }[];
}

export const MOCK_READING_HABITS: ReadingHabitsProfile = {
  currentStreakDays: 14,
  longestStreakDays: 28,
  todayMinutesRead: 35,
  dailyGoalMinutes: 30,
  weeklyHeatmap: [
    { dayName: 'Mon', minutes: 45, isCompleted: true },
    { dayName: 'Tue', minutes: 30, isCompleted: true },
    { dayName: 'Wed', minutes: 60, isCompleted: true },
    { dayName: 'Thu', minutes: 25, isCompleted: false },
    { dayName: 'Fri', minutes: 50, isCompleted: true },
    { dayName: 'Sat', minutes: 90, isCompleted: true },
    { dayName: 'Sun', minutes: 35, isCompleted: true }
  ],
  monthlyCompletionRatePercent: 92,
  streakRewardsUnlocked: [
    { streakDaysRequired: 7, title: '7-Day Scribe Flame', badgeIcon: '🕯️', isUnlocked: true },
    { streakDaysRequired: 14, title: '14-Day Bibliophile Hearth', badgeIcon: '🔥', isUnlocked: true },
    { streakDaysRequired: 30, title: '30-Day Grand Archivist Crown', badgeIcon: '👑', isUnlocked: false },
    { streakDaysRequired: 100, title: '100-Day Eternal Lore Master', badgeIcon: '⚡', isUnlocked: false }
  ]
};
