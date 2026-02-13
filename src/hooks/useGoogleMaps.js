import { useEffect, useState } from 'react';

let googleMapsPromise = null;

export function useGoogleMaps(language = 'en') {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.google?.maps) {
      setLoaded(true);
      return;
    }

    if (!googleMapsPromise) {
      const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!API_KEY) {
        setError('Google Maps API key not configured');
        return;
      }
      googleMapsPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&language=${language}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setLoaded(true);
          resolve(window.google);
        };
        script.onerror = () => {
          const err = new Error('Failed to load Google Maps');
          setError(err.message);
          reject(err);
        };
        document.head.appendChild(script);
      });
    }
    googleMapsPromise
      .then(() => setLoaded(true))
      .catch(err => setError(err.message));
  }, [language]);

  return { loaded, error, google: window.google };
}
