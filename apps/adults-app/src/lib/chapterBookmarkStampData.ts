export interface MarginStamp {
  id: string;
  readerUsername: string;
  readerAvatar: string;
  quoteSnippet: string;
  sealColor: string;
  pageNumber: number;
  likesCount: number;
  isFeaturedOnStream: boolean;
}

export const DEFAULT_MARGIN_STAMPS: MarginStamp[] = [
  {
    id: 'stamp_1',
    readerUsername: 'RivendellScholar',
    readerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80',
    quoteSnippet: '"All that is gold does not glitter, Not all those who wander are lost..."',
    sealColor: '#ffd700',
    pageNumber: 214,
    likesCount: 142,
    isFeaturedOnStream: true
  },
  {
    id: 'stamp_2',
    readerUsername: 'GondorArchivist',
    readerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80',
    quoteSnippet: '"Even the smallest person can change the course of the future."',
    sealColor: '#00ff88',
    pageNumber: 218,
    likesCount: 98,
    isFeaturedOnStream: false
  },
  {
    id: 'stamp_3',
    readerUsername: 'MoriaDelver',
    readerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&auto=format&fit=crop&q=80',
    quoteSnippet: '"They have taken the Bridge and the Second Hall. We cannot get out. Drums, drums in the deep."',
    sealColor: '#ff3b3b',
    pageNumber: 225,
    likesCount: 185,
    isFeaturedOnStream: false
  }
];
