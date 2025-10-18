
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import de from '@/lib/locales/de.json';
import en from '@/lib/locales/en.json';

type Locale = 'de' | 'en';

const translations: Record<Locale, Record<string, string>> = { de, en };

interface LanguageContextType {
  language: Locale;
  setLanguage: (language: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Locale>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('vibelink-lang') as Locale;
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    } else if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language.split('-')[0];
        if(browserLang === 'de') {
            setLanguage('de');
        } else {
            setLanguage('en');
        }
    }
  }, []);

  const handleSetLanguage = (lang: Locale) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibelink-lang', lang);
    }
  };
  
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
