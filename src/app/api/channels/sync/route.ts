import { NextResponse } from 'next/server';
import { channelsService } from '@/services/channels';

const POPULAR_CHANNELS = [
  'UCX6OQ3DkcsbYNE6H8uQQuVA', // MrBeast
  'UCq-Fj5jknLsUf-MWSy4_brA', // T-Series
  'UCbCmjCuTUZos6Inko4u57UQ', // Cocomelon
  'UCWeg2Pkate69NFdBeuRFTAw', // SQUEEZIE
  'UCyWqModMQlbIo8274Wh_ZsQ', // Cyprien
];

export async function POST(request: Request) {
  try {
    const results = [];
    const errors = [];
    
    for (const channelId of POPULAR_CHANNELS) {
      const success = await channelsService.syncWithYouTube(channelId);
      if (success) {
        results.push(channelId);
      } else {
        errors.push(channelId);
      }
      // Pause pour ne pas surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return NextResponse.json({
      success: true,
      synced: results.length,
      errors: errors.length
    });
    
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la synchronisation' },
      { status: 500 }
    );
  }
}