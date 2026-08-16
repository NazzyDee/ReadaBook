export interface ModShieldRule {
  id: string;
  name: string;
  category: 'SPOILER_TRIPWIRE' | 'HARASSMENT' | 'SELF_PROMO' | 'CAPS_FLOOD';
  actionType: 'AUTO_BLUR' | 'TIMEOUT_5M' | 'DELETE_MESSAGE' | 'SHADOWBAN';
  triggerRegex: string;
  isEnabled: boolean;
  blockedCount: number;
}

export const DEFAULT_MOD_SHIELD_RULES: ModShieldRule[] = [
  {
    id: 'rule_death_spoilers',
    name: 'Character Death & Plot Twist Tripwire',
    category: 'SPOILER_TRIPWIRE',
    actionType: 'AUTO_BLUR',
    triggerRegex: '(dies|kills|betrays|identity of|ending is|killer is)',
    isEnabled: true,
    blockedCount: 38
  },
  {
    id: 'rule_book_leaks',
    name: 'Unreleased Chapter & Piracy Leaks',
    category: 'SPOILER_TRIPWIRE',
    actionType: 'TIMEOUT_5M',
    triggerRegex: '(epub free|pdf download|leaked chapter|piratebay)',
    isEnabled: true,
    blockedCount: 14
  },
  {
    id: 'rule_caps_spam',
    name: 'Rage Caps & Excessive Emoji Flooding',
    category: 'CAPS_FLOOD',
    actionType: 'DELETE_MESSAGE',
    triggerRegex: '[A-Z]{12,}',
    isEnabled: true,
    blockedCount: 104
  }
];
