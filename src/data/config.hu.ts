export const categoriesHu = {
  adventure: { label: '⚡ Kaland', color: '#D97745' },
  explore: { label: '🧭 Felfedezés', color: '#5CA8BF' },
  thermal: { label: '✨ Termál', color: '#84C89A' },
  food: { label: '🍷 Gasztro', color: '#B989C1' },
  special: { label: '🌟 Különleges', color: '#D9B85F' },
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
  { key: 'all', label: 'Bármennyi', color: '#9A8F80' },
  { key: 'close', label: '🟢 < 1 óra', color: '#6FBF82', max: 50 },
  { key: 'mid', label: '🟡 1-2 óra', color: '#D8B35A', min: 51, max: 150 },
  { key: 'far', label: '🟠 2-3 óra', color: '#D88452', min: 151, max: 250 },
  { key: 'weekend', label: '🔴 3+ óra', color: '#C85F7A', min: 251 },
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
