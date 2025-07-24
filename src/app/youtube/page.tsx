'use client';

import React, { useState } from 'react';
import { Trophy, Gamepad2, Music, Baby, ChevronRight, Plus, Flag, TrendingUp, Users, Crown } from 'lucide-react';
import { AdSpace } from '@/components/ads/AdSpace';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { SubmitChannelForm } from '@/components/channels/SubmitChannelForm';
import { useChannels } from '@/hooks/useChannels';
import ChannelCard from '@/components/channels/ChannelCard';

export default function YouTubePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyTop100, setShowOnlyTop100] = useState(false);
  const [showOnlyCommunity, setShowOnlyCommunity] = useState(false);
  const [search, setSearch] = useState('');
  
  // Utiliser le filtre 'all' pour avoir toutes les chaînes
  const { data: channels, isLoading, error } = useChannels(search, 'all');
  const { user } = useAuth();

  // Filtrer les chaînes selon les options sélectionnées
  const filteredChannels = channels?.filter((channel: any) => {
    if (showOnlyTop100 && !channel.is_top100) return false;
    if (showOnlyCommunity && channel.is_top100) return false;
    if (selectedCategory !== 'all' && channel.theme_principal !== selectedCategory) return false;
    return true;
  }) || [];

  // Obtenir les catégories uniques
  const categories: string[] = [...new Set(channels?.map((ch: any) => ch.theme_principal).filter(Boolean) || [])] as string[];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header unifié */}
      <Header 
        showSearch={true}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Hero section avec boutons */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Classement YouTube Complet</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Découvrez toutes les chaînes : Top 100 mondial + Chaînes de la communauté
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowOnlyTop100(!showOnlyTop100);
                  setShowOnlyCommunity(false);
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  showOnlyTop100 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Crown className="w-4 h-4" />
                Top 100
              </button>
              <button
                onClick={() => {
                  setShowOnlyCommunity(!showOnlyCommunity);
                  setShowOnlyTop100(false);
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  showOnlyCommunity 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                Communauté
              </button>
            </div>
          </div>

          {/* Filtres par catégorie */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm transition ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Toutes
            </button>
            {categories.map((category: string) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Pub banner */}
        <div className="mb-8 flex justify-center">
          <AdSpace format="banner" />
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale - Liste des chaînes */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des chaînes...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                Erreur lors du chargement des chaînes
              </div>
            )}

            {!isLoading && filteredChannels.length === 0 && (
              <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg text-center">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Aucune chaîne trouvée avec ces critères
                </p>
              </div>
            )}

            {filteredChannels.length > 0 && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {filteredChannels.length} chaîne{filteredChannels.length > 1 ? 's' : ''} trouvée{filteredChannels.length > 1 ? 's' : ''}
                    {showOnlyTop100 && ' (Top 100 uniquement)'}
                    {showOnlyCommunity && ' (Communauté uniquement)'}
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredChannels.map((channel: any, index: number) => (
                    <div key={channel.id} className="relative">
                      <ChannelCard
                        channel={channel}
                        rank={index + 1}
                        isUserLoggedIn={!!user}
                      />
                      {/* Badge Top 100 ou Communauté */}
                      <div className="absolute top-2 right-2">
                        {channel.is_top100 ? (
                          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Top 100
                          </span>
                        ) : (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Communauté
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pub carrée au milieu */}
            <div className="flex justify-center py-6">
              <AdSpace format="square" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Formulaire de soumission pour les utilisateurs connectés */}
            {user && <SubmitChannelForm />}

            {/* Call to action si non connecté */}
            {!user && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  Proposez vos chaînes !
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                  Connectez-vous pour ajouter vos chaînes YouTube préférées.
                </p>
                <Link
                  href="/auth/login"
                  className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mb-2"
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  S'inscrire gratuitement
                </Link>
              </div>
            )}

            {/* Pub verticale sticky */}
            <div className="sticky top-24">
              <AdSpace format="vertical" />
              
              {/* Stats globales */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">📊 Statistiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total chaînes</span>
                    <span className="font-bold text-lg">{channels?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Top 100</span>
                    <span className="font-bold text-lg text-yellow-600">
                      {channels?.filter((ch: any) => ch.is_top100).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Communauté</span>
                    <span className="font-bold text-lg text-blue-600">
                      {channels?.filter((ch: any) => !ch.is_top100).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Catégories</span>
                    <span className="font-bold text-lg">{categories.length}</span>
                  </div>
                </div>
                
                <Link
                  href="/"
                  className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Voir le Top 100
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}