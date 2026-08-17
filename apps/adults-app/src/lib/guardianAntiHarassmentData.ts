export interface ModerationFilterRule {
  id: string;
  ruleName: string;
  triggerType: 'TOXICITY_AI' | 'SPOILER_LEAK' | 'SPAM_RAID' | 'IP_BAN';
  actionTaken: 'SHADOW_BAN' | 'SILENT_FLAG' | 'TIMEOUT_10M' | 'PERMANENT_BAN';
  eventsBlockedToday: number;
  isEnabled: boolean;
}

export const DEFAULT_GUARDIAN_RULES: ModerationFilterRule[] = [
  {
    id: 'rule_toxicity',
    ruleName: 'AI Zero-Tolerance Harassment Shield (Perspective API)',
    triggerType: 'TOXICITY_AI',
    actionTaken: 'SHADOW_BAN',
    eventsBlockedToday: 14,
    isEnabled: true
  },
  {
    id: 'rule_spoilers',
    ruleName: 'Unreleased Plot Spoiler Leaks & Climax Reveals',
    triggerType: 'SPOILER_LEAK',
    actionTaken: 'SILENT_FLAG',
    eventsBlockedToday: 42,
    isEnabled: true
  },
  {
    id: 'rule_spam_raid',
    ruleName: 'Follower-Bot Flood & Phishing Link Shield',
    triggerType: 'SPAM_RAID',
    actionTaken: 'TIMEOUT_10M',
    eventsBlockedToday: 8,
    isEnabled: true
  }
];
