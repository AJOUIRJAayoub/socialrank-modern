export interface Channel {
  id: number;
  youtube_id: string;
  nom: string;
  description?: string;
  abonnes: number;
  vues?: number;
  videos?: number;
  image?: string;
  categorie?: string;
  langue_principale?: string;
  date_ajout: string;
  derniere_maj: string;
  theme_principal?: string;
  total_votes?: number;
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