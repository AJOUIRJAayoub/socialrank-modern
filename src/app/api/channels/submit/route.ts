import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/services/api-client';

export async function POST(request: Request) {
  console.log('=== Submit Channel API Called ===');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { youtubeId, url, nom } = body;
    
    // Vérifier l'authentification
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      );
    }
    
    // Validation des données
    if (!youtubeId || !url) {
      console.log('Missing required data:', { youtubeId: !!youtubeId, url: !!url });
      return NextResponse.json(
        { error: 'ID YouTube et URL requis' },
        { status: 400 }
      );
    }
    
    // Nom par défaut si non fourni
    const channelName = nom || youtubeId;
    
    console.log('Calling PHP API with:', { youtubeId, url, nom: channelName });
    
    // Appeler l'API PHP pour sauvegarder dans la BDD
    const result = await apiClient.submitChannel(youtubeId, url, channelName);
    
    console.log('PHP API response:', result);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('=== Submit Error ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    
    // Si c'est une erreur de l'API
    if (error.message) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la soumission' },
      { status: 500 }
    );
  }
}