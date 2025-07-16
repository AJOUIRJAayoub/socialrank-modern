// src/services/auth.ts
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

interface DbUser {
  id: number;
  nom_utilisateur: string;
  email: string;
  mot_de_passe: string;
  role: 'user' | 'admin';
}

export const authService = {
  async findByUsername(username: string): Promise<DbUser | null> {
    try {
      const results = await query<DbUser>(
        'SELECT * FROM utilisateurs WHERE nom_utilisateur = ?',
        [username]
      );
      return results[0] || null;
    } catch (error) {
      console.error('Erreur findByUsername:', error);
      return null;
    }
  },

  async findByEmail(email: string): Promise<DbUser | null> {
    try {
      const results = await query<DbUser>(
        'SELECT * FROM utilisateurs WHERE email = ?',
        [email]
      );
      return results[0] || null;
    } catch (error) {
      console.error('Erreur findByEmail:', error);
      return null;
    }
  },

  async create(username: string, email: string, password: string): Promise<DbUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query<any>(
      'INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user']
    );
    
    // Récupérer l'utilisateur créé
    const newUser = await this.findByUsername(username);
    if (!newUser) throw new Error('Erreur lors de la création de l\'utilisateur');
    
    return newUser;
  },

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
};