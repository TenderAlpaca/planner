export type Language = 'en' | 'hu';

export interface UserLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface Category {
  label: string;
  color: string;
}

export interface FilterItem {
  key: string;
  label: string;
  icon?: string;
  color?: string;
  min?: number;
  max?: number;
}

export interface Place {
  id: number;
  name: string;
  loc: string;
  km: number;
  time: string;
  cat: string;
  vibes: string[];
  desc: string;
  lat: number;
  lng: number;
  tip: string;
  maps: string;
  emoji: string;
  duration: string;
}

export interface Combo {
  id: number;
  title: string;
  emoji: string;
  drive: string;
  vibe: string;
  type: string;
  steps: string[];
  vibes: string[];
}

export interface DistanceResult {
  placeId: number;
  distance: number;
  duration: number;
  distanceText: string;
  durationText: string;
  status: string;
}

export interface LocalizedData {
  places: Place[];
  combos: Combo[];
  categories: Record<string, Category>;
  vibeFilters: FilterItem[];
  distanceRanges: FilterItem[];
  durationFilters: FilterItem[];
  tripTypeFilters: FilterItem[];
}
