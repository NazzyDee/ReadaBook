export interface WhisperMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  attachedQuote?: string;
}

export interface WhisperContact {
  username: string;
  avatarUrl: string;
  isOnline: boolean;
  lastMessageSnippet: string;
  unreadCount: number;
  currentBookReading: string;
}

export const MOCK_WHISPER_CONTACTS: WhisperContact[] = [
  {
    username: 'NovelScholar',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isOnline: true,
    lastMessageSnippet: 'Did you hear that Gandalf line?! Chills!',
    unreadCount: 1,
    currentBookReading: 'The Lord of the Rings'
  },
  {
    username: 'GrimNarrator',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isOnline: true,
    lastMessageSnippet: 'Let’s do a co-reading watch party tonight at 8 PM.',
    unreadCount: 0,
    currentBookReading: 'Dune Messiah'
  },
  {
    username: 'ElvenScribe',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    isOnline: false,
    lastMessageSnippet: 'Thanks for the gift subscription earlier! 📖✨',
    unreadCount: 0,
    currentBookReading: 'The Name of the Wind'
  }
];

export const INITIAL_WHISPER_THREAD: WhisperMessage[] = [
  {
    id: 'wm_1',
    senderName: 'NovelScholar',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    text: 'Hey! Are you watching Lilly read Chapter 3 right now?',
    timestamp: '4:15 PM',
    isSelf: false
  },
  {
    id: 'wm_2',
    senderName: 'You',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    text: 'Yes! Her voice for Gollum was actually incredible!',
    timestamp: '4:16 PM',
    isSelf: true
  },
  {
    id: 'wm_3',
    senderName: 'NovelScholar',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    text: 'Did you hear that Gandalf line?! Chills!',
    timestamp: '4:18 PM',
    isSelf: false,
    attachedQuote: '“Even the smallest person can change the course of the future.”'
  }
];
