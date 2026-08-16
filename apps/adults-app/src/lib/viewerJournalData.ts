export interface SavedQuoteEntry {
  id: string;
  quoteText: string;
  bookTitle: string;
  author: string;
  chapter: string;
  streamerName: string;
  userNote: string;
  timestamp: string;
  sparksAwarded: number;
}

export const MOCK_SAVED_QUOTES: SavedQuoteEntry[] = [
  {
    id: 'q_1',
    quoteText: '“Not all those who wander are lost; the old that is strong does not wither, deep roots are not reached by the frost.”',
    bookTitle: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    chapter: 'Chapter 10: Strider',
    streamerName: 'SarahReads',
    userNote: 'Incredible delivery with the low cello background music!',
    timestamp: 'Today at 8:42 PM',
    sparksAwarded: 25
  },
  {
    id: 'q_2',
    quoteText: '“It is a far, far better thing that I do, than I have ever done; it is a far, far better rest that I go to than I have ever known.”',
    bookTitle: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    chapter: 'Book 3, Chapter 15',
    streamerName: 'ClassicTomes',
    userNote: 'Emotional chapter finale. Bookmarked for book club.',
    timestamp: 'Yesterday at 3:15 PM',
    sparksAwarded: 50
  }
];
