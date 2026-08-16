import { soundFX } from './soundFx';

export interface FoleyTriggerRule {
  id: string;
  keyword: string;
  soundName: string;
  icon: string;
  play: () => void;
  description: string;
}

export const DEFAULT_FOLEY_RULES: FoleyTriggerRule[] = [
  {
    id: 'foley_thunder',
    keyword: 'thunder',
    soundName: 'Thunderstorm Rumble',
    icon: '⚡',
    play: () => soundFX.playThunder(),
    description: 'Triggers on words: thunder, storm, lightning'
  },
  {
    id: 'foley_dragon',
    keyword: 'dragon',
    soundName: 'Dragon Breath & Roar',
    icon: '🐉',
    play: () => soundFX.playDragonRoar(),
    description: 'Triggers on words: dragon, monster, beast roar'
  },
  {
    id: 'foley_harp',
    keyword: 'music',
    soundName: 'Elven Harp Glissando',
    icon: '🎶',
    play: () => soundFX.playHarp(),
    description: 'Triggers on words: harp, song, elven, melody'
  },
  {
    id: 'foley_pages',
    keyword: 'book',
    soundName: 'Ancient Page Rustle',
    icon: '📖',
    play: () => soundFX.playPageRustle(),
    description: 'Triggers on words: book, parchment, scroll, read'
  },
  {
    id: 'foley_applause',
    keyword: 'cheer',
    soundName: 'Tavern Standing Ovation',
    icon: '👏',
    play: () => soundFX.playApplause(),
    description: 'Triggers on words: cheer, applaud, victory, feast'
  }
];

export interface FoleyEventLog {
  id: string;
  keyword: string;
  soundName: string;
  timestamp: string;
  snippet: string;
}

class SmartFoleyEngine {
  private lastTriggerTime = 0;
  private cooldownMs = 4000; // Prevent spamming sounds too fast
  private eventLogs: FoleyEventLog[] = [];
  private listeners: ((logs: FoleyEventLog[]) => void)[] = [];

  public subscribe(cb: (logs: FoleyEventLog[]) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public getLogs(): FoleyEventLog[] {
    return [...this.eventLogs];
  }

  public scanTextAndTrigger(
    text: string,
    enabled = true,
    customRules = DEFAULT_FOLEY_RULES
  ): FoleyTriggerRule | null {
    if (!enabled) return null;

    const now = Date.now();
    if (now - this.lastTriggerTime < this.cooldownMs) {
      return null;
    }

    const lower = text.toLowerCase();

    for (const rule of customRules) {
      if (lower.includes(rule.keyword.toLowerCase())) {
        this.lastTriggerTime = now;
        rule.play();

        const log: FoleyEventLog = {
          id: `foley_${now}`,
          keyword: rule.keyword,
          soundName: rule.soundName,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          snippet: text.length > 50 ? `${text.slice(0, 50)}...` : text
        };

        this.eventLogs = [log, ...this.eventLogs.slice(0, 15)];
        this.listeners.forEach(cb => cb(this.eventLogs));

        return rule;
      }
    }

    return null;
  }
}

export const smartFoley = new SmartFoleyEngine();
