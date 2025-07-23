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
}

export interface User {
  id: number;
  username: string;
  email?: string;
  role: 'admin' | 'user';
}

export interface Stats {
  id: number;
  chaine_id: number;
  abonnes: number;
  vues: number;
  videos: number;
  date_collecte: string;
}