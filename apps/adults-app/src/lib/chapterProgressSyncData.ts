export interface BookProgressData {
  bookTitle: string;
  author: string;
  currentPage: number;
  totalPages: number;
  currentChapter: number;
  totalChapters: number;
  chapterTitle: string;
  minutesRemainingInChapter: number;
  estimatedCompletionHours: number;
  kindleSyncCode: string;
}

export const ACTIVE_BOOK_PROGRESS: BookProgressData = {
  bookTitle: 'The Fellowship of the Ring',
  author: 'J.R.R. Tolkien',
  currentPage: 214,
  totalPages: 423,
  currentChapter: 10,
  totalChapters: 22,
  chapterTitle: 'Strider (At the Sign of the Prancing Pony)',
  minutesRemainingInChapter: 24,
  estimatedCompletionHours: 6.5,
  kindleSyncCode: 'READABOOK-FOTR-CH10-P214'
};
