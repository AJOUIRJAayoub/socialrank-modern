export interface Advertisement {
  id: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
  format: AdFormat;
  clicks: number;
  impressions: number;
  active: boolean;
}

export type AdFormat = 'banner' | 'square' | 'vertical' | 'inline';