export interface Channel {
  id: string;
  youtube_id: string;
  name: string;
  subscribers: number;
  category: string;
  country: string;
  thumbnail_url: string;
  rank?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Ranking {
  category: string;
  channels: Channel[];
  updated_at: Date;
}

export type Category = 'gaming' | 'music' | 'kids' | 'entertainment' | 'education' | 'tech';