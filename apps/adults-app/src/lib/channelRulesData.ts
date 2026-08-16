export interface ChannelRuleItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ChannelRulesConfig {
  streamerName: string;
  channelTagline: string;
  rules: ChannelRuleItem[];
}

export const MOCK_CHANNEL_RULES: ChannelRulesConfig = {
  streamerName: 'LillyReadsBooks',
  channelTagline: 'Welcome to our cozy book guild! Please read and accept our channel guidelines before joining the live chat.',
  rules: [
    {
      id: 'rule_no_spoilers',
      icon: '🤫',
      title: 'Strict No-Spoilers Policy',
      description: 'Never reveal upcoming chapter plot twists, character deaths, or endings unless explicitly requested by the narrator.'
    },
    {
      id: 'rule_respect',
      icon: '🤝',
      title: 'Be Kind & Respectful',
      description: 'Treat all fellow book club members, co-readers, and moderators with empathy and courtesy.'
    },
    {
      id: 'rule_no_backseat',
      icon: '📖',
      title: 'No Backseat Pronunciation / Pacing',
      description: 'Everyone experiences books differently. Allow the broadcaster to explore character accents and pace naturally.'
    },
    {
      id: 'rule_pg13',
      icon: '🛡️',
      title: 'Keep Chat PG-13 & Safe',
      description: 'No hate speech, excessive profanity, or graphic commentary in the main broadcast discussion.'
    }
  ]
};
