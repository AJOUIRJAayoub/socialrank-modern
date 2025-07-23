'use client';

import { Channel } from '@/types';
import { Users, Eye, Video, ChevronDown, ChevronUp, Trophy, TrendingUp, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeVoting } from './ThemeVoting';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ChannelCardProps {
  channel: Channel;
  rank: number;
}

export function ChannelCard({ channel, rank }: ChannelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  
  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatLongNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  // Calculer les moyennes
  const avgViewsPerVideo = channel.videos && channel.vues 
    ? Math.round(channel.vues / channel.videos) 
    : 0;

  const engagementRate = channel.vues && channel.abonnes
    ? ((channel.vues / channel.abonnes) / (channel.videos || 1)).toFixed(1)
    : '0';

  const getRankBadge = () => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-orange-600 text-white';
    if (rank <= 10) return 'bg-blue-500 text-white';
    return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const getCountryFlag = (country?: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸', 'IN': '🇮🇳', 'KR': '🇰🇷', 'UK': '🇬🇧', 'FR': '🇫🇷',
      'CA': '🇨🇦', 'DE': '🇩🇪', 'ES': '🇪🇸', 'JP': '🇯🇵', 'BR': '🇧🇷',
      'RU': '🇷🇺', 'UA': '🇺🇦', 'SE': '🇸🇪', 'AR': '🇦🇷', 'RO': '🇷🇴',
      'CN': '🇨🇳', 'AU': '🇦🇺', 'IE': '🇮🇪', 'SV': '🇸🇻', 'CH': '🇨🇭',
      'CY': '🇨🇾'
    };
    return flags[country || ''] || '🌍';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Rank Badge avec style amélioré */}
          <div className={`flex items-center justify-center w-14 h-14 rounded-full font-bold text-xl ${getRankBadge()}`}>
            #{rank}
            {rank <= 3 && <Trophy className="w-4 h-4 ml-1" />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  {channel.nom}
                  {channel.pays && <span className="text-2xl">{getCountryFlag(channel.pays)}</span>}
                </h3>
                
                {channel.theme_principal && (
                  <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full mb-2">
                    {channel.theme_principal}
                  </span>
                )}
              </div>
              
              {channel.youtube_id && (
                <a
                  href={`https://youtube.com/@${channel.nom.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:text-red-600"
                  title={`Voir ${channel.nom} sur YouTube`}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
            
            {channel.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {channel.description}
              </p>
            )}
            
            {/* Stats Grid amélioré */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Abonnés */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Abonnés</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatNumber(channel.abonnes)}
                </p>
                <p className="text-xs text-gray-500">{formatLongNumber(channel.abonnes)}</p>
              </div>
              
              {/* Vues */}
              {channel.vues !== undefined && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs">Vues totales</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatNumber(channel.vues)}
                  </p>
                  <p className="text-xs text-gray-500">{formatLongNumber(channel.vues)}</p>
                </div>
              )}
              
              {/* Vidéos */}
              {channel.videos !== undefined && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Video className="w-4 h-4" />
                    <span className="text-xs">Vidéos</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatNumber(channel.videos)}
                  </p>
                </div>
              )}
              
              {/* Moyenne vues/vidéo */}
              {avgViewsPerVideo > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Moy./vidéo</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatNumber(avgViewsPerVideo)}
                  </p>
                </div>
              )}
            </div>

            {/* Engagement Rate */}
            {channel.vues && channel.abonnes && channel.videos && (
              <div className="mt-3 pt-3 border-t dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Taux d'engagement: <strong className="text-gray-900 dark:text-white">{engagementRate}x</strong> vues/abonné/vidéo
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {channel.image && (
            <img
              src={channel.image}
              alt={`Avatar de ${channel.nom}`}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
        </div>
        
        {/* Bouton pour voter */}
        {user && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600"
          >
            Voter pour le thème
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      {/* Section de vote extensible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <ThemeVoting 
                channelId={channel.id} 
                currentTheme={channel.theme_principal}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}