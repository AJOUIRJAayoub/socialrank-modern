#!/bin/bash

# Script de configuration pour SocialRank Modern
echo "🚀 Configuration de SocialRank Modern..."

# Créer la structure des dossiers
echo "📁 Création de la structure des dossiers..."
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/components/channels
mkdir -p src/components/dashboard
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/hooks
mkdir -p src/services
mkdir -p public/images

# Créer le fichier .env.local
echo "🔐 Création du fichier .env.local..."
cat > .env.local << 'EOL'
# Base de données O2switch
DB_HOST=localhost
DB_PORT=3306
DB_USER=sc1roju7890
DB_PASS=VotreMotDePasse
DB_NAME=sc1roju7890_socialrank

# YouTube API
YOUTUBE_API_KEY=AIzaSyDWvbwx_UmRXyL6hPWZNKjNd-W7aKcVSgQ

# URL de l'API (pour production)
NEXT_PUBLIC_API_URL=http://localhost:3000
EOL

# Créer les fichiers de types TypeScript
echo "📝 Création des types TypeScript..."
cat > src/types/index.ts << 'EOL'
export interface Channel {
  id: number;
  youtube_id: string;
  nom: string;
  description?: string;
  abonnes: number;
  vues?: number;
  videos?: number;
  image?: string;
  categorie?: string;
  langue_principale?: string;
  date_ajout: string;
  derniere_maj: string;
}

export interface User {
  id: number;
  nom_utilisateur: string;
  email?: string;
  role: 'admin' | 'user';
}

export interface Stats {
  id: number;
  chaine_id: number;
  abonnes: number;
  vues: number;
  videos: number;
  date_collecte: string;
}
EOL

# Créer la configuration de la base de données
echo "🗄️ Configuration de la base de données..."
cat > src/lib/db.ts << 'EOL'
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;
EOL

# Créer le service API pour les chaînes
echo "🔌 Création des services API..."
cat > src/services/channels.ts << 'EOL'
import { Channel, Stats } from '@/types';
import { query } from '@/lib/db';

export const channelsService = {
  async getAll(): Promise<Channel[]> {
    return query<Channel>('SELECT * FROM chaines ORDER BY abonnes DESC');
  },

  async getById(id: number): Promise<Channel | null> {
    const results = await query<Channel>('SELECT * FROM chaines WHERE id = ?', [id]);
    return results[0] || null;
  },

  async getStats(channelId: number, days: number = 30): Promise<Stats[]> {
    return query<Stats>(
      `SELECT * FROM historique_stats 
       WHERE chaine_id = ? 
       AND date_collecte >= DATE_SUB(NOW(), INTERVAL ? DAY)
       ORDER BY date_collecte ASC`,
      [channelId, days]
    );
  },

  async search(searchTerm: string): Promise<Channel[]> {
    return query<Channel>(
      'SELECT * FROM chaines WHERE nom LIKE ? ORDER BY abonnes DESC',
      [`%${searchTerm}%`]
    );
  }
};
EOL

# Créer le fichier API route pour les chaînes
echo "🛣️ Création des routes API..."
mkdir -p src/app/api/channels
cat > src/app/api/channels/route.ts << 'EOL'
import { NextResponse } from 'next/server';
import { channelsService } from '@/services/channels';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    const channels = search 
      ? await channelsService.search(search)
      : await channelsService.getAll();
    
    return NextResponse.json(channels);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des chaînes' },
      { status: 500 }
    );
  }
}
EOL

# Créer le hook personnalisé pour les chaînes
echo "🪝 Création des hooks React..."
cat > src/hooks/useChannels.ts << 'EOL'
import { useQuery } from '@tanstack/react-query';
import { Channel } from '@/types';

async function fetchChannels(search?: string): Promise<Channel[]> {
  const url = search 
    ? `/api/channels?search=${encodeURIComponent(search)}`
    : '/api/channels';
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erreur de chargement');
  return response.json();
}

export function useChannels(search?: string) {
  return useQuery({
    queryKey: ['channels', search],
    queryFn: () => fetchChannels(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
EOL

# Créer le provider pour React Query
echo "🎨 Configuration des providers..."
cat > src/app/providers.tsx << 'EOL'
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
EOL

# Créer un composant Card pour les chaînes
echo "🎴 Création des composants UI..."
cat > src/components/channels/ChannelCard.tsx << 'EOL'
'use client';

import { Channel } from '@/types';
import { Users, Eye, Video, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChannelCardProps {
  channel: Channel;
  rank: number;
}

export function ChannelCard({ channel, rank }: ChannelCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl font-bold text-gray-400">#{rank}</div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {channel.nom}
          </h3>
          
          {channel.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {channel.description}
            </p>
          )}
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">{formatNumber(channel.abonnes)}</span>
            </div>
            
            {channel.vues && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">{formatNumber(channel.vues)}</span>
              </div>
            )}
            
            {channel.videos && (
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">{channel.videos}</span>
              </div>
            )}
          </div>
        </div>
        
        {channel.image && (
          <img
            src={channel.image}
            alt={channel.nom}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
      </div>
    </motion.div>
  );
}
EOL

# Créer le layout principal
echo "🏗️ Configuration du layout..."
cat > src/app/layout.tsx << 'EOL'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SocialRank - Classement YouTube',
  description: 'Suivez l\'évolution des chaînes YouTube françaises',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
EOL

# Créer la page d'accueil
echo "🏠 Création de la page d'accueil..."
cat > src/app/page.tsx << 'EOL'
'use client';

import { useState } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelCard } from '@/components/channels/ChannelCard';
import { Search, Loader2, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const { data: channels, isLoading, error } = useChannels(search);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                SocialRank
              </h1>
            </div>
            
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une chaîne..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Erreur lors du chargement des chaînes
          </div>
        )}

        {channels && (
          <div className="grid gap-4">
            {channels.map((channel, index) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                rank={index + 1}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
EOL

echo "✅ Configuration terminée !"
echo ""
echo "🎯 Prochaines étapes :"
echo "1. Modifiez le fichier .env.local avec votre mot de passe MySQL"
echo "2. Lancez le serveur de développement : npm run dev"
echo "3. Ouvrez http://localhost:3000"
echo ""
echo "💡 N'oubliez pas d'ajouter .env.local à votre .gitignore !"