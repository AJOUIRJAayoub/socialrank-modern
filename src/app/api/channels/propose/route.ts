import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // TODO: Sauvegarder dans la base de données
  console.log('Nouvelle proposition:', data);
  
  return NextResponse.json({
    success: true,
    message: 'Chaîne proposée avec succès'
  });
}