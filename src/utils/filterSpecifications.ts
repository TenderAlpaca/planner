import type { Combo, DistanceResult, FilterItem, Place } from '../types/domain';

type Predicate<T> = (value: T) => boolean;

function allOf<T>(predicates: Predicate<T>[]): Predicate<T> {
  return (value: T) => predicates.every((predicate) => predicate(value));
}

interface PlaceFilterState {
  showFavouritesOnly: boolean;
  favourites: number[];
  vibes: string[];
  dists: string[];
  durs: string[];
  travelTimes: Record<number, DistanceResult>;
  distanceRanges: FilterItem[];
}

export function buildPlaceFilterSpecification(state: PlaceFilterState): Predicate<Place> {
  const specs: Predicate<Place>[] = [];

  if (state.showFavouritesOnly) {
    specs.push((place) => state.favourites.includes(place.id));
  }

  if (state.vibes.length > 0) {
    specs.push((place) => state.vibes.some((vibe) => place.vibes.includes(vibe)));
  }

  if (state.durs.length > 0) {
    specs.push((place) => state.durs.includes(place.duration));
  }

  if (state.dists.length > 0) {
    specs.push((place) => {
      const travelData = state.travelTimes[place.id];
      const km = travelData ? Math.round(travelData.distance / 1000) : null;

      return state.dists.some((key) => {
        const range = state.distanceRanges.find((item) => item.key === key);
        if (!range) return false;
        if (range.min !== undefined && (km === null || km < range.min)) return false;
        if (range.max !== undefined && (km === null || km > range.max)) return false;
        return true;
      });
    });
  }

  return allOf(specs);
}

interface ComboFilterState {
  showFavouritesOnly: boolean;
  favourites: number[];
  vibes: string[];
  tripTypes: string[];
}

export function buildComboFilterSpecification(state: ComboFilterState): Predicate<Combo> {
  const specs: Predicate<Combo>[] = [];

  if (state.showFavouritesOnly) {
    specs.push((combo) => state.favourites.includes(combo.id));
  }

  if (state.vibes.length > 0) {
    specs.push((combo) => state.vibes.some((vibe) => combo.vibes.includes(vibe)));
  }

  if (state.tripTypes.length > 0) {
    specs.push((combo) => state.tripTypes.includes(combo.type));
  }

  return allOf(specs);
}
