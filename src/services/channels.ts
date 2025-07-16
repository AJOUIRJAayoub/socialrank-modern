import { Channel, Stats } from '@/types';
import { query } from '@/lib/db';

export const channelsService = {
  async getAll(): Promise<Channel[]> {
    return query<Channel>('SELECT * FROM chaines ORDER BY abonnes DESC');
  },

  async getById(id: number): Promise<Channel | null> {
    const results = await query<Channel>('SELECT * FROM chaines WHERE id = ?', [id]);
    return results[0] || null;
  },

  async getStats(channelId: number, days: number = 30): Promise<Stats[]> {
    return query<Stats>(
      `SELECT * FROM historique_stats 
       WHERE chaine_id = ? 
       AND date_collecte >= DATE_SUB(NOW(), INTERVAL ? DAY)
       ORDER BY date_collecte ASC`,
      [channelId, days]
    );
  },

  async search(searchTerm: string): Promise<Channel[]> {
    return query<Channel>(
      'SELECT * FROM chaines WHERE nom LIKE ? ORDER BY abonnes DESC',
      [`%${searchTerm}%`]
    );
  }
};
