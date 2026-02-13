export const categoriesHu = {
  adventure: { label: '⚡ Kaland', color: '#FF6B35' },
  explore: { label: '🧭 Felfedezés', color: '#45B7D1' },
  thermal: { label: '✨ Termál', color: '#96E6A1' },
  food: { label: '🍷 Gasztro', color: '#DDA0DD' },
  special: { label: '🌟 Különleges', color: '#FFD700' },
};

export const vibeFiltersHu = [
  { key: 'all', label: 'Összes', icon: '✦' },
  { key: 'chill', label: 'Laza', icon: '🧘' },
  { key: 'active', label: 'Aktív', icon: '💪' },
  { key: 'romantic', label: 'Romantikus', icon: '💕' },
  { key: 'culture', label: 'Kultúra', icon: '🎨' },
  { key: 'foodie', label: 'Gasztro', icon: '🍴' },
  { key: 'nature', label: 'Természet', icon: '🌿' },
  { key: 'outdoors', label: 'Szabadtér', icon: '☀️' },
  { key: 'history', label: 'Történelem', icon: '📜' },
];

export const distanceRangesHu = [
  { key: 'all', label: 'Bármennyi', color: '#888' },
  { key: 'close', label: '🟢 < 1 óra', color: '#4CAF50', max: 50 },
  { key: 'mid', label: '🟡 1-2 óra', color: '#FFC107', min: 51, max: 150 },
  { key: 'far', label: '🟠 2-3 óra', color: '#FF5722', min: 151, max: 250 },
  { key: 'weekend', label: '🔴 3+ óra', color: '#E91E63', min: 251 },
];

export const durationFiltersHu = [
  { key: 'all', label: 'Bármennyi' },
  { key: 'half', label: 'Fél nap' },
  { key: 'full', label: 'Egész nap' },
  { key: 'weekend', label: 'Hétvége' },
];

export const tripTypeFiltersHu = [
  { key: 'all', label: 'Összes terv' },
  { key: 'day', label: 'Egynapos utak' },
  { key: 'weekend', label: 'Hétvégi kiruccanások' },
];
