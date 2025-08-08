'use client';

import React, { useState } from 'react';
import { Trophy, Gamepad2, Music, Baby, ChevronRight, Plus, Flag, TrendingUp, Users, Crown, Globe, ChevronDown } from 'lucide-react';
import { AdSpace } from '@/components/ads/AdSpace';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { SubmitChannelForm } from '@/components/channels/SubmitChannelForm';
import { useChannels } from '@/hooks/useChannels';
import ChannelCard from '@/components/channels/ChannelCard';

// Définir TOUS les pays du monde avec leurs drapeaux
const COUNTRIES = [
  { code: 'all', label: 'Tous les pays', flag: '🌍' },
  
  // Europe (53 pays)
  { code: 'AL', label: 'Albanie', flag: '🇦🇱' },
  { code: 'AD', label: 'Andorre', flag: '🇦🇩' },
  { code: 'AT', label: 'Autriche', flag: '🇦🇹' },
  { code: 'BY', label: 'Biélorussie', flag: '🇧🇾' },
  { code: 'BE', label: 'Belgique', flag: '🇧🇪' },
  { code: 'BA', label: 'Bosnie-Herzégovine', flag: '🇧🇦' },
  { code: 'BG', label: 'Bulgarie', flag: '🇧🇬' },
  { code: 'HR', label: 'Croatie', flag: '🇭🇷' },
  { code: 'CY', label: 'Chypre', flag: '🇨🇾' },
  { code: 'CZ', label: 'République tchèque', flag: '🇨🇿' },
  { code: 'DK', label: 'Danemark', flag: '🇩🇰' },
  { code: 'EE', label: 'Estonie', flag: '🇪🇪' },
  { code: 'FI', label: 'Finlande', flag: '🇫🇮' },
  { code: 'FR', label: 'France', flag: '🇫🇷' },
  { code: 'DE', label: 'Allemagne', flag: '🇩🇪' },
  { code: 'GR', label: 'Grèce', flag: '🇬🇷' },
  { code: 'HU', label: 'Hongrie', flag: '🇭🇺' },
  { code: 'IS', label: 'Islande', flag: '🇮🇸' },
  { code: 'IE', label: 'Irlande', flag: '🇮🇪' },
  { code: 'IT', label: 'Italie', flag: '🇮🇹' },
  { code: 'XK', label: 'Kosovo', flag: '🇽🇰' },
  { code: 'LV', label: 'Lettonie', flag: '🇱🇻' },
  { code: 'LI', label: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LT', label: 'Lituanie', flag: '🇱🇹' },
  { code: 'LU', label: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MT', label: 'Malte', flag: '🇲🇹' },
  { code: 'MD', label: 'Moldavie', flag: '🇲🇩' },
  { code: 'MC', label: 'Monaco', flag: '🇲🇨' },
  { code: 'ME', label: 'Monténégro', flag: '🇲🇪' },
  { code: 'NL', label: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'MK', label: 'Macédoine du Nord', flag: '🇲🇰' },
  { code: 'NO', label: 'Norvège', flag: '🇳🇴' },
  { code: 'PL', label: 'Pologne', flag: '🇵🇱' },
  { code: 'PT', label: 'Portugal', flag: '🇵🇹' },
  { code: 'RO', label: 'Roumanie', flag: '🇷🇴' },
  { code: 'RU', label: 'Russie', flag: '🇷🇺' },
  { code: 'SM', label: 'Saint-Marin', flag: '🇸🇲' },
  { code: 'RS', label: 'Serbie', flag: '🇷🇸' },
  { code: 'SK', label: 'Slovaquie', flag: '🇸🇰' },
  { code: 'SI', label: 'Slovénie', flag: '🇸🇮' },
  { code: 'ES', label: 'Espagne', flag: '🇪🇸' },
  { code: 'SE', label: 'Suède', flag: '🇸🇪' },
  { code: 'CH', label: 'Suisse', flag: '🇨🇭' },
  { code: 'UA', label: 'Ukraine', flag: '🇺🇦' },
  { code: 'GB', label: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'VA', label: 'Vatican', flag: '🇻🇦' },
  
  // Asie (48 pays)
  { code: 'AF', label: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AM', label: 'Arménie', flag: '🇦🇲' },
  { code: 'AZ', label: 'Azerbaïdjan', flag: '🇦🇿' },
  { code: 'BH', label: 'Bahreïn', flag: '🇧🇭' },
  { code: 'BD', label: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BT', label: 'Bhoutan', flag: '🇧🇹' },
  { code: 'BN', label: 'Brunei', flag: '🇧🇳' },
  { code: 'KH', label: 'Cambodge', flag: '🇰🇭' },
  { code: 'CN', label: 'Chine', flag: '🇨🇳' },
  { code: 'GE', label: 'Géorgie', flag: '🇬🇪' },
  { code: 'IN', label: 'Inde', flag: '🇮🇳' },
  { code: 'ID', label: 'Indonésie', flag: '🇮🇩' },
  { code: 'IR', label: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', label: 'Irak', flag: '🇮🇶' },
  { code: 'IL', label: 'Israël', flag: '🇮🇱' },
  { code: 'JP', label: 'Japon', flag: '🇯🇵' },
  { code: 'JO', label: 'Jordanie', flag: '🇯🇴' },
  { code: 'KZ', label: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KW', label: 'Koweït', flag: '🇰🇼' },
  { code: 'KG', label: 'Kirghizistan', flag: '🇰🇬' },
  { code: 'LA', label: 'Laos', flag: '🇱🇦' },
  { code: 'LB', label: 'Liban', flag: '🇱🇧' },
  { code: 'MY', label: 'Malaisie', flag: '🇲🇾' },
  { code: 'MV', label: 'Maldives', flag: '🇲🇻' },
  { code: 'MN', label: 'Mongolie', flag: '🇲🇳' },
  { code: 'MM', label: 'Myanmar', flag: '🇲🇲' },
  { code: 'NP', label: 'Népal', flag: '🇳🇵' },
  { code: 'KP', label: 'Corée du Nord', flag: '🇰🇵' },
  { code: 'OM', label: 'Oman', flag: '🇴🇲' },
  { code: 'PK', label: 'Pakistan', flag: '🇵🇰' },
  { code: 'PS', label: 'Palestine', flag: '🇵🇸' },
  { code: 'PH', label: 'Philippines', flag: '🇵🇭' },
  { code: 'QA', label: 'Qatar', flag: '🇶🇦' },
  { code: 'SA', label: 'Arabie Saoudite', flag: '🇸🇦' },
  { code: 'SG', label: 'Singapour', flag: '🇸🇬' },
  { code: 'KR', label: 'Corée du Sud', flag: '🇰🇷' },
  { code: 'LK', label: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SY', label: 'Syrie', flag: '🇸🇾' },
  { code: 'TW', label: 'Taïwan', flag: '🇹🇼' },
  { code: 'TJ', label: 'Tadjikistan', flag: '🇹🇯' },
  { code: 'TH', label: 'Thaïlande', flag: '🇹🇭' },
  { code: 'TL', label: 'Timor oriental', flag: '🇹🇱' },
  { code: 'TR', label: 'Turquie', flag: '🇹🇷' },
  { code: 'TM', label: 'Turkménistan', flag: '🇹🇲' },
  { code: 'AE', label: 'Émirats arabes unis', flag: '🇦🇪' },
  { code: 'UZ', label: 'Ouzbékistan', flag: '🇺🇿' },
  { code: 'VN', label: 'Vietnam', flag: '🇻🇳' },
  { code: 'YE', label: 'Yémen', flag: '🇾🇪' },
  
  // Afrique (54 pays)
  { code: 'DZ', label: 'Algérie', flag: '🇩🇿' },
  { code: 'AO', label: 'Angola', flag: '🇦🇴' },
  { code: 'BJ', label: 'Bénin', flag: '🇧🇯' },
  { code: 'BW', label: 'Botswana', flag: '🇧🇼' },
  { code: 'BF', label: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', label: 'Burundi', flag: '🇧🇮' },
  { code: 'CV', label: 'Cap-Vert', flag: '🇨🇻' },
  { code: 'CM', label: 'Cameroun', flag: '🇨🇲' },
  { code: 'CF', label: 'République centrafricaine', flag: '🇨🇫' },
  { code: 'TD', label: 'Tchad', flag: '🇹🇩' },
  { code: 'KM', label: 'Comores', flag: '🇰🇲' },
  { code: 'CG', label: 'Congo', flag: '🇨🇬' },
  { code: 'CD', label: 'RD Congo', flag: '🇨🇩' },
  { code: 'CI', label: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'DJ', label: 'Djibouti', flag: '🇩🇯' },
  { code: 'EG', label: 'Égypte', flag: '🇪🇬' },
  { code: 'GQ', label: 'Guinée équatoriale', flag: '🇬🇶' },
  { code: 'ER', label: 'Érythrée', flag: '🇪🇷' },
  { code: 'SZ', label: 'Eswatini', flag: '🇸🇿' },
  { code: 'ET', label: 'Éthiopie', flag: '🇪🇹' },
  { code: 'GA', label: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', label: 'Gambie', flag: '🇬🇲' },
  { code: 'GH', label: 'Ghana', flag: '🇬🇭' },
  { code: 'GN', label: 'Guinée', flag: '🇬🇳' },
  { code: 'GW', label: 'Guinée-Bissau', flag: '🇬🇼' },
  { code: 'KE', label: 'Kenya', flag: '🇰🇪' },
  { code: 'LS', label: 'Lesotho', flag: '🇱🇸' },
  { code: 'LR', label: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', label: 'Libye', flag: '🇱🇾' },
  { code: 'MG', label: 'Madagascar', flag: '🇲🇬' },
  { code: 'MW', label: 'Malawi', flag: '🇲🇼' },
  { code: 'ML', label: 'Mali', flag: '🇲🇱' },
  { code: 'MR', label: 'Mauritanie', flag: '🇲🇷' },
  { code: 'MU', label: 'Maurice', flag: '🇲🇺' },
  { code: 'MA', label: 'Maroc', flag: '🇲🇦' },
  { code: 'MZ', label: 'Mozambique', flag: '🇲🇿' },
  { code: 'NA', label: 'Namibie', flag: '🇳🇦' },
  { code: 'NE', label: 'Niger', flag: '🇳🇪' },
  { code: 'NG', label: 'Nigeria', flag: '🇳🇬' },
  { code: 'RW', label: 'Rwanda', flag: '🇷🇼' },
  { code: 'ST', label: 'Sao Tomé-et-Principe', flag: '🇸🇹' },
  { code: 'SN', label: 'Sénégal', flag: '🇸🇳' },
  { code: 'SC', label: 'Seychelles', flag: '🇸🇨' },
  { code: 'SL', label: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SO', label: 'Somalie', flag: '🇸🇴' },
  { code: 'ZA', label: 'Afrique du Sud', flag: '🇿🇦' },
  { code: 'SS', label: 'Soudan du Sud', flag: '🇸🇸' },
  { code: 'SD', label: 'Soudan', flag: '🇸🇩' },
  { code: 'TZ', label: 'Tanzanie', flag: '🇹🇿' },
  { code: 'TG', label: 'Togo', flag: '🇹🇬' },
  { code: 'TN', label: 'Tunisie', flag: '🇹🇳' },
  { code: 'UG', label: 'Ouganda', flag: '🇺🇬' },
  { code: 'ZM', label: 'Zambie', flag: '🇿🇲' },
  { code: 'ZW', label: 'Zimbabwe', flag: '🇿🇼' },
  
  // Amériques (35 pays)
  { code: 'AG', label: 'Antigua-et-Barbuda', flag: '🇦🇬' },
  { code: 'AR', label: 'Argentine', flag: '🇦🇷' },
  { code: 'BS', label: 'Bahamas', flag: '🇧🇸' },
  { code: 'BB', label: 'Barbade', flag: '🇧🇧' },
  { code: 'BZ', label: 'Belize', flag: '🇧🇿' },
  { code: 'BO', label: 'Bolivie', flag: '🇧🇴' },
  { code: 'BR', label: 'Brésil', flag: '🇧🇷' },
  { code: 'CA', label: 'Canada', flag: '🇨🇦' },
  { code: 'CL', label: 'Chili', flag: '🇨🇱' },
  { code: 'CO', label: 'Colombie', flag: '🇨🇴' },
  { code: 'CR', label: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CU', label: 'Cuba', flag: '🇨🇺' },
  { code: 'DM', label: 'Dominique', flag: '🇩🇲' },
  { code: 'DO', label: 'République dominicaine', flag: '🇩🇴' },
  { code: 'EC', label: 'Équateur', flag: '🇪🇨' },
  { code: 'SV', label: 'Salvador', flag: '🇸🇻' },
  { code: 'GD', label: 'Grenade', flag: '🇬🇩' },
  { code: 'GT', label: 'Guatemala', flag: '🇬🇹' },
  { code: 'GY', label: 'Guyana', flag: '🇬🇾' },
  { code: 'HT', label: 'Haïti', flag: '🇭🇹' },
  { code: 'HN', label: 'Honduras', flag: '🇭🇳' },
  { code: 'JM', label: 'Jamaïque', flag: '🇯🇲' },
  { code: 'MX', label: 'Mexique', flag: '🇲🇽' },
  { code: 'NI', label: 'Nicaragua', flag: '🇳🇮' },
  { code: 'PA', label: 'Panama', flag: '🇵🇦' },
  { code: 'PY', label: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', label: 'Pérou', flag: '🇵🇪' },
  { code: 'KN', label: 'Saint-Christophe-et-Niévès', flag: '🇰🇳' },
  { code: 'LC', label: 'Sainte-Lucie', flag: '🇱🇨' },
  { code: 'VC', label: 'Saint-Vincent-et-les-Grenadines', flag: '🇻🇨' },
  { code: 'SR', label: 'Suriname', flag: '🇸🇷' },
  { code: 'TT', label: 'Trinité-et-Tobago', flag: '🇹🇹' },
  { code: 'US', label: 'États-Unis', flag: '🇺🇸' },
  { code: 'UY', label: 'Uruguay', flag: '🇺🇾' },
  { code: 'VE', label: 'Venezuela', flag: '🇻🇪' },
  
  // Océanie (14 pays)
  { code: 'AU', label: 'Australie', flag: '🇦🇺' },
  { code: 'FJ', label: 'Fidji', flag: '🇫🇯' },
  { code: 'KI', label: 'Kiribati', flag: '🇰🇮' },
  { code: 'MH', label: 'Îles Marshall', flag: '🇲🇭' },
  { code: 'FM', label: 'Micronésie', flag: '🇫🇲' },
  { code: 'NR', label: 'Nauru', flag: '🇳🇷' },
  { code: 'NZ', label: 'Nouvelle-Zélande', flag: '🇳🇿' },
  { code: 'PW', label: 'Palaos', flag: '🇵🇼' },
  { code: 'PG', label: 'Papouasie-Nouvelle-Guinée', flag: '🇵🇬' },
  { code: 'WS', label: 'Samoa', flag: '🇼🇸' },
  { code: 'SB', label: 'Îles Salomon', flag: '🇸🇧' },
  { code: 'TO', label: 'Tonga', flag: '🇹🇴' },
  { code: 'TV', label: 'Tuvalu', flag: '🇹🇻' },
  { code: 'VU', label: 'Vanuatu', flag: '🇻🇺' }
].sort((a, b) => {
  if (a.code === 'all') return -1;
  if (b.code === 'all') return 1;
  return a.label.localeCompare(b.label, 'fr');
});

export default function YouTubePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showOnlyTop100, setShowOnlyTop100] = useState(false);
  const [showOnlyCommunity, setShowOnlyCommunity] = useState(false);
  const [search, setSearch] = useState('');
  
  // Utiliser le filtre avec pays
  const { data: channels, isLoading, error } = useChannels(search, 'all', selectedCountry);
  const { user } = useAuth();

  // Filtrer les chaînes selon les options sélectionnées
  const filteredChannels = channels?.filter((channel: any) => {
    if (showOnlyTop100 && !channel.is_top100) return false;
    if (showOnlyCommunity && channel.is_top100) return false;
    if (selectedCategory !== 'all' && channel.theme_principal !== selectedCategory) return false;
    // Le filtre langue est déjà appliqué côté serveur via useChannels
    return true;
  }) || [];

  // Obtenir les catégories uniques
  const categories: string[] = [...new Set(channels?.map((ch: any) => ch.theme_principal).filter(Boolean) || [])] as string[];

  // Obtenir les pays présents dans les données
  const availableCountries = COUNTRIES.filter(country => 
    country.code === 'all' || 
    channels?.some((ch: any) => ch.pays === country.code)
  );

  // Les 10 pays les plus populaires à afficher directement
  const popularCountries = ['all', 'US', 'FR', 'GB', 'IN', 'JP', 'BR', 'KR', 'DE', 'ES'];
  const displayCountries = COUNTRIES.filter(c => popularCountries.includes(c.code));
  const otherCountries = availableCountries.filter(c => !popularCountries.includes(c.code));

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
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Toutes
              </button>
              {categories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filtres par pays */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 items-center">
              {/* Pays populaires affichés directement */}
              {displayCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`px-3 py-1.5 rounded-full text-sm transition flex items-center gap-1.5 ${
                    selectedCountry === country.code
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  {country.code === 'all' && <span>{country.label}</span>}
                </button>
              ))}
              
              {/* Menu déroulant pour les autres pays */}
              {otherCountries.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="px-3 py-1.5 rounded-full text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-1.5"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Plus de pays</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showCountryDropdown && (
                    <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50 max-h-96 overflow-y-auto min-w-[200px]">
                      <div className="p-2">
                        {otherCountries.map((country) => (
                          <button
                            key={country.code}
                            onClick={() => {
                              setSelectedCountry(country.code);
                              setShowCountryDropdown(false);
                            }}
                            className={`w-full px-3 py-2 rounded text-sm transition flex items-center gap-2 text-left ${
                              selectedCountry === country.code
                                ? 'bg-purple-500 text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <span className="text-base">{country.flag}</span>
                            <span>{country.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
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
                <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Aucune chaîne trouvée avec ces critères
                  {selectedCountry !== 'all' && (
                    <span className="block mt-2 text-sm">
                      Essayez avec un autre pays ou sélectionnez "Tous les pays"
                    </span>
                  )}
                </p>
              </div>
            )}

            {filteredChannels.length > 0 && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {filteredChannels.length} chaîne{filteredChannels.length > 1 ? 's' : ''} trouvée{filteredChannels.length > 1 ? 's' : ''}
                    {selectedCountry !== 'all' && ` - ${COUNTRIES.find(c => c.code === selectedCountry)?.label}`}
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
                      <div className="absolute top-2 right-2 flex gap-2">
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
                        {/* Badge pays si disponible */}
                        {channel.pays && (
                          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                            {COUNTRIES.find(c => c.code === channel.pays)?.flag || channel.pays}
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
              
              {/* Stats globales avec langues */}
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Pays</span>
                    <span className="font-bold text-lg text-purple-600">
                      {availableCountries.length - 1}
                    </span>
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