export interface SquadRelayStreamer {
  streamerId: string;
  streamerName: string;
  avatarUrl: string;
  currentChapterAssigned: number;
  relaySlotTime: string; // e.g. "12:00 PM - 02:00 PM EST"
  isCurrentlyLive: boolean;
  viewersOnlineCount: number;
}

export interface SquadRelayEvent {
  eventTitle: string;
  bookTitle: string;
  totalChapters: number;
  totalRunTimeHours: number;
  streamers: SquadRelayStreamer[];
}

export const DEFAULT_SQUAD_RELAY: SquadRelayEvent = {
  eventTitle: '24-Hour Marathon: The Lord of the Rings Complete Relay',
  bookTitle: 'The Fellowship of the Ring',
  totalChapters: 22,
  totalRunTimeHours: 24,
  streamers: [
    {
      streamerId: 'streamer_nazzy',
      streamerName: 'NazzyDee',
      avatarUrl: '/assets/avatars/nazzy.jpg',
      currentChapterAssigned: 15,
      relaySlotTime: '02:00 PM - 04:00 PM EST',
      isCurrentlyLive: true,
      viewersOnlineCount: 342
    },
    {
      streamerId: 'streamer_elena',
      streamerName: 'Elena Rostova',
      avatarUrl: '/assets/avatars/elena.jpg',
      currentChapterAssigned: 16,
      relaySlotTime: '04:00 PM - 06:00 PM EST',
      isCurrentlyLive: false,
      viewersOnlineCount: 0
    },
    {
      streamerId: 'streamer_marcus',
      streamerName: 'Marcus Vance',
      avatarUrl: '/assets/avatars/marcus.jpg',
      currentChapterAssigned: 17,
      relaySlotTime: '06:00 PM - 08:00 PM EST',
      isCurrentlyLive: false,
      viewersOnlineCount: 0
    }
  ]
};
