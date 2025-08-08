'use client';

import React from 'react';
import { Palette, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Retourner un placeholder pendant le SSR
    return (
      <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-2" />
    );
  }

  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    // Cycle: default → light → dark → default
    if (theme === 'default') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('default');
    }
  };

  return (
    <div className="mx-2">
      <button
        onClick={handleToggle}
        className="relative p-2 w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300"
        aria-label="Toggle theme"
      >
        {/* Indicateur de position */}
        <div
          className={`absolute top-1 w-8 h-8 bg-white dark:bg-gray-900 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
            theme === 'default' 
              ? 'translate-x-0' 
              : theme === 'light' 
              ? 'translate-x-10' 
              : 'translate-x-20'
          }`}
        >
          {theme === 'default' && <Palette className="w-4 h-4 text-purple-500" />}
          {theme === 'light' && <Sun className="w-4 h-4 text-yellow-500" />}
          {theme === 'dark' && <Moon className="w-4 h-4 text-blue-500" />}
        </div>
        
        {/* Labels */}
        <div className="relative flex justify-around items-center h-full px-1 pointer-events-none">
          <span className={`text-xs ${theme === 'default' ? 'opacity-0' : 'opacity-50'}`}>
            <Palette className="w-3 h-3" />
          </span>
          <span className={`text-xs ${theme === 'light' ? 'opacity-0' : 'opacity-50'}`}>
            <Sun className="w-3 h-3" />
          </span>
          <span className={`text-xs ${theme === 'dark' ? 'opacity-0' : 'opacity-50'}`}>
            <Moon className="w-3 h-3" />
          </span>
        </div>
      </button>
    </div>
  );
}

// Version dropdown avec descriptions
export function ThemeToggleDropdown() {
  const { theme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const themes = [
    { 
      value: 'default' as const, 
      label: 'Original', 
      icon: Palette,
      description: 'Thème coloré par défaut',
      color: 'text-purple-500'
    },
    { 
      value: 'light' as const, 
      label: 'Clair', 
      icon: Sun,
      description: 'Thème blanc minimaliste',
      color: 'text-yellow-500'
    },
    { 
      value: 'dark' as const, 
      label: 'Sombre', 
      icon: Moon,
      description: 'Thème sombre confortable',
      color: 'text-blue-500'
    },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <div className="relative mx-2">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        aria-label="Toggle theme"
      >
        {currentTheme && (
          <>
            <currentTheme.icon className={`w-5 h-5 ${currentTheme.color}`} />
            <span className="text-sm hidden sm:inline">{currentTheme.label}</span>
          </>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-50">
          {themes.map(({ value, label, icon: Icon, description, color }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setShowDropdown(false);
              }}
              className={`w-full px-3 py-2 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === value ? 'bg-gray-50 dark:bg-gray-700/50' : ''
              }`}
            >
              <Icon className={`w-5 h-5 mt-0.5 ${theme === value ? color : 'text-gray-500'}`} />
              <div className="text-left">
                <div className={`text-sm font-medium ${
                  theme === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {description}
                </div>
              </div>
              {theme === value && (
                <span className="ml-auto text-blue-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}