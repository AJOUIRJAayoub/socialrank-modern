import { NextResponse } from 'next/server';
import { apiClient } from '@/services/api-client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const channelId = parseInt(params.id);
    
    // Récupérer les vrais votes depuis l'API PHP
    const votesData = await apiClient.getChannelVotes(channelId);
    
    return NextResponse.json(votesData);
    
  } catch (error: any) {
    console.error('Erreur get votes:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération des votes' },
      { status: 500 }
    );
  }
}