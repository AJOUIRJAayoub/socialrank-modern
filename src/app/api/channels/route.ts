import { NextResponse } from 'next/server';

// Données de test en attendant l'accès à l'API
const FAKE_CHANNELS = [
  { id: 1, nom: "Squeezie", abonnes: 18500000 },
  { id: 2, nom: "Cyprien", abonnes: 14200000 },
  { id: 3, nom: "Norman", abonnes: 12100000 },
  { id: 4, nom: "Tibo InShape", abonnes: 9800000 },
  { id: 5, nom: "Amixem", abonnes: 8200000 },
];

export async function GET() {
  return NextResponse.json(FAKE_CHANNELS);
}