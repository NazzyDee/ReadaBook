export interface StoryBranchOption {
  id: string;
  label: string;
  description: string;
  targetPage: number;
  votes: number;
  icon: string;
}

export interface StoryBranchSession {
  id: string;
  bookTitle: string;
  chapterTitle: string;
  question: string;
  contextLore: string;
  durationSeconds: number;
  options: StoryBranchOption[];
}

export const MOCK_BRANCH_SESSION: StoryBranchSession = {
  id: 'branch_moria_gate',
  bookTitle: 'The Fellowship of the Ring',
  chapterTitle: 'Chapter 4: A Journey in the Dark',
  question: 'Gandalf ponders at the Doors of Durin as the lake begins to stir. Which path shall the Fellowship choose?',
  contextLore: 'The ancient elven runes glow faintly under the moonlight. Shadows move beneath the stagnant waters of Sirannon.',
  durationSeconds: 30,
  options: [
    {
      id: 'opt_speak_friend',
      label: "Speak 'Mellon' (Friend)",
      description: 'Unlock the Western Doors of Khazad-dûm directly and enter the dark halls.',
      targetPage: 284,
      votes: 142,
      icon: '🗝️'
    },
    {
      id: 'opt_high_pass',
      label: 'Turn Back to the High Pass',
      description: 'Brave the freezing snow blizzard over Caradhras once more.',
      targetPage: 291,
      votes: 78,
      icon: '❄️'
    },
    {
      id: 'opt_investigate_waters',
      label: 'Investigate the Lake Ripple',
      description: 'Draw blades against the lurking Watcher in the Water before opening the doors.',
      targetPage: 298,
      votes: 110,
      icon: '🦑'
    }
  ]
};
