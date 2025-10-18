
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // On mount, read the theme from the data attribute
    const root = window.document.documentElement;
    const initialTheme = root.getAttribute('data-theme') as Theme | null;
    if (initialTheme) {
      setTheme(initialTheme);
    }
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove(theme);
    root.classList.add(newTheme);
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('vibelink-theme', newTheme);
    setTheme(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
