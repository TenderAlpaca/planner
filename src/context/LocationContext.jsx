import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { geocodeAddress, getCurrentLocation } from '../services/locationService';
import { calculateDistances } from '../services/distanceService';
import { places } from '../data/places';
import { saveUserLocation, loadUserLocation, saveTravelTimeCache, loadTravelTimeCache } from '../utils/storage';
import { useLanguage } from './LanguageContext';

const LocationContext = createContext();

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}

export function LocationProvider({ children }) {
  const { language, t } = useLanguage();
  const { loaded: mapsLoaded, error: mapsError } = useGoogleMaps(language);
  const [userLocation, setUserLocation] = useState(null);
  const [travelTimes, setTravelTimes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  function localizeErrorMessage(message) {
    switch (message) {
      case 'Google Maps not loaded':
      case 'Google Maps not loaded yet':
        return t('errors.mapsNotLoaded');
      case 'Location not found':
        return t('errors.locationNotFound');
      case 'Geolocation not supported':
        return t('errors.geolocationNotSupported');
      case 'User location is not set or invalid. Please set your location.':
        return t('errors.invalidUserLocation');
      case 'One or more places have invalid coordinates.':
        return t('errors.invalidDestination');
      default:
        return message || t('errors.unknown');
    }
  }

  // Load saved location on mount
  useEffect(() => {
    const saved = loadUserLocation();
    if (saved) {
      setUserLocation(saved);
    } else {
      setIsFirstVisit(true);
    }
  }, []);

  // Calculate travel times when location changes and maps loaded
  useEffect(() => {
    if (userLocation && mapsLoaded) {
      calculateTravelTimes();
    }
  }, [userLocation, mapsLoaded, language]);

  async function calculateTravelTimes() {
    if (!mapsLoaded) {
      setError(t('errors.mapsNotLoaded'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const cacheKey = `travel_times_${userLocation.lat}_${userLocation.lng}`;
      const cached = loadTravelTimeCache(cacheKey);
      if (cached) {
        const { data, timestamp } = cached;
        const age = Date.now() - timestamp;
        if (age < 24 * 60 * 60 * 1000) {
          setTravelTimes(data);
          setLoading(false);
          return;
        }
      }
      const destinations = places.map(p => ({ id: p.id, lat: p.lat, lng: p.lng }));
      const results = await calculateDistances(userLocation, destinations, language);
      const timesMap = {};
      results.forEach(result => {
        timesMap[result.placeId] = result;
      });
      setTravelTimes(timesMap);
      saveTravelTimeCache(cacheKey, timesMap);
    } catch (err) {
      setError(localizeErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  }

  async function updateLocation(address) {
    if (!mapsLoaded) {
      setError(t('errors.mapsNotLoaded'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const location = await geocodeAddress(address, language);
      setUserLocation(location);
      saveUserLocation(location);
      setIsFirstVisit(false);
    } catch (err) {
      setError(localizeErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  }

  async function useCurrentLocation() {
    setLoading(true);
    setError(null);
    try {
      const location = await getCurrentLocation(language, t('location.currentLocation'));
      setUserLocation(location);
      saveUserLocation(location);
      setIsFirstVisit(false);
    } catch (err) {
      setError(localizeErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  }

  const localizedMapsError = mapsError === 'Google Maps API key not configured'
    ? t('errors.mapsApiMissing')
    : mapsError === 'Failed to load Google Maps'
      ? t('errors.mapsLoadFailed')
      : mapsError;

  const value = {
    userLocation,
    travelTimes,
    loading: loading || !mapsLoaded,
    error: error || localizedMapsError,
    isFirstVisit,
    mapsLoaded,
    updateLocation,
    useCurrentLocation,
    setIsFirstVisit
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
