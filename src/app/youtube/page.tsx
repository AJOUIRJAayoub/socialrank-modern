'use client';

import React, { useState } from 'react';
import { Trophy, Gamepad2, Music, Baby, ChevronRight, Plus, Flag, TrendingUp } from 'lucide-react';
import { AdSpace } from '@/components/ads/AdSpace';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';

interface Channel {
  id: string;
  name: string;
  subscribers: string;
  category: string;
  country?: string;
  thumbnail: string;
  rank: number;
  growth?: string;
}

export default function YouTubePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userCountry] = useState('FR');

  // Données mockées - à remplacer par API
  const channels: Channel[] = [
    // Gaming
    { id: '1', name: 'PewDiePie', subscribers: '111M', category: 'gaming', country: 'SE', thumbnail: '/api/placeholder/50/50', rank: 1, growth: '+2.3%' },
    { id: '2', name: 'Markiplier', subscribers: '34M', category: 'gaming', country: 'US', thumbnail: '/api/placeholder/50/50', rank: 2, growth: '+1.8%' },
    { id: '3', name: 'Squeezie Gaming', subscribers: '8M', category: 'gaming', country: 'FR', thumbnail: '/api/placeholder/50/50', rank: 3, growth: '+5.2%' },
    { id: '4', name: 'Ninja', subscribers: '24M', category: 'gaming', country: 'US', thumbnail: '/api/placeholder/50/50', rank: 4, growth: '+0.9%' },
    { id: '5', name: 'Gotaga', subscribers: '3.8M', category: 'gaming', country: 'FR', thumbnail: '/api/placeholder/50/50', rank: 5, growth: '+3.1%' },
    
    // Enfants
    { id: '6', name: 'Cocomelon', subscribers: '162M', category: 'kids', country: 'US', thumbnail: '/api/placeholder/50/50', rank: 1, growth: '+8.5%' },
    { id: '7', name: 'Vlad and Niki', subscribers: '98M', category: 'kids', country: 'US', thumbnail: '/api/placeholder/50/50', rank: 2, growth: '+12.3%' },
    { id: '8', name: 'Like Nastya', subscribers: '106M', category: 'kids', country: 'RU', thumbnail: '/api/placeholder/50/50', rank: 3, growth: '+10.1%' },
    { id: '9', name: "Ryan's World", subscribers: '35M', category: 'kids', country: 'US', thumbnail: '/api/placeholder/50/50', rank: 4, growth: '+4.7%' },
    { id: '10', name: 'Peppa Pig', subscribers: '28M', category: 'kids', country: 'UK', thumbnail: '/api/placeholder/50/50', rank: 5, growth: '+2.9%' },
    
    // Musique
    { id: '11', name: 'T-Series', subscribers: '252M', category: 'music', country: 'IN', thumbnail: '/api/placeholder/50/50', rank: 1, growth: '+6.2%' },
    { id: '12', name: 'Blackpink', subscribers: '90M', category: 'music', country: 'KR', thumbnail: '/api/placeholder/50/50', rank: 2, growth: '+15.8%' },
    { id: '13', name: 'Justin Bieber', subscribers: '71M', category: 'music', country: 'CA', thumbnail: '/api/placeholder/50/50', rank: 3, growth: '+1.2%' },
    { id: '14', name: 'Marshmello', subscribers: '56M', category: 'music', country: 'US', thumbnail: '/api/placeholder/50/50', rank: 4, growth: '+3.5%' },
    { id: '15', name: 'Ed Sheeran', subscribers: '53M', category: 'music', country: 'UK', thumbnail: '/api/placeholder/50/50', rank: 5, growth: '+2.1%' },
    
    // France
    { id: '16', name: 'Cyprien', subscribers: '14.5M', category: 'entertainment', country: 'FR', thumbnail: '/api/placeholder/50/50', rank: 1 },
    { id: '17', name: 'SQUEEZIE', subscribers: '18.2M', category: 'entertainment', country: 'FR', thumbnail: '/api/placeholder/50/50', rank: 2 },
    { id: '18', name: 'Norman', subscribers: '12.1M', category: 'entertainment', country: 'FR', thumbnail: '/api/placeholder/50/50', rank: 3 },
    { id: '19', name: 'Tibo InShape', subscribers: '8.9M', category: 'entertainment', country: 'FR', thumbnail: '/api/placeholder/50/50', rank: 4 },
    { id: '20', name: 'McFly & Carlito', subscribers: '7.2M', category: 'entertainment', country: 'FR', thumbnail: '/api/placeholder/50/50', rank: 5 },
  ];

  const getTopChannels = (category: string, country?: string, limit: number = 5) => {
    let filtered = channels;
    
    if (category !== 'all') {
      filtered = filtered.filter(ch => ch.category === category);
    }
    
    if (country) {
      filtered = filtered.filter(ch => ch.country === country);
    }
    
    return filtered.slice(0, limit);
  };

  const RankingCard = ({ title, icon: Icon, channelList, color }: {
    title: string;
    icon: any;
    channelList: Channel[];
    color: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Icon className={`w-6 h-6 ${color}`} />
          {title}
        </h3>
        <button className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm font-medium">
          Voir tout
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {channelList.map((channel, index) => (
          <div key={channel.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
            <span className={`font-bold text-lg w-8 text-center ${
              index === 0 ? 'text-yellow-500' : 
              index === 1 ? 'text-gray-400' : 
              index === 2 ? 'text-orange-600' : 
              'text-gray-500'
            }`}>
              {index + 1}
            </span>
            
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
              {channel.name.slice(0, 2).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <p className="font-semibold">{channel.name}</p>
              <p className="text-sm text-gray-500">{channel.subscribers} abonnés</p>
            </div>
            
            {channel.growth && (
              <div className="flex items-center gap-1 text-green-500 text-sm">
                <TrendingUp className="w-3 h-3" />
                {channel.growth}
              </div>
            )}
            
            {channel.country && (
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-medium">
                {channel.country}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header unifié */}
      <Header />

      {/* Hero section avec bouton "Proposer" */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Classements YouTube</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Découvrez les meilleures chaînes YouTube par catégorie et pays
              </p>
            </div>
            <Link 
              href="/youtube/propose" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Proposer une chaîne
            </Link>
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
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Gaming */}
            <RankingCard 
              title="🎮 Top Gaming Mondial" 
              icon={Gamepad2}
              channelList={getTopChannels('gaming')}
              color="text-purple-500"
            />

            {/* Top France */}
            <RankingCard 
              title="🇫🇷 Top Chaînes France" 
              icon={Flag}
              channelList={getTopChannels('entertainment', 'FR')}
              color="text-blue-500"
            />

            {/* Pub carrée au milieu */}
            <div className="flex justify-center">
              <AdSpace format="square" />
            </div>

            {/* Top Enfants */}
            <RankingCard 
              title="👶 Top Chaînes Enfants" 
              icon={Baby}
              channelList={getTopChannels('kids')}
              color="text-pink-500"
            />

            {/* Top Musique */}
            <RankingCard 
              title="🎵 Top Musique Mondial" 
              icon={Music}
              channelList={getTopChannels('music')}
              color="text-green-500"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pub verticale sticky */}
            <div className="sticky top-24">
              <AdSpace format="vertical" />
              
              {/* Stats globales */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">📊 Statistiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Chaînes référencées</span>
                    <span className="font-bold text-lg">12,543</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Catégories</span>
                    <span className="font-bold text-lg">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Pays couverts</span>
                    <span className="font-bold text-lg">195</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Mises à jour</span>
                    <span className="font-bold text-lg">Quotidien</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg transition">
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}