// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { apiClient } from '@/services/api-client';

export async function GET() {
  try {
    const result = await apiClient.testConnection();
    
    return NextResponse.json({
      success: true,
      message: '✅ Connexion à l\'API O2switch OK!',
      ...result
    });
  } catch (error: any) {
    console.error('Erreur test API:', error);
    return NextResponse.json({
      success: false,
      message: '❌ Erreur de connexion à l\'API',
      error: error.message,
      hint: 'Vérifiez que NEXT_PUBLIC_API_URL est bien défini dans .env.local'
    }, { status: 500 });
  }
}