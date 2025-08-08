import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ranki5 - Classement des Influenceurs',
  description: 'Découvrez le top 100 des créateurs de contenu YouTube et les chaînes proposées par la communauté',
  keywords: 'youtube, classement, influenceurs, créateurs, top 100, communauté',
  authors: [{ name: 'Ranki5 Team' }],
  openGraph: {
    title: 'Ranki5 - Classement des Influenceurs',
    description: 'Découvrez le top 100 des créateurs de contenu YouTube',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ranki5.vercel.app',
    siteName: 'Ranki5',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ranki5 - Classement des Influenceurs',
    description: 'Découvrez le top 100 des créateurs de contenu YouTube',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme && ['default', 'light', 'dark'].includes(theme)) {
                  document.documentElement.classList.add('theme-' + theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } else {
                  document.documentElement.classList.add('theme-default');
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}