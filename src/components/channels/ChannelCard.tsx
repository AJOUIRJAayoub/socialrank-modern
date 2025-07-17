'use client';

import { Channel } from '@/types';
import { Users, Eye, Video, ChevronDown, ChevronUp } from 'lucide-react';
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
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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
          <div className="text-3xl font-bold text-gray-400">#{rank}</div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {channel.nom}
            </h3>
            
            {channel.theme_principal && (
              <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full mb-2">
                {channel.theme_principal}
              </span>
            )}
            
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