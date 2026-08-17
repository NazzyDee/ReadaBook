export interface PodcastEpisode {
  episodeId: string;
  episodeNumber: number;
  title: string;
  durationMinutes: number;
  publishDate: string;
  isPublishedToSpotify: boolean;
  isPublishedToApplePodcasts: boolean;
  totalPodcastPlays: number;
}

export interface PodcastShowChannel {
  showTitle: string;
  feedRssUrl: string;
  podcastAuthor: string;
  episodes: PodcastEpisode[];
}

export const DEFAULT_PODCAST_SHOW: PodcastShowChannel = {
  showTitle: "The Tolkien Book Club Live Stream Archive",
  feedRssUrl: 'https://api.readabook.tv/v1/rss/nazzydee/tolkien-archives.xml',
  podcastAuthor: 'NazzyDee & ReadaBook Productions',
  episodes: [
    {
      episodeId: 'ep_102',
      episodeNumber: 102,
      title: 'Chapter 15: The Council of Elrond & The Breaking of the Fellowship',
      durationMinutes: 102,
      publishDate: 'Aug 16, 2026',
      isPublishedToSpotify: true,
      isPublishedToApplePodcasts: true,
      totalPodcastPlays: 4210
    },
    {
      episodeId: 'ep_101',
      episodeNumber: 101,
      title: 'Chapter 14: Flight to the Ford & The Nazgûl Attack',
      durationMinutes: 89,
      publishDate: 'Aug 14, 2026',
      isPublishedToSpotify: true,
      isPublishedToApplePodcasts: true,
      totalPodcastPlays: 6180
    }
  ]
};
