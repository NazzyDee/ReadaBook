export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  pages: string[];
}

export const books: Book[] = [
  {
    id: "peter-pan",
    title: "Peter Pan",
    author: "J.M. Barrie",
    coverUrl: "/assets/book_cover.jpg",
    genre: "Adventure",
    pages: [
      "All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was this. One day when she was two years old she was playing in a garden, and she plucked another flower and ran with it to her mother.",
      "I suppose she must have looked rather delightful, for Mrs. Darling put her hand to her heart and cried, 'Oh, why can't you remain like this for ever!' This was all that passed between them on the subject, but whence Wendy knew that she must grow up.",
      "You always know after you are two. Two is the beginning of the end. Of course they lived at 14 [their house number], and until Wendy came her mother was the chief one. She was a lovely lady, with a romantic mind and such a sweet mocking mouth.",
      "Her romantic mind was like the tiny boxes, one within the other, that come from the puzzling East, however many you discover there is always one more; and her sweet mocking mouth had one kiss on it that Wendy could never get, though there it was, quite conspicuous in the right-hand corner."
    ]
  },
  {
    id: "secret-garden",
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    coverUrl: "/assets/book_cover.jpg",
    genre: "Nature / Friendship",
    pages: [
      "When Mary Lennox was sent to Misselthwaite Manor to live with her uncle everybody said she was the most disagreeable-looking child ever seen. It was true, too. She had a little thin face, a little thin body, thin light hair and a sour expression.",
      "Her hair was yellow, and her face was yellow because she had been born in India and had always been ill in one way or another. Her father had held a position under the English Government and had always been busy and ill himself.",
      "Her mother had been a great beauty who cared only to go to important parties and amuse herself with gay people. She had not wanted a little girl at all, and when Mary was born she handed her over to the care of an Ayah [nurse].",
      "So by the time she was six years old she was as tyrannical and selfish a little pig as ever lived. She did not know that there were other children, or that she was supposed to be kind to anyone."
    ]
  },
  {
    id: "velveteen-rabbit",
    title: "The Velveteen Rabbit",
    author: "Margery Williams",
    coverUrl: "/assets/book_cover.jpg",
    genre: "Classics",
    pages: [
      "There was once a velveteen rabbit, and in the beginning he was really splendid. He was fat and bunchy, as a rabbit should be; his coat was spotted with brown and white, he had real thread whiskers, and his ears were lined with pink sateen.",
      "On Christmas morning, when he sat wedged in the top of the Boy's stocking, with a sprig of holly between his paws, the effect was charming. There were other things in the stocking, nuts and oranges and a toy engine, but the Rabbit was quite the best.",
      "For at least two hours the Boy loved him, and then Aunts and Uncles came to dinner, and there was a great rustling of tissue paper and unwrapping of parcels, and in the excitement of looking at all the new presents the Velveteen Rabbit was quite forgotten.",
      "For a long time he lived in the toy cupboard or on the nursery floor, and no one thought very much about him. He was naturally shy, and being only made of velveteen, some of the more expensive toys quite snubbed him."
    ]
  }
];
