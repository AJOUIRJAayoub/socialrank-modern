import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/services/api-client';

export async function POST(request: Request) {
  try {
    const { channelId, theme } = await request.json();
    
    // Vérifier l'authentification
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour voter' },
        { status: 401 }
      );
    }
    
    // Appeler l'API PHP pour sauvegarder le vote
    const result = await apiClient.voteTheme(channelId, theme);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Erreur vote:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du vote' },
      { status: 500 }
    );
  }
}