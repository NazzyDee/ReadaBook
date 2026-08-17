export interface DeveloperWebhookEndpoint {
  id: string;
  webhookUrl: string;
  subscribedEvents: string[]; // e.g. ['stream.page_turn', 'chat.cheer', 'sprint.completed']
  secretKeyMasked: string;
  deliverySuccessRatePct: number;
  lastPingTime: string;
}

export const DEFAULT_DEVELOPER_WEBHOOKS: DeveloperWebhookEndpoint[] = [
  {
    id: 'wh_streamdeck',
    webhookUrl: 'https://api.elgato.com/v1/plugins/readabook/events',
    subscribedEvents: ['stream.page_turn', 'stream.chapter_transition'],
    secretKeyMasked: 'whsec_••••••••••••••••3f8a',
    deliverySuccessRatePct: 99.8,
    lastPingTime: '2 mins ago'
  },
  {
    id: 'wh_discord_bot',
    webhookUrl: 'https://bot.nazzydee.tv/api/readabook/live-alerts',
    subscribedEvents: ['stream.live', 'stream.offline', 'lore.tribunal_ruling'],
    secretKeyMasked: 'whsec_••••••••••••••••9c42',
    deliverySuccessRatePct: 100.0,
    lastPingTime: '12 mins ago'
  }
];
