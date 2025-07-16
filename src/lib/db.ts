// src/lib/db.ts - Version améliorée pour connexion distante
import mysql from 'mysql2/promise';

// Configuration pour O2switch
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Options importantes pour O2switch
  connectTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Créer le pool de connexions
let pool: mysql.Pool | null = null;

// Fonction pour obtenir le pool
export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Fonction pour tester la connexion
export async function testConnection() {
  try {
    const connection = await getPool().getConnection();
    console.log('✅ Connexion MySQL réussie !');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error);
    return false;
  }
}

// Fonction query améliorée avec gestion d'erreurs
export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  try {
    const [results] = await getPool().execute(sql, params);
    return results as T[];
  } catch (error) {
    console.error('Database query error:', error);
    
    // Si c'est une erreur de connexion, on donne plus d'infos
    if (error instanceof Error) {
      const mysqlError = error as any; // Type assertion temporaire pour accéder au code
      
      if (mysqlError.code === 'ECONNREFUSED') {
        throw new Error('Impossible de se connecter à la base de données. Vérifiez vos paramètres de connexion.');
      }
      if (mysqlError.code === 'ER_ACCESS_DENIED_ERROR') {
        throw new Error('Accès refusé. Vérifiez votre nom d\'utilisateur et mot de passe.');
      }
      if (mysqlError.code === 'ER_BAD_DB_ERROR') {
        throw new Error('Base de données introuvable. Vérifiez le nom de la base.');
      }
    }
    
    throw error;
  }
}

export default getPool();