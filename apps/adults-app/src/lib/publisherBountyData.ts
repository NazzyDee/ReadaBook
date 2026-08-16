export interface PublisherBounty {
  id: string;
  publisherName: string;
  bookTitle: string;
  payoutAmountUsd: number;
  requirements: string;
  status: 'AVAILABLE' | 'ACCEPTED' | 'COMPLETED';
  deadlineDays: number;
}

export const DEFAULT_PUBLISHER_BOUNTIES: PublisherBounty[] = [
  {
    id: 'bounty_tor_fantasy',
    publisherName: 'Tor Books / Macmillan',
    bookTitle: 'The Sunlit Man by Brandon Sanderson',
    payoutAmountUsd: 1500,
    requirements: 'Read Chapter 1 live on stream + Host 10-minute spoiler-free audience discussion + 1 chat link drop.',
    status: 'AVAILABLE',
    deadlineDays: 14
  },
  {
    id: 'bounty_penguin_scifi',
    publisherName: 'Penguin Random House',
    bookTitle: 'Project Hail Mary by Andy Weir',
    payoutAmountUsd: 2200,
    requirements: 'Read 2 chapters with science sound effects enabled + display interactive purchase badge for 30 mins.',
    status: 'ACCEPTED',
    deadlineDays: 7
  },
  {
    id: 'bounty_orbit_debut',
    publisherName: 'Orbit Books',
    bookTitle: 'The Shadow of the Gods by John Gwynne',
    payoutAmountUsd: 1200,
    requirements: 'Live book club read-along sprint with viewers + 5 book box giveaways sponsored by Orbit.',
    status: 'COMPLETED',
    deadlineDays: 0
  }
];
