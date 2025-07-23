const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://abc123go.ranki5.com/api.php';

// Fonction pour récupérer le token
function getAuthHeader(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    console.log('Token found:', !!token); // Debug
    
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  return {};
}

// Fonction helper pour récupérer juste le token
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return token || null;
  }
  return null;
}

export const apiClient = {
  async testConnection() {
    const response = await fetch(`${API_URL}?action=test`);
    return response.json();
  },

  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  async register(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  async getChannels(search?: string) {
    const url = search 
      ? `${API_URL}?action=channels&search=${encodeURIComponent(search)}`
      : `${API_URL}?action=channels`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  async submitChannel(youtubeId: string, url: string, nom: string) {
    console.log('=== submitChannel Debug ===');
    console.log('Params:', { youtubeId, url, nom });
    
    // Récupérer le token
    const token = getToken();
    console.log('Token exists:', !!token);
    
    if (!token) {
      throw new Error('Vous devez être connecté pour proposer une chaîne');
    }
    
    // Solution temporaire : envoyer le token dans le body
    // car les headers Authorization ne semblent pas passer
    const response = await fetch(`${API_URL}?action=submit_channel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        youtubeId, 
        url, 
        nom,
        token // Envoyer le token dans le body
      }),
    });
    
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text:', text);
    
    // Essayer de parser le JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', text);
      throw new Error('Réponse invalide du serveur');
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la soumission');
    }
    
    return data;
  },

  async voteTheme(channelId: number, theme: string) {
    const token = getToken();
    
    if (!token) {
      throw new Error('Vous devez être connecté pour voter');
    }
    
    // Même solution : token dans le body
    const response = await fetch(`${API_URL}?action=vote_theme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        channelId, 
        theme,
        token 
      }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  async getChannelVotes(channelId: number) {
    const token = getToken();
    
    // Pour GET, on peut passer token en query param
    const url = token 
      ? `${API_URL}?action=channel_votes&channelId=${channelId}&token=${encodeURIComponent(token)}`
      : `${API_URL}?action=channel_votes&channelId=${channelId}`;
    
    const response = await fetch(url);
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  async getYouTubeChannels(search?: string, category?: string) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  
  const response = await fetch(`${API_URL.replace('api.php', 'youtube-api.php')}?action=get_channels&${params}`);
  
  if (!response.ok) throw new Error('Erreur lors du chargement');
  return response.json();
  },

  async updateChannelData(channelId: string) {
  const response = await fetch(`${API_URL.replace('api.php', 'youtube-api.php')}?action=update_channel&channel_id=${channelId}`);
  
  if (!response.ok) throw new Error('Erreur lors de la mise à jour');
  return response.json();
  },
};