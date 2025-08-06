// Configuration de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://abc123go.ranki5.com/api.php';

// Authentification Basic Auth
const API_USERNAME = 'admin';
const API_PASSWORD = 'ranki5-2025';
const API_AUTH = btoa(`${API_USERNAME}:${API_PASSWORD}`);

// Headers par défaut pour toutes les requêtes
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${API_AUTH}`
};

// Fonction helper pour les requêtes GET
export async function apiGet(action: string, params?: Record<string, any>) {
  const queryString = params ? '&' + new URLSearchParams(params).toString() : '';
  const url = `${API_URL}?action=${action}${queryString}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Fonction helper pour les requêtes POST
export async function apiPost(action: string, data: any) {
  const url = `${API_URL}?action=${action}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Fonctions spécifiques pour chaque endpoint
export const api = {
  // Auth
  login: (username: string, password: string) => 
    apiPost('login', { username, password }),
  
  register: (username: string, email: string, password: string) =>
    apiPost('register', { username, email, password }),
  
  // Channels
  getChannels: (params?: { search?: string; filter?: string; page?: number }) =>
    apiGet('channels', params),
  
  submitChannel: (data: { url?: string; nom: string; token: string }) =>
    apiPost('submit_channel', data),
  
  updateChannelStats: (channelId: number, token: string) =>
    apiPost('update_channel_stats', { channelId, token }),
  
  // Votes
  voteTheme: (channelId: number, theme: string, token: string) =>
    apiPost('vote_theme', { channelId, theme, token }),
  
  // Stats
  getStats: () => apiGet('stats'),
  
  // Admin
  updateAllStats: (token: string) =>
    apiPost('update_all_stats', { token }),
  
  importTop100: (token: string) =>
    apiPost('import_top100', { token })
};

export default api;