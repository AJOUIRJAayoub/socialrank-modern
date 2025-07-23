import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AdSpaceProps {
  format?: 'banner' | 'square' | 'vertical' | 'inline';
  className?: string;
}

export const AdSpace: React.FC<AdSpaceProps> = ({ format = 'banner', className = '' }) => {
  const dimensions = {
    banner: { width: 728, height: 90, label: 'Leaderboard' },
    square: { width: 300, height: 250, label: 'Medium Rectangle' },
    vertical: { width: 160, height: 600, label: 'Wide Skyscraper' },
    inline: { width: 320, height: 50, label: 'Mobile Banner' }
  };

  const { width, height, label } = dimensions[format];

  const demoAd = {
    title: "Flick3D - Animation 3D",
    description: "Créez des animations 3D époustouflantes",
    url: "https://flick3d.com/",
    cta: "Découvrir"
  };

  return (
    <div 
      className={`relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden transition-all hover:shadow-lg ${className}`}
      style={{ width: '100%', maxWidth: width, aspectRatio: `${width}/${height}` }}
    >
      <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
        Publicité
      </div>

      <a 
        href={demoAd.url} 
        target="_blank" 
        rel="noopener noreferrer sponsored"
        className="block w-full h-full relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-80"></div>
        
        <div className="relative h-full flex flex-col justify-center items-center text-white p-4">
          {format !== 'inline' && (
            <>
              <h3 className="font-bold text-lg mb-1">{demoAd.title}</h3>
              <p className="text-sm opacity-90 mb-3">{demoAd.description}</p>
            </>
          )}
          
          <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 transition">
            {demoAd.cta}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </a>
    </div>
  );
};