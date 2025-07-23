'use client';

import { useState } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelCard } from '@/components/channels/ChannelCard';
import { SubmitChannelForm } from '@/components/channels/SubmitChannelForm';
import { Loader2, TrendingUp, RefreshCw, Youtube, Download, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const { data: channels, isLoading, error, refetch } = useChannels(search);
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === 'admin' || user?.email === 'ayoub.ajouirja49@outlook.fr';

  // Fonction pour synchroniser avec YouTube
  const syncWithYouTube = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/channels/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.synced} chaînes synchronisées avec succès !`);
        refetch();
      } else {
        alert('❌ Erreur lors de la synchronisation');
      }
    } catch (error) {
      console.error('Erreur sync:', error);
      alert('❌ Erreur lors de la synchronisation');
    } finally {
      setIsSyncing(false);
    }
  };

  const importTop100 = async () => {
    if (!confirm('Importer les 100 plus grosses chaînes YouTube mondiales ? Cela peut prendre 1-2 minutes.')) {
      return;
    }
    
    setIsImporting(true);
    try {
      const response = await fetch('https://abc123go.ranki5.com/youtube-top-100.php?action=import');
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Import terminé !\n\n${data.imported} chaînes importées sur ${data.total}`);
        window.location.reload();
      } else {
        alert('❌ Erreur lors de l\'import');
      }
    } catch (error) {
      console.error('Erreur import:', error);
      alert('❌ Erreur lors de l\'import');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header avec recherche */}
      <Header 
        showSearch={true}
        searchValue={search}
        onSearchChange={setSearch}
      />

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

            {channels && channels.length === 0 && !search && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-lg text-center">
                <Youtube className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
                <p className="text-lg font-semibold mb-2">Découvrez les plus grandes chaînes YouTube</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {isAdmin ? 'Cliquez sur "Importer Top 100" pour commencer' : 'Les chaînes seront bientôt disponibles'}
                </p>
              </div>
            )}

            {channels && channels.length === 0 && search && (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 p-8 rounded-lg text-center">
                <p className="text-lg">Aucune chaîne trouvée</p>
                <p className="mt-2">Essayez avec d'autres mots-clés</p>
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
            {/* Section Admin - Visible uniquement pour les admins */}
            {isAdmin && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg shadow-lg p-6 border border-purple-200 dark:border-purple-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-900 dark:text-purple-100">
                  <Shield className="w-5 h-5" />
                  Administration
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                  Fonctions réservées aux administrateurs
                </p>
                <button
                  onClick={importTop100}
                  disabled={isImporting || isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors mb-3"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Importer Top 100 YouTube
                    </>
                  )}
                </button>
                
                <button
                  onClick={syncWithYouTube}
                  disabled={isSyncing || channels?.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Synchronisation...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Mettre à jour les données
                    </>
                  )}
                </button>
                
                {channels && channels.length > 0 && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 text-center">
                    Dernière sync: {new Date().toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            )}

            {/* Formulaire de soumission - Visible seulement si connecté */}
            {user && <SubmitChannelForm />}
            
            {/* Widget de statistiques amélioré */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Statistiques globales
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chaînes référencées</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {channels ? channels.length : 0}
                  </p>
                </div>
                {channels && channels.length > 0 && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total d'abonnés</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatBigNumber(channels.reduce((sum: number, ch: any) => sum + (ch.abonnes || 0), 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total de vues</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatBigNumber(channels.reduce((sum: number, ch: any) => sum + (ch.vues || 0), 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total de vidéos</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatBigNumber(channels.reduce((sum: number, ch: any) => sum + (ch.videos || 0), 0))}
                      </p>
                    </div>
                    <div className="pt-3 border-t dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne d'abonnés</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatBigNumber(Math.round(channels.reduce((sum: number, ch: any) => sum + (ch.abonnes || 0), 0) / channels.length))}
                      </p>
                    </div>
                  </>
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

            {/* Top des thèmes amélioré */}
            {channels && channels.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Top des thèmes</h3>
                <div className="space-y-3">
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
                      .map(([theme, count], index) => (
                        <div key={theme} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium px-2 py-1 rounded ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                              index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                              index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                              'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                            }`}>
                              #{index + 1}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{theme}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {count} chaîne{count > 1 ? 's' : ''}
                          </span>
                        </div>
                      ));
                  })()}
                </div>
              </div>
            )}

            {/* Top des pays */}
            {channels && channels.length > 0 && channels.some((ch: any) => ch.pays) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Répartition par pays</h3>
                <div className="space-y-2">
                  {(() => {
                    const countryCounts: Record<string, number> = {};
                    channels.forEach((ch: any) => {
                      if (ch.pays) {
                        countryCounts[ch.pays] = (countryCounts[ch.pays] || 0) + 1;
                      }
                    });
                    
                    const flags: Record<string, string> = {
                      'US': '🇺🇸 États-Unis',
                      'IN': '🇮🇳 Inde',
                      'KR': '🇰🇷 Corée du Sud',
                      'UK': '🇬🇧 Royaume-Uni',
                      'FR': '🇫🇷 France',
                      'CA': '🇨🇦 Canada',
                      'DE': '🇩🇪 Allemagne',
                      'ES': '🇪🇸 Espagne',
                      'JP': '🇯🇵 Japon',
                      'BR': '🇧🇷 Brésil',
                      'RU': '🇷🇺 Russie',
                      'UA': '🇺🇦 Ukraine',
                      'SE': '🇸🇪 Suède',
                      'AR': '🇦🇷 Argentine',
                      'RO': '🇷🇴 Roumanie',
                      'CN': '🇨🇳 Chine',
                      'AU': '🇦🇺 Australie',
                      'IE': '🇮🇪 Irlande',
                      'SV': '🇸🇻 Salvador',
                      'CH': '🇨🇭 Suisse',
                      'CY': '🇨🇾 Chypre'
                    };
                    
                    return Object.entries(countryCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([country, count]) => (
                        <div key={country} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {flags[country] || country}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {count}
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

// Fonction pour formater les grands nombres
function formatBigNumber(num: number): string {
  if (num >= 1000000000000) return `${(num / 1000000000000).toFixed(1)}T`;
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}