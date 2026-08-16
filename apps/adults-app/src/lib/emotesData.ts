export interface Emote {
  code: string;
  name: string;
  category: 'bookish' | 'twitch' | 'sub' | 'animated';
  emojiOrUrl: string;
  isSvg?: boolean;
  description: string;
}

export const EMOTES: Emote[] = [
  // Bookish Custom Emotes
  { code: 'BookWorm', name: 'Book Worm', category: 'bookish', emojiOrUrl: '🐛📖', description: 'Deep in the pages' },
  { code: 'NovelHype', name: 'Novel Hype', category: 'bookish', emojiOrUrl: '📚🔥', description: 'Peak chapter hype' },
  { code: 'PlotTwist', name: 'Plot Twist', category: 'bookish', emojiOrUrl: '😱⚡', description: 'Did NOT see that coming' },
  { code: 'TeaTime', name: 'Tea Time', category: 'bookish', emojiOrUrl: '☕🫖', description: 'Cozy warm sip' },
  { code: 'CozyFire', name: 'Cozy Fireplace', category: 'bookish', emojiOrUrl: '🪵🔥', description: 'Warm hearth vibes' },
  { code: 'Gasps', name: 'Gasping', category: 'bookish', emojiOrUrl: '🫢✨', description: 'Audible gasp' },
  { code: 'CliffHanger', name: 'Cliffhanger', category: 'bookish', emojiOrUrl: '🧗‍♀️‼️', description: 'Need the next chapter now' },
  { code: 'MindBlown', name: 'Mind Blown', category: 'bookish', emojiOrUrl: '🤯💥', description: 'Lore revealed' },
  { code: 'PageTurn', name: 'Page Turn', category: 'bookish', emojiOrUrl: '📄💨', description: 'Fast reading sprint' },
  { code: 'SpeedReader', name: 'Speed Reader', category: 'bookish', emojiOrUrl: '🏎️📖', description: 'Reading at 500 WPM' },
  { code: 'LitLover', name: 'Literature Lover', category: 'bookish', emojiOrUrl: '💖📕', description: 'True book love' },
  { code: 'CoffeeBook', name: 'Coffee & Books', category: 'bookish', emojiOrUrl: '☕📖', description: 'Sunday morning reading' },
  { code: 'CatReading', name: 'Reading Cat', category: 'bookish', emojiOrUrl: '🐱📚', description: 'Feline reading buddy' },
  { code: 'GlowBrain', name: 'Galaxy Brain Lore', category: 'bookish', emojiOrUrl: '🧠✨', description: 'Understood the foreshadowing' },
  { code: 'QuillPen', name: 'Quill Scribe', category: 'bookish', emojiOrUrl: '🪶📜', description: 'Writing sprinting' },
  { code: 'GoldStar', name: 'Five Star Read', category: 'bookish', emojiOrUrl: '⭐🌟', description: 'Masterpiece 5/5' },
  { code: 'TearsRain', name: 'Sad Ending', category: 'bookish', emojiOrUrl: '😭🌧️', description: 'Emotional damage' },
  { code: 'DragonRoar', name: 'Dragon Roar', category: 'bookish', emojiOrUrl: '🐉⚔️', description: 'Fantasy battle scene' },

  // Twitch Classic Global Emotes
  { code: 'PogChamp', name: 'PogChamp', category: 'twitch', emojiOrUrl: '😲🎉', description: 'Excitement / Pog' },
  { code: 'Kappa', name: 'Kappa', category: 'twitch', emojiOrUrl: '😏🎭', description: 'Sarcasm / irony' },
  { code: 'LUL', name: 'LUL', category: 'twitch', emojiOrUrl: '🤣', description: 'Laughter' },
  { code: 'BibleThump', name: 'BibleThump', category: 'twitch', emojiOrUrl: '🥺😭', description: 'Sadness / Crying' },
  { code: 'Kreygasm', name: 'Kreygasm', category: 'twitch', emojiOrUrl: '🤩💖', description: 'Pure satisfaction' },
  { code: 'MonkaS', name: 'MonkaS', category: 'twitch', emojiOrUrl: '😰💦', description: 'Sweating intense suspense' },
  { code: 'PeepoHappy', name: 'PeepoHappy', category: 'twitch', emojiOrUrl: '🥰🐸', description: 'Wholesome cozy joy' },
  { code: '5Head', name: '5Head', category: 'twitch', emojiOrUrl: '🍷🧠', description: 'Big brain literary analysis' },
  { code: 'Copium', name: 'Copium', category: 'twitch', emojiOrUrl: '🤿💨', description: 'Coping with character death' },
  { code: 'EZ', name: 'EZ Clap', category: 'twitch', emojiOrUrl: '😎👏', description: 'Easy reading goal reached' },
  { code: 'ResidentSleeper', name: 'ResidentSleeper', category: 'twitch', emojiOrUrl: '😴💤', description: 'Soothing bedtime voice' },
  { code: 'Clap', name: 'Clap', category: 'twitch', emojiOrUrl: '👏👏', description: 'Applause for narrator' },
  { code: 'NotLikeThis', name: 'NotLikeThis', category: 'twitch', emojiOrUrl: '🤦‍♂️🙈', description: 'Terrible decision made' },
  { code: 'VoteYea', name: 'Vote Yea', category: 'twitch', emojiOrUrl: '✅', description: 'Vote in prediction / poll' },
  { code: 'VoteNay', name: 'Vote Nay', category: 'twitch', emojiOrUrl: '❌', description: 'Vote in prediction / poll' }
];

export const EMOTE_MAP = new Map<string, Emote>(
  EMOTES.map(e => [e.code.toLowerCase(), e])
);

// Helper function to split text and return tokens (either string or Emote object)
export function parseMessageEmotes(text: string): (string | Emote)[] {
  if (!text) return [];
  const words = text.split(/(\s+)/);
  const result: (string | Emote)[] = [];

  for (const word of words) {
    if (!word) continue;
    const cleanWord = word.trim();
    const matchedEmote = EMOTE_MAP.get(cleanWord.toLowerCase());
    if (matchedEmote && matchedEmote.code.toLowerCase() === cleanWord.toLowerCase()) {
      result.push(matchedEmote);
    } else {
      result.push(word);
    }
  }

  return result;
}
