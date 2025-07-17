// src/services/youtube.ts
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function getChannelInfo(channelId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?` +
    `part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
  );
  
  const data = await response.json();
  const channel = data.items[0];
  
  return {
    youtube_id: channel.id,
    nom: channel.snippet.title,
    description: channel.snippet.description,
    image: channel.snippet.thumbnails.high.url,
    abonnes: parseInt(channel.statistics.subscriberCount),
    vues: parseInt(channel.statistics.viewCount),
    videos: parseInt(channel.statistics.videoCount)
  };
}