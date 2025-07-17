import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    return NextResponse.json({
      error: 'NEXT_PUBLIC_API_URL non définie',
      env: process.env
    });
  }
  
  try {
    const testUrl = `${apiUrl}?action=test`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    const text = await response.text();
    
    // Retourner le texte brut pour voir l'erreur
    return NextResponse.json({
      success: false,
      url: testUrl,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: text.substring(0, 1000), // Premiers 1000 caractères
      isHtml: text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'Erreur fetch',
      message: error.message,
      apiUrl
    });
  }
}