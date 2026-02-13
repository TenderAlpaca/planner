import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadLanguage, saveLanguage } from '../utils/storage';
import { translateMessage } from '../i18n/messages';
import type { Language } from '../types/domain';

interface LanguageContextValue {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

interface ProviderProps {
  children: React.ReactNode;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function detectInitialLanguage(): Language {
  const savedLanguage = loadLanguage();
  if (savedLanguage === 'hu' || savedLanguage === 'en') {
    return savedLanguage;
  }

  const browserLanguage = (navigator.language || '').toLowerCase();
  return browserLanguage.startsWith('hu') ? 'hu' : 'en';
}

export function LanguageProvider({ children }: ProviderProps) {
  const [language, setLanguage] = useState(detectInitialLanguage);

  useEffect(() => {
    saveLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key, params) => translateMessage(language, key, params),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
