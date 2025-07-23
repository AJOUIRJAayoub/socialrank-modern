import { Channel } from '@/types';

const API_URL = 'http://abc123go.ranki5.com/mysql-proxy.php';

export const channelsService = {
  async getAll(): Promise<Channel[]> {
    try {
      const response = await fetch(`${API_URL}?action=get_channels`);
      
      if (!response.ok) {
        throw new Error('Erreur serveur');
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Erreur API:', data.error);
        return this.getDefaultChannels();
      }
      
      return data;
    } catch (error) {
      console.error('Erreur getAll:', error);
      return this.getDefaultChannels();
    }
  },

  async syncWithYouTube(youtubeId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}?action=sync_youtube`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `youtube_id=${encodeURIComponent(youtubeId)}`
      });
      
      const data = await response.json();
      return data.success || false;
    } catch (error) {
      console.error('Erreur sync:', error);
      return false;
    }
  },

  async search(searchTerm: string): Promise<Channel[]> {
    const channels = await this.getAll();
    return channels.filter(channel => 
      channel.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Méthodes stub pour la compatibilité
  async getById(id: number): Promise<Channel | null> {
    const channels = await this.getAll();
    return channels.find(ch => ch.id === id) || null;
  },

  async getStats(channelId: number, days: number = 30): Promise<any[]> {
    return [];
  },

  // Données par défaut si l'API ne marche pas
  getDefaultChannels(): Channel[] {
    return [
      {
        id: 1,
        youtube_id: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
        nom: 'MrBeast',
        description: 'YouTube Philanthropist',
        abonnes: 412000000,
        vues: 89254900000,
        videos: 883,
        image: 'https://yt3.googleusercontent.com/ytc/AIdro_lGRc-05M2OoE1ejQdxeFhyP7OkJg9h4Y-7CK_5je3QqA=s900',
        langue_principale: 'US',
        theme_principal: 'Divertissement',
        date_ajout: new Date().toISOString(),
        derniere_maj: new Date().toISOString()
      },
      {
        id: 2,
        youtube_id: 'UCq-Fj5jknLsUf-MWSy4_brA',
        nom: 'T-Series',
        description: 'Music & Entertainment',
        abonnes: 298000000,
        vues: 303364800000,
        videos: 23886,
        image: 'https://yt3.googleusercontent.com/DzaZaTX6gdgjjPI_vkNc2dPbI794UroI9fTAunua0fa7lukDj5NDkjfhS5-w2KXuvmNn2WqPJw=s900',
        langue_principale: 'IN',
        theme_principal: 'Musique',
        date_ajout: new Date().toISOString(),
        derniere_maj: new Date().toISOString()
      }
    ] as Channel[];
  }
};