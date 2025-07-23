import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface CountResult {
  total: number;
}

export async function GET() {
  try {
    // Test de connexion
    const tables = await query('SHOW TABLES');
    
    // Vérifier la structure de la table chaines
    const columns = await query('SHOW COLUMNS FROM chaines');
    
    // Compter les enregistrements
    const countResult = await query<CountResult>('SELECT COUNT(*) as total FROM chaines');
    
    // Essayer de récupérer quelques enregistrements
    const sampleData = await query('SELECT id, nom, abonnes FROM chaines LIMIT 3');
    
    return NextResponse.json({
      success: true,
      tables: tables,
      columns: columns,
      count: countResult[0]?.total || 0,
      sampleData: sampleData,
      dbInfo: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      stack: (error as Error).stack
    });
  }
}