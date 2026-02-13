import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LocationProvider } from './context/LocationContext';
import { LanguageProvider } from './context/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </LanguageProvider>
  </React.StrictMode>
);
