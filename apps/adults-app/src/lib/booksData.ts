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
    id: "alice-in-wonderland",
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    coverUrl: "/assets/book_cover.jpg",
    genre: "Fantasy",
    pages: [
      "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?'",
      "So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.",
      "There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!' (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural);",
      "But when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.",
      "In another moment down went Alice after it, never once considering how in the world she was to get out again. The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well."
    ]
  },
  {
    id: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    coverUrl: "/assets/book_cover.jpg",
    genre: "Sci-Fi / Classics",
    pages: [
      "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.",
      "I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.",
      "Inspirited by this wind of promise, my daydreams become more fervent and vivid. I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight.",
      "There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour. There—for with your leave, my sister, I will put some trust in preceding navigators—there snow and frost are banished; and sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe."
    ]
  },
  {
    id: "the-time-machine",
    title: "The Time Machine",
    author: "H.G. Wells",
    coverUrl: "/assets/book_cover.jpg",
    genre: "Sci-Fi",
    pages: [
      "The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burned brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses.",
      "Our chairs, being his patents, embraced and caressed us rather than submitted to being sat upon, and there was that luxurious after-dinner atmosphere when thought runs gracefully free of the trammels of precision. And he put it to us in this way, marking the points with a lean forefinger, as we sat and lazily admired his earnestness over this new paradox (as we thought it) which he had thought fit to lay before us.",
      "'You must follow me carefully. I shall have to uncontrovert one or two ideas that are almost universally accepted. The geometry, for instance, they taught you at school is founded on a misconception.'",
      "'Is not that rather a large thing to expect us to begin upon?' said Filby, an argumentative person with red hair. 'I do not mean to ask you to accept anything without reasonable ground for it. You will soon admit as much as I need from you. You know of course that a mathematical line, a line of thickness nil, has no real existence. They taught you that? Nor a mathematical plane. These things are mere abstractions.'"
    ]
  },
  {
    id: "metamorphosis",
    title: "The Metamorphosis",
    author: "Franz Kafka",
    coverUrl: "/assets/book_cover.jpg",
    genre: "Fiction / Classics",
    pages: [
      "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.",
      "The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. 'What's happened to me?' he thought. It wasn't a dream.",
      "His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table—Samsa was a travelling salesman—and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.",
      "It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather. Drops of rain could be heard hitting the pane, which made him feel quite sad."
    ]
  },
  {
    id: "scarlet-letter",
    title: "The Scarlet Letter",
    author: "Nathaniel Hawthorne",
    coverUrl: "/assets/book_cover.jpg",
    genre: "Drama / Classics",
    pages: [
      "A throng of bearded men, in sad-colored garments and gray, steeple-crowned hats, intermixed with women, some wearing hoods, and others bareheaded, was assembled in front of a wooden edifice, the door of which was heavily timbered with oak, and studded with iron spikes.",
      "The founders of a new colony, whatever Utopia of human virtue and happiness they might originally project, have invariably recognized it among their earliest practical necessities to allot a portion of the virgin soil as a cemetery, and another portion as the site of a prison.",
      "In accordance with this rule, it may safely be assumed that the forefathers of Boston had built the first prison-house, somewhere in the vicinity of Cornhill, almost as seasonably as they marked out the first burial-ground, on Isaac Johnson's lot, and round about his grave, which subsequently became the nucleus of all the congregated sepulchres in the old churchyard of King's Chapel.",
      "Certain it is, that, some fifteen or twenty years after the settlement of the town, the wooden jail was already marked with weather-stains and other indications of age, which gave a yet darker aspect to its beetle-browed and gloomy front."
    ]
  },
  {
    id: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    coverUrl: "/assets/book_cover.jpg",
    genre: "Horror / Gothic",
    pages: [
      "3 May. Bistritz.—Left Munich at 8:35 P.M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little walk I had through the streets.",
      "I feared to go very far from the station, as we had arrived late and would start as near the correct time as possible. The impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule.",
      "We left in pretty good time, and came after nightfall to Klausenburgh. Here I stopped for the night at the Hotel Royale. I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but made me thirsty. (Mem., get recipe for Mina.)",
      "I asked the waiter, and he said it was called 'paprika hendl,' and that, as it was a national dish, I should be able to get it anywhere along the Carpathians. I found my smattering of German very useful; indeed, I don't know how I should be able to get on without it."
    ]
  }
];

export const getBookById = (id: string): Book | undefined => {
  return books.find(b => b.id === id);
};
