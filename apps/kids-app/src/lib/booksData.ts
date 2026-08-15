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
    "id": "the-fellowship-of-the-ring",
    "title": "The Fellowship of the Ring",
    "author": "J.R.R. Tolkien",
    "coverUrl": "https://covers.openlibrary.org/b/id/14627060-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1090L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-two-towers",
    "title": "The Two Towers",
    "author": "J.R.R. Tolkien",
    "coverUrl": "https://covers.openlibrary.org/b/id/14627564-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1100L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-return-of-the-king",
    "title": "The Return of the King",
    "author": "J.R.R. Tolkien",
    "coverUrl": "https://covers.openlibrary.org/b/id/14627062-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1110L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "harry-potter-and-the-sorcerer-s-stone",
    "title": "Harry Potter and the Sorcerer's Stone",
    "author": "J.K. Rowling",
    "coverUrl": "https://covers.openlibrary.org/b/id/276518-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level V",
    "lexile": "880L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "harry-potter-and-the-chamber-of-secrets",
    "title": "Harry Potter and the Chamber of Secrets",
    "author": "J.K. Rowling",
    "coverUrl": "https://covers.openlibrary.org/b/id/15158664-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level V",
    "lexile": "940L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "harry-potter-and-the-prisoner-of-azkaban",
    "title": "Harry Potter and the Prisoner of Azkaban",
    "author": "J.K. Rowling",
    "coverUrl": "https://covers.openlibrary.org/b/id/10580435-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "880L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "harry-potter-and-the-goblet-of-fire",
    "title": "Harry Potter and the Goblet of Fire",
    "author": "J.K. Rowling",
    "coverUrl": "https://covers.openlibrary.org/b/id/12059372-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "880L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "harry-potter-and-the-order-of-the-phoenix",
    "title": "Harry Potter and the Order of the Phoenix",
    "author": "J.K. Rowling",
    "coverUrl": "https://covers.openlibrary.org/b/id/15158666-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level X",
    "lexile": "950L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "harry-potter-and-the-half-blood-prince",
    "title": "Harry Potter and the Half-Blood Prince",
    "author": "J.K. Rowling",
    "coverUrl": "https://covers.openlibrary.org/b/id/10716273-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "920L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "harry-potter-and-the-deathly-hallows",
    "title": "Harry Potter and the Deathly Hallows",
    "author": "J.K. Rowling",
    "coverUrl": "https://covers.openlibrary.org/b/id/15158660-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "980L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "a-game-of-thrones",
    "title": "A Game of Thrones",
    "author": "George R.R. Martin",
    "coverUrl": "https://covers.openlibrary.org/b/id/9269962-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1100L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "a-clash-of-kings",
    "title": "A Clash of Kings",
    "author": "George R.R. Martin",
    "coverUrl": "https://covers.openlibrary.org/b/id/8231751-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1120L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "a-storm-of-swords",
    "title": "A Storm of Swords",
    "author": "George R.R. Martin",
    "coverUrl": "https://covers.openlibrary.org/b/id/15124196-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1140L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "a-feast-for-crows",
    "title": "A Feast for Crows",
    "author": "George R.R. Martin",
    "coverUrl": "https://covers.openlibrary.org/b/id/6501256-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1150L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "a-dance-with-dragons",
    "title": "A Dance with Dragons",
    "author": "George R.R. Martin",
    "coverUrl": "https://covers.openlibrary.org/b/id/11298743-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1160L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-lion-the-witch-and-the-wardrobe",
    "title": "The Lion, the Witch and the Wardrobe",
    "author": "C.S. Lewis",
    "coverUrl": "https://covers.openlibrary.org/b/id/8441376-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "940L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "prince-caspian",
    "title": "Prince Caspian",
    "author": "C.S. Lewis",
    "coverUrl": "https://covers.openlibrary.org/b/id/45897-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "870L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-voyage-of-the-dawn-treader",
    "title": "The Voyage of the Dawn Treader",
    "author": "C.S. Lewis",
    "coverUrl": "https://covers.openlibrary.org/b/id/9184719-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "970L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-silver-chair",
    "title": "The Silver Chair",
    "author": "C.S. Lewis",
    "coverUrl": "https://covers.openlibrary.org/b/id/6950992-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "840L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-horse-and-his-boy",
    "title": "The Horse and His Boy",
    "author": "C.S. Lewis",
    "coverUrl": "https://covers.openlibrary.org/b/id/9184792-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "970L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-magician-s-nephew",
    "title": "The Magician's Nephew",
    "author": "C.S. Lewis",
    "coverUrl": "https://covers.openlibrary.org/b/id/1072931-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "790L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-last-battle",
    "title": "The Last Battle",
    "author": "C.S. Lewis",
    "coverUrl": "https://covers.openlibrary.org/b/id/6529226-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "890L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "a-wizard-of-earthsea",
    "title": "A Wizard of Earthsea",
    "author": "Ursula K. Le Guin",
    "coverUrl": "https://covers.openlibrary.org/b/id/13617691-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level X",
    "lexile": "950L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-tombs-of-atuan",
    "title": "The Tombs of Atuan",
    "author": "Ursula K. Le Guin",
    "coverUrl": "https://covers.openlibrary.org/b/id/6633403-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level X",
    "lexile": "920L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-farthest-shore",
    "title": "The Farthest Shore",
    "author": "Ursula K. Le Guin",
    "coverUrl": "https://covers.openlibrary.org/b/id/6498990-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level X",
    "lexile": "940L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "tehanu",
    "title": "Tehanu",
    "author": "Ursula K. Le Guin",
    "coverUrl": "https://covers.openlibrary.org/b/id/3347790-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "980L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-eye-of-the-world",
    "title": "The Eye of the World",
    "author": "Robert Jordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/980232-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1050L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-great-hunt",
    "title": "The Great Hunt",
    "author": "Robert Jordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/182352-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1060L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-dragon-reborn",
    "title": "The Dragon Reborn",
    "author": "Robert Jordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/603239-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1070L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-shadow-rising",
    "title": "The Shadow Rising",
    "author": "Robert Jordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/603240-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1080L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-fires-of-heaven",
    "title": "The Fires of Heaven",
    "author": "Robert Jordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/603821-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1090L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-way-of-kings",
    "title": "The Way of Kings",
    "author": "Brandon Sanderson",
    "coverUrl": "https://covers.openlibrary.org/b/id/14658316-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1100L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "words-of-radiance",
    "title": "Words of Radiance",
    "author": "Brandon Sanderson",
    "coverUrl": "https://covers.openlibrary.org/b/id/14658334-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1120L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "oathbringer",
    "title": "Oathbringer",
    "author": "Brandon Sanderson",
    "coverUrl": "https://covers.openlibrary.org/b/id/14658111-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1150L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "rhythm-of-war",
    "title": "Rhythm of War",
    "author": "Brandon Sanderson",
    "coverUrl": "https://covers.openlibrary.org/b/id/14658361-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1160L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-lightning-thief",
    "title": "The Lightning Thief",
    "author": "Rick Riordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/7239831-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level U",
    "lexile": "740L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-sea-of-monsters",
    "title": "The Sea of Monsters",
    "author": "Rick Riordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/108909-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level U",
    "lexile": "680L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-titan-s-curse",
    "title": "The Titan's Curse",
    "author": "Rick Riordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/14601475-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level U",
    "lexile": "690L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-battle-of-the-labyrinth",
    "title": "The Battle of the Labyrinth",
    "author": "Rick Riordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/6274739-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level U",
    "lexile": "670L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-last-olympian",
    "title": "The Last Olympian",
    "author": "Rick Riordan",
    "coverUrl": "https://covers.openlibrary.org/b/id/6624107-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level U",
    "lexile": "620L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "mistborn-the-final-empire",
    "title": "Mistborn: The Final Empire",
    "author": "Brandon Sanderson",
    "coverUrl": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "870L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-well-of-ascension",
    "title": "The Well of Ascension",
    "author": "Brandon Sanderson",
    "coverUrl": "https://covers.openlibrary.org/b/id/14658341-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "890L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-hero-of-ages",
    "title": "The Hero of Ages",
    "author": "Brandon Sanderson",
    "coverUrl": "https://covers.openlibrary.org/b/id/14658094-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "910L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-golden-compass",
    "title": "The Golden Compass",
    "author": "Philip Pullman",
    "coverUrl": "https://covers.openlibrary.org/b/id/7896630-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level X",
    "lexile": "930L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-subtle-knife",
    "title": "The Subtle Knife",
    "author": "Philip Pullman",
    "coverUrl": "https://covers.openlibrary.org/b/id/12614549-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "950L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-amber-spyglass",
    "title": "The Amber Spyglass",
    "author": "Philip Pullman",
    "coverUrl": "https://covers.openlibrary.org/b/id/12613246-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "970L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-name-of-the-wind",
    "title": "The Name of the Wind",
    "author": "Patrick Rothfuss",
    "coverUrl": "https://covers.openlibrary.org/b/id/11480483-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1020L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-wise-man-s-fear",
    "title": "The Wise Man's Fear",
    "author": "Patrick Rothfuss",
    "coverUrl": "https://covers.openlibrary.org/b/id/8294024-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1050L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-colour-of-magic",
    "title": "The Colour of Magic",
    "author": "Terry Pratchett",
    "coverUrl": "https://covers.openlibrary.org/b/id/14647238-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "890L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "mort",
    "title": "Mort",
    "author": "Terry Pratchett",
    "coverUrl": "https://covers.openlibrary.org/b/id/14648805-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "900L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "guards-guards",
    "title": "Guards! Guards!",
    "author": "Terry Pratchett",
    "coverUrl": "https://covers.openlibrary.org/b/id/13095550-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "920L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "small-gods",
    "title": "Small Gods",
    "author": "Terry Pratchett",
    "coverUrl": "https://covers.openlibrary.org/b/id/14648232-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level X",
    "lexile": "940L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-gunslinger",
    "title": "The Gunslinger",
    "author": "Stephen King",
    "coverUrl": "https://covers.openlibrary.org/b/id/8396638-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "960L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-drawing-of-the-three",
    "title": "The Drawing of the Three",
    "author": "Stephen King",
    "coverUrl": "https://covers.openlibrary.org/b/id/14651245-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1000L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-waste-lands",
    "title": "The Waste Lands",
    "author": "Stephen King",
    "coverUrl": "https://covers.openlibrary.org/b/id/14654089-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1020L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "wizard-and-glass",
    "title": "Wizard and Glass",
    "author": "Stephen King",
    "coverUrl": "https://covers.openlibrary.org/b/id/14657088-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1040L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-last-wish",
    "title": "The Last Wish",
    "author": "Andrzej Sapkowski",
    "coverUrl": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "950L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "blood-of-elves",
    "title": "Blood of Elves",
    "author": "Andrzej Sapkowski",
    "coverUrl": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "970L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "time-of-contempt",
    "title": "Time of Contempt",
    "author": "Andrzej Sapkowski",
    "coverUrl": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "990L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-fifth-season",
    "title": "The Fifth Season",
    "author": "N.K. Jemisin",
    "coverUrl": "https://covers.openlibrary.org/b/id/8133598-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1030L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-obelisk-gate",
    "title": "The Obelisk Gate",
    "author": "N.K. Jemisin",
    "coverUrl": "https://covers.openlibrary.org/b/id/8138324-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1050L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-stone-sky",
    "title": "The Stone Sky",
    "author": "N.K. Jemisin",
    "coverUrl": "https://covers.openlibrary.org/b/id/8191910-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1060L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-poppy-war",
    "title": "The Poppy War",
    "author": "R.F. Kuang",
    "coverUrl": "https://covers.openlibrary.org/b/id/8463552-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1040L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-dragon-republic",
    "title": "The Dragon Republic",
    "author": "R.F. Kuang",
    "coverUrl": "https://covers.openlibrary.org/b/id/8539487-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1060L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-burning-god",
    "title": "The Burning God",
    "author": "R.F. Kuang",
    "coverUrl": "https://covers.openlibrary.org/b/id/10329759-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1070L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "assassin-s-apprentice",
    "title": "Assassin's Apprentice",
    "author": "Robin Hobb",
    "coverUrl": "https://covers.openlibrary.org/b/id/4915230-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "940L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "royal-assassin",
    "title": "Royal Assassin",
    "author": "Robin Hobb",
    "coverUrl": "https://covers.openlibrary.org/b/id/2177291-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "960L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "assassin-s-quest",
    "title": "Assassin's Quest",
    "author": "Robin Hobb",
    "coverUrl": "https://covers.openlibrary.org/b/id/368112-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "980L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "eragon",
    "title": "Eragon",
    "author": "Christopher Paolini",
    "coverUrl": "https://covers.openlibrary.org/b/id/13921600-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level U",
    "lexile": "710L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "eldest",
    "title": "Eldest",
    "author": "Christopher Paolini",
    "coverUrl": "https://covers.openlibrary.org/b/id/12848701-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level V",
    "lexile": "780L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "brisingr",
    "title": "Brisingr",
    "author": "Christopher Paolini",
    "coverUrl": "https://covers.openlibrary.org/b/id/2411585-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level W",
    "lexile": "820L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "inheritance",
    "title": "Inheritance",
    "author": "Christopher Paolini",
    "coverUrl": "https://covers.openlibrary.org/b/id/6973055-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level X",
    "lexile": "850L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-hobbit",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "coverUrl": "https://covers.openlibrary.org/b/id/14627509-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level S",
    "lexile": "1000L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-princess-bride",
    "title": "The Princess Bride",
    "author": "William Goldman",
    "coverUrl": "https://covers.openlibrary.org/b/id/9284881-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level V",
    "lexile": "840L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "american-gods",
    "title": "American Gods",
    "author": "Neil Gaiman",
    "coverUrl": "https://covers.openlibrary.org/b/id/8494659-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "960L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "jonathan-strange-mr-norrell",
    "title": "Jonathan Strange & Mr Norrell",
    "author": "Susanna Clarke",
    "coverUrl": "https://covers.openlibrary.org/b/id/525391-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1050L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "circe",
    "title": "Circe",
    "author": "Madeline Miller",
    "coverUrl": "https://covers.openlibrary.org/b/id/8739376-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "930L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-night-circus",
    "title": "The Night Circus",
    "author": "Erin Morgenstern",
    "coverUrl": "https://covers.openlibrary.org/b/id/8773134-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "910L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "good-omens",
    "title": "Good Omens",
    "author": "Terry Pratchett & Neil Gaiman",
    "coverUrl": "https://covers.openlibrary.org/b/id/10482258-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "870L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-last-unicorn",
    "title": "The Last Unicorn",
    "author": "Peter S. Beagle",
    "coverUrl": "https://covers.openlibrary.org/b/id/294651-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level W",
    "lexile": "850L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "piranesi",
    "title": "Piranesi",
    "author": "Susanna Clarke",
    "coverUrl": "https://covers.openlibrary.org/b/id/10226290-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level X",
    "lexile": "900L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "watership-down",
    "title": "Watership Down",
    "author": "Richard Adams",
    "coverUrl": "https://covers.openlibrary.org/b/id/6450196-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level X",
    "lexile": "880L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "uprooted",
    "title": "Uprooted",
    "author": "Naomi Novik",
    "coverUrl": "https://covers.openlibrary.org/b/id/8539161-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "910L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "spinning-silver",
    "title": "Spinning Silver",
    "author": "Naomi Novik",
    "coverUrl": "https://covers.openlibrary.org/b/id/8423441-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "920L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-neverending-story",
    "title": "The Neverending Story",
    "author": "Michael Ende",
    "coverUrl": "https://covers.openlibrary.org/b/id/13200934-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level V",
    "lexile": "830L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "alice-s-adventures-in-wonderland",
    "title": "Alice's Adventures in Wonderland",
    "author": "Lewis Carroll",
    "coverUrl": "https://covers.openlibrary.org/b/id/10527843-L.jpg",
    "genre": "Classics",
    "ageRange": "5-7",
    "readingLevel": "Level Q",
    "lexile": "890L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-once-and-future-king",
    "title": "The Once and Future King",
    "author": "T.H. White",
    "coverUrl": "https://covers.openlibrary.org/b/id/6630521-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1080L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "peter-and-wendy",
    "title": "Peter and Wendy",
    "author": "J.M. Barrie",
    "coverUrl": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "910L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "coraline",
    "title": "Coraline",
    "author": "Neil Gaiman",
    "coverUrl": "https://covers.openlibrary.org/b/id/14171421-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level S",
    "lexile": "740L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-graveyard-book",
    "title": "The Graveyard Book",
    "author": "Neil Gaiman",
    "coverUrl": "https://covers.openlibrary.org/b/id/7099583-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "820L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "a-monster-calls",
    "title": "A Monster Calls",
    "author": "Patrick Ness",
    "coverUrl": "https://covers.openlibrary.org/b/id/7011713-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "730L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "tigana",
    "title": "Tigana",
    "author": "Guy Gavriel Kay",
    "coverUrl": "https://covers.openlibrary.org/b/id/477417-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1070L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-lions-of-al-rassan",
    "title": "The Lions of Al-Rassan",
    "author": "Guy Gavriel Kay",
    "coverUrl": "https://covers.openlibrary.org/b/id/477414-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1060L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "stardust",
    "title": "Stardust",
    "author": "Neil Gaiman",
    "coverUrl": "https://covers.openlibrary.org/b/id/8216379-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level V",
    "lexile": "970L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "elantris",
    "title": "Elantris",
    "author": "Brandon Sanderson",
    "coverUrl": "https://covers.openlibrary.org/b/id/14658083-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level W",
    "lexile": "890L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-starless-sea",
    "title": "The Starless Sea",
    "author": "Erin Morgenstern",
    "coverUrl": "https://covers.openlibrary.org/b/id/9084503-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Y",
    "lexile": "940L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-priory-of-the-orange-tree",
    "title": "The Priory of the Orange Tree",
    "author": "Samantha Shannon",
    "coverUrl": "https://covers.openlibrary.org/b/id/8802446-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1090L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-ocean-at-the-end-of-the-lane",
    "title": "The Ocean at the End of the Lane",
    "author": "Neil Gaiman",
    "coverUrl": "https://covers.openlibrary.org/b/id/7258156-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level X",
    "lexile": "920L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "babel",
    "title": "Babel",
    "author": "R.F. Kuang",
    "coverUrl": "https://covers.openlibrary.org/b/id/12468631-L.jpg",
    "genre": "Fantasy",
    "ageRange": "8-10",
    "readingLevel": "Level Z",
    "lexile": "1110L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  },
  {
    "id": "the-house-in-the-cerulean-sea",
    "title": "The House in the Cerulean Sea",
    "author": "TJ Klune",
    "coverUrl": "https://covers.openlibrary.org/b/id/9312772-L.jpg",
    "genre": "Fantasy",
    "ageRange": "5-7",
    "readingLevel": "Level T",
    "lexile": "840L",
    "pages": [
      "Cozy Study & Listening Session: Watch narrator read physical copy on camera! 🎥"
    ]
  }
];

export const getBookById = (id: string): Book | undefined => {
  return books.find(b => b.id === id);
};
