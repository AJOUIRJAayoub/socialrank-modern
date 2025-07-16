// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { apiClient } from '@/services/api-client';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur et mot de passe requis' },
        { status: 400 }
      );
    }

    console.log('Tentative de connexion pour:', username);

    // Utiliser l'API PHP sur O2switch
    const result = await apiClient.login(username, password);

    console.log('Connexion réussie pour:', result.user.username);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Erreur connexion:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la connexion' },
      { status: 401 }
    );
  }
}