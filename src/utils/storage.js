// src/utils/storage.js

// LocalStorage wrapper for user location and travel time cache

export function saveUserLocation(location) {
  localStorage.setItem('userLocation', JSON.stringify(location));
}

export function loadUserLocation() {
  const saved = localStorage.getItem('userLocation');
  return saved ? JSON.parse(saved) : null;
}

export function saveTravelTimeCache(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

export function loadTravelTimeCache(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const parsed = JSON.parse(cached);
    return parsed;
  } catch {
    return null;
  }
}

export function saveLanguage(language) {
  localStorage.setItem('language', language);
}

export function loadLanguage() {
  return localStorage.getItem('language');
}

