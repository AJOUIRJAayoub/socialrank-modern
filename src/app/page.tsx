'use client';

import { useState } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelCard } from '@/components/channels/ChannelCard';
import { SubmitChannelForm } from '@/components/channels/SubmitChannelForm';
import { Search, Loader2, TrendingUp, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const { data: channels, isLoading, error, refetch } = useChannels(search);
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
                    <span className="font-medium">{user.username}</span>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des chaînes - Colonne principale */}
          <div className="lg:col-span-2">
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

            {channels && channels.length === 0 && (
              <div className="bg-gray-100 text-gray-600 p-8 rounded-lg text-center">
                <p className="text-lg">Aucune chaîne trouvée</p>
                {search && (
                  <p className="mt-2">Essayez avec d'autres mots-clés</p>
                )}
              </div>
            )}

            {channels && channels.length > 0 && (
              <div className="grid gap-4">
                {channels.map((channel: any, index: number) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Colonne droite */}
          <div className="space-y-6">
            {/* Formulaire de soumission - Visible seulement si connecté */}
            {user && <SubmitChannelForm />}
            
            {/* Widget de statistiques */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Statistiques
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chaînes référencées</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {channels ? channels.length : 0}
                  </p>
                </div>
                {channels && channels.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total d'abonnés</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {channels.reduce((sum: number, ch: any) => sum + (ch.abonnes || 0), 0).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Call to action si non connecté */}
            {!user && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  Rejoignez la communauté !
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                  Connectez-vous pour proposer des chaînes et voter pour leurs thèmes.
                </p>
                <Link
                  href="/auth/register"
                  className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  S'inscrire gratuitement
                </Link>
              </div>
            )}

            {/* Top des thèmes */}
            {channels && channels.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Top des thèmes</h3>
                <div className="space-y-2">
                  {/* Calculer les thèmes les plus populaires */}
                  {(() => {
                    const themeCounts: Record<string, number> = {};
                    channels.forEach((ch: any) => {
                      if (ch.theme_principal) {
                        themeCounts[ch.theme_principal] = (themeCounts[ch.theme_principal] || 0) + 1;
                      }
                    });
                    
                    return Object.entries(themeCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([theme, count]) => (
                        <div key={theme} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{theme}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {count} chaîne{count > 1 ? 's' : ''}
                          </span>
                        </div>
                      ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}