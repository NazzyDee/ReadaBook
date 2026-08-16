export interface ChroniclerResponse {
  query: string;
  responseTitle: string;
  body: string;
  tags: string[];
  suggestedFollowUps: string[];
}

export const LORE_KNOWLEDGE_BASE: Record<string, ChroniclerResponse> = {
  aragorn: {
    query: 'aragorn',
    responseTitle: '👑 Aragorn II Elessar (Lineage & Destiny)',
    body: 'Aragorn is the 16th Chieftain of the Dúnedain and rightful heir to the thrones of Arnor and Gondor through his direct ancestor **Isildur**, son of High King **Elendil**. Raised in secret in Rivendell under the name *Estel* ("Hope"), he carries the shards of Narsil (reforged as Andúril).',
    tags: ['Lineage', 'Dúnedain', 'Kings of Men'],
    suggestedFollowUps: ['Who was Isildur?', 'What is the Ring of Barahir?', 'Tell me about Arwen Undómiel']
  },
  isildur: {
    query: 'isildur',
    responseTitle: '⚔️ Isildur (Son of Elendil)',
    body: 'High King of Gondor and Arnor who cut the One Ring from Sauron\'s hand with the hilt-shard of Narsil at the Siege of Barad-dûr (Second Age 3441). He refused to destroy it in Mount Doom, claiming it as weregild for his father\'s death, leading to his demise at the Disaster of the Gladden Fields.',
    tags: ['Second Age', 'High King', 'One Ring'],
    suggestedFollowUps: ['What happened at the Gladden Fields?', 'Who was Elendil?']
  },
  mithril: {
    query: 'mithril',
    responseTitle: '💎 Mithril (True-Silver)',
    body: '**Mithril** is a legendary metal mined by the Dwarves of Moria (Khazad-dûm). It resembles silver but never tarnishes, is lighter than feather, and stronger than tempered steel. Bilbo gave Frodo a mail-shirt of Mithril worth more than the entire Shire.',
    tags: ['Minerals', 'Dwarves', 'Moria'],
    suggestedFollowUps: ['Where was Mithril found?', 'What is the Balrog?']
  },
  balrog: {
    query: 'balrog',
    responseTitle: '🔥 The Balrog of Morgoth (Durin\'s Bane)',
    body: 'A Maia of fire corrupted by Morgoth in the First Age. Slept for millennia beneath Caradhras until Dwarf miners delved too greedily and too deep in the Third Age (1980 T.A.), leading to the ruin of Khazad-dûm. Faced Gandalf the Grey at the Bridge of Khazad-dûm.',
    tags: ['Ainur', 'First Age', 'Moria'],
    suggestedFollowUps: ['What did Gandalf shout at the Bridge?', 'Who was Morgoth?']
  },
  recap: {
    query: 'recap',
    responseTitle: '📜 Chapter 4 Live Story Recap',
    body: '1. **Journey into the Dark**: The Fellowship enters the Great Gates of Moria after deciphering the password *"Mellon"*.\n2. **The Chamber of Mazarbul**: Gandalf discovers the Book of Mazarbul detailing the doomed last stand of Balin\'s colony.\n3. **Drums in the Deep**: Orc archers, cave-trolls, and the fiery terror of Durin\'s Bane corner the company at the Bridge of Khazad-dûm.',
    tags: ['Chapter Summary', 'Key Plot Points', 'Fellowship'],
    suggestedFollowUps: ['Who was Balin?', 'How did Gandalf break the Bridge?']
  }
};

export function queryChroniclerAI(input: string): ChroniclerResponse {
  const lower = input.toLowerCase();

  if (lower.includes('aragorn') || lower.includes('strider') || lower.includes('lineage')) {
    return LORE_KNOWLEDGE_BASE.aragorn;
  }
  if (lower.includes('isildur') || lower.includes('elendil')) {
    return LORE_KNOWLEDGE_BASE.isildur;
  }
  if (lower.includes('mithril') || lower.includes('silver') || lower.includes('armor')) {
    return LORE_KNOWLEDGE_BASE.mithril;
  }
  if (lower.includes('balrog') || lower.includes('flame') || lower.includes('morgoth') || lower.includes('bridge')) {
    return LORE_KNOWLEDGE_BASE.balrog;
  }
  if (lower.includes('recap') || lower.includes('summary') || lower.includes('what happened')) {
    return LORE_KNOWLEDGE_BASE.recap;
  }

  // Default fallback response
  return {
    query: input,
    responseTitle: `📖 The Chronicler Archive: "${input}"`,
    body: `According to the Red Book of Westmarch and ancient elven lore, **"${input}"** holds deep significance in the Third Age of Middle-earth. The archives record that courage, fellowship, and ancient oaths bind the fate of the Free Peoples together during this perilous journey.`,
    tags: ['Lore Archive', 'Third Age', 'Chronicles'],
    suggestedFollowUps: ['Give me a chapter recap', 'Tell me about Aragorn\'s lineage', 'What is Mithril?']
  };
}
