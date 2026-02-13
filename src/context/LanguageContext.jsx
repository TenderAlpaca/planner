import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadLanguage, saveLanguage } from '../utils/storage';
import { translateMessage } from '../i18n/messages';

const LanguageContext = createContext();

function detectInitialLanguage() {
  const savedLanguage = loadLanguage();
  if (savedLanguage === 'hu' || savedLanguage === 'en') {
    return savedLanguage;
  }

  const browserLanguage = (navigator.language || '').toLowerCase();
  return browserLanguage.startsWith('hu') ? 'hu' : 'en';
}

export function LanguageProvider({ children }) {
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
