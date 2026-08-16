export interface D20RollEvent {
  id: string;
  scenarioTitle: string;
  difficultyClass: number; // DC 1 to 30
  statModifier: string; // e.g. +3 Charisma
  successOutcome: string;
  failureOutcome: string;
  lastRoll: number | null;
  outcomeResult: 'CRITICAL_SUCCESS' | 'SUCCESS' | 'FAILURE' | 'CRITICAL_FAIL' | 'PENDING';
}

export const DEFAULT_D20_EVENT: D20RollEvent = {
  id: 'roll_dragon_persuasion',
  scenarioTitle: 'Persuading Smaug the Golden Not to Incinerate Bilbo',
  difficultyClass: 15,
  statModifier: '+4 Silver Tongue (Viewer Sparks Buff)',
  successOutcome: 'The Dragon falls into a deep philosophical slumber admiring riddles.',
  failureOutcome: 'Dragon breath incinerates the party shields! Narrator reads with Demon Voice FX.',
  lastRoll: 18,
  outcomeResult: 'SUCCESS'
};
