import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SocialRank - Classement YouTube',
  description: 'Suivez l\'évolution des chaînes YouTube françaises',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}