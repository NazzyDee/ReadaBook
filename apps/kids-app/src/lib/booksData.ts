export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  pages: string[];
  ageRange?: string;
  readingLevel?: string;
  lexile?: string;
  description?: string;
}

export const books: Book[] = [
  {
    id: "the-hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    coverUrl: "https://covers.openlibrary.org/b/id/14627509-L.jpg",
    genre: "Fantasy",
    ageRange: "8-10",
    readingLevel: "Level S",
    lexile: "1000L",
    description: "Bilbo Baggins, a hobbit, is swept into a quest to reclaim the lost Dwarf Kingdom of Erebor from the dragon Smaug.",
    pages: ["Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"]
  },
  {
    id: "harry-potter",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    coverUrl: "https://covers.openlibrary.org/b/id/15155833-L.jpg",
    genre: "Fantasy",
    ageRange: "8-10",
    readingLevel: "Level V",
    lexile: "880L",
    description: "A young wizard discovers his magical heritage and attends Hogwarts School of Witchcraft and Wizardry.",
    pages: ["Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"]
  },
  {
    id: "fellowship-of-the-ring",
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    coverUrl: "https://covers.openlibrary.org/b/id/14627060-L.jpg",
    genre: "Fantasy",
    ageRange: "8-10",
    readingLevel: "Level Z",
    lexile: "1090L",
    description: "The first volume of The Lord of the Rings, in which Frodo Baggins embarks on a quest to destroy the One Ring.",
    pages: ["Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"]
  },
  {
    id: "chronicles-of-narnia",
    title: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
    author: "C.S. Lewis",
    coverUrl: "https://covers.openlibrary.org/b/id/8441376-L.jpg",
    genre: "Fantasy",
    ageRange: "5-7",
    readingLevel: "Level T",
    lexile: "940L",
    description: "Four siblings step through a wardrobe into the magical land of Narnia and assist Aslan in defeating the White Witch.",
    pages: ["Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"]
  },
  {
    id: "a-game-of-thrones",
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    coverUrl: "https://covers.openlibrary.org/b/id/9269962-L.jpg",
    genre: "Fantasy",
    ageRange: "8-10",
    readingLevel: "Level Z",
    lexile: "1100L",
    description: "The first volume of A Song of Ice and Fire, charting the political struggles of Westeros and the rise of ancient threats.",
    pages: ["Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"]
  }
];

export const getBookById = (id: string): Book | undefined => {
  return books.find(b => b.id === id);
};
