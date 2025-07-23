import { NextResponse } from 'next/server';
import { youtubeService } from '@/services/youtube.service';

// Liste des IDs de chaînes populaires (vous pouvez la personnaliser)
const POPULAR_CHANNELS = {
  gaming: [
    'UCX6OQ3DkcsbYNE6H8uQQuVA', // MrBeast
    'UC-lHJZR3Gqxm24_Vd_AJ5Yw', // PewDiePie
    'UCYzPXprvl5Y-Sf0g4vX-m6g', // Markiplier
    'UCtinbF-Q-fVthA0qrFQTgXQ', // CaseyNeistat
  ],
  music: [
    'UCq-Fj5jknLsUf-MWSy4_brA', // T-Series
    'UC9CoOnJkIBMdeijd9qYoT_g', // Blackpink
    'UCIwFjwMjI0y7PDBVEO9-bkQ', // Justin Bieber
  ],
  kids: [
    'UCbCmjCuTUZos6Inko4u57UQ', // Cocomelon
    'UCtxdfwb9wfkoGocVUAJ-Bmg', // Vlad and Niki
  ],
  france: [
    'UCWeg2Pkate69NFdBeuRFTAw', // SQUEEZIE
    'UCyWqModMQlbIo8274Wh_ZsQ', // Cyprien
    'UCaNlbnghtwlsGF-KzAFThqA', // Norman
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search');
  
  try {
    let channels: any[] = [];
    
    if (search) {
      // Si recherche, utiliser l'API de recherche
      channels = await youtubeService.searchChannels(search);
    } else if (category === 'all') {
      // Récupérer toutes les chaînes populaires
      const allChannelIds = Object.values(POPULAR_CHANNELS).flat();
      channels = await youtubeService.getMultipleChannels(allChannelIds);
    } else if (POPULAR_CHANNELS[category as keyof typeof POPULAR_CHANNELS]) {
      // Récupérer par catégorie
      const categoryChannelIds = POPULAR_CHANNELS[category as keyof typeof POPULAR_CHANNELS];
      channels = await youtubeService.getMultipleChannels(categoryChannelIds);
    }
    
    // Formater les données pour votre app
    const formattedChannels = channels.map(channel => ({
      id: channel.id,
      nom: channel.title,
      youtube_id: channel.id,
      abonnes: parseInt(channel.statistics.subscriberCount),
      vues: parseInt(channel.statistics.viewCount),
      nb_videos: parseInt(channel.statistics.videoCount),
      pays: channel.country || 'N/A',
      date_creation: channel.publishedAt,
      description: channel.description,
      avatar: channel.thumbnails.high.url,
      categories: channel.topicCategories || [],
      custom_url: channel.customUrl
    }));
    
    // Trier par nombre d'abonnés
    formattedChannels.sort((a, b) => b.abonnes - a.abonnes);
    
    return NextResponse.json(formattedChannels);
    
  } catch (error) {
    console.error('Erreur YouTube API:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données YouTube' },
      { status: 500 }
    );
  }
}