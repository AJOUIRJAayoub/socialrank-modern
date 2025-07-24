import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
    if (!youtubeId || !nom) {
      console.log('Missing required data:', { youtubeId: !!youtubeId, nom: !!nom });
      return NextResponse.json(
        { error: 'ID YouTube et nom requis' },
        { status: 400 }
      );
    }
    
    console.log('Calling PHP API with:', { youtubeId, url, nom, token: token.value });
    
    // Appeler directement l'API PHP depuis le serveur (pas de CORS ici)
    const response = await fetch('https://abc123go.ranki5.com/api.php?action=submit_channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        youtubeId,
        url: url || `https://youtube.com/channel/${youtubeId}`,
        nom,
        token: token.value
      })
    });
    
    const result = await response.json();
    console.log('PHP API response:', result);
    
    if (!response.ok || result.error) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de la soumission' },
        { status: response.status || 400 }
      );
    }
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('=== Submit Error ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la soumission' },
      { status: 500 }
    );
  }
}