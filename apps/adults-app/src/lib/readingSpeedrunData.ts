export interface SpeedrunSplit {
  segmentName: string; // e.g. "Chapter 1: The Boy Who Lived"
  personalBestTime: string;
  currentRunTime: string;
  deltaSeconds: number; // negative = ahead of PB
  wpmSpeed: number;
}

export interface SpeedrunRunData {
  category: string; // e.g. "Harry Potter and the Philosopher's Stone (Any% Audio + Comprehension 100%)"
  worldRecordTime: string;
  worldRecordHolder: string;
  currentTimer: string;
  splits: SpeedrunSplit[];
}

export const DEFAULT_SPEEDRUN_DATA: SpeedrunRunData = {
  category: 'The Hobbit (Any% Unabridged + 100% Comprehension Gate)',
  worldRecordTime: '04:12:38',
  worldRecordHolder: 'SpeedyReader99',
  currentTimer: '01:44:19',
  splits: [
    {
      segmentName: 'Ch 1: An Unexpected Party',
      personalBestTime: '00:32:10',
      currentRunTime: '00:30:45',
      deltaSeconds: -85,
      wpmSpeed: 420
    },
    {
      segmentName: 'Ch 2: Roast Mutton',
      personalBestTime: '01:05:40',
      currentRunTime: '01:04:12',
      deltaSeconds: -88,
      wpmSpeed: 440
    },
    {
      segmentName: 'Ch 3: A Short Rest',
      personalBestTime: '01:45:50',
      currentRunTime: '01:44:19',
      deltaSeconds: -91,
      wpmSpeed: 465
    }
  ]
};
