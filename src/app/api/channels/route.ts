import { NextResponse } from 'next/server';
import { apiClient } from '@/services/api-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    
    // Récupérer les vraies données depuis l'API PHP
    const channels = await apiClient.getChannels(search);
    
    return NextResponse.json(channels);
    
  } catch (error) {
    console.error('Erreur channels:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des chaînes' },
      { status: 500 }
    );
  }
}