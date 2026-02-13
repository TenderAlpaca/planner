// src/utils/storage.js

// LocalStorage wrapper for user location and travel time cache
import type { DistanceResult, Language, UserLocation } from '../types/domain';

interface CacheValue {
  data: Record<number, DistanceResult>;
  timestamp: number;
}

export function saveUserLocation(location: UserLocation): void {
  localStorage.setItem('userLocation', JSON.stringify(location));
}

export function loadUserLocation(): UserLocation | null {
  const saved = localStorage.getItem('userLocation');
  return saved ? JSON.parse(saved) : null;
}

export function saveTravelTimeCache(key: string, data: Record<number, DistanceResult>): void {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

export function loadTravelTimeCache(key: string): CacheValue | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const parsed = JSON.parse(cached);
    return parsed;
  } catch {
    return null;
  }
}

export function saveLanguage(language: Language): void {
  localStorage.setItem('language', language);
}

export function loadLanguage(): Language | null {
  const language = localStorage.getItem('language');
  if (language === 'en' || language === 'hu') return language;
  return null;
}

