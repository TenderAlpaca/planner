import {
  categories,
  vibeFilters,
  distanceRanges,
  durationFilters,
  tripTypeFilters,
} from './config';
import { categoriesHu, vibeFiltersHu, distanceRangesHu, durationFiltersHu, tripTypeFiltersHu } from './config.hu';
import { places } from './places';
import { placesHu } from './places.hu';
import { combos } from './combos';
import { combosHu } from './combos.hu';

export function getLocalizedData(language) {
  const isHungarian = language === 'hu';
  return {
    places: isHungarian ? placesHu : places,
    combos: isHungarian ? combosHu : combos,
    categories: isHungarian ? categoriesHu : categories,
    vibeFilters: isHungarian ? vibeFiltersHu : vibeFilters,
    distanceRanges: isHungarian ? distanceRangesHu : distanceRanges,
    durationFilters: isHungarian ? durationFiltersHu : durationFilters,
    tripTypeFilters: isHungarian ? tripTypeFiltersHu : tripTypeFilters,
  };
}
