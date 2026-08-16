export interface RelayChannelLeg {
  id: string;
  channelName: string;
  avatarUrl: string;
  bookSection: string;
  timeSlotFormatted: string;
  pagesRead: number;
  status: 'COMPLETED' | 'LIVE_NOW' | 'UP_NEXT';
}

export interface GlobalRelayStatus {
  relayTitle: string;
  totalWorldPagesRead: number;
  worldRecordTargetPages: number;
  activeChannelIndex: number;
  hoursElapsed: number;
  totalHours: number;
}

export const DEFAULT_RELAY_LEGS: RelayChannelLeg[] = [
  {
    id: 'leg_1',
    channelName: 'LordOfLore',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80',
    bookSection: 'The Fellowship: Chapters 1 - 4',
    timeSlotFormatted: '12:00 PM - 03:00 PM',
    pagesRead: 142,
    status: 'COMPLETED'
  },
  {
    id: 'leg_2',
    channelName: 'BookWormQueen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&auto=format&fit=crop&q=80',
    bookSection: 'The Fellowship: Chapters 5 - 8',
    timeSlotFormatted: '03:00 PM - 06:00 PM',
    pagesRead: 168,
    status: 'LIVE_NOW'
  },
  {
    id: 'leg_3',
    channelName: 'ArchivistChillhop',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80',
    bookSection: 'The Fellowship: Chapters 9 - 12',
    timeSlotFormatted: '06:00 PM - 09:00 PM',
    pagesRead: 0,
    status: 'UP_NEXT'
  }
];

export const DEFAULT_GLOBAL_RELAY: GlobalRelayStatus = {
  relayTitle: 'The 24-Hour Solstice World Reading Relay',
  totalWorldPagesRead: 2840,
  worldRecordTargetPages: 5000,
  activeChannelIndex: 1,
  hoursElapsed: 6,
  totalHours: 24
};
