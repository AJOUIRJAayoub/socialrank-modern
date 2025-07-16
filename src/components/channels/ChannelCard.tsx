'use client';

import { Channel } from '@/types';
import { Users, Eye, Video } from 'lucide-react';
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
            alt={`Avatar de ${channel.nom}`}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
      </div>
    </motion.div>
  );
}