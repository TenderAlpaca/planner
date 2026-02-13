// src/services/locationService.js
import type { UserLocation } from '../types/domain';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export async function geocodeAddress(address: string, language: 'en' | 'hu' = 'en'): Promise<UserLocation> {
  if (!window.google?.maps) {
    throw new Error('Google Maps not loaded');
  }
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        address: address,
        language,
      },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          const result = results[0];
          resolve({
            address: result.formatted_address,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          });
        } else {
          reject(new Error('Location not found'));
        }
      }
    );
  });
}

export async function getCurrentLocation(language: 'en' | 'hu' = 'en', fallbackLabel = 'Current Location'): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (!window.google?.maps) {
          reject(new Error('Google Maps not loaded'));
          return;
        }
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };
        geocoder.geocode(
          { location: latlng, language },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve({
                address: results[0].formatted_address,
                lat: latitude,
                lng: longitude
              });
            } else {
              resolve({
                address: fallbackLabel,
                lat: latitude,
                lng: longitude
              });
            }
          }
        );
      },
      (error) => reject(error)
    );
  });
}
