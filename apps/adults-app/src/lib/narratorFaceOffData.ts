export interface MonologueDuel {
  id: string;
  monologueTitle: string;
  passageText: string;
  bookSource: string;
  narratorA: {
    name: string;
    avatar: string;
    votes: number;
  };
  narratorB: {
    name: string;
    avatar: string;
    votes: number;
  };
  secondsRemaining: number;
  status: 'PERFORMING' | 'VOTING' | 'DECIDED';
}

export const ACTIVE_MONOLOGUE_DUEL: MonologueDuel = {
  id: 'duel_smaug_confrontation',
  monologueTitle: 'The Dragon Smaug’s Boast',
  passageText: '“My armor is like tenfold shields, my teeth are swords, my claws spears, the shock of my tail a thunderbolt, my wings a hurricane, and my breath death!”',
  bookSource: 'The Hobbit • Chapter 12: Inside Information',
  narratorA: {
    name: 'SarahReads',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80',
    votes: 382
  },
  narratorB: {
    name: 'ClassicTomes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80',
    votes: 415
  },
  secondsRemaining: 34,
  status: 'VOTING'
};
