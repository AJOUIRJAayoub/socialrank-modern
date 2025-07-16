'use client';

import { useState } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelCard } from '@/components/channels/ChannelCard';
import { Search, Loader2, TrendingUp, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const { data: channels, isLoading, error } = useChannels(search);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                SocialRank
              </h1>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une chaîne..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Boutons Auth */}
            <div className="flex items-center gap-3">
              {user ? (
                // Si connecté
                <>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user.nom_utilisateur}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                // Si non connecté
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Barre de recherche mobile */}
          <div className="relative w-full mt-4 md:hidden">
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