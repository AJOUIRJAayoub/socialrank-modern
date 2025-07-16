// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { apiClient } from '@/services/api-client';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    // Validation
    if (!username || !password || !email) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit faire au moins 6 caractères' },
        { status: 400 }
      );
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }
    
    console.log('Tentative d\'inscription:', { username, email });
    
    // Utiliser l'API PHP sur O2switch
    const result = await apiClient.register(username, email, password);
    
    console.log('Inscription réussie pour:', result.user.username);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Erreur inscription:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}