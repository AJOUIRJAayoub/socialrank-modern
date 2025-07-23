const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyDWvbwx_UmRXyL6hPWZNKjNd-W7aKcVSgQs';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
  country?: string;
  publishedAt: string;
  customUrl?: string;
  topicCategories?: string[];
}

export const youtubeService = {
  // Récupérer les infos d'une chaîne par ID
  async getChannelById(channelId: string): Promise<YouTubeChannel> {
    const url = `${YOUTUBE_API_BASE}/channels?` + new URLSearchParams({
      part: 'snippet,statistics,topicDetails',
      id: channelId,
      key: YOUTUBE_API_KEY
    });

    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Chaîne non trouvée');
    }
    
    const channel = data.items[0];
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnails: channel.snippet.thumbnails,
      statistics: channel.statistics,
      country: channel.snippet.country,
      publishedAt: channel.snippet.publishedAt,
      customUrl: channel.snippet.customUrl,
      topicCategories: channel.topicDetails?.topicCategories
    };
  },

  // Récupérer plusieurs chaînes
  async getMultipleChannels(channelIds: string[]): Promise<YouTubeChannel[]> {
    const url = `${YOUTUBE_API_BASE}/channels?` + new URLSearchParams({
      part: 'snippet,statistics,topicDetails',
      id: channelIds.join(','),
      maxResults: '50',
      key: YOUTUBE_API_KEY
    });

    const response = await fetch(url);
    const data = await response.json();
    
    return data.items.map((channel: any) => ({
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnails: channel.snippet.thumbnails,
      statistics: channel.statistics,
      country: channel.snippet.country,
      publishedAt: channel.snippet.publishedAt,
      customUrl: channel.snippet.customUrl,
      topicCategories: channel.topicDetails?.topicCategories
    }));
  },

  // Rechercher des chaînes
  async searchChannels(query: string, maxResults: number = 10): Promise<any[]> {
    const url = `${YOUTUBE_API_BASE}/search?` + new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'channel',
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY
    });

    const response = await fetch(url);
    const data = await response.json();
    
    // Pour chaque résultat, on doit faire un appel supplémentaire pour les stats
    const channelIds = data.items.map((item: any) => item.id.channelId);
    if (channelIds.length > 0) {
      return this.getMultipleChannels(channelIds);
    }
    
    return [];
  },

  // Récupérer les chaînes les plus populaires par catégorie/pays
  async getTrendingChannels(categoryId?: string, regionCode: string = 'FR'): Promise<any[]> {
    // Malheureusement, YouTube API ne permet pas de récupérer directement
    // les chaînes les plus populaires. On doit passer par les vidéos trending
    const url = `${YOUTUBE_API_BASE}/videos?` + new URLSearchParams({
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: regionCode,
      categoryId: categoryId || '0',
      maxResults: '50',
      key: YOUTUBE_API_KEY
    });

    const response = await fetch(url);
    const data = await response.json();
    
    // Extraire les IDs de chaînes uniques
    const channelIds = [...new Set(data.items.map((item: any) => item.snippet.channelId))];
    
    // Récupérer les infos des chaînes
    if (channelIds.length > 0) {
      return this.getMultipleChannels(channelIds as string[]);
    }
    
    return [];
  }
};