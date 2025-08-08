import React, { useState, useCallback } from 'react';
import { Trophy, Users, Eye, Video, Calendar, MapPin, Youtube, ChevronDown, ChevronUp, TrendingUp, Clock, Globe, DollarSign } from 'lucide-react';
import type { Channel } from '@/types';

interface ChannelCardProps {
  channel: Channel;
  rank: number;
  isUserLoggedIn: boolean;
  onAddChannel?: () => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, rank, isUserLoggedIn, onAddChannel }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Formater les nombres avec espaces pour les milliers
  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace('.', ',') + ' Md';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace('.', ',') + ' M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.', ',') + ' K';
    }
    return num.toLocaleString('fr-FR');
  }, []);

  // Calculer l'estimation des revenus mensuel (1$/1000vues)
  const calculateMonthlyRevenue = useCallback((): number => {
    if (!channel.vues || !channel.videos || channel.videos === 0) return 0;
    
    // Vues moyennes par vidéo
    const avgViewsPerVideo = channel.vues / channel.videos;
    
    // Estimation: supposons 4 vidéos par mois en moyenne pour une chaîne active
    const videosPerMonth = 4;
    const monthlyViews = avgViewsPerVideo * videosPerMonth;
    
    // 1$ pour 1000 vues
    return monthlyViews * 0.001;
  }, [channel.vues, channel.videos]);

  // Formater les revenus en dollars
  const formatRevenue = useCallback((revenue: number): string => {
    if (revenue >= 1000000) {
      return `$${(revenue / 1000000).toFixed(1)}M`;
    }
    if (revenue >= 1000) {
      return `$${(revenue / 1000).toFixed(1)}K`;
    }
    if (revenue >= 1) {
      return `$${revenue.toFixed(0)}`;
    }
    return '$0';
  }, []);

  // Calculer l'engagement rate
  const engagementRate = channel.abonnes > 0 && channel.vues && channel.videos && channel.videos > 0
    ? ((channel.vues / channel.videos) / channel.abonnes * 100).toFixed(2)
    : '0';

  // Déterminer la couleur du rang
  const getRankColor = (rank: number): string => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  // Générer l'URL YouTube correcte
  const getYouTubeUrl = (): string | null => {
    // Si on a déjà une URL complète
    if (channel.youtube_url) {
      return channel.youtube_url;
    }
    
    // Si on a un custom_url
    if (channel.custom_url) {
      if (channel.custom_url.startsWith('@')) {
        return `https://youtube.com/${channel.custom_url}`;
      }
      return `https://youtube.com/@${channel.custom_url}`;
    }
    
    // Si l'ID est un @username temporaire
    if (channel.youtube_id && channel.youtube_id.startsWith('@')) {
      return `https://youtube.com/${channel.youtube_id}`;
    }
    
    // Si c'est un ID temporaire
    if (channel.youtube_id && channel.youtube_id.startsWith('TEMP_')) {
      return null;
    }
    
    // Si on a un vrai ID YouTube
    if (channel.youtube_id && channel.youtube_id.startsWith('UC')) {
      return `https://youtube.com/channel/${channel.youtube_id}`;
    }
    
    return null;
  };

  // Générer l'URL de l'image avec fallback
  const getImageUrl = (): string => {
    // Si on a une image valide
    if (channel.image && channel.image.startsWith('http')) {
      return channel.image;
    }
    
    // Sinon, utiliser UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.nom)}&background=FF0000&color=fff&size=128&font-size=0.5&bold=true`;
  };

  // Déterminer si c'est une chaîne Top 100 ou communautaire
  const isTop100 = channel.is_top100 || (channel.abonnes > 10000000);
  const source = channel.source || (isTop100 ? 'top100' : 'community');

  const youtubeUrl = getYouTubeUrl();
  const imageUrl = getImageUrl();
  const monthlyRevenue = calculateMonthlyRevenue();

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all duration-300 transform hover:scale-[1.02] border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Rang - Maintenant juste les numéros */}
          <div className={`text-3xl font-bold ${getRankColor(rank)}`}>
            #{rank}
          </div>
          
          {/* Image et nom */}
          <div className="flex items-center space-x-3">
            <img
              src={imageUrl}
              alt={`${channel.nom} logo`}
              className="w-16 h-16 rounded-full object-cover bg-gray-700"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.nom)}&background=FF0000&color=fff&size=128&font-size=0.5&bold=true`;
              }}
            />
            <div>
              <h3 className="text-xl font-semibold text-white">{channel.nom}</h3>
              {channel.theme_principal && (
                <span className="text-sm text-gray-400">{channel.theme_principal}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Bouton YouTube */}
        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 transition-colors"
            title={`Voir ${channel.nom} sur YouTube`}
          >
            <Youtube className="w-6 h-6" />
          </a>
        )}
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center text-blue-400 mb-1">
            <Users className="w-5 h-5 mr-1" />
            <span className="text-sm">Abonnés</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(channel.abonnes)}</p>
        </div>
        
        {channel.vues !== undefined && channel.vues > 0 && (
          <div className="text-center">
            <div className="flex items-center justify-center text-green-400 mb-1">
              <Eye className="w-5 h-5 mr-1" />
              <span className="text-sm">Vues</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatNumber(channel.vues)}</p>
          </div>
        )}
        
        {channel.videos !== undefined && channel.videos > 0 && (
          <div className="text-center">
            <div className="flex items-center justify-center text-purple-400 mb-1">
              <Video className="w-5 h-5 mr-1" />
              <span className="text-sm">Vidéos</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatNumber(channel.videos)}</p>
          </div>
        )}
        
        {/* Nouvelle section: Estimation revenus mensuel */}
        {monthlyRevenue > 0 && (
          <div className="text-center">
            <div className="flex items-center justify-center text-yellow-400 mb-1">
              <DollarSign className="w-5 h-5 mr-1" />
              <span className="text-sm">Rev./mois</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatRevenue(monthlyRevenue)}</p>
          </div>
        )}
      </div>

      {/* Bouton détails */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        {showDetails ? (
          <>
            <ChevronUp className="w-5 h-5 mr-1" />
            Masquer les détails
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5 mr-1" />
            Voir plus de détails
          </>
        )}
      </button>

      {/* Détails supplémentaires */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
          {channel.description && (
            <p className="text-gray-300 text-sm">{channel.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm">
            {channel.pays && (
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{channel.pays}</span>
              </div>
            )}
            
            {channel.langue_principale && (
              <div className="flex items-center text-gray-400">
                <Globe className="w-4 h-4 mr-1" />
                <span>{channel.langue_principale}</span>
              </div>
            )}
            
            {channel.derniere_maj && (
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span>Mis à jour: {new Date(channel.derniere_maj).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-400">
              <span className={`px-2 py-1 rounded text-xs ${
                source === 'top100' ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'
              }`}>
                {source === 'top100' ? 'Top 100' : 'Communauté'}
              </span>
            </div>
          </div>
          
          {channel.vues && channel.videos && channel.videos > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
              <div className="bg-gray-700 rounded p-2">
                <span className="text-gray-400">Vues moyennes/vidéo:</span>
                <p className="text-white font-semibold">
                  {formatNumber(Math.round(channel.vues / channel.videos))}
                </p>
              </div>
              <div className="bg-gray-700 rounded p-2">
                <span className="text-gray-400">Estimation revenus/an:</span>
                <p className="text-white font-semibold">
                  {formatRevenue(monthlyRevenue * 12)}
                </p>
              </div>
            </div>
          )}
          
          {monthlyRevenue > 0 && (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mt-3">
              <p className="text-green-300 text-xs mb-1">💡 Estimation basée sur:</p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• 4 vidéos par mois</li>
                <li>• 1$ pour 1000 vues</li>
                <li>• Moyenne: {formatNumber(Math.round((channel.vues || 0) / (channel.videos || 1)))} vues/vidéo</li>
              </ul>
            </div>
          )}
          
          {channel.date_ajout && (
            <div className="text-xs text-gray-500 mt-2">
              <Calendar className="w-3 h-3 inline mr-1" />
              Ajouté le {new Date(channel.date_ajout).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChannelCard;