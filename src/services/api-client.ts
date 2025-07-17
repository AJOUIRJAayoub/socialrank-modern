// Ligne 1 - Changer l'URL par défaut
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yr.wacs.fr/auth-complete.php';

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
  }
};