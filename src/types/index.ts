// Types pour l'application SocialRank

export interface Channel {
  id: number;
  youtube_id: string;
  nom: string;
  description?: string;
  abonnes: number;
  vues?: number;
  videos?: number;
  image?: string;
  langue_principale?: string;
  theme_principal?: string;
  pays?: string;
  date_ajout?: string;
  derniere_maj?: string;
  custom_url?: string;
  youtube_url?: string;
  is_top100?: boolean;
  source?: 'top100' | 'community';
  soumis_par?: number;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  created_at?: string;
}

export interface Stats {
  id: number;
  chaine_id: number;
  abonnes: number;
  vues: number;
  videos: number;
  date_collecte: string;
}

export interface Theme {
  theme: string;
  count: number;
  votes?: number;
}

export interface Country {
  pays: string;
  count: number;
}

export interface GlobalStats {
  total_channels: number;
  top100_channels: number;
  community_channels: number;
  total_subscribers: number;
  total_views: number;
  total_videos: number;
  top_themes: Theme[];
  top_countries: Country[];
  temp_channels?: number;
  channels_without_stats?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  username?: string;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SubmitChannelData {
  url?: string;
  youtubeId?: string;
  nom: string;
  token?: string;
}

export interface SubmitChannelResponse {
  success: boolean;
  message?: string;
  id?: number;
  channel_info?: {
    youtube_id: string;
    nom: string;
    abonnes?: number;
    custom_url?: string;
    note?: string;
  };
  error?: string;
}

export interface VoteThemeData {
  channel_id: number;
  theme: string;
  token?: string;
}

export interface VoteThemeResponse {
  success: boolean;
  message?: string;
  theme?: string;
  error?: string;
}

export interface UpdateStatsResponse {
  success: boolean;
  updated?: number;
  total?: number;
  errors?: string[];
  message?: string;
  api_status?: string;
}

export interface ImportTop100Response {
  success: boolean;
  imported?: number;
  updated?: number;
  errors?: string[];
  message?: string;
}