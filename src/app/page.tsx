'use client';

import { useState } from 'react';
import { useChannels } from '@/hooks/useChannels';
import ChannelCard from '@/components/channels/ChannelCard';
import { Loader2, TrendingUp, RefreshCw, Youtube, Download, Shield, Crown, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';

export default function HomePage() {
  const [search, setSearch] = useState('');
  // Utiliser le filtre top100 pour cette page
  const { data: channels, isLoading, error, refetch } = useChannels(search, 'top100');
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === 'admin' || user?.email === 'ayoub.ajouirja49@outlook.fr' || user?.username === 'test';

  // Fonction pour synchroniser avec YouTube (ancienne)
  const syncWithYouTube = async () => {
    setIsSyncing(true);
    try {
      // Récupérer le token
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch('https://abc123go.ranki5.com/api.php?action=update_all_stats', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Mise à jour terminée !\n\n${data.updated} chaînes mises à jour sur ${data.total}\n\nActualisez la page pour voir les changements.`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert(`❌ Erreur: ${data.error || 'Erreur lors de la synchronisation'}`);
      }
    } catch (error) {
      console.error('Erreur sync:', error);
      alert('❌ Erreur lors de la synchronisation');
    } finally {
      setIsSyncing(false);
    }
  };

  // Nouvelle fonction pour mettre à jour les stats
  const updateAllStats = async () => {
    if (!confirm('Mettre à jour les statistiques des chaînes ? Cela peut prendre quelques secondes.')) {
      return;
    }
    
    setIsUpdatingStats(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch('https://abc123go.ranki5.com/api.php?action=update_all_stats', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Statistiques mises à jour !\n\n${data.updated} chaînes actualisées\n${data.errors?.length > 0 ? `\nErreurs: ${data.errors.join(', ')}` : ''}`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert(`❌ ${data.error || 'Erreur lors de la mise à jour'}`);
      }
    } catch (error) {
      console.error('Erreur update stats:', error);
      alert('❌ Erreur lors de la mise à jour des statistiques');
    } finally {
      setIsUpdatingStats(false);
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

  // Calculer les stats des chaînes sans données
  const channelsWithoutStats = channels?.filter((ch: any) => ch.abonnes === 0).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header avec recherche */}
      <Header 
        showSearch={true}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Bannière Top 100 */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <Crown className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Top 100 des plus grandes chaînes YouTube mondiales</h1>
            <Crown className="w-8 h-8" />
          </div>
          <p className="text-center mt-2 text-yellow-100">
            Les géants de YouTube classés par nombre d'abonnés
          </p>
        </div>
      </div>

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
                <p className="text-lg">Aucune chaîne trouvée dans le Top 100</p>
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
                    isUserLoggedIn={!!user}
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
                
                {/* Bouton Import Top 100 */}
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
                
                {/* Nouveau bouton de mise à jour des stats */}
                <button
                  onClick={updateAllStats}
                  disabled={isUpdatingStats || channels?.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors mb-3"
                >
                  {isUpdatingStats ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mise à jour en cours...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      Actualiser les statistiques
                    </>
                  )}
                </button>
                
                {/* Ancien bouton de sync (gardé pour compatibilité) */}
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
                      Sync YouTube (Legacy)
                    </>
                  )}
                </button>
                
                {/* Informations sur les chaînes sans stats */}
                {channelsWithoutStats > 0 && (
                  <div className="mt-3 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-xs text-orange-800 dark:text-orange-200">
                      ⚠️ {channelsWithoutStats} chaîne{channelsWithoutStats > 1 ? 's' : ''} sans statistiques
                    </p>
                  </div>
                )}
                
                {channels && channels.length > 0 && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 text-center">
                    Dernière sync: {new Date().toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            )}

            {/* Information Top 100 */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
              <h3 className="text-lg font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                📊 À propos du Top 100
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                Cette page affiche uniquement les 100 plus grandes chaînes YouTube au monde.
              </p>
              <Link
                href="/youtube"
                className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-100 font-medium"
              >
                Voir toutes les chaînes →
              </Link>
            </div>

            {/* Call to action pour proposer une chaîne */}
            {user ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  Une chaîne manque ?
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                  Proposez vos chaînes YouTube préférées sur la page dédiée.
                </p>
                <Link
                  href="/youtube"
                  className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Proposer une chaîne
                </Link>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  Rejoignez la communauté !
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                  Connectez-vous pour proposer des chaînes sur la page YouTube.
                </p>
                <Link
                  href="/auth/register"
                  className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  S'inscrire gratuitement
                </Link>
              </div>
            )}
            
            {/* Widget de statistiques Top 100 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Statistiques du Top 100
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chaînes dans le Top 100</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {channels ? channels.length : 0} / 100
                  </p>
                  {channelsWithoutStats > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      ({channelsWithoutStats} sans stats)
                    </p>
                  )}
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne d'abonnés</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatBigNumber(Math.round(channels.reduce((sum: number, ch: any) => sum + (ch.abonnes || 0), 0) / channels.length))}
                      </p>
                    </div>
                    <div className="pt-3 border-t dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Seuil d'entrée (100e)</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {channels.length > 0 ? formatBigNumber(channels[channels.length - 1].abonnes) : '10M+'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Top des thèmes dans le Top 100 */}
            {channels && channels.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Thèmes dominants</h3>
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